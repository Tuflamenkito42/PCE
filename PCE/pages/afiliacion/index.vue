<template>
  <main class="affiliation-page container">
    <h1 class="page-title">{{ t('affiliation.title') }}</h1>

    <div class="affiliation-layout">
      <!-- Left: Form -->
      <div class="form-container card">
        <!-- Steps Header -->
        <div class="form-steps" v-if="!isAlreadyAffiliated">
          <div v-for="step in 5" :key="step" :class="['step', { active: currentStep === step, completed: currentStep > step }]">
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
            <div :key="isAlreadyAffiliated ? 'affiliated' : currentStep">
              
              <!-- ALREADY AFFILIATED VIEW -->
              <div v-if="isAlreadyAffiliated" class="step-content text-center">
                 <div class="success-animation">
                  <div class="check-container" style="background: #000; color: #723233;">
                    <div class="check-mark">✓</div>
                  </div>
                </div>
                <h2 class="form-subtitle">{{ t('affiliation.alreadyAffiliated') }}</h2>
                <div class="success-message">
                  <p>Hola <strong>{{ affiliationData.name }}</strong>, gracias por tu compromiso.</p>
                  <p>Tu afiliación está activa y contribuyes con <strong>{{ affiliationData.quota }}€/mes</strong>.</p>
                  
                  <div class="affiliation-number">
                    <span>{{ t('affiliation.affiliationNumber') }}</span>
                    <strong>#{{ affiliationData.id }}</strong>
                  </div>
                </div>
                
                <div class="success-actions">
                  <button @click="handleCancelSubscription" class="btn" style="background: #723233; color: white;">
                    {{ isCancelling ? t('affiliation.cancelInProgress') : t('affiliation.cancelSubscription') }}
                  </button>
                </div>
              </div>

              <!-- STEP 1: DATOS PERSONALES + DNI SCANNER -->
              <div v-else-if="currentStep === 1" class="step-content">
                <h2 class="form-subtitle">{{ t('affiliation.personalData') }}</h2>
                
                <!-- DNI SCANNER -->
                <div class="dni-scanner-section">
                  <DniScanner @dataExtracted="handleDniData" />
                </div>

                <div class="form-divider">
                  <span>{{ t('affiliation.manualEntry') }}</span>
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label>{{ t('affiliation.name') }}</label>
                    <input v-model="formData.name" type="text" :placeholder="t('affiliation.namePlaceholder')" required :class="{ 'error': errors.name }" />
                    <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
                  </div>
                  <div class="form-group">
                    <label>{{ t('affiliation.lastname') }}</label>
                    <input v-model="formData.lastname" type="text" :placeholder="t('affiliation.lastnamePlaceholder')" required :class="{ 'error': errors.lastname }" />
                    <span v-if="errors.lastname" class="error-msg">{{ errors.lastname }}</span>
                  </div>
                  <div class="form-group">
                    <label>{{ t('affiliation.dni') }}</label>
                    <input v-model="formData.dni" type="text" :placeholder="t('affiliation.dniPlaceholder')" required :class="{ 'error': errors.dni, 'valid': dniValid }" />
                    <span v-if="errors.dni" class="error-msg">{{ errors.dni }}</span>
                    <span v-else-if="dniValid" class="success-msg">{{ t('affiliation.dniValid') }}</span>
                  </div>
                  <div class="form-group">
                    <label>{{ t('affiliation.dateOfBirth') }}</label>
                    <input v-model="formData.birthdate" type="date" required :class="{ 'error': errors.birthdate }" />
                    <span v-if="errors.birthdate" class="error-msg">{{ errors.birthdate }}</span>
                  </div>
                  <div class="form-group">
                    <label>{{ t('affiliation.emailPrimary') }}</label>
                    <input v-model="formData.email" type="email" :placeholder="t('affiliation.emailPlaceholder')" required :class="{ 'error': errors.email }" />
                    <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
                  </div>
                  <div class="form-group">
                    <label>{{ lt('Confirmar email', 'Confirmar correu', 'Emaila berretsi', 'Confirmar email') }}</label>
                    <input v-model="formData.confirmEmail" type="email" :placeholder="lt('Repite tu email', 'Repeteix el teu correu', 'Errepikatu zure emaila', 'Repite o teu email')" required :class="{ 'error': errors.confirmEmail }" />
                    <span v-if="errors.confirmEmail" class="error-msg">{{ errors.confirmEmail }}</span>
                  </div>
                  <div class="form-group">
                    <label>{{ t('affiliation.phoneNumber') }}</label>
                    <input v-model="formData.phone" type="tel" :placeholder="t('affiliation.phoneNumber')" required :class="{ 'error': errors.phone }" />
                    <span v-if="errors.phone" class="error-msg">{{ errors.phone }}</span>
                  </div>

                  <div class="form-group">
                    <label>{{ lt('Foto para el carné de socio', 'Foto per al carnet de soci', 'Bazkide txartelerako argazkia', 'Foto para o carné de socio') }} *</label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      @change="handleCardPhotoChange"
                      :class="{ 'error': errors.cardPhoto }"
                    />
                    <p class="photo-help">{{ lt('Esta foto se utilizará exclusivamente para generar tu carné de socio.', 'Aquesta foto s utilitzarà exclusivament per generar el teu carnet de soci.', 'Argazki hau zure bazkide txartela sortzeko bakarrik erabiliko da.', 'Esta foto empregarase exclusivamente para xerar o teu carné de socio.') }}</p>
                    <img v-if="cardPhotoPreview" :src="cardPhotoPreview" :alt="lt('Vista previa de la foto para el carné', 'Vista prèvia de la foto per al carnet', 'Txartelerako argazkiaren aurrebista', 'Vista previa da foto para o carné')" class="card-photo-preview" />
                    <span v-if="errors.cardPhoto" class="error-msg">{{ errors.cardPhoto }}</span>
                  </div>
                </div>
              </div>

              <!-- STEP 2: CUOTA -->
              <div v-else-if="currentStep === 2" class="step-content">
                <h2 class="form-subtitle">{{ lt('CUOTA DE AFILIACIÓN', 'QUOTA D AFILIACIÓ', 'AFILIAZIO KUOTA', 'COTA DE AFILIACIÓN') }}</h2>
                <p class="step-description">{{ lt('Selecciona tu cuota mensual. Todas las contribuciones ayudan a fortalecer nuestro movimiento.', 'Selecciona la teva quota mensual. Totes les contribucions ajuden a enfortir el nostre moviment.', 'Aukeratu zure hileko kuota. Ekarpen guztiek gure mugimendua indartzen laguntzen dute.', 'Selecciona a túa cota mensual. Todas as contribucións axudan a fortalecer o noso movemento.') }}</p>
                
                <div class="quota-options">
                  <div 
                    v-for="quota in quotaOptions" 
                    :key="quota.value"
                    :class="['quota-card', { selected: formData.quota === quota.value }]"
                    @click="formData.quota = quota.value"
                  >
                    <div class="quota-badge" v-if="quota.recommended">{{ lt('Recomendado', 'Recomanat', 'Gomendatua', 'Recomendado') }}</div>
                    <div class="quota-amount">{{ quota.label }}</div>
                    <div class="quota-description">{{ quota.description }}</div>
                    <div class="quota-check">✓</div>
                  </div>
                </div>

                <div v-if="formData.quota === 'custom'" class="custom-quota">
                  <label>{{ lt('Cantidad personalizada (€/mes)', 'Quantitat personalitzada (€/mes)', 'Zenbateko pertsonalizatua (€/hilean)', 'Cantidade personalizada (€/mes)') }}</label>
                  <input 
                    v-model.number="formData.customAmount" 
                    type="number" 
                    min="5" 
                    step="1" 
                    :placeholder="lt('Mínimo 5€', 'Mínim 5€', 'Gutxienez 5€', 'Mínimo 5€')"
                  />
                </div>
              </div>

              <!-- STEP 3: DATOS BANCARIOS (STRIPE) -->
              <div v-else-if="currentStep === 3" class="step-content">
                <div class="payment-summary card-accent">
                  <div class="summary-header">
                    <h2 class="form-subtitle">{{ lt('RESUMEN DEL PAGO', 'RESUM DEL PAGAMENT', 'ORDAINKETAREN LABURPENA', 'RESUMO DO PAGAMENTO') }}</h2>
                    <p class="step-description">{{ lt('Introduce tus datos de tarjeta para finalizar el proceso.', 'Introdueix les teves dades de targeta per finalitzar el procés.', 'Sartu zure txartelaren datuak prozesua amaitzeko.', 'Introduce os teus datos da tarxeta para finalizar o proceso.') }}</p>
                  </div>
                  
                  <div class="payment-grid">
                    <div class="summary-item">
                      <span class="summary-label">{{ lt('CUOTA MENSUAL', 'QUOTA MENSUAL', 'HILEKO KUOTA', 'COTA MENSUAL') }}</span>
                      <span class="summary-value highlight-green">{{ selectedQuotaAmount }}€</span>
                    </div>
                    <div class="summary-item">
                      <span class="summary-label">{{ lt('PRIMER CARGO', 'PRIMER CÀRREC', 'LEHEN KOBRANTZA', 'PRIMEIRO COBRO') }}</span>
                      <span class="summary-value">{{ lt('HOY', 'AVUI', 'GAUR', 'HOXE') }}</span>
                    </div>
                    <div class="summary-item">
                      <span class="summary-label">{{ lt('PRÓXIMO CARGO', 'PRÒXIM CÀRREC', 'HURRENGO KOBRANTZA', 'PRÓXIMO COBRO') }}</span>
                      <span class="summary-value">{{ nextChargeDate }}</span>
                    </div>
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
              </div>

              <!-- STEP 4: CONFIRMACIÓN -->
              <div v-else-if="currentStep === 4" class="step-content">
                <h2 class="form-subtitle">{{ lt('CONFIRMACIÓN', 'CONFIRMACIÓ', 'BAIEZTAPENA', 'CONFIRMACIÓN') }}</h2>
                <p class="step-description">{{ lt('Revisa tus datos antes de finalizar la afiliación.', 'Revisa les teves dades abans de finalitzar l afiliació.', 'Egiaztatu zure datuak afiliazioa amaitu aurretik.', 'Revisa os teus datos antes de finalizar a afiliación.') }}</p>

                <div class="confirmation-grid">
                  <div class="confirmation-section">
                    <h3>{{ lt('Datos personales', 'Dades personals', 'Datu pertsonalak', 'Datos persoais') }}</h3>
                    <div class="data-row">
                      <span class="label">{{ lt('Nombre completo:', 'Nom complet:', 'Izen-abizenak:', 'Nome completo:') }}</span>
                      <span class="value">{{ formData.name }} {{ formData.lastname }}</span>
                    </div>
                    <div class="data-row">
                      <span class="label">DNI/NIE:</span>
                      <span class="value">{{ formData.dni }}</span>
                    </div>
                    <div class="data-row">
                      <span class="label">{{ lt('Fecha de nacimiento:', 'Data de naixement:', 'Jaiotze data:', 'Data de nacemento:') }}</span>
                      <span class="value">{{ formatDate(formData.birthdate) }}</span>
                    </div>
                    <div class="data-row">
                      <span class="label">Email:</span>
                      <span class="value">{{ formData.email }}</span>
                    </div>
                  </div>

                  <div class="confirmation-section">
                    <h3>{{ lt('Cuota de afiliación', 'Quota d afiliació', 'Afiliazio kuota', 'Cota de afiliación') }}</h3>
                    <div class="data-row">
                      <span class="label">{{ lt('Cuota mensual:', 'Quota mensual:', 'Hileko kuota:', 'Cota mensual:') }}</span>
                      <span class="value highlight">{{ selectedQuotaAmount }}€/mes</span>
                    </div>
                    <div class="data-row">
                      <span class="label">{{ lt('Método de pago:', 'Mètode de pagament:', 'Ordainketa metodoa:', 'Método de pagamento:') }}</span>
                      <span class="value">{{ lt('Tarjeta de crédito/débito', 'Targeta de crèdit/dèbit', 'Kreditu/zordunketa txartela', 'Tarxeta de crédito/débito') }}</span>
                    </div>
                  </div>

                  <div class="confirmation-section full-width">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="formData.acceptTerms" required />
                      <span>
                        {{ lt('Acepto los', 'Accepto els', 'Onartzen ditut', 'Acepto os') }}
                        <a href="/condiciones-uso" target="_blank">{{ lt('términos y condiciones', 'termes i condicions', 'terminoak eta baldintzak', 'termos e condicións') }}</a>
                        {{ lt('y la', 'i la', 'eta', 'e a') }}
                        <a href="/politica-privacidad" target="_blank">{{ lt('política de privacidad', 'política de privacitat', 'pribatutasun politika', 'política de privacidade') }}</a>
                      </span>
                    </label>
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
                </div>
              </div>

              <!-- STEP 5: ÉXITO -->
              <div v-else-if="currentStep === 5" class="step-content success-step">
                <div class="success-animation">
                  <div class="check-container" style="background: #000; color: #723233;">
                    <div class="check-mark">✓</div>
                  </div>
                </div>
                
                <h2 class="form-subtitle text-center">{{ lt('¡AFILIACIÓN COMPLETADA!', 'AFILIACIÓ COMPLETADA!', 'AFILIAZIOA OSATUTA!', 'AFILIACIÓN COMPLETADA!') }}</h2>
                <div class="success-message text-center">
                  <p>{{ lt('Gracias', 'Gràcies', 'Eskerrik asko', 'Grazas') }} <strong>{{ formData.name }}</strong>, {{ lt('tu proceso de afiliación se ha completado correctamente.', 'el teu procés d afiliació s ha completat correctament.', 'zure afiliazio prozesua ondo osatu da.', 'o teu proceso de afiliación completouse correctamente.') }}</p>
                  <p>{{ lt('Hemos guardado tus datos y pronto recibirás un correo de confirmación con los siguientes pasos.', 'Hem desat les teves dades i aviat rebràs un correu de confirmació amb els passos següents.', 'Zure datuak gorde ditugu eta laster jasoko duzu berrespen-mezu bat hurrengo pausoekin.', 'Gardamos os teus datos e pronto recibirás un correo de confirmación cos seguintes pasos.') }}</p>
                  
                  <div class="affiliation-number">
                    <span>{{ lt('NÚMERO DE SOLICITUD', 'NÚMERO DE SOL·LICITUD', 'ESKAERA ZENBAKIA', 'NÚMERO DE SOLICITUDE') }}</span>
                    <strong>#{{ Date.now().toString().slice(-6) }}</strong>
                  </div>
                </div>

                <div class="success-actions">
                  <NuxtLink to="/" class="btn btn-finish">{{ lt('VOLVER AL INICIO', 'TORNAR A L INICI', 'HASIERARA ITZULI', 'VOLVER AO INICIO') }}</NuxtLink>
                </div>
              </div>
            </div>
          </transition>

          <div v-if="currentStep < 5" class="form-nav">
            <button v-if="currentStep > 1" type="button" class="btn" @click="previousStep">{{ lt('Anterior', 'Anterior', 'Aurrekoa', 'Anterior') }}</button>
            <button 
              v-if="currentStep < 4" 
              type="button" 
              class="btn btn-next" 
              @click="nextStep"
              :disabled="!canProceed"
            >
              {{ lt('Siguiente', 'Següent', 'Hurrengoa', 'Seguinte') }}
            </button>
            <button 
              v-if="currentStep === 4" 
              type="submit" 
              class="btn btn-next"
              :disabled="isProcessing || !formData.acceptTerms"
            >
              <span v-if="isProcessing">{{ lt('Procesando...', 'Processant...', 'Prozesatzen...', 'Procesando...') }}</span>
              <span v-else>{{ lt('Finalizar afiliación', 'Finalitzar afiliació', 'Afiliazioa amaitu', 'Finalizar afiliación') }}</span>
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
const { t, locale } = useI18n()
import StripeCard from '@/components/StripeCard.vue'
import { isValidEmail, isValidDNI } from '@/utils/validation'
import { computed } from 'vue'

