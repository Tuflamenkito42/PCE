import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { validateAdmin } from '../../../utils/admin'
import { useDb } from '../../../utils/db'

const VALID_STATUSES = ['new', 'reviewing', 'interview', 'accepted', 'rejected']

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
    )
  `)
}

export default defineEventHandler(async (event) => {
  validateAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const status = String(body?.status || '').toLowerCase()

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID no válido' })
  }

  if (!VALID_STATUSES.includes(status)) {
    throw createError({ statusCode: 400, message: 'Estado no válido' })
  }

  const db = useDb()
  await ensureTableExists(db)
  await db.query('UPDATE job_applications SET status = ? WHERE id = ?', [status, id])

  return { success: true, message: 'Estado de candidatura actualizado' }
})
