export default defineNuxtRouteMiddleware(async (to, from) => {
    const { user, checkAuth } = useAuth();

    // Restore session from httpOnly cookie on direct navigation/refresh
    if (!user.value) {
        await checkAuth();
    }

    // ✅ SECURITY: Requiere autenticación para acceder a bullpatriot
    if (!user.value) {
        console.warn('⛔ Acceso denegado a bullpatriot: Usuario no autenticado');
        return navigateTo({
            path: '/login',
            query: {
                redirect: '/bullpatriot'  // Redirigir a bullpatriot después del login
            }
        });
    }
});
