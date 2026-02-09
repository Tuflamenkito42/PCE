import bcrypt from 'bcryptjs';
import { usePrisma } from '../../utils/prisma';
import { defineEventHandler, readBody, createError } from 'h3';

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

    // Do NOT set cookie here. This is just for validation.

    return {
        status: 'success',
        user: {
            id: user.id,
            email: user.email,
            full_name: user.fullName,
            role: user.role,
            dni: user.dni
        }
    };
});
