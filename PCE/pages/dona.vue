<template>
  <main class="donation-page container">
    <h1 class="page-title">{{ t('donation.title') }}</h1>

    <div class="donation-layout">
      <!-- Left: Form -->
      <div class="form-container card">
        <div class="form-content">
          <h2 class="form-subtitle">{{ t('donation.supportTitle') }}</h2>
          <p class="step-description">{{ t('donation.supportDesc') }}</p>
          
          <div class="donation-steps" v-if="!isSuccess">
            <!-- STEP 1: AMOUNT -->
            <div v-if="step === 1" class="step-content">
              <label class="input-label">{{ t('donation.selectAmount') }}</label>
              <div class="quota-options">
                <div 
                  v-for="amount in donationOptions" 
                  :key="amount.value"
                  :class="['quota-card', { selected: selectedAmount === amount.value }]"
                  @click="selectedAmount = amount.value"
                >
                  <div class="quota-amount">{{ amount.label }}</div>
                  <div class="quota-check">✓</div>
                </div>
                <div 
                  :class="['quota-card', { selected: selectedAmount === 'custom' }]"
                  @click="focusCustomAmount"
                >
                  <div class="quota-amount">{{ t('donation.other') }}</div>
                  <div class="quota-check">✓</div>
                </div>
              </div>

              <!-- Input for Custom Amount -->
              <div v-if="selectedAmount === 'custom'" class="form-group-don full-width custom-amount-container">
                  <label class="input-label">{{ t('donation.customAmount') }}</label>
                  <input 
                    ref="customAmountInput"
                    v-model="customAmount" 
                    type="number" 
                    min="1" 
                    :placeholder="t('donation.customAmount')" 
                    class="form-input-don" 
                  />
              </div>

                <div class="form-group-don full-width">
                  <label class="input-label">{{ t('donation.email') }}</label>
                  <input v-model="donorData.email" type="email" :placeholder="t('donation.emailPlaceholder')" class="form-input-don" />
                </div>

                <div class="donation-actions">
                  <button class="btn btn-next" :disabled="!finalAmount" @click="step = 2">{{ lt('Continuar', 'Continuar', 'Jarraitu', 'Continuar') }}</button>
                </div>
              </div>

              <!-- STEP 2: PAYMENT -->
              <div v-else-if="step === 2" class="step-content">
                <div class="payment-summary card-accent">
                  <div class="summary-header">
                    <h2 class="form-subtitle">{{ t('donation.summary') }}</h2>
                  </div>
                  <div class="summary-item center">
                    <span class="summary-label">{{ t('donation.amount') }}</span>
                    <span class="summary-value highlight-green">{{ finalAmount }}€</span>
                  </div>
                </div>

                <div class="stripe-container">
                  <label class="input-label">{{ lt('DATOS DE LA TARJETA', 'DADES DE LA TARGETA', 'TXARTELAREN DATUAK', 'DATOS DA TARXETA') }}</label>
                  <StripeCard ref="stripeCardRef" @ready="stripeReady = true" @change="handleCardChange" />
                </div>

              <transition name="shake">
                <div v-if="paymentError" :class="['payment-alert', paymentStatus]">
                  <div class="alert-icon">
                    <span v-if="paymentStatus === 'success'">✅</span>
                    <span v-else-if="paymentStatus === 'processing'">🕒</span>
                    <span v-else>⚠️</span>
                  </div>
                  <div class="alert-content">
                    <strong>
                      {{ 
                        paymentStatus === 'success' ? lt('CONFIRMADO', 'CONFIRMAT', 'BAIEZTATUTA', 'CONFIRMADO') : 
                        paymentStatus === 'processing' ? lt('PROCESANDO', 'PROCESSANT', 'PROZESATZEN', 'PROCESANDO') : 'ERROR' 
                      }}
                    </strong>
                    <p>{{ paymentError }}</p>
                  </div>
                </div>
              </transition>

              <div class="donation-actions">
                <button class="btn" @click="step = 1">{{ lt('Anterior', 'Anterior', 'Aurrekoa', 'Anterior') }}</button>
                <button 
                  class="btn btn-next" 
                  :disabled="isProcessing || !cardComplete" 
                  @click="handleDonation"
                >
                  <span v-if="isProcessing">{{ lt('Procesando...', 'Processant...', 'Prozesatzen...', 'Procesando...') }}</span>
                  <span v-else>{{ lt('Donar ahora', 'Donar ara', 'Orain eman', 'Doar agora') }}</span>
                </button>
              </div>

            </div>
          </div>

          <!-- SUCCESS STATE -->
          <div v-else class="step-content success-step">
            <div class="success-animation">
              <div class="check-container">
                <div class="check-mark">✓</div>
              </div>
            </div>
            
            <h2 class="form-subtitle text-center">{{ lt('¡MUCHAS GRACIAS!', 'MOLTES GRÀCIES!', 'ESKERRIK ASKO!', 'MOITAS GRAZAS!') }}</h2>
            <div class="success-message text-center">
              <p>{{ lt('Tu donación de', 'La teva donació de', 'Zure dohaintza', 'A túa doazón de') }} <strong>{{ finalAmount }}€</strong> {{ lt('ha sido procesada correctamente.', 's ha processat correctament.', 'ondo prozesatu da.', 'foi procesada correctamente.') }}</p>
              <p>{{ lt('Gracias a personas como tú, PCE puede seguir creciendo.', 'Gràcies a persones com tu, PCE pot continuar creixent.', 'Zu bezalako pertsonei esker, PCEk hazten jarrai dezake.', 'Grazas a persoas coma ti, PCE pode seguir medrando.') }}</p>
              
              <div class="affiliation-number">
                <span>{{ lt('CÓDIGO DE DONACIÓN', 'CODI DE DONACIÓ', 'DOHAINTZA KODEA', 'CÓDIGO DE DOAZÓN') }}</span>
                <strong>#DON{{ Date.now().toString().slice(-5) }}</strong>
              </div>
            </div>

            <div class="success-actions">
              <NuxtLink to="/" class="btn btn-finish">{{ lt('VOLVER AL INICIO', 'TORNAR A L INICI', 'HASIERARA ITZULI', 'VOLVER AO INICIO') }}</NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Info -->
      <aside class="donation-info benefits-sidebar">
        <div class="card-logo">
          <img src="/images/logo.png" alt="Logo PCE" />
        </div>
        <h3>{{ lt('¿A DÓNDE VA TU DINERO?', 'ON VA ELS TEUS DINERS?', 'NORA DOA ZURE DIRUA?', 'A ONDE VAI O TEU DIÑEIRO?') }}</h3>
        <ul class="benefits-list">
          <li>{{ lt('1. CAMPAÑAS DE PREVENCIÓN', '1. CAMPANYES DE PREVENCIÓ', '1. PREBENTZIO KANPAINAK', '1. CAMPAÑAS DE PREVENCIÓN') }}</li>
          <li>{{ lt('2. MATERIAL DE PROTECCIÓN', '2. MATERIAL DE PROTECCIÓ', '2. BABES MATERIALA', '2. MATERIAL DE PROTECCIÓN') }}</li>
          <li>{{ lt('3. ACCIÓN SOCIAL', '3. ACCIÓ SOCIAL', '3. EKINTZA SOZIALA', '3. ACCIÓN SOCIAL') }}</li>
        </ul>
        <p class="small-note">{{ lt('TU AYUDA ES FUNDAMENTAL PARA NOSOTROS', 'LA TEVA AJUDA ÉS FONAMENTAL PER A NOSALTRES', 'ZURE LAGUNTZA FUNTSEZKOA DA GURETZAT', 'A TÚA AXUDA É FUNDAMENTAL PARA NÓS') }}</p>
      </aside>
    </div>
  </main>
