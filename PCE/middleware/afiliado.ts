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
    const result = await $fetch('/api/afiliacion/check', {
      method: 'GET',
      query: { email: user.value.email }
    })

    if (!result?.affiliated) {
      return navigateTo('/afiliacion')
    }
  } catch (_error) {
    return navigateTo('/afiliacion')
  }
})
