import { verifyAuthToken } from '../../utils/auth-token';

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token');

    if (!token) {
        return { user: null };
    }

    try {
        const decoded = verifyAuthToken(token);
        return { user: decoded };
    } catch (e) {
        console.error('Token decoding error:', e);
        return { user: null };
    }
});
