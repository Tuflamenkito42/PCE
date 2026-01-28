export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const db = useDb();

    try {
        const [result]: any = await db.query(
            `INSERT INTO donations (name, email, amount, message, payment_intent_id, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                body.name || 'Anónimo',
                body.email || null,
                body.amount,
                body.message || null,
                body.payment_intent_id,
                body.status || 'pending'
            ]
        );


        // Send notification email to admin
        const config = useRuntimeConfig();
        console.log('Donation Handler - Email Config Check:', {
            hasUser: !!config.smtpUser,
            user: config.smtpUser,
            hasPass: !!config.smtpPass
        });

        if (config.smtpUser) {
            console.log('Attempting to send email to:', config.smtpUser);
            await sendEmail(
                config.smtpUser,
                `💰 Nueva Donación: ${body.amount}€ de ${body.name}`,
                `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h1 style="color: #2c3e50;">¡Nueva Donación Recibida!</h1>
                        <p style="font-size: 16px;">Se ha registrado una nueva donación en la web.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 10px;"><strong>👤 Nombre:</strong> ${body.name}</li>
                            <li style="margin-bottom: 10px;"><strong>📧 Email:</strong> ${body.email || 'No proporcionado'}</li>
                            <li style="margin-bottom: 10px;"><strong>💸 Cantidad:</strong> ${body.amount}€</li>
                            <li style="margin-bottom: 10px;"><strong>💬 Mensaje:</strong> ${body.message || 'Sin mensaje'}</li>
                            <li style="margin-bottom: 10px;"><strong>📊 Estado:</strong> ${body.status}</li>
                            <li style="margin-bottom: 10px;"><strong>💳 ID Pago:</strong> ${body.payment_intent_id}</li>
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
            message: 'Error al guardar la donación: ' + error.message
        });
    }
});
