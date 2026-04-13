import { createError, defineEventHandler, getHeader, readMultipartFormData } from 'h3'
import { useDb } from '../../utils/db'
import { sendEmail } from '../../utils/email'
import { mkdir, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { randomUUID } from 'node:crypto'

const ADMIN_NOTIFICATION_EMAIL = 'pcepartidopolitico@gmail.com'

const applyAttempts = new Map<string, { count: number; resetAt: number }>()

const checkApplyRateLimit = (ip: string) => {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000
  const maxAttempts = 10
  const current = applyAttempts.get(ip)

  if (!current || now > current.resetAt) {
    applyAttempts.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (current.count >= maxAttempts) {
    return false
  }

  current.count += 1
  return true
}

const ensureTableExists = async (db: ReturnType<typeof useDb>) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS job_applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      offer_id VARCHAR(120) NOT NULL,
      full_name VARCHAR(160) NOT NULL,
      email VARCHAR(160) NOT NULL,
      phone VARCHAR(80) NOT NULL,
      city VARCHAR(120) NOT NULL,
      availability VARCHAR(255) NOT NULL,
      motivation TEXT NOT NULL,
      cv_file_path VARCHAR(255) NULL,
      cv_original_name VARCHAR(255) NULL,
      cv_mime_type VARCHAR(120) NULL,
      status VARCHAR(40) DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_job_status (status),
      INDEX idx_job_created_at (created_at)
    ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  const [columns]: any = await db.query(`
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'job_applications'
  `)

  const existingColumns = new Set((columns || []).map((col: any) => String(col.COLUMN_NAME || '').toLowerCase()))

  if (!existingColumns.has('cv_file_path')) {
    await db.query('ALTER TABLE job_applications ADD COLUMN cv_file_path VARCHAR(255) NULL')
  }
  if (!existingColumns.has('cv_original_name')) {
    await db.query('ALTER TABLE job_applications ADD COLUMN cv_original_name VARCHAR(255) NULL')
  }
  if (!existingColumns.has('cv_mime_type')) {
    await db.query('ALTER TABLE job_applications ADD COLUMN cv_mime_type VARCHAR(120) NULL')
  }
}

const sanitizeText = (value: string) => value.normalize('NFC').replace(/[<>]/g, '').trim()

export default defineEventHandler(async (event) => {
  const clientIp = (getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown') as string

  if (!checkApplyRateLimit(clientIp)) {
    throw createError({
      statusCode: 429,
      message: 'Demasiadas solicitudes. Inténtalo más tarde.'
    })
  }

  const parts = await readMultipartFormData(event)
  if (!parts || parts.length === 0) {
    throw createError({ statusCode: 400, message: 'No se recibió información de la candidatura.' })
  }

  const fields = new Map<string, string>()
  let cvFile: { filename: string; type: string; data: Buffer } | null = null

  for (const part of parts) {
    if (!part.name) continue

    if (part.name === 'cv') {
      cvFile = {
        filename: part.filename || 'curriculum',
        type: part.type || 'application/octet-stream',
        data: part.data
      }
      continue
    }

    fields.set(part.name, part.data?.toString('utf8') || '')
  }

  const offerId = fields.get('offerId')
  const fullName = fields.get('fullName')
  const email = fields.get('email')
  const phone = fields.get('phone')
  const city = fields.get('city')
  const availability = fields.get('availability')
  const motivation = fields.get('motivation')

  if (!offerId || !fullName || !email || !phone || !city || !availability || !motivation) {
    throw createError({ statusCode: 400, message: 'Completa todos los campos obligatorios.' })
  }

  if (!cvFile) {
    throw createError({ statusCode: 400, message: 'Debes adjuntar tu currículum.' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    throw createError({ statusCode: 400, message: 'Email no válido.' })
  }

  if (String(motivation).length < 20 || String(motivation).length > 3000) {
    throw createError({ statusCode: 400, message: 'La motivación debe tener entre 20 y 3000 caracteres.' })
  }

  const allowedMimes = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ])

  const extension = extname(cvFile.filename || '').toLowerCase()
  const allowedExtensions = new Set(['.pdf', '.doc', '.docx'])
  if (!allowedMimes.has(cvFile.type) && !allowedExtensions.has(extension)) {
    throw createError({ statusCode: 400, message: 'Formato de currículum no válido. Usa PDF, DOC o DOCX.' })
  }

  const maxFileSize = 8 * 1024 * 1024
  if (cvFile.data.length > maxFileSize) {
    throw createError({ statusCode: 400, message: 'El currículum supera el máximo permitido de 8MB.' })
  }

  const db = useDb()
  await ensureTableExists(db)

  const safeExtension = allowedExtensions.has(extension) ? extension : '.pdf'
  const uploadsDir = join(process.cwd(), 'private_uploads', 'curriculum')
  await mkdir(uploadsDir, { recursive: true })

  const storedFilename = `${Date.now()}-${randomUUID()}${safeExtension}`
  const absoluteFilePath = join(uploadsDir, storedFilename)
  await writeFile(absoluteFilePath, cvFile.data)

  await db.query(
    `INSERT INTO job_applications
      (offer_id, full_name, email, phone, city, availability, motivation, cv_file_path, cv_original_name, cv_mime_type, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sanitizeText(String(offerId)),
      sanitizeText(String(fullName)),
      String(email).toLowerCase().trim(),
      sanitizeText(String(phone)),
      sanitizeText(String(city)),
      sanitizeText(String(availability)),
      sanitizeText(String(motivation)),
      absoluteFilePath,
      sanitizeText(String(cvFile.filename || 'curriculum')),
      cvFile.type,
      'new'
    ]
  )

  const cleanEmail = String(email).toLowerCase().trim()
  const cleanName = sanitizeText(String(fullName))
  const cleanOfferId = sanitizeText(String(offerId))

  await sendEmail(
    cleanEmail,
    'Gracias por tu candidatura - PCE',
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
      <div style="background-color: #723233; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0;">CANDIDATURA RECIBIDA</h1>
      </div>
      <div style="padding: 30px; background-color: white;">
        <h2 style="color: #333;">Hola ${cleanName},</h2>
        <p style="color: #555; line-height: 1.6;">
          Gracias por enviar tu candidatura. Hemos recibido correctamente tu solicitud para la oferta <strong>${cleanOfferId}</strong>.
        </p>
        <p style="color: #555; line-height: 1.6;">
          Nuestro equipo revisará tu perfil y te contactaremos si encaja con el proceso.
        </p>
      </div>
      <div style="padding: 20px; text-align: center; font-size: 12px; color: #888;">
        <p>© 2026 Protección Civil Española. Todos los derechos reservados.</p>
      </div>
    </div>
    `
  )

  await sendEmail(
    ADMIN_NOTIFICATION_EMAIL,
    `🧾 Nueva candidatura: ${cleanName}`,
    `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #723233; margin-top: 0;">Nueva candidatura recibida</h1>
        <ul style="list-style: none; padding: 0; color: #333;">
          <li><strong>Nombre:</strong> ${cleanName}</li>
          <li><strong>Email:</strong> ${cleanEmail}</li>
          <li><strong>Oferta:</strong> ${cleanOfferId}</li>
          <li><strong>Disponibilidad:</strong> ${sanitizeText(String(availability))}</li>
        </ul>
      </div>
    </div>
    `
  )

  return {
    success: true,
    message: 'Candidatura recibida. Revisaremos tu perfil en breve.'
  }
})
