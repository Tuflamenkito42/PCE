export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token');

    if (!token) {
        return { user: null };
    }

    try {
        // Ensure Buffer is available or use standard atob for base64
        const buffer = globalThis.Buffer || await import('node:buffer').then(m => m.Buffer);
        const decodedString = buffer.from(token, 'base64').toString('utf-8');
        const decoded = JSON.parse(decodedString);
        return { user: decoded };
    } catch (e) {
        console.error('Token decoding error:', e);
        return { user: null };
    }
});
