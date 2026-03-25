export default defineRouteMiddleware((to, from) => {
    const { user } = useAuth();

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

    if (user.value.role !== 'admin') {
        console.warn('⛔ Acceso denegado a admin: Usuario no tiene permisos de administrador');
        return navigateTo('/');
    }
});
