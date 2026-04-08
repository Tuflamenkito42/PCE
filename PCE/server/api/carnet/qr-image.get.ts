import { requireAuth } from '../../utils/auth-middleware'
import { useDb } from '../../utils/db'
import { createCarnetQrToken } from '../../utils/carnet-qr-token'
import { verifyCarnetQrToken } from '../../utils/carnet-qr-token'

export default defineEventHandler(async (event) => {
  const tokenQuery = String(getQuery(event).token || '').trim()
  let token = tokenQuery

  if (token) {
    verifyCarnetQrToken(token)
  }

  const QRCode = (await import('qrcode')).default

  if (!token) {
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
    token = createCarnetQrToken(affiliationId)
  }

  const proto = getHeader(event, 'x-forwarded-proto') || (process.dev ? 'http' : 'https')
  const host = getHeader(event, 'x-forwarded-host') || getHeader(event, 'host') || 'localhost:3000'
  const payloadUrl = `${proto}://${host}/carnet/qr/${token}`

  if (!payloadUrl) {
    throw createError({ statusCode: 500, statusMessage: 'No se pudo generar la URL del QR.' })
  }

  const pngBuffer = await QRCode.toBuffer(payloadUrl, {
    width: 320,
    margin: 1,
    color: {
      dark: '#1f1f1f',
      light: '#FFFFFFFF'
    }
  })

  setHeader(event, 'Content-Type', 'image/png')
  setHeader(event, 'Cache-Control', 'no-store')

  return pngBuffer
})
