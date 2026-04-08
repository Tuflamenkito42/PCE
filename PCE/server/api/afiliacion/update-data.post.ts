import { requireAuth } from '../../utils/auth-middleware'
import { useDb } from '../../utils/db'

const activeStatuses = ['paid', 'active', 'simulated_paid']

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)
  const db = useDb()
  const body = await readBody(event)

  const name = String(body.name || '').trim()
  const lastname = String(body.lastname || '').trim()
  const dni = String(body.dni || '').toUpperCase().trim()
  const birthdate = String(body.birthdate || '').trim()
  const phone = String(body.phone || '').trim()

  if (!name || !lastname || !dni || !birthdate || !phone) {
    throw createError({
      statusCode: 400,
      message: 'Faltan campos obligatorios para actualizar tus datos.'
    })
  }

  const email = String(authUser.email || '').toLowerCase().trim()

  const [affRows]: any = await db.query(
    `SELECT id
     FROM affiliations
     WHERE email = ? AND status IN (?, ?, ?)
     ORDER BY created_at DESC
     LIMIT 1`,
    [email, ...activeStatuses]
  )

  if (!Array.isArray(affRows) || affRows.length === 0) {
    throw createError({
      statusCode: 403,
      message: 'No tienes una afiliacion activa para editar.'
    })
  }

  const affiliationId = Number(affRows[0].id)

  const [conflictAffByDni]: any = await db.query(
    `SELECT id
     FROM affiliations
     WHERE dni = ?
       AND id <> ?
       AND status IN (?, ?, ?)
     LIMIT 1`,
    [dni, affiliationId, ...activeStatuses]
  )

  if (Array.isArray(conflictAffByDni) && conflictAffByDni.length > 0) {
    throw createError({
      statusCode: 409,
      message: 'Ese DNI/NIE ya esta siendo utilizado por otra afiliacion activa.'
    })
  }

  const [currentUserRows]: any = await db.query(
    'SELECT id FROM users WHERE email = ? LIMIT 1',
    [email]
  )

  const currentUserId = Array.isArray(currentUserRows) && currentUserRows.length > 0
    ? Number(currentUserRows[0].id)
    : null

  if (currentUserId) {
    const [conflictUserByDni]: any = await db.query(
      'SELECT id FROM users WHERE dni = ? AND id <> ? LIMIT 1',
      [dni, currentUserId]
    )

    if (Array.isArray(conflictUserByDni) && conflictUserByDni.length > 0) {
      throw createError({
        statusCode: 409,
        message: 'Ese DNI/NIE ya esta registrado en otro usuario.'
      })
    }
  }

  await db.query(
    `UPDATE affiliations
     SET name = ?, lastname = ?, dni = ?, birthdate = ?, phone = ?
     WHERE id = ?`,
    [name, lastname, dni, birthdate, phone, affiliationId]
  )

  const fullName = `${name} ${lastname}`.trim()
  await db.query(
    `UPDATE users
     SET full_name = ?, dni = ?
     WHERE email = ?`,
    [fullName, dni, email]
  )

  return {
    success: true,
    message: 'Datos actualizados correctamente.'
  }
})
