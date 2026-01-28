<template>
  <div class="stripe-card-element">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando formulario de pago...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>❌ {{ error }}</p>
    </div>
    
    <div v-else>
      <!-- Card Element Container -->
      <div ref="cardElement" class="card-element"></div>
      
      <!-- Card Errors -->
      <div v-if="cardError" class="card-error">
        {{ cardError }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { StripeCardElement } from '@stripe/stripe-js'

const props = defineProps<{
  clientSecret?: string
}>()

const emit = defineEmits<{
  ready: []
  change: [complete: boolean]
  error: [error: string]
}>()

const { stripe, loading, error, initStripe } = useStripe()
const cardElement = ref<HTMLElement | null>(null)
const cardError = ref<string>('')
const cardComplete = ref(false)

let card: StripeCardElement | null = null

onMounted(async () => {
  await initStripe()
  
  if (stripe.value && cardElement.value) {
    const elements = stripe.value.elements()
    
    card = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#fff',
          fontFamily: 'var(--font-body), sans-serif',
          '::placeholder': {
            color: 'rgba(255, 255, 255, 0.5)'
          },
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '12px'
        },
        invalid: {
          color: '#ff6b6b',
          iconColor: '#ff6b6b'
        }
      },
      hidePostalCode: false
    })
    
    card.mount(cardElement.value)
    
    // Listen for changes
    card.on('change', (event) => {
      cardError.value = event.error ? event.error.message : ''
      cardComplete.value = event.complete
      
      emit('change', event.complete)
      
      if (event.error) {
        emit('error', event.error.message)
      }
    })
    
    card.on('ready', () => {
      emit('ready')
    })
  }
})

// Expose card element for parent component
defineExpose({
  card,
  cardComplete
})
</script>

<style scoped>
.stripe-card-element {
  width: 100%;
}

.loading-state {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  padding: 20px;
  background: rgba(255, 107, 107, 0.2);
  border: 2px solid #ff6b6b;
  border-radius: 10px;
  color: #ff6b6b;
  text-align: center;
}

.card-element {
  padding: 18px 25px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  transition: all 0.3s ease;
}

.card-element:focus-within {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.card-error {
  margin-top: 10px;
  color: #ff6b6b;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
}
</style>
