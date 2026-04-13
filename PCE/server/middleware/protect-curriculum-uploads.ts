import { createError, defineEventHandler, getRequestURL } from 'h3'

export default defineEventHandler((event) => {
  const pathname = getRequestURL(event).pathname || ''
  if (pathname.startsWith('/uploads/curriculum/')) {
    throw createError({
      statusCode: 403,
      message: 'Acceso denegado a currículums.'
    })
  }
})
