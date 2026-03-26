import { H3Event, createError, getCookie } from 'h3';
import { verifyAuthToken } from './auth-token';

export const validateAdmin = (event: H3Event) => {
    const token = getCookie(event, 'auth_token');
    if (!token) {
        console.warn('[validateAdmin] No token found in cookies');
        throw createError({ statusCode: 401, message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = verifyAuthToken(token);
        const role = String(decoded.role || '').toLowerCase();

        if (role !== 'admin') {
            console.warn('[validateAdmin] User is not admin:', decoded.email);
            throw createError({ statusCode: 403, message: 'Forbidden: Admin access required' });
        }
        return decoded;
    } catch (e: any) {
        // Keep explicit auth/authorization errors as-is
        if (e?.statusCode) {
            throw e;
        }
        console.error('[validateAdmin] Error decoding token:', e);
        throw createError({ statusCode: 401, message: 'Invalid token structure' });
    }
};
