import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { amount, currency, metadata } = body;
    const config = useRuntimeConfig();
    const secretKey = config.stripeSecretKey;

    if (!secretKey) {
        throw createError({
            statusCode: 500,
            message: 'Stripe secret key is not configured'
        });
    }

    const stripe = new Stripe(secretKey, {
        apiVersion: '2025-01-27.acacia' as any,
    });

    if (!amount || isNaN(parseFloat(amount))) {
        throw createError({
            statusCode: 400,
            message: 'Monto de pago inválido'
        });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(parseFloat(amount) * 100), // Convert to cents
            currency: currency || 'eur',
            metadata: metadata,
            payment_method_types: ['card'],
        });

        return {
            clientSecret: paymentIntent.client_secret,
        };
    } catch (error: any) {
        console.error('Stripe error:', error.message);
        throw createError({
            statusCode: 500,
            message: error.message || 'Error al crear el intento de pago',
        });
    }
});
