export const useUser = () => useState<any>('user', () => null);

export const useAuth = () => {
    const user = useUser();

    // Check auth on startup via server endpoint (works with httpOnly cookies)
    const checkAuth = async () => {
        try {
            const apiFetch = process.server ? useRequestFetch() : $fetch;
            const data = await apiFetch<any>('/api/auth/me', {
                method: 'GET'
            });

            if (data?.user) {
                user.value = data.user;
                return true;
            }
        } catch (e) {
            console.error('Auth restore error:', e);
        }

        user.value = null;
        return false;
    };

    const validate = async (email: string, password: string) => {
        return await $fetch<any>('/api/auth/validate', {
            method: 'POST',
            body: { email, password }
        });
    };

    const login = async (email: string, password: string) => {
        const data = await $fetch<any>('/api/auth/login', {
            method: 'POST',
            body: { email, password }
        });

        if (data) {
            user.value = data.user;
            return data;
        }
    };

    const register = async (userData: any) => {
        return await $fetch<any>('/api/auth/register', {
            method: 'POST',
            body: userData
        });
    };

    const logout = async () => {
        try {
            await $fetch('/api/auth/logout', {
                method: 'POST'
            });
        } catch (e) {
            console.error('Logout API error:', e);
        }

        user.value = null;
        try {
            await navigateTo('/login', { replace: true });
        } catch (e) {
            console.error('Logout navigation error:', e);
            if (process.client) {
                window.location.href = '/login';
            }
        }
    };

    return {
        user,
        checkAuth,
        validate,
        login,
        register,
        logout
    };
};
