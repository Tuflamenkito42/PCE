import { defineEventHandler, readBody, createError, getHeader } from 'h3';
import { useDb } from '../../utils/db';
import { sendEmail } from '../../utils/email';

// ✅ SECURITY: Simple in-memory rate limiter per IP
const contactAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string) {
    const now = Date.now();
    const limit = 5; // Max 5 contact messages per hour
    const windowMs = 60 * 60 * 1000; // 1 hour

    const record = contactAttempts.get(ip);
    if (!record || now > record.resetTime) {
        contactAttempts.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (record.count >= limit) {
        console.warn(`⚠️ Contact spam attempt from IP: ${ip}`);
        return false;
    }

    record.count++;
    return true;
}

export default defineEventHandler(async (event) => {
    // ✅ SECURITY: Rate limiting
    const clientIp = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown';
    if (!checkRateLimit(clientIp as string)) {
        throw createError({
            statusCode: 429,
            message: 'Too many requests. Max 5 contact forms per hour.'
        });
    }

    const body = await readBody(event);
    const { name, email, subject, message } = body;

    // ✅ SECURITY: Validation
    if (!name || !email || !message) {
        throw createError({
            statusCode: 400,
            message: 'Todos los campos obligatorios (nombre, email, mensaje) deben ser rellenados.'
        });
    }

    // ✅ SECURITY: Validate field lengths
    if (name.length < 2 || name.length > 100) {
        throw createError({
            statusCode: 400,
            message: 'Nombre debe tener entre 2 y 100 caracteres'
        });
    }

    if (message.length < 10 || message.length > 5000) {
        throw createError({
            statusCode: 400,
            message: 'Mensaje debe tener entre 10 y 5000 caracteres'
        });
    }

    if (subject && subject.length > 200) {
        throw createError({
            statusCode: 400,
            message: 'Asunto debe tener máximo 200 caracteres'
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw createError({
            statusCode: 400,
            message: 'Email inválido'
        });
    }

    // ✅ SECURITY: Sanitize inputs (remove HTML)
    const sanitizeInput = (input: string) => {
        return input
            .replace(/[<>]/g, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '')
            .trim();
    };

    const cleanName = sanitizeInput(name);
    const cleanEmail = email.toLowerCase().trim();
    const cleanSubject = subject ? sanitizeInput(subject) : 'Sin asunto';
    const cleanMessage = sanitizeInput(message);

    const db = useDb();

    try {
        // 1. Save to database
        await db.query(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [cleanName, cleanEmail, cleanSubject, cleanMessage]
        );

        console.log(`✅ Contact message received from: ${cleanEmail}`);

        // 2. Send notification email to admin
        const config = useRuntimeConfig();
        if (config.smtpUser) {
            await sendEmail(
                config.smtpUser,
                `📩 Nuevo mensaje de contacto: ${cleanSubject}`,
                `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h1 style="color: #723233; border-bottom: 2px solid #723233; padding-bottom: 10px;">Nuevo Mensaje Recibido</h1>
                        <p>Has recibido un nuevo mensaje a través del formulario de contacto de la web.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 12px;"><strong>👤 Nombre:</strong> ${cleanName}</li>
                            <li style="margin-bottom: 12px;"><strong>📧 Email:</strong> ${cleanEmail}</li>
                            <li style="margin-bottom: 12px;"><strong>📌 Asunto:</strong> ${cleanSubject}</li>
                        </ul>
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #723233;">
                            <strong>💬 Mensaje:</strong><br>
                            <p style="white-space: pre-wrap;">${cleanMessage}</p>
                        </div>
                    </div>
                </div>
                `
            );
        }

        // 3. Send confirmation to user
        await sendEmail(
            cleanEmail,
            'Hemos recibido tu mensaje - PCE',
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                <div style="background-color: #723233; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0;">PCE CONTACTO</h1>
                </div>
                <div style="padding: 30px; background-color: white;">
                    <h2 style="color: #333;">¡Hola ${cleanName}!</h2>
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
        console.error('❌ Contact error:', error);
        throw createError({
            statusCode: 500,
            message: 'Error al enviar el mensaje'
        });
    }
});
