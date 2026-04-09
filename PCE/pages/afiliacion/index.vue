<template>
  <main class="affiliation-page container">
    <h1 class="page-title">{{ t('affiliation.title') }}</h1>

    <div class="affiliation-layout">
      <!-- Left: Form -->
      <div class="form-container card">
        <div v-if="affiliationNotice" class="affiliation-notice">{{ affiliationNotice }}</div>

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
                    <input v-model="formData.name" type="text" :placeholder="t('affiliation.namePlaceholder')" required :readonly="isNameLocked" :class="{ 'error': errors.name, 'locked': isNameLocked }" />
                    <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
                  </div>
                  <div class="form-group">
                    <label>{{ t('affiliation.lastname') }}</label>
                    <input v-model="formData.lastname" type="text" :placeholder="t('affiliation.lastnamePlaceholder')" required :readonly="isLastnameLocked" :class="{ 'error': errors.lastname, 'locked': isLastnameLocked }" />
                    <span v-if="errors.lastname" class="error-msg">{{ errors.lastname }}</span>
                  </div>
                  <div class="form-group">
                    <label>{{ t('affiliation.dni') }}</label>
                    <input v-model="formData.dni" type="text" :placeholder="t('affiliation.dniPlaceholder')" required :readonly="isDniLocked" :class="{ 'error': errors.dni, 'valid': dniValid, 'locked': isDniLocked }" />
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
                    <input v-model="formData.email" type="email" :placeholder="t('affiliation.emailPlaceholder')" required :readonly="isEmailLocked" :class="{ 'error': errors.email, 'locked': isEmailLocked }" />
                    <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
                  </div>
                  <div class="form-group">
                    <label>{{ lt('Confirmar email', 'Confirmar correu', 'Emaila berretsi', 'Confirmar email') }}</label>
                    <input v-model="formData.confirmEmail" type="email" :placeholder="lt('Repite tu email', 'Repeteix el teu correu', 'Errepikatu zure emaila', 'Repite o teu email')" required :readonly="isEmailLocked" :class="{ 'error': errors.confirmEmail, 'locked': isEmailLocked }" />
                    <span v-if="errors.confirmEmail" class="error-msg">{{ errors.confirmEmail }}</span>
                  </div>
                  <div class="form-group">
                    <label>{{ t('affiliation.phoneNumber') }}</label>
                    <input v-model="formData.phone" type="tel" :placeholder="t('affiliation.phoneNumber')" required :class="{ 'error': errors.phone }" />
                    <span v-if="errors.phone" class="error-msg">{{ errors.phone }}</span>
                  </div>

                  <div class="form-group full-width">
                    <label>{{ lt('Foto para el carné de socio', 'Foto per al carnet de soci', 'Bazkide txartelerako argazkia', 'Foto para o carné de socio') }} *</label>
                    <p class="photo-help">{{ lt('Esta foto se utilizará exclusivamente para generar tu carné de socio.', 'Aquesta foto s utilitzarà exclusivament per generar el teu carnet de soci.', 'Argazki hau zure bazkide txartela sortzeko bakarrik erabiliko da.', 'Esta foto empregarase exclusivamente para xerar o teu carné de socio.') }}</p>

                    <!-- Si hay foto procesada y NO hay preview de nuevo editor -->
                    <div v-if="cardPhotoPreview && !cardPhotoEditorActive" class="photo-preview-section">
                      <div class="photo-preview">
                        <div class="photo-container">
                          <img :src="cardPhotoPreview" alt="Foto seleccionada" class="photo-img" />
                        </div>
                      </div>
                      <label class="photo-input-label">
                        Cambiar foto
                        <input
                          type="file"
                          accept="image/*"
                          @change="handleCardPhotoSelect"
                          :disabled="cardPhotoProcessing"
                        />
                      </label>
                      <span v-if="errors.cardPhoto" class="error-msg">{{ errors.cardPhoto }}</span>
                    </div>

                    <!-- Si no hay foto -->
                    <div v-else-if="!cardPhotoPreview && !cardPhotoEditorActive" class="photo-preview-section">
                      <div class="photo-preview">
                        <div class="photo-placeholder">{{ lt('Sin foto', 'Sense foto', 'Argazkirik gabe', 'Sen foto') }}</div>
                      </div>
                      <label class="photo-input-label">
                        {{ lt('Seleccionar foto', 'Seleccionar foto', 'Argazkia hautatu', 'Seleccionar foto') }}
                        <input
                          type="file"
                          accept="image/*"
                          @change="handleCardPhotoSelect"
                          :disabled="cardPhotoProcessing"
                        />
                      </label>
                      <span v-if="errors.cardPhoto" class="error-msg">{{ errors.cardPhoto }}</span>
                    </div>

                    <!-- EDITOR INTERACTIVO DE FOTO -->
                    <div v-if="cardPhotoEditorActive && cardPhotoRawPreview" class="photo-editor-section">
                      <div class="editor-container">
                        <div class="editor-workspace">
                          <div ref="cardPhotoCropAreaRef" class="crop-area" @wheel.prevent="handleCardPhotoWheel">
                            <img
                              :src="cardPhotoRawPreview"
                              :style="{
                                transform: `translate(${cardPhotoPanX}px, ${cardPhotoPanY}px) scale(${cardPhotoBaseScale * cardPhotoZoom})`,
                                transformOrigin: 'center center',
                                cursor: cardPhotoDragging ? 'grabbing' : 'grab',
                                transition: cardPhotoDragging ? 'none' : 'transform 0.2s'
                              }"
                              @mousedown="startCardPhotoDrag"
                              @mousemove="doCardPhotoDrag"
                              @mouseup="endCardPhotoDrag"
                              @mouseleave="endCardPhotoDrag"
                              class="editable-img"
                            />
                          </div>

                          <aside class="editor-side-panel">
                            <p class="mouse-help">
                              {{ lt('Ajusta con el ratón: arrastra para mover y usa la rueda para hacer zoom.', 'Ajusta amb el ratolí: arrossega per moure i usa la roda per fer zoom.', 'Doitu saguarekin: arrastatu mugitzeko eta erabili gurpila zoom egiteko.', 'Axusta co rato: arrastra para mover e usa a roda para facer zoom.') }}
                            </p>

                            <button
                              type="button"
                              @click="resetCardPhotoTransform"
                              class="btn-reset-adjust"
                              :disabled="cardPhotoProcessing"
                            >
                              {{ lt('Recentrar imagen', 'Recentra imatge', 'Irudia birzentratzea', 'Recentrar imaxe') }}
                            </button>

                            <div class="editor-controls">
                              <div class="zoom-control">
                                <span class="control-label">{{ lt('Zoom', 'Zoom', 'Zoom', 'Zoom') }}</span>
                                <input
                                  v-model.number="cardPhotoZoom"
                                  type="range"
                                  min="0.5"
                                  max="3"
                                  step="0.1"
                                  class="zoom-slider"
                                />
                                <span class="zoom-value">{{ Math.round(cardPhotoZoom * 100) }}%</span>
                              </div>

                              <div class="pan-control">
                                <span class="control-label">X</span>
                                <input
                                  v-model.number="cardPhotoPanX"
                                  type="range"
                                  min="-180"
                                  max="180"
                                  step="1"
                                  class="zoom-slider"
                                />
                                <span class="zoom-value">{{ Math.round(cardPhotoPanX) }}px</span>
                              </div>

                              <div class="pan-control">
                                <span class="control-label">Y</span>
                                <input
                                  v-model.number="cardPhotoPanY"
                                  type="range"
                                  min="-180"
                                  max="180"
                                  step="1"
                                  class="zoom-slider"
                                />
                                <span class="zoom-value">{{ Math.round(cardPhotoPanY) }}px</span>
                              </div>

                              <div class="action-buttons">
                                <button
                                  type="button"
                                  @click="cancelCardPhotoEdit"
                                  class="btn-cancel"
                                  :disabled="cardPhotoProcessing"
                                >
                                  {{ lt('Cancelar', 'Cancelar', 'Ezeztatu', 'Cancelar') }}
                                </button>
                                <button
                                  type="button"
                                  @click="confirmCardPhotoEdit"
                                  class="btn-confirm"
                                  :disabled="cardPhotoProcessing"
                                >
                                  <span v-if="cardPhotoProcessing">{{ lt('Guardando...', 'Guardant...', 'Gordetzean...', 'Gardando...') }}</span>
                                  <span v-else>{{ lt('Confirmar foto', 'Confirmar foto', 'Argazkia berretsi', 'Confirmar foto') }}</span>
                                </button>
                              </div>
                            </div>
                          </aside>
                        </div>
                      </div>
                      <p v-if="cardPhotoError" class="msg error">{{ cardPhotoError }}</p>
                    </div>
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
import { computed, watchEffect } from 'vue'

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
const cardPhotoRawPreview = ref('')
const cardPhotoEditorActive = ref(false)
const cardPhotoProcessing = ref(false)
const cardPhotoError = ref('')
const cardPhotoZoom = ref(1)
const cardPhotoPanX = ref(0)
const cardPhotoPanY = ref(0)
const cardPhotoDragging = ref(false)
const cardPhotoDragStartX = ref(0)
const cardPhotoDragStartY = ref(0)
const cardPhotoDragStartPanX = ref(0)
const cardPhotoDragStartPanY = ref(0)
const cardPhotoCropAreaRef = ref(null)
const cardPhotoNaturalWidth = ref(0)
const cardPhotoNaturalHeight = ref(0)
const cardPhotoBaseScale = ref(1)
const CARD_TEMPLATE_WIDTH = 1408
const CARD_TEMPLATE_HEIGHT = 768
const CARD_PHOTO_SLOT_WIDTH_RATIO = 0.112
const CARD_PHOTO_SLOT_HEIGHT_RATIO = 0.246
const CARD_PHOTO_RATIO = (CARD_TEMPLATE_WIDTH * CARD_PHOTO_SLOT_WIDTH_RATIO) / (CARD_TEMPLATE_HEIGHT * CARD_PHOTO_SLOT_HEIGHT_RATIO)

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
const hasAffiliationRedirected = ref(false)
const affiliationNotice = ref('')

