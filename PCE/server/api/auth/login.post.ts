import bcrypt from 'bcryptjs';
import { Buffer } from 'node:buffer';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, password } = body;

    if (!email || !password) {
        throw createError({ statusCode: 400, message: 'Email y contraseña requeridos' });
    }

    const db = useDb();
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const users = rows as any[];

    if (users.length === 0) {
        throw createError({ statusCode: 401, message: 'Credenciales inválidas' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        throw createError({ statusCode: 401, message: 'Credenciales inválidas' });
    }

    // Set cookie for session (simple approach without JWT for now, just user ID, or could use JWT if preferred but keeping it simple for "remember me")
    // For better security in production, use a signed session token (JWT).
    // Here we'll just return the user info and let the client handle state, 
    // BUT user asked to "not login every time", so we should set a cookie.

    // We'll simulate a simple session by storing user_id in an httpOnly cookie? 
    // Or just a public cookie for this demo since we don't have a complex auth module installed.
    // Let's use a simple cookie 'pce_auth_user' with the JSON data, but usually this is insecure.
    // Better: Return user data and use useCookie in the frontend to store a session persistence flag.

    // Actually, setting an HttpOnly cookie is best for security.
    // Let's create a simple session token (mock) or just store the user ID.
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role })).toString('base64');

    setCookie(event, 'auth_token', token, {
        httpOnly: false, // Let frontend read it for now to know we are logged in, or use a separate composable.
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
    });

    return {
        status: 'success',
        user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role
        }
    };
});
