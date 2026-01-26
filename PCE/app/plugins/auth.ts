export default defineNuxtPlugin(async (nuxtApp) => {
    const { checkAuth } = useAuth();
    await checkAuth();
});
