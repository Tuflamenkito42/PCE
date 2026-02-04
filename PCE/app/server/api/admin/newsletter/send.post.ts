export default defineEventHandler(async (event) => {
    validateAdmin(event);
    const body = await readBody(event);
    const { subject, message } = body;

    if (!subject || !message) {
        throw createError({
            statusCode: 400,
            message: 'Asunto y mensaje son obligatorios'
        });
    }

    const db = useDb();
    const [subscribers]: any = await db.query('SELECT email FROM newsletter_subscribers WHERE active = 1');

    if (subscribers.length === 0) {
        return { success: true, message: 'No hay suscriptores activos a los que enviar el comunicado' };
    }

    const emailPromises = subscribers.map((sub: any) => {
        return sendEmail(
            sub.email,
            subject,
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                <div style="background-color: #723233; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0; font-family: 'Cinzel', serif;">PROTECCIÓN CIVIL ESPAÑOLA</h1>
                </div>
                <div style="padding: 30px; background-color: white;">
                    <h2 style="color: #333;">Comunicado Oficial</h2>
                    <div style="color: #555; line-height: 1.6; white-space: pre-wrap;">
                        ${message}
                    </div>
                </div>
                <div style="padding: 20px; text-align: center; font-size: 12px; color: #888;">
                    <p>© 2024 Protección Civil Española. Todos los derechos reservados.</p>
                    <p>Has recibido este correo porque estás suscrito a nuestro newsletter. Si deseas darte de baja, por favor contacta con nosotros.</p>
                </div>
            </div>
            `
        );
    });

    try {
        await Promise.all(emailPromises);
        return { success: true, message: `Comunicado enviado correctamente a ${subscribers.length} suscriptores` };
    } catch (error: any) {
        console.error('Bulk email error:', error);
        throw createError({
            statusCode: 500,
            message: 'Error al enviar el comunicado masivo: ' + error.message
        });
    }
});
