export default defineNuxtRouteMiddleware(async (to) => {
  const { user, checkAuth } = useAuth()

  if (!user.value) {
    await checkAuth()
  }

  if (!user.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  try {
    const apiFetch = process.server ? useRequestFetch() : $fetch
    const result = await apiFetch('/api/afiliacion/check', {
      method: 'GET',
      query: { email: user.value.email }
    })

    if (!result?.affiliated) {
      return navigateTo('/afiliacion')
    }
  } catch (error) {
    // No redirigir por errores transitorios en refresh (SSR/cookies/red).
    console.warn('No se pudo verificar afiliación en este intento:', error)
  }
})
