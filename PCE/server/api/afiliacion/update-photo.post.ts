import { requireAuth } from '../../utils/auth-middleware'
import { useDb } from '../../utils/db'
import fs from 'fs/promises'
import path from 'path'

const activeStatuses = ['paid', 'active', 'simulated_paid']

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)
  const db = useDb()

  try {
    const form = await readMultipartFormData(event)
    
    if (!form) {
      throw createError({
        statusCode: 400,
        message: 'No se recibió la foto.'
      })
    }

    const photoFile = form.find(f => f.name === 'photo')
    
    if (!photoFile) {
      throw createError({
        statusCode: 400,
        message: 'No se recibió el archivo de foto.'
      })
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedMimes.includes(photoFile.type || '')) {
      throw createError({
        statusCode: 400,
        message: 'Solo se permiten imágenes (JPEG, PNG, WebP, GIF).'
      })
    }

    if ((photoFile.data?.length || 0) > 5 * 1024 * 1024) {
      throw createError({
        statusCode: 413,
        message: 'La imagen debe pesar menos de 5MB.'
      })
    }

    const email = String(authUser.email || '').toLowerCase().trim()

    const [affRows]: any = await db.query(
      `SELECT id
       FROM affiliations
       WHERE email = ? AND status IN (?, ?, ?)
       ORDER BY created_at DESC
       LIMIT 1`,
      [email, ...activeStatuses]
    )

    if (!Array.isArray(affRows) || affRows.length === 0) {
      throw createError({
        statusCode: 403,
        message: 'No tienes una afiliacion activa para actualizar.'
      })
    }

    const affiliationId = Number(affRows[0].id)

    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 10)
    const ext = photoFile.filename?.split('.').pop() || 'jpg'
    const filename = `${timestamp}-${random}.${ext}`

    // Save to uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'affiliations')
    
    try {
      await fs.mkdir(uploadsDir, { recursive: true })
    } catch (err) {
      console.error('Error creating uploads directory:', err)
    }

    const filepath = path.join(uploadsDir, filename)
    await fs.writeFile(filepath, photoFile.data)

    // Update database with new photo URL
    const photoUrl = `/uploads/affiliations/${filename}`

    await db.query(
      `UPDATE affiliations
       SET card_photo_path = ?, photo_url = ?
       WHERE id = ?`,
      [photoUrl, photoUrl, affiliationId]
    )

    return {
      success: true,
      photo_url: photoUrl
    }
  } catch (err) {
    throw err
  }
})