const { user } = useAuth()

const splitFullName = (value) => {
  const normalized = String(value || '').trim().replace(/\s+/g, ' ')
  if (!normalized) return { name: '', lastname: '' }
  const parts = normalized.split(' ')
  const name = parts.shift() || ''
  const lastname = parts.join(' ')
  return { name, lastname }
}

const isNameLocked = computed(() => false)
const isLastnameLocked = computed(() => false)
const isDniLocked = computed(() => Boolean(String(user.value?.dni || '').trim()))
const isEmailLocked = computed(() => Boolean(String(user.value?.email || '').trim()))

watchEffect(() => {
  if (!user.value) return

  const fullName = String(user.value.full_name || '').trim()
  if (fullName && (!formData.name || !formData.lastname)) {
    const parts = splitFullName(fullName)
    if (!formData.name && parts.name) formData.name = parts.name
    if (!formData.lastname && parts.lastname) formData.lastname = parts.lastname
  }

  const dni = String(user.value.dni || '').toUpperCase().trim()
  if (dni && !formData.dni) {
    formData.dni = dni
  }

  const email = String(user.value.email || '').toLowerCase().trim()
  if (email) {
    if (!formData.email) formData.email = email
    if (!formData.confirmEmail) formData.confirmEmail = email
  }
})

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

      if (!hasAffiliationRedirected.value) {
        hasAffiliationRedirected.value = true
    affiliationNotice.value = lt('Ya te has afiliado. Te redirigimos al apartado de carné.', 'Ja t\'has afiliat. Et redirigim a l\'apartat de carnet.', 'Dagoeneko afiliatu zara. Karnet atalera birbideratuko zaitugu.', 'Xa te afiliache. Redirixímoste ao apartado do carné.')
    await navigateTo('/carnet?notice=already-affiliated')
      }
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