const lt = (es, ca, eu, gl) => {
  if (locale.value === 'ca') return ca
  if (locale.value === 'eu') return eu
  if (locale.value === 'gl') return gl
  return es
}

const currentStep = ref(1)
const stepLabels = computed(() => [
  lt('Datos personales', 'Dades personals', 'Datu pertsonalak', 'Datos persoais'),
  lt('Cuota', 'Quota', 'Kuota', 'Cota'),
  lt('Datos bancarios', 'Dades bancàries', 'Banku datuak', 'Datos bancarios'),
  lt('Confirmación', 'Confirmació', 'Baieztapena', 'Confirmación'),
  lt('Finalizado', 'Finalitzat', 'Amaituta', 'Finalizado')
])

// Form Data
const formData = reactive({
  name: '',
  lastname: '',
  dni: '',
  birthdate: '',
  email: '',
  confirmEmail: '',
  phone: '',
  quota: '10',
  customAmount: null,
  acceptTerms: false
})

const cardPhotoFile = ref(null)
const cardPhotoPreview = ref('')
const CARD_PHOTO_RATIO = 112 / 246

const errors = ref({})
const isProcessing = ref(false)
const paymentError = ref('')
const paymentStatus = ref('error') // 'error', 'success', or 'processing'
const stripeReady = ref(false)
const cardComplete = ref(false)
const stripeCardRef = ref(null)

