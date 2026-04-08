import { requireAuth } from '../../utils/auth-middleware'
import { useDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)
  const db = useDb()

  const email = String(authUser.email || '').toLowerCase().trim()

  const [affRows]: any = await db.query(
    `SELECT id, name, lastname, dni, birthdate, email, phone, quota, status, card_photo_path, photo_url, created_at
     FROM affiliations
     WHERE email = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    [email]
  )

  const [userRows]: any = await db.query(
    `SELECT id, full_name, dni, email
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email]
  )

  const affiliation = Array.isArray(affRows) && affRows.length > 0 ? affRows[0] : null
  const user = Array.isArray(userRows) && userRows.length > 0 ? userRows[0] : null

  return {
    affiliation: affiliation
      ? {
          id: Number(affiliation.id),
          name: String(affiliation.name || ''),
          lastname: String(affiliation.lastname || ''),
          dni: String(affiliation.dni || ''),
          birthdate: affiliation.birthdate,
          email: String(affiliation.email || ''),
          phone: String(affiliation.phone || ''),
          quota: Number(affiliation.quota || 0),
          status: String(affiliation.status || ''),
          photoUrl: String(affiliation.photo_url || affiliation.card_photo_path || ''),
          createdAt: affiliation.created_at
        }
      : null,
    user: user
      ? {
          id: Number(user.id),
          fullName: String(user.full_name || ''),
          dni: String(user.dni || ''),
          email: String(user.email || '')
        }
      : null
  }
})