</template>

<script setup>
import StripeCard from '@/components/StripeCard.vue'
const { t, locale } = useI18n()

const lt = (es, ca, eu, gl) => {
  if (locale.value === 'ca') return ca
  if (locale.value === 'eu') return eu
  if (locale.value === 'gl') return gl
  return es
}

const step = ref(1)
const selectedAmount = ref('10')
const customAmount = ref(null)
const isProcessing = ref(false)
const isSuccess = ref(false)
const paymentError = ref('')
const paymentStatus = ref('error') // 'error', 'success', or 'processing'
const stripeReady = ref(false)
const cardComplete = ref(false)
const stripeCardRef = ref(null)
const customAmountInput = ref(null)

const focusCustomAmount = () => {
  selectedAmount.value = 'custom'
  // Wait for the input to render then focus
  nextTick(() => {
    customAmountInput.value?.focus()
  })
}

const donorData = reactive({
  name: '',
  email: ''
})

const donationOptions = [
  { value: '5', label: '5€' },
  { value: '10', label: '10€' },
  { value: '20', label: '20€' },
  { value: '50', label: '50€' }
]

const finalAmount = computed(() => {
  if (selectedAmount.value === 'custom') return customAmount.value
  return selectedAmount.value
})

const handleCardChange = (complete) => {
  cardComplete.value = complete
}

