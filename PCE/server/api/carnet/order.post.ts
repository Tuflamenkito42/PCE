import { useDb } from '../../utils/db'
import { sendEmail } from '../../utils/email'
import { requireAuth } from '../../utils/auth-middleware'

const ADMIN_NOTIFICATION_EMAIL = 'pcepartidopolitico@gmail.com'

const ensureTableExists = async (db: ReturnType<typeof useDb>) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS carnet_orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      address VARCHAR(255),
      city VARCHAR(120),
      postal_code VARCHAR(10),
      country VARCHAR(120),
      nif VARCHAR(20),
      numero_socio VARCHAR(50),
      amount DECIMAL(10, 2) DEFAULT 5.00,
      payment_intent_id VARCHAR(255),
      status VARCHAR(50) DEFAULT 'pending',
      shipping_status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_carnet_email (email),
      INDEX idx_carnet_status (status),
      INDEX idx_carnet_created_at (created_at)
    )
  `)
}

export default defineEventHandler(async (event) => {
  try {
    const authUser = requireAuth(event)
    const body = await readBody(event)
    const {
      fullName,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
      nif,
      numeroSocio,
      paymentIntentId,
      status,
      orderType
    } = body

    // Validar datos requeridos
    if (!fullName || !email || !address || !city || !nif || !numeroSocio || !paymentIntentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan datos requeridos'
      })
    }

    const db = useDb()
    await ensureTableExists(db)

    const normalizedEmail = String(email).toLowerCase().trim()

    // Insertar orden en BD
    const [result]: any = await db.query(
      `INSERT INTO carnet_orders (
        user_id, full_name, email, phone, address, city, postal_code, country, 
        nif, numero_socio, amount, payment_intent_id, status, shipping_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        authUser.id || null,
        fullName,
        normalizedEmail,
        phone || null,
        address,
        city,
        postalCode || null,
        country,
        nif,
        numeroSocio,
        5.00,
        paymentIntentId,
        status || 'completed',
        'pending'
      ]
    )

    // Enviar email a admin
    const config = useRuntimeConfig()

    if (config.smtpUser) {
      await sendEmail(
        ADMIN_NOTIFICATION_EMAIL,
        `📮 Nuevo Pedido de Carné Físico de ${fullName}`,
        `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50;">¡Nuevo Pedido de Carné Físico!</h1>
            <p style="font-size: 16px;">Se ha realizado un nuevo pedido de carné físico que necesita ser procesado y enviado.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 10px;"><strong>👤 Nombre:</strong> ${fullName}</li>
              <li style="margin-bottom: 10px;"><strong>📧 Email:</strong> ${normalizedEmail}</li>
              <li style="margin-bottom: 10px;"><strong>📱 Teléfono:</strong> ${phone || 'No proporcionado'}</li>
              <li style="margin-bottom: 10px;"><strong>🆔 NIF:</strong> ${nif}</li>
              <li style="margin-bottom: 10px;"><strong>🏷️ Nº Socio:</strong> ${numeroSocio}</li>
              <li style="margin-bottom: 10px;"><strong>🔁 Tipo:</strong> ${orderType === 'renewal' ? 'Renovación' : 'Alta inicial'}</li>
              <li style="margin-bottom: 10px;"><strong>📍 Dirección:</strong> ${address}, ${postalCode || ''} ${city}, ${country}</li>
              <li style="margin-bottom: 10px;"><strong>💳 ID Pago:</strong> ${paymentIntentId}</li>
              <li style="margin-bottom: 10px;"><strong>💰 Cantidad:</strong> 5.00€</li>
            </ul>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 14px;">Por favor, procesa este pedido y envía el carné físico a la dirección indicada.</p>
          </div>
        </div>
        `
      )

      // Enviar confirmación al usuario
      await sendEmail(
        normalizedEmail,
        'Pedido de Carné Físico Confirmado - PCE',
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
          <div style="background-color: #723233; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">PEDIDO CONFIRMADO</h1>
          </div>
          <div style="padding: 30px; background-color: white;">
            <h2 style="color: #333;">¡Gracias, ${fullName.split(' ')[0]}!</h2>
            <p style="color: #555; line-height: 1.6;">
              Tu pedido de carné físico ha sido confirmado correctamente.
            </p>
            <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Detalles del Pedido:</h3>
              <p style="margin: 5px 0;"><strong>Nº Socio:</strong> ${numeroSocio}</p>
              <p style="margin: 5px 0;"><strong>Dirección de envío:</strong> ${address}</p>
              <p style="margin: 5px 0;"><strong>${postalCode} ${city}, ${country}</strong></p>
              <p style="margin: 5px 0;"><strong>Cantidad:</strong> 5,00€</p>
            </div>
            <p style="color: #555; line-height: 1.6;">
              Tu carné físico será preparado y enviado en un plazo estimado de <strong>7 días</strong>.
            </p>
            <p style="color: #888; font-size: 14px;">
              Si tienes alguna duda, no dudes en contactarnos.
            </p>
          </div>
          <div style="padding: 20px; text-align: center; font-size: 12px; color: #888;">
            <p>© 2026 Protección Civil Española. Todos los derechos reservados.</p>
          </div>
        </div>
        `
      )
    }

    return {
      success: true,
      id: result.insertId,
      message: 'Pedido guardado correctamente'
    }

  } catch (error: any) {
    console.error('Error guardando pedido de carné:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al guardar el pedido: ' + (error.message || 'Error desconocido')
    })
  }
})
