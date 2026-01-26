export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token');

    if (!token) {
        return { user: null };
    }

    try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        // Optionally verify against DB here if needed
        return { user: decoded };
    } catch (e) {
        return { user: null };
    }
});
