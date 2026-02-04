import { defineEventHandler, readBody, createError } from 'h3';
import { useDb } from '../../utils/db';
import { sendEmail } from '../../utils/email';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !message) {
        throw createError({
            statusCode: 400,
            message: 'Todos los campos obligatorios (nombre, email, mensaje) deben ser rellenados.'
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw createError({
            statusCode: 400,
            message: 'Email inválido'
        });
    }

    const db = useDb();

    try {
        // 1. Save to database
        await db.query(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject || 'Sin asunto', message]
        );

        // 2. Send notification email to admin
        const config = useRuntimeConfig();
        if (config.smtpUser) {
            await sendEmail(
                config.smtpUser,
                `📩 Nuevo mensaje de contacto: ${subject || 'Sin asunto'}`,
                `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h1 style="color: #723233; border-bottom: 2px solid #723233; padding-bottom: 10px;">Nuevo Mensaje Recibido</h1>
                        <p>Has recibido un nuevo mensaje a través del formulario de contacto de la web.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 12px;"><strong>👤 Nombre:</strong> ${name}</li>
                            <li style="margin-bottom: 12px;"><strong>📧 Email:</strong> ${email}</li>
                            <li style="margin-bottom: 12px;"><strong>📌 Asunto:</strong> ${subject || 'Sin asunto'}</li>
                        </ul>
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #723233;">
                            <strong>💬 Mensaje:</strong><br>
                            <p style="white-space: pre-wrap;">${message}</p>
                        </div>
                    </div>
                </div>
                `
            );
        }

        // 3. Optional: Send confirmation to user
        await sendEmail(
            email,
            'Hemos recibido tu mensaje - PCE',
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                <div style="background-color: #723233; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0;">PCE CONTACTO</h1>
                </div>
                <div style="padding: 30px; background-color: white;">
                    <h2 style="color: #333;">¡Hola ${name}!</h2>
                    <p style="color: #555; line-height: 1.6;">
                        Hemos recibido tu mensaje correctamente. Nuestro equipo lo revisará y te responderemos lo antes posible.
                    </p>
                    <p style="color: #555; line-height: 1.6;">
                        Gracias por ponerte en contacto con nosotros.
                    </p>
                </div>
                <div style="padding: 20px; text-align: center; font-size: 12px; color: #888;">
                    <p>© 2024 Protección Civil Española. Todos los derechos reservados.</p>
                </div>
            </div>
            `
        );

        return { status: 'ok', message: 'Mensaje enviado correctamente' };

    } catch (error: any) {
        console.error('Contact error:', error);
        throw createError({
            statusCode: 500,
            message: 'Error al enviar el mensaje. Detalles: ' + error.message
        });
    }
});
