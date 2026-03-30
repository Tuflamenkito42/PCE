import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { validateAdmin } from '../../../utils/admin'
import { useDb } from '../../../utils/db'

const VALID_SHIPPING_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const ensureTableExists = async (db: ReturnType<typeof useDb>) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS carnet_orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NULL,
      address VARCHAR(255) NULL,
      city VARCHAR(120) NULL,
      postal_code VARCHAR(10) NULL,
      country VARCHAR(120) NULL,
      nif VARCHAR(20) NULL,
      numero_socio VARCHAR(50) NULL,
      amount DECIMAL(10, 2) DEFAULT 5.00,
      payment_intent_id VARCHAR(255) NULL,
      status VARCHAR(50) DEFAULT 'completed',
      shipping_status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_carnet_email (email),
      INDEX idx_carnet_status (status),
      INDEX idx_carnet_shipping_status (shipping_status),
      INDEX idx_carnet_created_at (created_at)
    )
  `)
}

export default defineEventHandler(async (event) => {
  validateAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const status = String(body?.status || '').toLowerCase().trim()

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID no válido' })
  }

  if (!VALID_SHIPPING_STATUSES.includes(status)) {
    throw createError({ statusCode: 400, message: 'Estado de envío no válido' })
  }

  const db = useDb()
  await ensureTableExists(db)
  await db.query('UPDATE carnet_orders SET shipping_status = ? WHERE id = ?', [status, id])

  return { success: true, message: 'Estado de envío actualizado' }
})
