import { H3Event, createError, getCookie } from 'h3';

export const validateAdmin = (event: H3Event) => {
    const token = getCookie(event, 'auth_token');
    if (!token) {
        console.warn('[validateAdmin] No token found in cookies');
        throw createError({ statusCode: 401, message: 'Unauthorized: No token provided' });
    }

    try {
        const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
        const decoded = JSON.parse(jsonStr);
        console.log('[validateAdmin] Token decoded:', decoded.email, 'Role:', decoded.role);

        if (decoded.role !== 'admin') {
            console.warn('[validateAdmin] User is not admin:', decoded.email);
            throw createError({ statusCode: 403, message: 'Forbidden: Admin access required' });
        }
        return decoded;
    } catch (e) {
        console.error('[validateAdmin] Error decoding token:', e);
        throw createError({ statusCode: 401, message: 'Invalid token structure' });
    }
};
