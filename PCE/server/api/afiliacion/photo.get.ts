import { requireAuth } from '../../utils/auth-middleware'
import { useDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const db = useDb()

  try {
    const [columns]: any = await db.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliations'
    `)

    const existingColumns = new Set((columns || []).map((col: any) => String(col.COLUMN_NAME || '').toLowerCase()))
    if (!existingColumns.has('card_photo_path')) {
      return { photoUrl: null }
    }

    const [rows]: any = await db.query(
      `SELECT card_photo_path
       FROM affiliations
       WHERE email = ? AND status IN (?, ?, ?)
       ORDER BY created_at DESC
       LIMIT 1`,
      [String(user.email || '').toLowerCase().trim(), 'paid', 'active', 'simulated_paid']
    )

    const latest = Array.isArray(rows) && rows.length > 0 ? rows[0] : null
    return {
      photoUrl: latest?.card_photo_path || null
    }
  } catch (error) {
    console.error('Error obteniendo foto de afiliación:', error)
    return { photoUrl: null }
  }
})
