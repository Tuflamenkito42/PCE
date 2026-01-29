import { defineEventHandler, readBody, createError } from 'h3';
import { useDb } from '../../utils/db';
import { sendEmail } from '../../utils/email';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email } = body;

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw createError({
            statusCode: 400,
            message: 'Email inválido'
        });
    }

    const db = useDb();

    try {
        // Insert into database
        await db.query('INSERT INTO newsletter_subscribers (email) VALUES (?)', [email]);

        // Send welcome email
        await sendEmail(
            email,
            '🗞️ ¡Bienvenido a nuestro Newsletter!',
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                <div style="background-color: #723233; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0; font-family: 'Cinzel', serif;">PROTECCIÓN CIVIL ESPAÑOLA</h1>
                </div>
                <div style="padding: 30px; background-color: white; border-bottom: 1px solid #eee;">
                    <h2 style="color: #333;">¡Hola!</h2>
                    <p style="color: #555; line-height: 1.6;">
                        Gracias por suscribirte a nuestro newsletter. A partir de ahora rercibirás todas las novedades, eventos y comunicados oficiales directamente en tu bandeja de entrada.
                    </p>
                    <p style="color: #555; line-height: 1.6;">
                        Estamos encantados de que quieras estar al día con nuestro movimiento.
                    </p>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="https://pce-web.com" style="background-color: #723233; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visitar nuestra Web</a>
                    </div>
                </div>
                <div style="padding: 20px; text-align: center; font-size: 12px; color: #888;">
                    <p>© 2024 Protección Civil Española. Todos los derechos reservados.</p>
                    <p>Si no deseas recibir más correos, por favor contacta con nosotros.</p>
                </div>
            </div>
            `
        );

        return { status: 'ok', message: 'Suscripción exitosa' };
    } catch (error: any) {
        // Handle duplicate email error
        if (error.code === 'ER_DUP_ENTRY') {
            return { status: 'ok', message: 'Este correo ya está suscrito' };
        }

        // Detailed error for debugging
        const errorDetail = error.message || error.code || 'Error desconocido';
        console.error('Newsletter error:', errorDetail);

        throw createError({
            statusCode: 500,
            message: 'Error al suscribir: ' + errorDetail
        });
    }
});
