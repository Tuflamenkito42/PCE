import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig()
        const stripe = new Stripe(config.stripeSecretKey as string, {
            apiVersion: '2025-12-15.clover'
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
                // TODO: Update database, send confirmation email, etc.
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
