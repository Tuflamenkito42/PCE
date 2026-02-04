import { H3Event, createError, getCookie } from 'h3';

export const validateAdmin = (event: H3Event) => {
    const token = getCookie(event, 'auth_token');
    if (!token) {
        throw createError({ statusCode: 401, message: 'Unauthorized' });
    }

    try {
        // Simple base64 decode for the JSON token
        const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
        const decoded = JSON.parse(jsonStr);

        if (decoded.role !== 'admin') {
            throw createError({ statusCode: 403, message: 'Forbidden' });
        }
        return decoded;
    } catch (e) {
        throw createError({ statusCode: 401, message: 'Invalid token' });
    }
};