const handleCardPhotoSelect = async (event) => {
  cardPhotoError.value = ''
  const target = event.target
  const file = target?.files?.[0]

  if (!file) return

  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
  if (!allowedTypes.has(file.type)) {
    cardPhotoError.value = lt('Formato no válido. Usa JPG, PNG o WEBP.', 'Format no vàlid. Usa JPG, PNG o WEBP.', 'Formatu baliogabea. Erabili JPG, PNG edo WEBP.', 'Formato non válido. Usa JPG, PNG ou WEBP.')
    target.value = ''
    return
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    cardPhotoError.value = lt('La foto no puede superar 5MB.', 'La foto no pot superar 5MB.', 'Argazkiak ezin du 5MB gainditu.', 'A foto non pode superar 5MB.')
    target.value = ''
    return
  }

  // Mostrar el editor interactivo con la imagen sin procesar
  const reader = new FileReader()
  reader.onload = async () => {
    const dataUrl = String(reader.result || '')
    if (!dataUrl) return

    const sourceImage = await new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('No se pudo leer la foto seleccionada'))
      img.src = dataUrl
    })

    cardPhotoNaturalWidth.value = sourceImage.naturalWidth || sourceImage.width || 0
    cardPhotoNaturalHeight.value = sourceImage.naturalHeight || sourceImage.height || 0
    cardPhotoRawPreview.value = dataUrl
    cardPhotoEditorActive.value = true
    cardPhotoZoom.value = 1
    cardPhotoPanX.value = 0
    cardPhotoPanY.value = 0
    cardPhotoError.value = ''

    await nextTick()
    updateCardPhotoBaseScale()
  }
  reader.readAsDataURL(file)
}

