import { defineEventHandler, readBody, createError, getHeader } from 'h3';
import { useDb } from '../../utils/db';
import { sendEmail } from '../../utils/email';

const ADMIN_NOTIFICATION_EMAIL = 'pcepartidopolitico@gmail.com';

// Same anti-spam strategy as contact form
const reportingAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string) {
  const now = Date.now();
  const limit = 5;
  const windowMs = 60 * 60 * 1000;

  const record = reportingAttempts.get(ip);
  if (!record || now > record.resetTime) {
    reportingAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    console.warn(`⚠️ Reporting spam attempt from IP: ${ip}`);
    return false;
  }

  record.count++;
  return true;
}

const sanitizeInput = (input: string) => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

export default defineEventHandler(async (event) => {
  const clientIp = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown';
  if (!checkRateLimit(clientIp as string)) {
    throw createError({
      statusCode: 429,
      message: 'Too many requests. Max 5 reports per hour.'
    });
  }

  const body = await readBody(event);
  const { name, email, subject, message } = body;

  if (!name || !email || !message) {
    throw createError({
      statusCode: 400,
      message: 'Todos los campos obligatorios (nombre, email, mensaje) deben ser rellenados.'
    });
  }

  if (name.length < 2 || name.length > 100) {
    throw createError({ statusCode: 400, message: 'Nombre debe tener entre 2 y 100 caracteres' });
  }

  if (message.length < 10 || message.length > 5000) {
    throw createError({ statusCode: 400, message: 'Mensaje debe tener entre 10 y 5000 caracteres' });
  }

  if (subject && subject.length > 200) {
    throw createError({ statusCode: 400, message: 'Asunto debe tener máximo 200 caracteres' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, message: 'Email inválido' });
  }

  const cleanName = sanitizeInput(name);
  const cleanEmail = email.toLowerCase().trim();
  const cleanSubject = subject ? sanitizeInput(subject) : 'Canal de Denuncias';
  const cleanMessage = sanitizeInput(message);

  const db = useDb();

  try {
    await db.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [cleanName, cleanEmail, cleanSubject, cleanMessage]
    );

    const config = useRuntimeConfig();

    if (config.smtpUser) {
      await sendEmail(
        ADMIN_NOTIFICATION_EMAIL,
        `🚨 Nueva denuncia recibida: ${cleanSubject}`,
        `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #723233; border-bottom: 2px solid #723233; padding-bottom: 10px;">Nuevo Aviso - Canal de Denuncias</h1>
            <p>Se ha recibido una nueva comunicación desde el canal de denuncias.</p>
            <ul style="list-style: none; padding: 0; margin-top: 20px;">
              <li style="margin-bottom: 12px;"><strong>Nombre:</strong> ${cleanName}</li>
              <li style="margin-bottom: 12px;"><strong>Email:</strong> ${cleanEmail}</li>
              <li style="margin-bottom: 12px;"><strong>Asunto:</strong> ${cleanSubject}</li>
            </ul>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #723233;">
              <strong>Mensaje:</strong><br>
              <p style="white-space: pre-wrap;">${cleanMessage}</p>
            </div>
          </div>
        </div>
        `
      );
    } else {
      console.warn('SMTP no configurado: denuncia guardada en BD sin envío de correo.');
    }

    await sendEmail(
      cleanEmail,
      'Hemos recibido tu denuncia - PCE',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
        <div style="background-color: #723233; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">CANAL DE DENUNCIAS</h1>
        </div>
        <div style="padding: 30px; background-color: white;">
          <h2 style="color: #333;">Hola ${cleanName},</h2>
          <p style="color: #555; line-height: 1.6;">
            Hemos recibido correctamente tu comunicación. Nuestro equipo revisará el caso y, si procede,
            te contactaremos a través de este email.
          </p>
          <p style="color: #555; line-height: 1.6;">
            Gracias por colaborar con nosotros.
          </p>
        </div>
      </div>
      `
    );

    return { status: 'ok', message: 'Denuncia enviada correctamente' };
  } catch (error: any) {
    console.error('❌ Reporting error:', error);
    throw createError({
      statusCode: 500,
      message: 'Error al enviar la denuncia'
    });
  }
});