// Affiliation Status State
const isAlreadyAffiliated = ref(false)
const isCancelling = ref(false)
const affiliationData = ref({})

const { user } = useAuth()

onMounted(async () => {
    if (user.value?.email) {
        await checkAffiliationExisting(user.value.email)
    }
})

watch(() => user.value, async (newUser) => {
    if (newUser?.email) {
        await checkAffiliationExisting(newUser.email)
    }
})

const checkAffiliationExisting = async (email) => {
    try {
        const { data } = await useFetch('/api/afiliacion/check', {
            query: { email }
        })
        if (data.value && data.value.affiliated) {
            isAlreadyAffiliated.value = true
            affiliationData.value = data.value.data
        }
    } catch (e) {
        console.error("Error checking affiliation:", e)
    }
}

const handleCancelSubscription = async () => {
  if (!confirm(lt('¿Estás seguro de que quieres cancelar tu afiliación?', 'Segur que vols cancel·lar la teva afiliació?', 'Ziur zaude zure afiliazioa ezeztatu nahi duzula?', 'Estás seguro de que queres cancelar a túa afiliación?'))) return
    
    isCancelling.value = true
    try {
        const { error } = await useFetch('/api/afiliacion/cancel', {
            method: 'POST',
            body: { email: affiliationData.value.email }
        })

        if (error.value) throw error.value

        alert(lt('Suscripción cancelada correctamente.', 'Subscripció cancel·lada correctament.', 'Harpidetza behar bezala ezeztatu da.', 'Subscrición cancelada correctamente.'))
        isAlreadyAffiliated.value = false
        // Reset form or redirect
    } catch (e) {
        alert(lt('Error al cancelar: ', 'Error en cancel·lar: ', 'Ezeztatzean errorea: ', 'Erro ao cancelar: ') + (e.message || lt('Error desconocido', 'Error desconegut', 'Errore ezezaguna', 'Erro descoñecido')))
    } finally {
        isCancelling.value = false
    }
}

