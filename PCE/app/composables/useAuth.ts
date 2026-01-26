export const useUser = () => useState('user', () => null);

export const useAuth = () => {
    const user = useUser();

    // Check auth on startup
    const checkAuth = async () => {
        try {
            const headers = useRequestHeaders(['cookie']);
            const { data } = await useFetch('/api/auth/me', { headers });

            if (data.value && data.value.user) {
                user.value = data.value.user;
                return true;
            }
        } catch (e) {
            console.error('Auth check failed:', e);
        }
        user.value = null;
        return false;
    };

    const login = async (email, password) => {
        const { data, error } = await useFetch('/api/auth/login', {
            method: 'POST',
            body: { email, password }
        });

        if (error.value) throw error.value;

        user.value = data.value.user;
        return data.value;
    };

    const register = async (userData) => {
        const { data, error } = await useFetch('/api/auth/register', {
            method: 'POST',
            body: userData
        });

        if (error.value) throw error.value;
        return data.value;
    };

    const logout = async () => {
        const token = useCookie('auth_token');
        token.value = null;
        user.value = null;
        navigateTo('/login');
    };

    return {
        user,
        checkAuth,
        login,
        register,
        logout
    };
};
