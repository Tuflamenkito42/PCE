import crypto from 'node:crypto'

export type CarnetQrPayload = {
  affiliationId: number
  exp: number
}

const encode = (value: string) => Buffer.from(value, 'utf8').toString('base64url')
const decode = (value: string) => Buffer.from(value, 'base64url').toString('utf8')

const getSecret = () => {
  const config = useRuntimeConfig()
  return String(
    config.authTokenSecret ||
    process.env.AUTH_TOKEN_SECRET ||
    'local-dev-insecure-secret-change-me'
  )
}

const sign = (body: string, secret: string) => {
  return crypto.createHmac('sha256', secret).update(body).digest('base64url')
}

export const createCarnetQrToken = (affiliationId: number, ttlSeconds = 60 * 60 * 24 * 180) => {
  const payload: CarnetQrPayload = {
    affiliationId,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds
  }

  const body = encode(JSON.stringify(payload))
  const signature = sign(body, getSecret())
  return `${body}.${signature}`
}

export const verifyCarnetQrToken = (token: string): CarnetQrPayload => {
  const [body, signature] = String(token || '').split('.')

  if (!body || !signature) {
    throw createError({ statusCode: 401, statusMessage: 'Token QR invalido' })
  }

  const expected = sign(body, getSecret())
  const valid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))

  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Token QR invalido' })
  }

  const payload = JSON.parse(decode(body)) as CarnetQrPayload
  if (!payload?.affiliationId || !payload?.exp) {
    throw createError({ statusCode: 401, statusMessage: 'Token QR invalido' })
  }

  const now = Math.floor(Date.now() / 1000)
  if (payload.exp < now) {
    throw createError({ statusCode: 401, statusMessage: 'Token QR expirado' })
  }

  return payload
}
