<template>
  <main class="affiliation-page container">
    <h1 class="page-title">AFILIACIÓN</h1>

    <div class="affiliation-layout">
      <!-- Left: Form -->
      <div class="form-container card">
        <!-- Steps Header -->
        <div class="form-steps">
          <div v-for="step in 4" :key="step" :class="['step', { active: currentStep === step, completed: currentStep > step }]">
            <div class="step-circle">
              <span v-if="currentStep > step">✓</span>
              <span v-else>{{ step }}</span>
            </div>
            <span class="step-label">{{ stepLabels[step - 1] }}</span>
          </div>
        </div>

        <!-- Form Content -->
        <form class="main-form" @submit.prevent="handleSubmit">
          <transition name="fade" mode="out-in">
            <div :key="currentStep">
              <!-- STEP 1: DATOS PERSONALES + DNI SCANNER -->
              <div v-if="currentStep === 1" class="step-content">
                <h2 class="form-subtitle">DATOS PERSONALES</h2>
                
                <!-- DNI SCANNER -->
                <div class="dni-scanner-section">
                  <DniScanner @dataExtracted="handleDniData" />
                </div>

                <div class="form-divider">
                  <span>O introduce los datos manualmente</span>
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label>NOMBRE *</label>
                    <input v-model="formData.name" type="text" placeholder="Nombre" required :class="{ 'error': errors.name }" />
                    <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
                  </div>
                  <div class="form-group">
                    <label>APELLIDOS *</label>
                    <input v-model="formData.lastname" type="text" placeholder="Apellidos" required :class="{ 'error': errors.lastname }" />
                    <span v-if="errors.lastname" class="error-msg">{{ errors.lastname }}</span>
                  </div>
                  <div class="form-group">
                    <label>DNI / NIE *</label>
                    <input v-model="formData.dni" type="text" placeholder="Ejemplo: 12345678A" required :class="{ 'error': errors.dni, 'valid': dniValid }" />
                    <span v-if="errors.dni" class="error-msg">{{ errors.dni }}</span>
                    <span v-else-if="dniValid" class="success-msg">✓ DNI válido</span>
                  </div>
                  <div class="form-group">
                    <label>FECHA DE NACIMIENTO *</label>
                    <input v-model="formData.birthdate" type="date" required :class="{ 'error': errors.birthdate }" />
                    <span v-if="errors.birthdate" class="error-msg">{{ errors.birthdate }}</span>
                  </div>
                  <div class="form-group">
                    <label>EMAIL PRINCIPAL *</label>
                    <input v-model="formData.email" type="email" placeholder="Email principal" required :class="{ 'error': errors.email }" />
                    <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
                  </div>
                  <div class="form-group">
                    <label>TELÉFONO PRINCIPAL *</label>
                    <input v-model="formData.phone" type="tel" placeholder="Teléfono principal" required :class="{ 'error': errors.phone }" />
                    <span v-if="errors.phone" class="error-msg">{{ errors.phone }}</span>
                  </div>
                </div>
              </div>

              <!-- STEP 2: CUOTA -->
              <div v-else-if="currentStep === 2" class="step-content">
                <h2 class="form-subtitle">CUOTA DE AFILIACIÓN</h2>
                <p class="step-description">Selecciona tu cuota mensual. Todas las contribuciones ayudan a fortalecer nuestro movimiento.</p>
                
                <div class="quota-options">
                  <div 
                    v-for="quota in quotaOptions" 
                    :key="quota.value"
                    :class="['quota-card', { selected: formData.quota === quota.value }]"
                    @click="formData.quota = quota.value"
                  >
                    <div class="quota-badge" v-if="quota.recommended">Recomendado</div>
                    <div class="quota-amount">{{ quota.label }}</div>
                    <div class="quota-description">{{ quota.description }}</div>
                    <div class="quota-check">✓</div>
                  </div>
                </div>

                <div v-if="formData.quota === 'custom'" class="custom-quota">
                  <label>Cantidad personalizada (€/mes)</label>
                  <input 
                    v-model.number="formData.customAmount" 
                    type="number" 
                    min="5" 
                    step="1" 
                    placeholder="Mínimo 5€"
                  />
                </div>
              </div>

              <!-- STEP 3: DATOS BANCARIOS (STRIPE) -->
              <div v-else-if="currentStep === 3" class="step-content">
                <h2 class="form-subtitle">DATOS BANCARIOS</h2>
                <p class="step-description">Introduce tus datos de pago de forma segura. Usamos Stripe para procesar los pagos.</p>

                <div class="payment-info">
                  <div class="info-item">
                    <strong>Cuota mensual:</strong>
                    <span class="amount">{{ selectedQuotaAmount }}€</span>
                  </div>
                  <div class="info-item">
                    <strong>Primer cargo:</strong>
                    <span>Hoy</span>
                  </div>
                  <div class="info-item">
                    <strong>Próximo cargo:</strong>
                    <span>{{ nextChargeDate }}</span>
                  </div>
                </div>

                <div class="stripe-section">
                  <StripeCard ref="stripeCardRef" @ready="stripeReady = true" @change="handleCardChange" />
                  
                  <div class="test-cards-info">
                    <details>
                      <summary>🧪 Tarjetas de prueba</summary>
                      <ul>
                        <li><code>4242 4242 4242 4242</code> - ✅ Éxito</li>
                        <li><code>4000 0000 0000 0002</code> - ❌ Declinada</li>
                        <li><code>4000 0000 0000 9995</code> - ❌ Sin fondos</li>
                      </ul>
                      <p><small>Cualquier fecha futura y CVC de 3 dígitos</small></p>
                    </details>
                  </div>
                </div>

                <div v-if="paymentError" class="payment-error">
                  {{ paymentError }}
                </div>
              </div>

              <!-- STEP 4: CONFIRMACIÓN -->
              <div v-else-if="currentStep === 4" class="step-content">
                <h2 class="form-subtitle">CONFIRMACIÓN</h2>
                <p class="step-description">Revisa tus datos antes de finalizar la afiliación.</p>

                <div class="confirmation-grid">
                  <div class="confirmation-section">
                    <h3>Datos Personales</h3>
                    <div class="data-row">
                      <span class="label">Nombre completo:</span>
                      <span class="value">{{ formData.name }} {{ formData.lastname }}</span>
                    </div>
                    <div class="data-row">
                      <span class="label">DNI/NIE:</span>
                      <span class="value">{{ formData.dni }}</span>
                    </div>
                    <div class="data-row">
                      <span class="label">Fecha de nacimiento:</span>
                      <span class="value">{{ formatDate(formData.birthdate) }}</span>
                    </div>
                    <div class="data-row">
                      <span class="label">Email:</span>
                      <span class="value">{{ formData.email }}</span>
                    </div>
                    <div class="data-row">
                      <span class="label">Teléfono:</span>
                      <span class="value">{{ formData.phone }}</span>
                    </div>
                  </div>

                  <div class="confirmation-section">
                    <h3>Cuota de Afiliación</h3>
                    <div class="data-row">
                      <span class="label">Cuota mensual:</span>
                      <span class="value highlight">{{ selectedQuotaAmount }}€/mes</span>
                    </div>
                    <div class="data-row">
                      <span class="label">Método de pago:</span>
                      <span class="value">Tarjeta de crédito/débito</span>
                    </div>
                  </div>

                  <div class="confirmation-section full-width">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="formData.acceptTerms" required />
                      <span>Acepto los <a href="/condiciones-uso" target="_blank">términos y condiciones</a> y la <a href="/politica-privacidad" target="_blank">política de privacidad</a></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <div class="form-nav">
            <button v-if="currentStep > 1" type="button" class="btn" @click="previousStep">Anterior</button>
            <button 
              v-if="currentStep < 4" 
              type="button" 
              class="btn btn-next" 
              @click="nextStep"
              :disabled="!canProceed"
            >
              Siguiente
            </button>
            <button 
              v-if="currentStep === 4" 
              type="submit" 
              class="btn btn-next"
              :disabled="isProcessing || !formData.acceptTerms"
            >
              <span v-if="isProcessing">Procesando...</span>
              <span v-else>Finalizar Afiliación</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Right: Benefits -->
      <AffiliationSidebar @join="currentStep = 1" />
    </div>
  </main>
