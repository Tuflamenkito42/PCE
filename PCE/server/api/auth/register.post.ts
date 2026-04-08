import bcrypt from 'bcryptjs';
import { useDb } from '../../utils/db';
import { sendEmail } from '../../utils/email';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, password, confirmPassword, fullName, dni } = body;

    if (!email || !password || !confirmPassword || !fullName || !dni) {
        throw createError({ statusCode: 400, message: 'Faltan datos requeridos' });
    }

    if (String(password) !== String(confirmPassword)) {
        throw createError({ statusCode: 400, message: 'Las contraseñas no coinciden' });
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
    const role = 'public';

    // Insert user
    try {
        await db.query(
            'INSERT INTO users (email, password, full_name, dni, role) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, fullName, dni, role]
        );

        await sendEmail(
            String(email).toLowerCase().trim(),
            'Bienvenido a PCE - Registro completado',
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                <div style="background-color: #723233; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0;">BIENVENIDO A PCE</h1>
                </div>
                <div style="padding: 30px; background-color: white;">
                    <h2 style="color: #333;">Hola ${fullName},</h2>
                    <p style="color: #555; line-height: 1.6;">
                        Gracias por registrarte en nuestra plataforma. Tu cuenta ha sido creada correctamente.
                    </p>
                    <p style="color: #555; line-height: 1.6;">
                        Ya puedes acceder a tu perfil y participar en las iniciativas de PCE.
                    </p>
                </div>
                <div style="padding: 20px; text-align: center; font-size: 12px; color: #888;">
                    <p>© 2026 Protección Civil Española. Todos los derechos reservados.</p>
                </div>
            </div>
            `
        );

        return { status: 'success', message: 'Usuario registrado correctamente' };
    } catch (error: any) {
        throw createError({ statusCode: 500, message: 'Error al registrar usuario: ' + error.message });
    }
});