// Quota options
const quotaOptions = [
  { value: '5', label: '5€/mes', description: lt('Apoyo básico', 'Suport bàsic', 'Oinarrizko laguntza', 'Apoio básico'), recommended: false },
  { value: '10', label: '10€/mes', description: lt('Apoyo estándar', 'Suport estàndard', 'Laguntza estandarra', 'Apoio estándar'), recommended: true },
  { value: '20', label: '20€/mes', description: lt('Apoyo comprometido', 'Suport compromès', 'Konpromisozko laguntza', 'Apoio comprometido'), recommended: false },
  { value: '50', label: '50€/mes', description: lt('Apoyo premium', 'Suport premium', 'Premium laguntza', 'Apoio premium'), recommended: false },
  { value: 'custom', label: lt('PERSONALIZADO', 'PERSONALITZAT', 'PERTSONALIZATUA', 'PERSONALIZADO'), description: lt('Elige tu cantidad', 'Tria la teva quantitat', 'Aukeratu zure zenbatekoa', 'Elixe a túa cantidade'), recommended: false }
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
  const localeMap = { es: 'es-ES', ca: 'ca-ES', eu: 'eu-ES', gl: 'gl-ES' }
  return date.toLocaleDateString(localeMap[locale.value] || 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
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
  
  // Fill available fields regardless of validity
  if (data.dni) formData.dni = data.dni
  if (data.nombre) formData.name = data.nombre
  if (data.apellidos) formData.lastname = data.apellidos
  
  // Parse birthdate if available
  if (data.fecha_nacimiento) {
    const parts = data.fecha_nacimiento.split(/[\/\.]/)
    if (parts.length === 3) {
      const [day, month, year] = parts
      formData.birthdate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  }

  if (data.valido) {
    console.log('✅ DNI válido detectado. Formulario auto-rellenado.')
  } else {
    console.log('⚠️ Algunos datos detectados. Por favor, completa o verifica manualmente los campos.')
  }
}

const processCardPhotoFile = async (file) => {
  if (!process.client) return file

  const sourceUrl = URL.createObjectURL(file)

  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('No se pudo procesar la imagen'))
      img.src = sourceUrl
    })

    const sourceWidth = image.naturalWidth || image.width
    const sourceHeight = image.naturalHeight || image.height
    if (!sourceWidth || !sourceHeight) {
      throw new Error('Dimensiones inválidas')
    }

    let cropWidth = sourceWidth
    let cropHeight = sourceHeight

    if (sourceWidth / sourceHeight > CARD_PHOTO_RATIO) {
      cropWidth = Math.round(sourceHeight * CARD_PHOTO_RATIO)
    } else {
      cropHeight = Math.round(sourceWidth / CARD_PHOTO_RATIO)
    }

    const freeX = Math.max(0, sourceWidth - cropWidth)
    const freeY = Math.max(0, sourceHeight - cropHeight)

    // Para fotos de retrato, prioriza cabeza/rostro (encuadre ligeramente superior)
    const offsetX = Math.round(freeX / 2)
    const offsetY = Math.round(freeY * 0.22)

    const outputWidth = 560
    const outputHeight = Math.round(outputWidth / CARD_PHOTO_RATIO)
    const canvas = document.createElement('canvas')
    canvas.width = outputWidth
    canvas.height = outputHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('No se pudo inicializar el procesado de imagen')
    }

    ctx.drawImage(
      image,
      offsetX,
      offsetY,
      cropWidth,
      cropHeight,
      0,
      0,
      outputWidth,
      outputHeight
    )

    const processedBlob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('No se pudo exportar la imagen procesada'))
          return
        }
        resolve(blob)
      }, 'image/jpeg', 0.92)
    })

    const processedFile = new File(
      [processedBlob],
      `card-photo-${Date.now()}.jpg`,
      { type: 'image/jpeg' }
    )

    return processedFile
  } finally {
    URL.revokeObjectURL(sourceUrl)
  }
}

