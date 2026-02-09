import Stripe from 'stripe'
import { sendEmail } from '../utils/email';

export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig()
        const stripe = new Stripe(config.stripeSecretKey as string, {
            apiVersion: '2026-01-28.clover'
        })

        const body = await readRawBody(event)
        const signature = getHeader(event, 'stripe-signature')

        if (!signature || !body) {
            throw createError({
                statusCode: 400,
                message: 'Missing signature or body'
            })
        }

        // Verify webhook signature
        const webhookEvent = stripe.webhooks.constructEvent(
            body,
            signature,
            config.stripeWebhookSecret as string
        )

        // Handle different event types
        switch (webhookEvent.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = webhookEvent.data.object as Stripe.PaymentIntent
                console.log('✅ Payment succeeded:', paymentIntent.id)

                try {
                    const donorEmail = paymentIntent.metadata?.email || paymentIntent.receipt_email
                    const amount = (paymentIntent.amount / 100).toFixed(2)
                    const currency = paymentIntent.currency.toUpperCase()

                    // 1. Send receipt to donor
                    if (donorEmail) {
                        await sendEmail(
                            donorEmail,
                            'Confirmación de Donación - PCE',
                            `
                            <div style="font-family: Arial, sans-serif; color: #333;">
                                <h1 style="color: #5E2C2C;">¡Gracias por tu donación!</h1>
                                <p>Hemos recibido tu donación de <strong>${amount} ${currency}</strong>.</p>
                                <p>Tu apoyo es fundamental para nosotros.</p>
                                <br>
                                <p>Atentamente,</p>
                                <p><strong>PCE</strong></p>
                            </div>
                            `
                        )
                        console.log('📧 Confirmation email sent to:', donorEmail)
                    }

                    // 2. Send notification to ADMIN (Dedicated Email)
                    // "el correo dedicado aun recibe la notificación"
                    await sendEmail(
                        'pcepartidopolitico@gmail.com',
                        '💰 Nueva Donación Recibida',
                        `
                        <div style="font-family: Arial, sans-serif;">
                            <h2 style="color: #2c5e2e;">Nueva Donación</h2>
                            <p><strong>Cantidad:</strong> ${amount} ${currency}</p>
                            <p><strong>Email Donante:</strong> ${donorEmail || 'No proporcionado'}</p>
                            <p><strong>ID Pago:</strong> ${paymentIntent.id}</p>
                            <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        `
                    )
                    console.log('📧 Admin notification sent to pcepartidopolitico@gmail.com')

                } catch (emailError) {
                    console.error('Failed to send donation emails:', emailError)
                }
                break

            case 'payment_intent.payment_failed':
                const failedPayment = webhookEvent.data.object as Stripe.PaymentIntent
                console.log('❌ Payment failed:', failedPayment.id)
                // TODO: Handle failed payment
                break

            case 'charge.succeeded':
                const charge = webhookEvent.data.object as Stripe.Charge
                console.log('💰 Charge succeeded:', charge.id)
                break

            default:
                console.log(`Unhandled event type: ${webhookEvent.type}`)
        }

        return { received: true }
    } catch (error: any) {
        console.error('Webhook error:', error)
        throw createError({
            statusCode: 400,
            message: error.message || 'Webhook error'
        })
    }
})
