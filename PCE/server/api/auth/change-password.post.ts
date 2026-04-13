import bcrypt from 'bcryptjs'
import { createError, defineEventHandler, readBody } from 'h3'
import { requireAuth } from '../../utils/auth-middleware'
import { usePrisma } from '../../utils/prisma'

type ChangePasswordBody = {
  currentPassword?: string
  newPassword?: string
}

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)
  const body = await readBody<ChangePasswordBody>(event)

  const currentPassword = String(body?.currentPassword || '')
  const newPassword = String(body?.newPassword || '')

  if (!currentPassword || !newPassword) {
    throw createError({ statusCode: 400, message: 'Debes enviar la contraseña actual y la nueva.' })
  }

  if (newPassword.length < 8) {
    throw createError({ statusCode: 400, message: 'La nueva contraseña debe tener al menos 8 caracteres.' })
  }

  const prisma = usePrisma()
  const user = await prisma.user.findUnique({
    where: { email: authUser.email }
  })

  if (!user) {
    throw createError({ statusCode: 404, message: 'Usuario no encontrado.' })
  }

  const validCurrentPassword = await bcrypt.compare(currentPassword, user.password)
  if (!validCurrentPassword) {
    throw createError({ statusCode: 401, message: 'La contraseña actual no es correcta.' })
  }

  const samePassword = await bcrypt.compare(newPassword, user.password)
  if (samePassword) {
    throw createError({ statusCode: 400, message: 'La nueva contraseña no puede ser igual a la actual.' })
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  })

  return { success: true, message: 'Contraseña actualizada correctamente.' }
})