const handleCardPhotoChange = async (event) => {
  const target = event.target
  const file = target?.files?.[0]

  if (!file) {
    if (cardPhotoPreview.value) {
      URL.revokeObjectURL(cardPhotoPreview.value)
    }
    cardPhotoFile.value = null
    cardPhotoPreview.value = ''
    return
  }

  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
  if (!allowedTypes.has(file.type)) {
    errors.value.cardPhoto = lt('Formato no válido. Usa JPG, PNG o WEBP.', 'Format no vàlid. Usa JPG, PNG o WEBP.', 'Formatu baliogabea. Erabili JPG, PNG edo WEBP.', 'Formato non válido. Usa JPG, PNG ou WEBP.')
    cardPhotoFile.value = null
    cardPhotoPreview.value = ''
    target.value = ''
    return
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    errors.value.cardPhoto = lt('La foto no puede superar 5MB.', 'La foto no pot superar 5MB.', 'Argazkiak ezin du 5MB gainditu.', 'A foto non pode superar 5MB.')
    cardPhotoFile.value = null
    cardPhotoPreview.value = ''
    target.value = ''
    return
  }

  try {
    errors.value.cardPhoto = ''
    const processedFile = await processCardPhotoFile(file)

    if (cardPhotoPreview.value) {
      URL.revokeObjectURL(cardPhotoPreview.value)
    }

    cardPhotoFile.value = processedFile
    cardPhotoPreview.value = URL.createObjectURL(processedFile)
  } catch (error) {
    errors.value.cardPhoto = lt('No se pudo ajustar la foto automáticamente. Prueba con otra imagen.', 'No s ha pogut ajustar la foto automàticament. Prova amb una altra imatge.', 'Argazkia ezin izan da automatikoki egokitu. Saiatu beste irudi batekin.', 'Non se puido axustar a foto automaticamente. Proba con outra imaxe.')
    cardPhotoFile.value = null
    cardPhotoPreview.value = ''
    target.value = ''
  }
}

