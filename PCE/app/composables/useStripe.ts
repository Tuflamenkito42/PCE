import { loadStripe, type Stripe } from '@stripe/stripe-js'
import { ref, type Ref } from 'vue'

let stripePromise: Promise<Stripe | null> | null = null

export const useStripe = () => {
    const stripe: Ref<Stripe | null> = ref(null)
    const loading = ref(true)
    const error = ref<string | null>(null)

    const initStripe = async () => {
        try {
            loading.value = true

            // Get public key from runtime config
            const config = useRuntimeConfig()
            const publicKey = config.public.stripePublicKey as string

            if (!publicKey) {
                throw new Error('Stripe public key not found')
            }

            // Load Stripe
            if (!stripePromise) {
                stripePromise = loadStripe(publicKey)
            }

            stripe.value = await stripePromise

            if (!stripe.value) {
                throw new Error('Failed to load Stripe')
            }

            loading.value = false
        } catch (err: any) {
            error.value = err.message
            loading.value = false
            console.error('Error initializing Stripe:', err)
        }
    }

    return {
        stripe,
        loading,
        error,
        initStripe
    }
}
