<template>
  <div class="stripe-card-element">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando pasarela de pago segura...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>❌ Error: {{ error }}</p>
    </div>
    
    <div v-else>
      <!-- Contenedor del campo con fondo blanco para máxima visibilidad -->
      <div class="card-input-wrapper">
        <div ref="cardElement" class="card-element"></div>
      </div>
      
      <!-- Errores de la tarjeta -->
      <div v-if="cardError" class="card-error">
        {{ cardError }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue'
import { useStripe } from '@/composables/useStripe'

const emit = defineEmits(['ready', 'change', 'error'])

const { stripe, loading, error, initStripe } = useStripe()
const cardElement = ref<HTMLElement | null>(null)
const cardError = ref<string>('')
const cardComplete = ref(false)

const card = shallowRef<any>(null)

onMounted(async () => {
  await initStripe()
  
  if (stripe.value && cardElement.value) {
    const elements = stripe.value.elements()
    
    card.value = elements.create('card', {
      style: {
        base: {
          fontSize: '18px',
          color: '#1a1a1a', // Texto casi negro para que se vea perfecto sobre blanco
          fontFamily: 'system-ui, -apple-system, sans-serif',
          '::placeholder': {
            color: '#aab7c4'
          },
        },
        invalid: {
          color: '#e53e3e',
          iconColor: '#e53e3e'
        }
      },
      hidePostalCode: true
    })
    
    card.value.mount(cardElement.value)
    
    card.value.on('change', (event: any) => {
      cardError.value = event.error ? event.error.message : ''
      cardComplete.value = event.complete
      emit('change', event.complete)
    })
    
    card.value.on('ready', () => emit('ready'))
  }
})

defineExpose({ card, cardComplete })
</script>

<style scoped>
.stripe-card-element {
  width: 100%;
}

.card-input-wrapper {
  background: white; /* Blanco para que el texto se vea perfecto */
  border: 1px solid #ddd;
  border-radius: 50px;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
}

.card-input-wrapper:focus-within {
  border-color: #fff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4);
}

.card-element {
  padding: 15px 20px;
  min-height: 56px;
}

.loading-state {
  text-align: center;
  padding: 20px;
  color: white;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.card-error {
  margin-top: 15px;
  color: #ff6b6b;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  padding: 10px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 107, 0.2);
  font-family: 'Cinzel', serif;
}
</style>