</template>

<script setup>
import AffiliationSidebar from './components/AffiliationSidebar.vue'
import DniScanner from '@/components/DniScanner.vue'
import StripeCard from '@/components/StripeCard.vue'
import { isValidEmail, isValidDNI } from '@/utils/validation'
import { computed } from 'vue'

const currentStep = ref(1)
const stepLabels = ['Datos personales', 'Cuota', 'Datos Bancarios', 'Confirmación']

// Form Data
const formData = reactive({
  name: '',
  lastname: '',
  dni: '',
  birthdate: '',
  email: '',
  phone: '',
  quota: '10',
  customAmount: null,
  acceptTerms: false
})

const errors = ref({})
const isProcessing = ref(false)
const paymentError = ref('')
const stripeReady = ref(false)
const cardComplete = ref(false)
const stripeCardRef = ref(null)

// Quota options
const quotaOptions = [
  { value: '5', label: '5€/mes', description: 'Apoyo básico', recommended: false },
  { value: '10', label: '10€/mes', description: 'Apoyo estándar', recommended: true },
  { value: '20', label: '20€/mes', description: 'Apoyo comprometido', recommended: false },
  { value: '50', label: '50€/mes', description: 'Apoyo premium', recommended: false },
  { value: 'custom', label: 'Personalizado', description: 'Elige tu cantidad', recommended: false }
]

