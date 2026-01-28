export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const db = useDb();

    try {
        const [result]: any = await db.query(
            `INSERT INTO affiliations (name, lastname, dni, birthdate, email, phone, quota, message, payment_intent_id, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                body.name,
                body.lastname,
                body.dni,
                body.birthdate,
                body.email,
                body.phone,
                body.quota,
                body.message || null,
                body.payment_intent_id,
                body.status || 'pending'
            ]
        );

        // Send notification email to admin
        const config = useRuntimeConfig();
        if (config.smtpUser) {
            await sendEmail(
                config.smtpUser,
                `📝 Nueva Afiliación: ${body.name} ${body.lastname}`,
                `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h1 style="color: #2c3e50;">¡Nueva Afiliación Registrada!</h1>
                        <p style="font-size: 16px;">Se ha registrado un nuevo afiliado en la web.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 10px;"><strong>👤 Nombre:</strong> ${body.name} ${body.lastname}</li>
                            <li style="margin-bottom: 10px;"><strong>🆔 DNI:</strong> ${body.dni}</li>
                            <li style="margin-bottom: 10px;"><strong>📧 Email:</strong> ${body.email}</li>
                            <li style="margin-bottom: 10px;"><strong>📞 Teléfono:</strong> ${body.phone}</li>
                            <li style="margin-bottom: 10px;"><strong>🎂 F. Nacimiento:</strong> ${body.birthdate}</li>
                            <li style="margin-bottom: 10px;"><strong>💰 Cuota:</strong> ${body.quota}</li>
                            <li style="margin-bottom: 10px;"><strong>💬 Mensaje:</strong> ${body.message || 'Sin mensaje'}</li>
                            <li style="margin-bottom: 10px;"><strong>📊 Estado:</strong> ${body.status}</li>
                        </ul>
                    </div>
                </div>
                `
            );
        }

        return {
            success: true,
            id: result.insertId
        };
    } catch (error: any) {
        console.error('Database error:', error);
        throw createError({
            statusCode: 500,
            message: 'Error al guardar la afiliación: ' + error.message
        });
    }
});
