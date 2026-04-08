import { useDb } from '../../../utils/db'
import { verifyCarnetQrToken } from '../../../utils/carnet-qr-token'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')

  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Token requerido.' })
  }

  const payload = verifyCarnetQrToken(token)
  const db = useDb()

  const [rows]: any = await db.query(
    `SELECT id, name, lastname, dni, email, birthdate, phone, quota, status, created_at, card_photo_path
     FROM affiliations
     WHERE id = ?
     LIMIT 1`,
    [payload.affiliationId]
  )

  if (!Array.isArray(rows) || rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Carnet no encontrado.' })
  }

  const row = rows[0]

  return {
    card: {
      id: Number(row.id),
      fullName: `${String(row.name || '').trim()} ${String(row.lastname || '').trim()}`.trim(),
      dni: String(row.dni || ''),
      email: String(row.email || ''),
      birthdate: row.birthdate,
      phone: String(row.phone || ''),
      quota: Number(row.quota || 0),
      status: String(row.status || ''),
      createdAt: row.created_at,
      renovationAt: (() => {
        const d = new Date(row.created_at)
        d.setFullYear(d.getFullYear() + 5)
        return d
      })(),
      numberId: `SOC${String(Number(row.id) || 0).padStart(6, '0')}`,
      photoUrl: String(row.card_photo_path || '')
    }
  }
})
