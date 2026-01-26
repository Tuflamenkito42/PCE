export const useUser = () => useState<any>('user', () => null);

export const useAuth = () => {
    const user = useUser();

    // Check auth on startup
    const checkAuth = async () => {
        try {
            const headers = useRequestHeaders(['cookie']);
            const { data } = await useFetch('/api/auth/me', { headers });

            if (data.value && (data.value as any).user) {
                user.value = (data.value as any).user;
                console.log('Auth restored:', user.value);
                return true;
            }
        } catch (e) {
            console.error('Auth check failed:', e);
        }
        console.log('No active session found');
        user.value = null;
        return false;
    };

    const login = async (email: string, password: string) => {
        const { data, error } = await useFetch<any>('/api/auth/login', {
            method: 'POST',
            body: { email, password }
        });

        if (error.value) throw error.value;

        if (data.value) {
            user.value = data.value.user;
            return data.value;
        }
    };

    const register = async (userData: any) => {
        const { data, error } = await useFetch<any>('/api/auth/register', {
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