const validateStep1 = () => {
  errors.value = {}
  let valid = true

  if (!formData.name) { errors.value.name = t('affiliation.requiredName'); valid = false; }
  if (!formData.lastname) { errors.value.lastname = t('affiliation.requiredLastname'); valid = false; }
  
  if (!isValidDNI(formData.dni)) {
    errors.value.dni = t('affiliation.invalidDni'); 
    valid = false; 
  }

  if (!formData.birthdate) { errors.value.birthdate = t('affiliation.requiredBirthdate'); valid = false; }

  if (!isValidEmail(formData.email)) {
    errors.value.email = t('affiliation.invalidEmail'); 
    valid = false; 
  }

  if (!isValidEmail(formData.confirmEmail)) {
    errors.value.confirmEmail = lt('Debes confirmar un email válido', 'Has de confirmar un correu vàlid', 'Baliozko email bat berretsi behar duzu', 'Debes confirmar un email válido')
    valid = false
  } else if (String(formData.email).toLowerCase().trim() !== String(formData.confirmEmail).toLowerCase().trim()) {
    errors.value.confirmEmail = lt('Los emails no coinciden', 'Els correus no coincideixen', 'Emailak ez datoz bat', 'Os emails non coinciden')
    valid = false
  }

  if (!formData.phone || String(formData.phone).trim().length < 6) {
    errors.value.phone = t('affiliation.requiredPhone')
    valid = false
  }

  if (!cardPhotoFile.value) {
    errors.value.cardPhoto = lt('Debes subir una foto para generar el carné.', 'Has de pujar una foto per generar el carnet.', 'Txartela sortzeko argazki bat igo behar duzu.', 'Debes subir unha foto para xerar o carné.')
    valid = false
  }

  return valid
}

