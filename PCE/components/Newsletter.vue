<template>
  <section class="newsletter-section">
    <div class="newsletter-content">
      <h3>{{ lt('RECIBE TODAS LAS NOVEDADES EN TU EMAIL', 'REP TOTES LES NOVETATS AL TEU CORREU', 'JASO BERRITASUN GUZTIAK ZURE POSTAN', 'RECIBE TODAS AS NOVIDADES NO TEU EMAIL') }}</h3>
      <form class="newsletter-form" @submit.prevent="handleSubmit">
        <div class="input-group">
          <label for="email">{{ lt('DIRECCIÓN DE CORREO', 'ADREÇA DE CORREU', 'POSTA HELBIDEA', 'ENDEREZO DE CORREO') }}</label>
          <input 
            v-model="email" 
            type="email" 
            id="email" 
            class="newsletter-input" 
            :disabled="loading"
            required 
          />
        </div>
        
        <div class="form-actions">
          <div class="checkbox-group">
            <input 
              v-model="privacy" 
              type="checkbox" 
              id="privacy" 
              :disabled="loading"
              required 
            />
            <label for="privacy">{{ lt('ACEPTO LA POLÍTICA DE PRIVACIDAD', 'ACCEPTO LA POLÍTICA DE PRIVACITAT', 'PRIBATUTASUN POLITIKA ONARTZEN DUT', 'ACEPTO A POLÍTICA DE PRIVACIDADE') }}</label>
          </div>
          <button 
            type="submit" 
            class="btn btn-submit"
            :disabled="loading"
          >
            {{ loading ? lt('ENVIANDO...', 'ENVIANT...', 'BIDALTZEN...', 'ENVIANDO...') : lt('ENVIAR', 'ENVIAR', 'BIDALI', 'ENVIAR') }}
          </button>
        </div>
        <p v-if="message" :class="['feedback-message', { error: isError }]">
          {{ message }}
        </p>
      </form>
    </div>
  </section>
</template>

<script setup>
const { locale } = useI18n()

const lt = (es, ca, eu, gl) => {
  if (locale.value === 'ca') return ca
  if (locale.value === 'eu') return eu
  if (locale.value === 'gl') return gl
  return es
}

const email = ref('')
const privacy = ref(false)
const loading = ref(false)
const message = ref('')
const isError = ref(false)

const handleSubmit = async () => {
  if (!email.value || !privacy.value) return
  
  loading.value = true
  message.value = ''
  isError.value = false

  try {
    await $fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: { email: email.value }
    })
    message.value = lt(
      '¡Gracias por suscribirte! Te hemos enviado un correo de confirmación.',
      'Gràcies per subscriure t! T hem enviat un correu de confirmació.',
      'Eskerrik asko harpidetzeagatik! Berrespen mezu bat bidali dizugu.',
      'Grazas por subscribirte! Enviámosche un correo de confirmación.'
    )
    email.value = ''
    privacy.value = false
  } catch (error) {
    console.error(error)
    isError.value = true
    message.value = error.data?.message || lt(
      'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
      'S ha produït un error. Si us plau, torna ho a intentar.',
      'Errore bat gertatu da. Saiatu berriro, mesedez.',
      'Produciuse un erro. Por favor, téntao de novo.'
    )
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.newsletter-section {
  background-color: #B4A7A7;
  padding: 40px 20px; /* Reduced from 60px */
  color: #5E2C2C;
  width: 100%;
  margin-top: 0;

  .newsletter-content {
    max-width: 800px; /* Reduced from 900px */
    margin: 0 auto;

    h3 {
      font-family: 'Cinzel', serif;
      font-weight: 700;
      font-size: 1.25rem; /* Reduced from 1.5rem */
      color: #8B3A3A;
      margin-bottom: 25px; /* Reduced from 40px */
      letter-spacing: 2px;
    }

    .newsletter-form {
      display: flex;
      flex-direction: column;
      gap: 20px; /* Reduced from 30px */

      .input-group {
        display: flex;
        flex-direction: column;
        gap: 10px; /* Reduced from 15px */

        label {
          font-family: 'Cinzel', serif;
          font-weight: 700;
          color: #5E2C2C;
          font-size: 0.8rem; /* Reduced from 0.9rem */
          letter-spacing: 1px;
        }

        .newsletter-input {
          background: transparent;
          border: none;
          border-bottom: 2px solid #5E2C2C;
          padding: 8px 0; /* Reduced from 10px */
          width: 100%;
          font-family: 'Cinzel', serif;
          font-size: 1rem; /* Reduced from 1.1rem */
          color: #000;
          outline: none;
          transition: border-color 0.3s;

          &:focus {
            border-bottom-color: #8B3A3A;
          }
        }
      }

      .form-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 15px;

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.8rem; /* Reduced from 0.85rem */
          font-weight: 700;
          
          input[type="checkbox"] {
            accent-color: #5E2C2C;
            width: 16px; /* Reduced from 18px */
            height: 16px;
            cursor: pointer;
          }

          label {
            cursor: pointer;
            font-family: 'Cinzel', serif;
            letter-spacing: 1px;
          }
        }

        .btn-submit {
          background-color: #723233;
          color: #fff;
          padding: 10px 35px; /* Reduced from 12px 45px */
          border-radius: 4px;
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 0.9rem; /* Reduced from 1rem */
          letter-spacing: 1px;
          transition: all 0.3s ease;
          
          &:hover {
            background-color: #5e2c2c;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          }
        }
      }

      .feedback-message {
        margin-top: 15px;
        font-family: 'Cinzel', serif;
        font-size: 0.9rem;
        color: #2e7d32;
        text-align: center;
        font-weight: bold;

        &.error {
          color: #c62828;
        }
      }
    }
  }
}
</style>
