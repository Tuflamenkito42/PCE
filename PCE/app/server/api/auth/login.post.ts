import bcrypt from 'bcryptjs';
import { usePrisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, password } = body;

    if (!email || !password) {
        throw createError({ statusCode: 400, message: 'Email y contraseña requeridos' });
    }

    const prisma = usePrisma();
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw createError({ statusCode: 401, message: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        throw createError({ statusCode: 401, message: 'Credenciales inválidas' });
    }

    // Set cookie for session
    const token = Buffer.from(JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.fullName
    })).toString('base64');

    setCookie(event, 'auth_token', token, {
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
    });

    return {
        status: 'success',
        user: {
            id: user.id,
            email: user.email,
            full_name: user.fullName,
            role: user.role
        }
    };
});
