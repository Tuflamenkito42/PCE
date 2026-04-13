import { createError, defineEventHandler, getRouterParam, sendStream, setHeader } from 'h3'
import { createReadStream, existsSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { validateAdmin } from '../../../../utils/admin'
import { useDb } from '../../../../utils/db'

export default defineEventHandler(async (event) => {
  validateAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID no válido' })
  }

  const db = useDb()
  const [rows]: any = await db.query(
    'SELECT cv_file_path, cv_original_name, cv_mime_type FROM job_applications WHERE id = ? LIMIT 1',
    [id]
  )

  const record = rows?.[0]
  if (!record || !record.cv_file_path) {
    throw createError({ statusCode: 404, message: 'No hay currículum adjunto para esta candidatura.' })
  }

  const filePath = String(record.cv_file_path)
  const allowedBasePath = resolve(join(process.cwd(), 'private_uploads', 'curriculum'))
  const resolvedFilePath = resolve(filePath)

  if (!resolvedFilePath.startsWith(allowedBasePath)) {
    throw createError({ statusCode: 403, message: 'Ruta de archivo no permitida.' })
  }

  if (!existsSync(resolvedFilePath)) {
    throw createError({ statusCode: 404, message: 'No se encontró el archivo del currículum.' })
  }

  const originalName = String(record.cv_original_name || basename(filePath)).replace(/[\r\n"]/g, '')
  const mimeType = String(record.cv_mime_type || 'application/octet-stream')

  setHeader(event, 'Content-Type', mimeType)
  setHeader(event, 'Content-Disposition', `attachment; filename="${originalName}"`)

  return sendStream(event, createReadStream(resolvedFilePath))
})
