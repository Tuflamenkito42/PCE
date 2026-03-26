export default defineNuxtRouteMiddleware(async (to, from) => {
    const { user, checkAuth } = useAuth();

    // Restore session from httpOnly cookie on direct navigation/refresh
    if (!user.value) {
        await checkAuth();
    }

    // ✅ SECURITY: Requiere autenticación Y rol de administrador
    if (!user.value) {
        console.warn('⛔ Acceso denegado a admin: Usuario no autenticado');
        return navigateTo({
            path: '/login',
            query: {
                redirect: '/admin'
            }
        });
    }

    if ((user.value.role || '').toLowerCase() !== 'admin') {
        console.warn('⛔ Acceso denegado a admin: Usuario no tiene permisos de administrador');
        return navigateTo('/');
    }
});
