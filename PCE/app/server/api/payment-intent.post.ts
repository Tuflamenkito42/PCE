import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig()
        const stripe = new Stripe(config.stripeSecretKey as string)

        const body = await readBody(event)
        const { amount, currency = 'eur', metadata = {} } = body

        if (!amount || amount <= 0) {
            throw createError({
                statusCode: 400,
                message: 'Invalid amount'
            })
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            automatic_payment_methods: {
                enabled: true
            },
            metadata
        })

        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        }
    } catch (error: any) {
        console.error('Payment intent error:', error)
        throw createError({
            statusCode: 500,
            message: error.message || 'Error creating payment intent'
        })
    }
})
