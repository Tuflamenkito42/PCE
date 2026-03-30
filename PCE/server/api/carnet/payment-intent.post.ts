export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { amount, email } = body

    const numericAmount = Number(amount)
    if (!numericAmount || numericAmount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cantidad inválida'
      })
    }

    // Acepta 5 (euros) o 500 (céntimos) y lo normaliza a céntimos
    const amountInCents = numericAmount > 50 ? Math.round(numericAmount) : Math.round(numericAmount * 100)
    if (amountInCents !== 500) {
      throw createError({
        statusCode: 400,
        statusMessage: 'El importe del carné físico debe ser 5,00€'
      })
    }

    const config = useRuntimeConfig()

    // Fallback en desarrollo cuando no hay clave Stripe configurada
    if (!config.stripeSecretKey) {
      const simulatedId = `sim_pi_${Date.now()}`
      return {
        clientSecret: `simulated_secret_${simulatedId}`,
        id: simulatedId,
        simulated: true
      }
    }

    // Importar Stripe solo cuando realmente se va a usar
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(config.stripeSecretKey as string)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        type: 'carnet_fisico',
        email: email || ''
      }
    })

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
      simulated: false
    }

  } catch (error: any) {
    console.error('Error creando payment intent:', error)

    const rawMsg = String(error?.message || error?.statusMessage || '')
    const lowerMsg = rawMsg.toLowerCase()

    // En desarrollo, si la clave Stripe es inválida o falta, usamos simulación
    if (lowerMsg.includes('invalid api key') || lowerMsg.includes('api key') || lowerMsg.includes('secret key')) {
      const simulatedId = `sim_pi_${Date.now()}`
      return {
        clientSecret: `simulated_secret_${simulatedId}`,
        id: simulatedId,
        simulated: true
      }
    }

    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Error al crear el intent de pago'
    })
  }
})
