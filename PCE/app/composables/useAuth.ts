export const useUser = () => useState<any>('user', () => null);

export const useAuth = () => {
    const user = useUser();

    // Check auth on startup using cookie directly (client & server friendly)
    const checkAuth = () => {
        try {
            const token = useCookie('auth_token');
            if (token.value) {
                // Simple base64 decode for the JSON token
                // We stored it as: Buffer.from(JSON.stringify(...)).toString('base64')
                let jsonStr = '';
                if (process.server) {
                    const { Buffer } = require('node:buffer');
                    jsonStr = Buffer.from(token.value, 'base64').toString('utf-8');
                } else {
                    jsonStr = atob(token.value);
                }

                if (jsonStr) {
                    const decoded = JSON.parse(jsonStr);
                    // Ensure full_name exists for the badge updates
                    user.value = decoded;
                    console.log('User restored from cookie:', user.value);
                    return true;
                }
            }
        } catch (e) {
            console.error('Auth restore error:', e);
            // If error decoding, clear cookie to prevent loop
            const token = useCookie('auth_token');
            token.value = null;
        }
        user.value = null;
        return false;
    };

    const validate = async (email: string, password: string) => {
        const { data, error } = await useFetch<any>('/api/auth/validate', {
            method: 'POST',
            body: { email, password }
        });

        if (error.value) throw error.value;
        return data.value;
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
        validate,
        login,
        register,
        logout
    };
};
