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
    if (!existingColumns.has('photo_url') && !existingColumns.has('card_photo_path')) {
      return { photoUrl: null }
    }

    const normalizedEmail = String(user.email || '').toLowerCase().trim()
    const normalizedDni = String(user.dni || '').toUpperCase().trim()

    const [rows]: any = await db.query(
      `SELECT COALESCE(photo_url, card_photo_path) AS photo_url
       FROM affiliations
       WHERE (
         email = ?
         OR (? <> '' AND dni = ?)
       )
         AND (photo_url IS NOT NULL OR card_photo_path IS NOT NULL)
       ORDER BY created_at DESC
       LIMIT 1`,
      [normalizedEmail, normalizedDni, normalizedDni]
    )

    const latest = Array.isArray(rows) && rows.length > 0 ? rows[0] : null

    const photoUrl = String(latest?.photo_url || '')

    if (!photoUrl) {
      return { photoUrl: null }
    }

    // Devuelve la URL relativa simple (compatible con timestamp cache-bust)
    return { photoUrl }
  } catch (error) {
    console.error('Error obteniendo foto de afiliación:', error)
    return { photoUrl: null }
  }
})