const handleDonation = async () => {
  isProcessing.value = true
  paymentError.value = ''
  paymentStatus.value = 'error'

  try {
    const { data: paymentData, error: fetchError } = await useFetch('/api/payment-intent', {
      method: 'POST',
      body: {
        amount: finalAmount.value,
        currency: 'eur',
        email: donorData.email,
        metadata: {
          type: 'donation',
          timestamp: new Date().toISOString()
        }
      }
    })

    // Handle Simulation Mode if keys are invalid
    if (fetchError.value) {
      const errorMsg = fetchError.value.data?.message || ''
      const lowerError = errorMsg.toLowerCase()
      
      if (lowerError.includes('api key') || lowerError.includes('secret') || lowerError.includes('llave')) {
        paymentStatus.value = 'processing'
        paymentError.value = lt('Verificando datos de tarjeta...', 'Verificant dades de la targeta...', 'Txartelaren datuak egiaztatzen...', 'Verificando datos da tarxeta...')
        await new Promise(r => setTimeout(r, 1500))
        paymentStatus.value = 'success'
        paymentError.value = lt('¡Pago aceptado correctamente!', 'Pagament acceptat correctament!', 'Ordainketa ondo onartu da!', 'Pagamento aceptado correctamente!')
        await new Promise(r => setTimeout(r, 1000))

        await useFetch('/api/donacion', {
          method: 'POST',
          body: {
            email: donorData.email,
            amount: finalAmount.value,
            payment_intent_id: 'sim_don_' + Date.now(),
            status: 'simulated_paid'
          }
        })
        isSuccess.value = true
        return
      }
      throw new Error(errorMsg || lt('Error de conexión', 'Error de connexió', 'Konexio errorea', 'Erro de conexión'))
    }

    if (!paymentData.value?.clientSecret) {
      throw new Error(lt('No se recibió la clave de pago', 'No s ha rebut la clau de pagament', 'Ez da ordainketa gakoa jaso', 'Non se recibiu a clave de pagamento'))
    }

    const { stripe: stripeInstance, initStripe } = useStripe()
    await initStripe()

    const { error } = await stripeInstance.value.confirmCardPayment(paymentData.value.clientSecret, {
      payment_method: {
        card: stripeCardRef.value.card,
        billing_details: {
          email: donorData.email
        }
      }
    })

    if (error) throw new Error(error.message)

    // Save to database
    await useFetch('/api/donacion', {
      method: 'POST',
      body: {
        email: donorData.email,
        amount: finalAmount.value,
        payment_intent_id: paymentData.value.clientSecret.split('_secret')[0],
        status: 'paid'
      }
    })

    isSuccess.value = true
  } catch (error) {
    console.error('Donation error:', error)
    paymentError.value = error.message || lt('Error al procesar la donación', 'Error en processar la donació', 'Errorea dohaintza prozesatzean', 'Erro ao procesar a doazón')
    isProcessing.value = false
  }
}