const updateCardPhotoBaseScale = () => {
  const cropAreaEl = cardPhotoCropAreaRef.value
  const naturalW = cardPhotoNaturalWidth.value
  const naturalH = cardPhotoNaturalHeight.value

  if (!cropAreaEl || !naturalW || !naturalH) {
    cardPhotoBaseScale.value = 1
    return
  }

  const cropW = cropAreaEl.clientWidth || 1
  const cropH = cropAreaEl.clientHeight || Math.round(cropW / CARD_PHOTO_RATIO)
  const fitScale = Math.max(cropW / naturalW, cropH / naturalH)
  cardPhotoBaseScale.value = Number(fitScale.toFixed(6))
}

const startCardPhotoDrag = (e) => {
  if (!cardPhotoRawPreview.value) return
  cardPhotoDragging.value = true
  cardPhotoDragStartX.value = e.clientX
  cardPhotoDragStartY.value = e.clientY
  cardPhotoDragStartPanX.value = cardPhotoPanX.value
  cardPhotoDragStartPanY.value = cardPhotoPanY.value
}

const doCardPhotoDrag = (e) => {
  if (!cardPhotoDragging.value) return
  const dx = e.clientX - cardPhotoDragStartX.value
  const dy = e.clientY - cardPhotoDragStartY.value
  cardPhotoPanX.value = cardPhotoDragStartPanX.value + dx
  cardPhotoPanY.value = cardPhotoDragStartPanY.value + dy
}

const handleCardPhotoWheel = (e) => {
  const direction = e.deltaY > 0 ? -1 : 1
  const step = direction * 0.08
  const nextZoom = Math.max(0.5, Math.min(3, cardPhotoZoom.value + step))
  cardPhotoZoom.value = Number(nextZoom.toFixed(2))
}

const resetCardPhotoTransform = () => {
  cardPhotoZoom.value = 1
  cardPhotoPanX.value = 0
  cardPhotoPanY.value = 0
}

