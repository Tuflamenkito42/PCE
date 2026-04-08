import { requireAuth } from '../../utils/auth-middleware'
import { useDb } from '../../utils/db'
import { createCarnetQrToken } from '../../utils/carnet-qr-token'

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)
  const db = useDb()

  const email = String(authUser.email || '').toLowerCase().trim()

  const [rows]: any = await db.query(
    `SELECT id
     FROM affiliations
     WHERE email = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    [email]
  )

  if (!Array.isArray(rows) || rows.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No hay afiliacion registrada para generar QR.'
    })
  }

  const affiliationId = Number(rows[0].id)
  const token = createCarnetQrToken(affiliationId)

  const proto = getHeader(event, 'x-forwarded-proto') || 'https'
  const host = getHeader(event, 'x-forwarded-host') || getHeader(event, 'host') || 'localhost:3000'
  const baseUrl = `${proto}://${host}`

  return {
    token,
    publicUrl: `${baseUrl}/carnet/qr/${token}`
  }
})
