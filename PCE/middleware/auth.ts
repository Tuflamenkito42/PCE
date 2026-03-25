export default defineRouteMiddleware((to, from) => {
    const { user } = useAuth();

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
