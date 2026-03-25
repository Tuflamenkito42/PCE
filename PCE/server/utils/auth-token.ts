import crypto from 'node:crypto'

export type AuthTokenPayload = {
  id?: number
  email: string
  role: string
  full_name?: string
  exp: number
}

const b64UrlEncode = (input: string) => Buffer.from(input, 'utf8').toString('base64url')
const b64UrlDecode = (input: string) => Buffer.from(input, 'base64url').toString('utf8')

let warnedMissingSecret = false

const getSecret = () => {
  const config = useRuntimeConfig()
  const secret = String(
    config.authTokenSecret ||
    process.env.AUTH_TOKEN_SECRET ||
    'local-dev-insecure-secret-change-me'
  )

  if (!config.authTokenSecret && !process.env.AUTH_TOKEN_SECRET && !warnedMissingSecret) {
    warnedMissingSecret = true
    console.warn('[auth-token] AUTH_TOKEN_SECRET no configurado. Usando fallback temporal de desarrollo.')
  }

  return secret
}

const sign = (data: string, secret: string) => {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url')
}

export const createAuthToken = (payload: Omit<AuthTokenPayload, 'exp'>, ttlSeconds = 60 * 60 * 24 * 7) => {
  const secret = getSecret()
  const fullPayload: AuthTokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds
  }

  const body = b64UrlEncode(JSON.stringify(fullPayload))
  const signature = sign(body, secret)
  return `${body}.${signature}`
}

export const verifyAuthToken = (token: string): AuthTokenPayload => {
  const secret = getSecret()
  const [body, signature] = token.split('.')

  if (!body || !signature) {
    throw createError({ statusCode: 401, statusMessage: 'Token invalido' })
  }

  const expectedSig = sign(body, secret)
  const validSignature = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))
  if (!validSignature) {
    throw createError({ statusCode: 401, statusMessage: 'Token invalido' })
  }

  const payload = JSON.parse(b64UrlDecode(body)) as AuthTokenPayload
  if (!payload?.email || !payload?.role || !payload?.exp) {
    throw createError({ statusCode: 401, statusMessage: 'Token invalido' })
  }

  const now = Math.floor(Date.now() / 1000)
  if (payload.exp < now) {
    throw createError({ statusCode: 401, statusMessage: 'Token expirado' })
  }

  return payload
}