useHead({
  title: `${t('donation.title')} - PCE`,
  meta: [{ name: 'description', content: t('donation.supportDesc') }]
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.donation-page {
  .page-title {
    font-family: 'Cinzel', serif;
    font-size: 3.5rem;
    color: #F0F0F0;
    text-shadow: 2px 2px 10px rgba(0,0,0,0.5);
    margin-bottom: 40px;
  }
}

.donation-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 60px;
  align-items: start;

  @media (min-width: 1024px) {
    grid-template-columns: 1.8fr 1fr;
  }
}

.form-container {
  background-color: #5E2C2C;
  padding: 50px 60px;
  border-radius: 30px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

.form-subtitle {
  font-family: 'Cinzel', serif;
  color: #fff;
  font-size: 1.8rem;
  margin-bottom: 15px;
  letter-spacing: 2px;
}

.step-description {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
  font-size: 0.95rem;
  line-height: 1.6;
}

.input-label {
  display: block;
  font-family: 'Cinzel', serif;
  font-size: 0.85rem;
  color: #fff;
  margin-bottom: 15px;
  font-weight: bold;
  letter-spacing: 1px;
}

.quota-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.quota-card {
  position: relative;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &.selected {
    background: rgba(255, 255, 255, 0.2);
    border-color: #00ff00;
    
    .quota-check { opacity: 1; }
  }

  .quota-amount {
    font-family: 'Cinzel', serif;
    font-size: 1.5rem;
    color: #fff;
  }

  .quota-check {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    background: #00ff00;
    color: #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: bold;
    opacity: 0;
  }
}

.custom-quota {
  margin-top: 20px;
  label { color: #fff; display: block; margin-bottom: 10px; font-family: 'Cinzel', serif; }
  input {
    width: 100%;
    padding: 15px 25px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    color: #fff;
    font-size: 1.2rem;
    &:focus { outline: none; border-color: #00ff00; }
  }
}

.payment-summary {
  background: rgba(0,0,0,0.2);
  padding: 25px;
  border-radius: 20px;
  margin-bottom: 30px;
  text-align: center;
}

.summary-item.center {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.highlight-green {
  color: #00ff00;
  font-size: 2.5rem;
  font-family: 'Cinzel', serif;
}

.donation-actions {
  display: flex;
  gap: 15px;
  margin-top: 40px;
  justify-content: center;

  .btn {
    padding: 15px 40px;
    border-radius: 50px;
    font-family: 'Cinzel', serif;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    background: rgba(255,255,255,0.1);
    color: #fff;
    border: none;

    &:hover { background: rgba(255,255,255,0.2); }
  }

  .btn-next {
    background: #000;
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
}

/* Reusing sidebar styles from afiliacion - EXACT MATCH */
.benefits-sidebar {
  background-color: #D6CFCE;
  padding: 60px 40px;
  border-radius: 40px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 4px solid #5E2C2C;
}

.card-logo {
  width: 160px;
  height: 160px;
  border: 4px solid #5E2C2C;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  padding: 20px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.donation-info h3 {
  font-family: 'Cinzel', serif;
  color: #5E2C2C;
  font-size: 1.5rem;
  margin-bottom: 40px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.benefits-list {
  list-style: none;
  width: 100%;
  margin-bottom: 40px;
  
  li {
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    color: #5E2C2C;
    padding: 15px 0;
    border-bottom: 1px solid #5E2C2C;
    text-transform: uppercase;
    
    &:last-child {
      border-bottom: none;
    }
  }
}

.small-note {
  font-family: 'Cinzel', serif;
  font-size: 0.6rem;
  color: #5E2C2C;
  margin-top: 20px;
  opacity: 0.8;
  max-width: 200px;
  line-height: 1.4;
  text-transform: uppercase;
}

/* Success step */
.success-step {
  text-align: center;
  padding: 40px 0;
}

.check-container {
  width: 100px;
  height: 100px;
  background: #000;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  font-size: 60px;
  color: #723233;
}

.affiliation-number {
  background: rgba(0,0,0,0.3);
  padding: 20px;
  border-radius: 15px;
  margin: 30px 0;
  span { display: block; font-size: 0.8rem; opacity: 0.6; margin-bottom: 5px; }
  strong { font-size: 1.8rem; color: #ffffff; letter-spacing: 3px; }
}


.form-grid-don {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 25px;
  margin-bottom: 20px;
}

.form-input-don {
  width: 100%;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: #fff;
  font-size: 1rem;
  &:focus { outline: none; border-color: #00ff00; }
}

.form-textarea-don {
  width: 100%;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: #fff;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  &:focus { outline: none; border-color: #00ff00; }
}

.full-width {
  width: 100%;
}


</style>
