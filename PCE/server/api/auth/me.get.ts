import { Buffer } from 'node:buffer';

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token');

    if (!token) {
        return { user: null };
    }

    try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        return { user: decoded };
    } catch (e) {
        return { user: null };
    }
});
