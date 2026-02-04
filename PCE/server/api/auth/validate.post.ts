import bcrypt from 'bcryptjs';

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

    // Do NOT set cookie here. This is just for validation.

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
