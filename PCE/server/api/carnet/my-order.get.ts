import { requireAuth } from '../../utils/auth-middleware'
import { useDb } from '../../utils/db'

const ensureTableExists = async (db: ReturnType<typeof useDb>) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS carnet_orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      address VARCHAR(255),
      city VARCHAR(120),
      postal_code VARCHAR(10),
      country VARCHAR(120),
      nif VARCHAR(20),
      numero_socio VARCHAR(50),
      amount DECIMAL(10, 2) DEFAULT 5.00,
      payment_intent_id VARCHAR(255),
      status VARCHAR(50) DEFAULT 'pending',
      shipping_status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_carnet_email (email),
      INDEX idx_carnet_status (status),
      INDEX idx_carnet_created_at (created_at)
    )
  `)
}

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const db = useDb()
  await ensureTableExists(db)

  const params: Array<string | number> = []
  let whereSql = 'email = ?'

  if (user.id) {
    whereSql = '(user_id = ? OR email = ?)'
    params.push(user.id)
  }

  params.push(String(user.email || '').toLowerCase().trim())

  const [rows]: any = await db.query(
    `SELECT id, status, payment_intent_id, created_at
     FROM carnet_orders
     WHERE ${whereSql}
       AND status IN ('completed', 'simulated_paid')
     ORDER BY created_at DESC
     LIMIT 1`,
    params
  )

  const latest = Array.isArray(rows) && rows.length > 0 ? rows[0] : null

  return {
    hasOrder: Boolean(latest),
    lastOrder: latest
      ? {
          id: Number(latest.id),
          status: String(latest.status || ''),
          paymentIntentId: String(latest.payment_intent_id || ''),
          createdAt: latest.created_at
        }
      : null
  }
})
