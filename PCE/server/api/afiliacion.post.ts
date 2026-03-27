import { useDb } from '../utils/db';
import { sendEmail } from '../utils/email';

const ADMIN_NOTIFICATION_EMAIL = 'pcepartidopolitico@gmail.com';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const db = useDb();

    // Check if DNI already affiliated
    const [existingAff] = await db.query('SELECT id FROM affiliations WHERE dni = ?', [body.dni]);
    if ((existingAff as any).length > 0) {
        throw createError({
            statusCode: 409,
            message: 'Ya existe una solicitud de afiliación con este DNI/NIE'
        });
    }

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
                ADMIN_NOTIFICATION_EMAIL,
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

        // Send welcome email to the user
        if (body.email) {
            await sendEmail(
                body.email,
                `¡Te damos la bienvenida a PCE, ${body.name}! 🇪🇸`,
                `
                <div style="font-family: 'Helvetica', Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                        
                        <!-- Header -->
                        <div style="background-color: #723233; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-family: 'Times New Roman', serif; letter-spacing: 2px;">PROTECCIÓN CIVIL ESPAÑOLA</h1>
                        </div>

                        <!-- Content -->
                        <div style="padding: 40px;">
                            <h2 style="color: #333333; margin-top: 0;">¡Hola, ${body.name}!</h2>
                            
                            <p style="color: #555555; line-height: 1.6; font-size: 16px;">
                                En nombre de todo el equipo, queremos darte la más cálida bienvenida. Tu afiliación ha sido procesada correctamente y ya formas parte de nuestro movimiento.
                            </p>

                            <div style="background-color: #f0f4f8; border-left: 4px solid #723233; padding: 15px; margin: 25px 0;">
                                <p style="margin: 0; color: #555;"><strong>Tu número de afiliado es:</strong> #${result.insertId}</p>
                                <p style="margin: 5px 0 0; color: #555;"><strong>Cuota seleccionada:</strong> ${body.quota}</p>
                            </div>

                            <p style="color: #555555; line-height: 1.6; font-size: 16px;">
                                Gracias a tu apoyo, podemos seguir trabajando por una sociedad más segura, unida y protegida. Tu compromiso es nuestra fuerza.
                            </p>

                            <p style="color: #555555; line-height: 1.6; font-size: 16px;">
                                Próximamente recibirás más información sobre nuestros próximos eventos y acciones.
                            </p>
                            
                            <!-- Button -->
                            <div style="text-align: center; margin-top: 30px;">
                                <a href="https://pce-web.com" style="background-color: #723233; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ir a la web</a>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #eeeeee; padding: 20px; text-align: center; font-size: 12px; color: #888888;">
                            <p>© 2024 Protección Civil Española. Todos los derechos reservados.</p>
                            <p>Este es un correo automático, por favor no respondas a esta dirección.</p>
                        </div>
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
