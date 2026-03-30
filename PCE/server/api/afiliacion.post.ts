import { useDb } from '../utils/db';
import { sendEmail } from '../utils/email';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';

const ADMIN_NOTIFICATION_EMAIL = 'pcepartidopolitico@gmail.com';

const ensureAffiliationsTableExists = async (db: ReturnType<typeof useDb>) => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS affiliations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            lastname VARCHAR(255) NOT NULL,
            dni VARCHAR(20) NOT NULL,
            birthdate DATE,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            quota DECIMAL(10, 2) NOT NULL,
            message TEXT,
            card_photo_path VARCHAR(255),
            card_photo_mime VARCHAR(120),
            payment_intent_id VARCHAR(255),
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_affiliations_email (email),
            INDEX idx_affiliations_dni (dni),
            INDEX idx_affiliations_status (status)
        ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const [columns]: any = await db.query(`
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'affiliations'
    `);

    const existingColumns = new Set((columns || []).map((col: any) => String(col.COLUMN_NAME || '').toLowerCase()));

    if (!existingColumns.has('payment_intent_id')) {
        await db.query('ALTER TABLE affiliations ADD COLUMN payment_intent_id VARCHAR(255) NULL');
    }
    if (!existingColumns.has('status')) {
        await db.query("ALTER TABLE affiliations ADD COLUMN status VARCHAR(50) DEFAULT 'pending'");
    }
    if (!existingColumns.has('card_photo_path')) {
        await db.query('ALTER TABLE affiliations ADD COLUMN card_photo_path VARCHAR(255) NULL');
    }
    if (!existingColumns.has('card_photo_mime')) {
        await db.query('ALTER TABLE affiliations ADD COLUMN card_photo_mime VARCHAR(120) NULL');
    }
};

export default defineEventHandler(async (event) => {
    const contentType = String(getHeader(event, 'content-type') || '').toLowerCase();

    let body: any = {};
    let cardPhotoFile: { filename: string; type: string; data: Buffer } | null = null;

    if (contentType.includes('multipart/form-data')) {
        const parts = await readMultipartFormData(event);

        if (!parts || parts.length === 0) {
            throw createError({
                statusCode: 400,
                message: 'No se recibieron datos de afiliación'
            });
        }

        for (const part of parts) {
            if (!part.name) continue;

            if (part.name === 'cardPhoto') {
                cardPhotoFile = {
                    filename: part.filename || 'card-photo',
                    type: part.type || 'application/octet-stream',
                    data: part.data
                };
                continue;
            }

            body[part.name] = part.data?.toString('utf8') || '';
        }
    } else {
        body = await readBody(event);
    }

    const db = useDb();

    const cleanEmail = String(body.email || '').toLowerCase().trim();
    const cleanDni = String(body.dni || '').toUpperCase().trim();

    const numericQuota = Number(body.quota);

    if (!cleanEmail || !cleanDni || !body.name || !body.lastname || !body.birthdate || !body.quota) {
        throw createError({
            statusCode: 400,
            message: 'Faltan campos obligatorios para completar la afiliación'
        });
    }

    if (!numericQuota || Number.isNaN(numericQuota) || numericQuota < 5) {
        throw createError({
            statusCode: 400,
            message: 'La cuota seleccionada no es válida'
        });
    }

    if (!body.payment_intent_id) {
        throw createError({
            statusCode: 400,
            message: 'No se ha podido validar el pago. Intenta de nuevo.'
        });
    }

    if (!cardPhotoFile) {
        throw createError({
            statusCode: 400,
            message: 'Debes subir una foto para generar tu carné de socio.'
        });
    }

    const allowedImageMimes = new Set(['image/jpeg', 'image/png', 'image/webp']);
    const extension = extname(cardPhotoFile.filename || '').toLowerCase();
    const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);

    if (!allowedImageMimes.has(cardPhotoFile.type) && !allowedExtensions.has(extension)) {
        throw createError({
            statusCode: 400,
            message: 'Formato de foto no válido. Usa JPG, PNG o WEBP.'
        });
    }

    const maxPhotoSize = 5 * 1024 * 1024;
    if (cardPhotoFile.data.length > maxPhotoSize) {
        throw createError({
            statusCode: 400,
            message: 'La foto supera el tamaño máximo permitido de 5MB.'
        });
    }

    const safeExtension = allowedExtensions.has(extension) ? extension : '.jpg';
    const photosDir = join(process.cwd(), 'public', 'uploads', 'affiliation-photos');
    await mkdir(photosDir, { recursive: true });

    const storedFilename = `${Date.now()}-${randomUUID()}${safeExtension}`;
    const absolutePhotoPath = join(photosDir, storedFilename);
    await writeFile(absolutePhotoPath, cardPhotoFile.data);

    const publicPhotoPath = `/uploads/affiliation-photos/${storedFilename}`;

    try {
        await ensureAffiliationsTableExists(db);

        // Check if DNI already affiliated
        const [existingAff] = await db.query('SELECT id FROM affiliations WHERE dni = ? AND status IN (?, ?, ?)', [cleanDni, 'paid', 'active', 'simulated_paid']);
        if ((existingAff as any).length > 0) {
            throw createError({
                statusCode: 400,
                message: 'Ya existe una solicitud de afiliación con este DNI/NIE'
            });
        }

        // Check if email already affiliated (common case when user is logged in)
        const [existingAffByEmail] = await db.query('SELECT id FROM affiliations WHERE email = ? AND status IN (?, ?, ?)', [cleanEmail, 'paid', 'active', 'simulated_paid']);
        if ((existingAffByEmail as any).length > 0) {
            throw createError({
                statusCode: 400,
                message: 'Este email ya tiene una afiliación activa'
            });
        }

        const [result]: any = await db.query(
            `INSERT INTO affiliations (name, lastname, dni, birthdate, email, phone, quota, message, card_photo_path, card_photo_mime, payment_intent_id, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                body.name,
                body.lastname,
                cleanDni,
                body.birthdate,
                cleanEmail,
                body.phone || null,
                numericQuota,
                body.message || null,
                publicPhotoPath,
                cardPhotoFile.type,
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
        if (error?.statusCode) {
            throw error;
        }
        console.error('Database error:', error);
        throw createError({
            statusCode: 500,
            message: 'Error al guardar la afiliación: ' + error.message
        });
    }
});