// Computed
const dniValid = computed(() => {
  if (!formData.dni) return false
  return isValidDNI(formData.dni)
})

const selectedQuotaAmount = computed(() => {
  if (formData.quota === 'custom') {
    return formData.customAmount || 0
  }
  return formData.quota
})

const nextChargeDate = computed(() => {
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
})

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return validateStep1()
  }
  if (currentStep.value === 2) {
    return formData.quota && (formData.quota !== 'custom' || formData.customAmount >= 5)
  }
  if (currentStep.value === 3) {
    return stripeReady.value && cardComplete.value
  }
  return true
})

// Methods
const handleDniData = (data) => {
  console.log('DNI Data:', data)
  
  if (data.valido) {
    if (data.dni) formData.dni = data.dni
    if (data.nombre) formData.name = data.nombre
    if (data.apellidos) formData.lastname = data.apellidos
    
    // Parse birthdate if available
    if (data.fecha_nacimiento) {
      const [day, month, year] = data.fecha_nacimiento.split('/')
      formData.birthdate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    
    alert('✅ DNI válido detectado. Formulario auto-rellenado.')
  } else {
    alert('⚠️ DNI detectado pero no válido. Por favor, verifica los datos.')
  }
}

const validateStep1 = () => {
  errors.value = {}
  let valid = true

  if (!formData.name) { errors.value.name = "El nombre es obligatorio"; valid = false; }
  if (!formData.lastname) { errors.value.lastname = "Los apellidos son obligatorios"; valid = false; }
  
  if (!isValidDNI(formData.dni)) {
    errors.value.dni = "DNI/NIE inválido"; 
    valid = false; 
  }

  if (!formData.birthdate) { errors.value.birthdate = "La fecha de nacimiento es obligatoria"; valid = false; }

  if (!isValidEmail(formData.email)) {
    errors.value.email = "Email inválido"; 
    valid = false; 
  }

  if (!formData.phone) { errors.value.phone = "El teléfono es obligatorio"; valid = false; }

  return valid
}

const nextStep = () => {
  if (currentStep.value === 1) {
    if (validateStep1()) {
      currentStep.value++
    }
  } else if (currentStep.value === 2) {
    if (formData.quota && (formData.quota !== 'custom' || formData.customAmount >= 5)) {
      currentStep.value++
    }
  } else if (currentStep.value === 3) {
    if (stripeReady.value && cardComplete.value) {
      currentStep.value++
    }
  } else {
    currentStep.value++
  }
}

const previousStep = () => {
  currentStep.value--
}

const handleCardChange = (complete) => {
  cardComplete.value = complete
}

const handleSubmit = async () => {
  if (!formData.acceptTerms) {
    alert('Debes aceptar los términos y condiciones')
    return
  }

  isProcessing.value = true
  paymentError.value = ''

  try {
    // Create payment intent
    const { data: paymentData } = await useFetch('/api/payment-intent', {
      method: 'POST',
      body: {
        amount: selectedQuotaAmount.value,
        currency: 'eur',
        metadata: {
          name: `${formData.name} ${formData.lastname}`,
          dni: formData.dni,
          email: formData.email
        }
      }
    })

    if (!paymentData.value?.clientSecret) {
      throw new Error('No se pudo crear el intento de pago')
    }

    // Confirm payment with Stripe
    const { stripe } = useStripe()
    await stripe.value.initStripe()

    const { error } = await stripe.value.stripe.confirmCardPayment(paymentData.value.clientSecret, {
      payment_method: {
        card: stripeCardRef.value.card,
        billing_details: {
          name: `${formData.name} ${formData.lastname}`,
          email: formData.email
        }
      }
    })

    if (error) {
      throw new Error(error.message)
    }

    // Success!
    alert('¡Gracias por afiliarte a PCE! Pronto recibirás un correo de confirmación.')
    navigateTo('/')
    
  } catch (error) {
    console.error('Payment error:', error)
    paymentError.value = error.message || 'Error al procesar el pago'
    isProcessing.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

useHead({
  title: 'Afiliación - PCE',
  meta: [
    { name: 'description', content: 'Únete a Protección Civil Española (PCE) y forma parte del cambio. Proceso de afiliación sencillo y rápido.' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.affiliation-page {
  .page-title {
    font-family: 'Cinzel', serif;
    font-size: 3.5rem;
    color: #F0F0F0;
    text-shadow: 2px 2px 10px rgba(0,0,0,0.5);
    margin-bottom: 40px;
  }
}

.affiliation-layout {
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

.form-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;
  position: relative;
  padding: 0 20px;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 40px;
    right: 40px;
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
    z-index: 0;
  }

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    position: relative;
    z-index: 1;
    width: 80px;

    &.active, &.completed {
      .step-circle {
        background-color: #ffffff;
        color: #000;
        box-shadow: 0 0 20px rgba(255,255,255,0.4);
      }
      .step-label {
        color: #fff;
        opacity: 1;
      }
    }

    .step-circle {
      width: 40px;
      height: 40px;
      background-color: #723233;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: #fff;
      font-family: 'Cinzel', serif;
    }

    .step-label {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
    }
  }
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
}

/* DNI Scanner Section */
.dni-scanner-section {
  margin-bottom: 30px;
  padding: 30px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
}

.form-divider {
  text-align: center;
  margin: 30px 0;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  span {
    padding: 0 20px;
    background: #5E2C2C;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    font-family: 'Cinzel', serif;
  }
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    font-family: 'Cinzel', serif;
    font-weight: 700;
    font-size: 0.85rem;
    color: #fff;
    text-transform: uppercase;
  }

  input {
    background-color: #B4A7A7;
    border: none;
    padding: 18px 25px;
    border-radius: 50px;
    color: #000;
    font-size: 1rem;
    font-family: var(--font-body);

    &::placeholder {
      color: rgba(0,0,0,0.4);
    }
    
    &:focus {
      outline: none;
      background-color: #fff;
    }

    &.valid {
      border: 2px solid #00ff00;
    }

    &.error {
      border: 2px solid #ff6b6b;
      background-color: rgba(255, 107, 107, 0.2);
    }
  }
}

/* Quota Options */
.quota-options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.quota-card {
  position: relative;
  padding: 25px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }

  &.selected {
    background: rgba(255, 255, 255, 0.2);
    border-color: #00ff00;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);

    .quota-check {
      opacity: 1;
    }
  }

  .quota-badge {
    position: absolute;
    top: -10px;
    right: 15px;
    background: #00ff00;
    color: #000;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: bold;
  }

  .quota-amount {
    font-family: 'Cinzel', serif;
    font-size: 1.8rem;
    color: #fff;
    margin-bottom: 10px;
  }

  .quota-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }

  .quota-check {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 30px;
    height: 30px;
    background: #00ff00;
    color: #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
}

.custom-quota {
  margin-top: 20px;

  label {
    display: block;
    font-family: 'Cinzel', serif;
    color: #fff;
    margin-bottom: 10px;
  }

  input {
    width: 100%;
    padding: 18px 25px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    color: #fff;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.5);
    }
  }
}

/* Payment Section */
.payment-info {
  background: rgba(0, 0, 0, 0.3);
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 30px;

  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;

    &:last-child {
      border-bottom: none;
    }

    .amount {
      font-family: 'Cinzel', serif;
      font-size: 1.3rem;
      color: #00ff00;
    }
  }
}

.stripe-section {
  margin-bottom: 20px;
}

.test-cards-info {
  margin-top: 20px;
  
  details {
    background: rgba(0, 0, 0, 0.3);
    padding: 15px;
    border-radius: 10px;

    summary {
      cursor: pointer;
      font-weight: bold;
      color: #fff;
      margin-bottom: 10px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 10px 0;

      li {
        padding: 8px 0;
        color: rgba(255, 255, 255, 0.9);

        code {
          background: rgba(0, 0, 0, 0.5);
          padding: 2px 8px;
          border-radius: 5px;
          font-family: monospace;
        }
      }
    }

    p {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.85rem;
    }
  }
}

.payment-error {
  margin-top: 15px;
  padding: 15px;
  background: rgba(255, 107, 107, 0.2);
  border: 2px solid #ff6b6b;
  border-radius: 10px;
  color: #ff6b6b;
  text-align: center;
}

/* Confirmation */
.confirmation-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.confirmation-section {
  background: rgba(0, 0, 0, 0.3);
  padding: 25px;
  border-radius: 15px;

  &.full-width {
    grid-column: 1 / -1;
  }

  h3 {
    font-family: 'Cinzel', serif;
    color: #fff;
    margin-bottom: 20px;
    font-size: 1.3rem;
  }

  .data-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:last-child {
      border-bottom: none;
    }

    .label {
      color: rgba(255, 255, 255, 0.7);
    }

    .value {
      color: #fff;
      font-weight: bold;

      &.highlight {
        color: #00ff00;
        font-family: 'Cinzel', serif;
        font-size: 1.2rem;
      }
    }
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #fff;
  cursor: pointer;

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  a {
    color: #00ff00;
    text-decoration: underline;

    &:hover {
      color: #00cc00;
    }
  }
}

.form-nav {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 50px;

  .btn {
    padding: 15px 40px;
    border: none;
    border-radius: 50px;
    font-family: 'Cinzel', serif;
    font-weight: bold;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .btn-next {
    background-color: #000 !important;
    color: #fff !important;
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
    
    &:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.4);
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.error-msg {
  color: #ff9999;
  font-size: 0.8rem;
  margin-top: 5px;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  margin-left: 10px;
}

.success-msg {
  color: #00ff00;
  font-size: 0.8rem;
  margin-top: 5px;
  font-weight: 700;
  margin-left: 10px;
}
</style>