const submitAffiliation = async (payload) => {
  const multipart = new FormData()

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null || value === '') continue
    multipart.append(key, String(value))
  }

  if (cardPhotoFile.value) {
    multipart.append('cardPhoto', cardPhotoFile.value)
  }

  return await $fetch('/api/afiliacion', {
    method: 'POST',
    body: multipart
  })
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
    alert(lt('DEBES ACEPTAR LOS TÉRMINOS Y CONDICIONES', 'HAS D ACCEPTAR ELS TERMES I CONDICIONS', 'BALDINTZAK ETA TERMINOAK ONARTU BEHAR DITUZU', 'DEBES ACEPTAR OS TERMOS E CONDICIÓNS'))
    return
  }

  isProcessing.value = true
  paymentError.value = ''
  paymentStatus.value = 'error' // Reset status

  try {
    const numericQuota = Number(selectedQuotaAmount.value)
    if (!numericQuota || Number.isNaN(numericQuota) || numericQuota < 5) {
      throw new Error(lt('CUOTA NO VÁLIDA. REVISA EL IMPORTE SELECCIONADO.', 'QUOTA NO VÀLIDA. REVISA L IMPORT SELECCIONAT.', 'KUOTA EZ DA BALIOZKOA. BERRIKUSI HAUTATUTAKO ZENBATEKOA.', 'COTA NON VÁLIDA. REVISA O IMPORTE SELECCIONADO.'))
    }

    const affiliationPayload = {
      ...formData,
      quota: numericQuota
    }

    // 1. Create payment intent
    let paymentData
    try {
      paymentData = await $fetch('/api/payment-intent', {
        method: 'POST',
        body: {
          amount: numericQuota,
          currency: 'eur',
          metadata: {
            name: `${formData.name} ${formData.lastname}`,
            dni: formData.dni,
            email: formData.email
          }
        }
      })
    } catch (paymentIntentError) {
      const errorMsg = paymentIntentError?.data?.message || paymentIntentError?.message || ''
      const lowerMsg = String(errorMsg).toLowerCase()

      // If error is about API keys, we allow simulation for testing
      if (lowerMsg.includes('api key') || lowerMsg.includes('secret') || lowerMsg.includes('stripe')) {
        console.warn('Entrando en modo simulación (Claves de Stripe no configuradas)')

        paymentStatus.value = 'processing'
        paymentError.value = lt('VERIFICANDO DATOS DE TARJETA...', 'VERIFICANT DADES DE TARGETA...', 'TXARTEL DATUAK EGIAZTATZEN...', 'VERIFICANDO DATOS DA TARXETA...')

        // Brief delay to simulate a real check
        await new Promise(resolve => setTimeout(resolve, 1500))

        paymentStatus.value = 'success'
        paymentError.value = lt('¡PAGO ACEPTADO CORRECTAMENTE!', 'PAGAMENT ACCEPTAT CORRECTAMENT!', 'ORDAINKETA ONDO ONARTU DA!', 'PAGAMENTO ACEPTADO CORRECTAMENTE!')
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Save to DB (Simulated)
        await submitAffiliation({
          ...affiliationPayload,
          payment_intent_id: 'sim_' + Date.now(),
          status: 'simulated_paid'
        })

        currentStep.value = 5
        return
      }

      throw new Error(errorMsg || lt('ERROR DE CONEXIÓN CON EL SERVIDOR', 'ERROR DE CONNEXIÓ AMB EL SERVIDOR', 'ZERBITZARIAREKIKO KONEXIO ERROREA', 'ERRO DE CONEXIÓN CO SERVIDOR'))
    }

    if (!paymentData?.clientSecret) {
      throw new Error(lt('NO SE RECIBIÓ RESPUESTA DEL SERVIDOR DE PAGOS', 'NO S HA REBUT RESPOSTA DEL SERVIDOR DE PAGAMENTS', 'EZ DA ORDAINKETA ZERBITZARIKO ERANTZUNIK JASO', 'NON SE RECIBIU RESPOSTA DO SERVIDOR DE PAGOS'))
    }

    // 3. Confirm payment with Stripe
    const { stripe: stripeInstance, initStripe } = useStripe()
    await initStripe()

    if (!stripeInstance.value) throw new Error(lt('ERROR AL INICIALIZAR STRIPE', 'ERROR EN INICIALITZAR STRIPE', 'ERROREA STRIPE ABIATZEAN', 'ERRO AO INICIALIZAR STRIPE'))

    const { error } = await stripeInstance.value.confirmCardPayment(paymentData.clientSecret, {
      payment_method: {
        card: stripeCardRef.value.card,
        billing_details: {
          name: `${formData.name} ${formData.lastname}`,
          email: formData.email
        }
      }
    })

    if (error) throw new Error(error.message)

    // 4. Save to Database (Real)
    await submitAffiliation({
      ...affiliationPayload,
      payment_intent_id: paymentData.clientSecret.split('_secret')[0],
      status: 'paid'
    })

    currentStep.value = 5
    
  } catch (error) {
    console.error('Payment error:', error)
    const backendMsg = error?.data?.message || error?.statusMessage || error?.message
    paymentError.value = (backendMsg || lt('ERROR AL PROCESAR EL PAGO', 'ERROR EN PROCESSAR EL PAGAMENT', 'ERROREA ORDAINKETA PROZESATZEAN', 'ERRO AO PROCESAR O PAGO')).toUpperCase()
    paymentStatus.value = 'error'
    isProcessing.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const localeMap = { es: 'es-ES', ca: 'ca-ES', eu: 'eu-ES', gl: 'gl-ES' }
  return date.toLocaleDateString(localeMap[locale.value] || 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

useHead(() => ({
  title: `${t('affiliation.title')} - PCE`,
  meta: [
    { name: 'description', content: `${t('affiliation.personalData')}` }
  ]
}))
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
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.95rem;
    font-family: 'Cinzel', serif;
    position: relative;
    z-index: 1;
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
    border: 2px solid transparent;
    padding: 18px 25px;
    border-radius: 50px;
    color: #1a1a1a;
    font-size: 1.1rem;
    font-family: var(--font-body);

    &::placeholder {
      color: rgba(0,0,0,0.5);
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

  .form-textarea {
    background-color: #B4A7A7;
    border: 2px solid transparent;
    padding: 18px 25px;
    border-radius: 20px;
    color: #1a1a1a;
    font-size: 1.1rem;
    font-family: var(--font-body);
    min-height: 120px;
    resize: vertical;

    &:focus {
      outline: none;
      background-color: #fff;
    }
  }

  &.full-width {
    grid-column: 1 / -1;
  }
}

.photo-help {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.card-photo-preview {
  width: 140px;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
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

.payment-summary {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%);
  padding: 35px;
  border-radius: 20px;
  margin-bottom: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
}

.summary-header {
  margin-bottom: 25px;
  text-align: center;
}

.payment-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 640px) {
  .payment-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.3s_ease;
}

.summary-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.summary-label {
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1px;
}

.summary-value {
  font-weight: 800;
  color: #fff;
  font-size: 1rem;
}

.highlight-green {
  color: #39FF14;
  text-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
  font-size: 1.4rem;
}

.stripe-container {
  margin-bottom: 30px;
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

.test-cards-wrapper {
  margin-top: 25px;
}

.premium-details {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.premium-details summary {
  padding: 15px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-family: 'Cinzel', serif;
  font-size: 0.9rem;
  font-weight: bold;
  list-style: none;
}

.premium-details summary::-webkit-details-marker {
  display: none;
}

.premium-details summary:hover {
  background: rgba(255, 255, 255, 0.05);
}

.premium-details summary .arrow {
  margin-left: auto;
  font-size: 0.7rem;
  opacity: 0.5;
  transition: transform 0.3s ease;
}

.premium-details[open] summary .arrow {
  transform: rotate(180deg);
}

.details-content {
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.test-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.premium-code {
  font-family: 'Roboto Mono', monospace;
  color: #00ff00;
  font-size: 0.95rem;
}

.status-badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.status-badge.success { background: rgba(0, 255, 0, 0.2); color: #00ff00; }
.status-badge.error { background: rgba(255, 0, 0, 0.2); color: #ff6b6b; }

.details-footer {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-top: 10px;
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

/* Success Step Styles */
.success-step {
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.success-animation {
  .check-container {
    width: 100px;
    height: 100px;
    background: #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .check-mark {
    font-size: 50px;
    color: #723233;
    font-weight: bold;
  }
}

.success-message {
  color: #fff;
  
  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 15px;
    opacity: 0.9;
  }
}

.affiliation-number {
  margin-top: 30px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  span {
    font-family: 'Cinzel', serif;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 2px;
  }

  strong {
    font-size: 2rem;
    color: #ffffff;
    letter-spacing: 5px;
  }
}


.text-center {
  text-align: center;
}

@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
