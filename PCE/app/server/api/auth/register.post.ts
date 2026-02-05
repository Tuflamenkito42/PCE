import bcrypt from 'bcryptjs';
import { useDb } from '../../utils/db';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, password, fullName, dni } = body;

    if (!email || !password || !fullName || !dni) {
        throw createError({ statusCode: 400, message: 'Faltan datos requeridos' });
    }

    const db = useDb();

    // Check if user exists (email or DNI)
    const [existingEmail] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if ((existingEmail as any).length > 0) {
        throw createError({ statusCode: 409, message: 'El correo electrónico ya está registrado' });
    }

    const [existingDni] = await db.query('SELECT id FROM users WHERE dni = ?', [dni]);
    if ((existingDni as any).length > 0) {
        throw createError({ statusCode: 409, message: 'El DNI/NIE ya está registrado' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = (email.toLowerCase().includes('staff') || email.toLowerCase().includes('pce')) ? 'staff' : 'public';

    // Insert user
    try {
        await db.query(
            'INSERT INTO users (email, password, full_name, dni, role) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, fullName, dni, role]
        );
        return { status: 'success', message: 'Usuario registrado correctamente' };
    } catch (error: any) {
        throw createError({ statusCode: 500, message: 'Error al registrar usuario: ' + error.message });
    }
});