const endCardPhotoDrag = () => {
  cardPhotoDragging.value = false
}

const cancelCardPhotoEdit = () => {
  cardPhotoRawPreview.value = ''
  cardPhotoEditorActive.value = false
  cardPhotoNaturalWidth.value = 0
  cardPhotoNaturalHeight.value = 0
  cardPhotoBaseScale.value = 1
  cardPhotoZoom.value = 1
  cardPhotoPanX.value = 0
  cardPhotoPanY.value = 0
  cardPhotoError.value = ''
}

const confirmCardPhotoEdit = async () => {
  if (!cardPhotoRawPreview.value) return

  cardPhotoProcessing.value = true
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No se pudo inicializar canvas')
    }

    // Aplicar el ratio real del hueco de foto del carnet
    const aspectRatio = CARD_PHOTO_RATIO
    const cropAreaEl = cardPhotoCropAreaRef.value
    const containerWidth = cropAreaEl?.clientWidth || 280
    const containerHeight = cropAreaEl?.clientHeight || Math.round(containerWidth / aspectRatio)
    const outputWidth = 560
    const outputHeight = Math.round(outputWidth / aspectRatio)

    canvas.width = outputWidth
    canvas.height = outputHeight

    const img = new Image()
    img.onload = async () => {
      const fitScale = cardPhotoBaseScale.value > 0
        ? cardPhotoBaseScale.value
        : Math.max(containerWidth / img.width, containerHeight / img.height)
      const effectiveScale = fitScale * cardPhotoZoom.value

      // Dibujar la imagen con zoom y pan aplicados
      const scaledWidth = img.width * effectiveScale
      const scaledHeight = img.height * effectiveScale
      const x = (containerWidth - scaledWidth) / 2 + cardPhotoPanX.value
      const y = (containerHeight - scaledHeight) / 2 + cardPhotoPanY.value

      // Escalar para el tamaño final
      const scaleX = outputWidth / containerWidth
      const scaleY = outputHeight / containerHeight
      ctx.drawImage(img, x * scaleX, y * scaleY, scaledWidth * scaleX, scaledHeight * scaleY)

      // Convertir a blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            cardPhotoError.value = 'No se pudo procesar la imagen'
            cardPhotoProcessing.value = false
            return
          }

          const processedFile = new File(
            [blob],
            `card-photo-${Date.now()}.jpg`,
            { type: 'image/jpeg' }
          )

          cardPhotoFile.value = processedFile
          cardPhotoPreview.value = URL.createObjectURL(blob)
          cardPhotoEditorActive.value = false
          cardPhotoRawPreview.value = ''
          cardPhotoProcessing.value = false
          errors.value.cardPhoto = ''
        },
        'image/jpeg',
        0.92
      )
    }
    img.onerror = () => {
      cardPhotoError.value = 'Error al procesar la imagen'
      cardPhotoProcessing.value = false
    }
    img.src = cardPhotoRawPreview.value
  } catch (error) {
    cardPhotoError.value = error?.message || 'No se pudo procesar la imagen'
    cardPhotoProcessing.value = false
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
  if (isAlreadyAffiliated.value) {
    affiliationNotice.value = lt('Ya tienes una afiliación activa. Te llevamos a tu carné.', 'Ja tens una afiliació activa. Et portem al teu carnet.', 'Dagoeneko afiliazio aktiboa duzu. Zure karnetera eramango zaitugu.', 'Xa tes unha afiliación activa. Levámoste ao teu carné.')
    navigateTo('/carnet?notice=already-affiliated')
    return
  }

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
  if (isAlreadyAffiliated.value) {
    affiliationNotice.value = lt('Ya tienes una afiliación activa. Te llevamos a tu carné.', 'Ja tens una afiliació activa. Et portem al teu carnet.', 'Dagoeneko afiliazio aktiboa duzu. Zure karnetera eramango zaitugu.', 'Xa tes unha afiliación activa. Levámoste ao teu carné.')
    navigateTo('/carnet?notice=already-affiliated')
    return
  }

  if (!formData.acceptTerms) {
    paymentStatus.value = 'error'
    paymentError.value = lt('Debes aceptar los términos y condiciones.', 'Has d\'acceptar els termes i condicions.', 'Baldintzak eta terminoak onartu behar dituzu.', 'Debes aceptar os termos e condicións.')
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
.affiliation-notice {
  margin-bottom: 16px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(245, 216, 182, 0.28);
  background: rgba(245, 216, 182, 0.12);
  color: #f5d8b6;
  font-size: 0.92rem;
}

.form-group input.locked {
  background: rgba(0, 0, 0, 0.2);
  cursor: not-allowed;
}

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

/* Photo Editor Styles */
.photo-preview-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.photo-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  overflow: hidden;
}

.photo-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.photo-img {
  max-width: 100%;
  max-height: 350px;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
}

.photo-placeholder {
  color: rgba(234, 223, 224, 0.5);
  font-size: 1rem;
}

.photo-input-label {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5d8b6, #e8c99c);
  border: none;
  border-radius: 12px;
  padding: 14px 20px;
  color: #5e2c2c;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 8px;
  min-height: 48px;
}

.photo-input-label:hover {
  background: linear-gradient(135deg, #f7e0c7, #ead3ad);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.photo-input-label input {
  display: none;
}

.photo-input-label:has(input:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

.photo-editor-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 14px;
}

.editor-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.editor-workspace {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: start;
}

@media (min-width: 1080px) {
  .editor-workspace {
    grid-template-columns: minmax(420px, 1fr) 320px;
  }
}

.crop-area {
  position: relative;
  width: 100%;
  aspect-ratio: 157 / 189;
  max-width: 340px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(245, 216, 182, 0.5);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
}

.editable-img {
  width: auto;
  height: auto;
  max-width: none;
  max-height: none;
  display: block;
  user-select: none;
  cursor: grab;
  transition: cursor 0.2s;
}

.editable-img:active {
  cursor: grabbing;
}

.mouse-help {
  margin: 0;
  text-align: left;
  color: rgba(234, 223, 224, 0.9);
  font-size: 0.88rem;
  line-height: 1.35;
}

.editor-side-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 14px;
}

.btn-reset-adjust {
  width: 100%;
  border: 1px solid rgba(245, 216, 182, 0.35);
  background: rgba(245, 216, 182, 0.08);
  color: #f5d8b6;
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn-reset-adjust:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.editor-controls {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.zoom-control,
.pan-control {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
  padding: 14px 16px;
  border-radius: 12px;
  flex-wrap: wrap;
}

.control-label {
  color: #eadfe0;
  font-weight: 700;
  min-width: 50px;
  font-size: 0.95rem;
}

.zoom-slider {
  flex: 1;
  min-width: 150px;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.zoom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5d8b6, #e8c99c);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s;
}

.zoom-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.zoom-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5d8b6, #e8c99c);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s;
}

.zoom-slider::-moz-range-thumb:hover {
  transform: scale(1.15);
}

.zoom-value {
  color: #f5d8b6;
  font-weight: 700;
  min-width: 55px;
  text-align: right;
  font-size: 0.95rem;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-cancel,
.btn-confirm {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
  font-size: 0.95rem;
}

.btn-cancel {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f4ecec;
}

.btn-cancel:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.35);
}

.btn-confirm {
  background: linear-gradient(135deg, #f5d8b6, #e8c99c);
  color: #5e2c2c;
}

.btn-confirm:hover:not(:disabled) {
  background: linear-gradient(135deg, #f7e0c7, #ead3ad);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.btn-cancel:disabled,
.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.msg {
  margin: 0;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 0.9rem;
}

.msg.error {
  background: rgba(255, 120, 120, 0.18);
  border: 1px solid rgba(255, 120, 120, 0.35);
  color: #ffd0d0;
}
</style>
