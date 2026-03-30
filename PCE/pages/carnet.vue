<template>
  <main class="carnet-page container">
    <section class="card">
      <div class="section-head">
        <h1>{{ t('nav.carnet') || 'Mi Carné de Socio' }}</h1>
      </div>

      <ClientOnly>
        <div v-if="user" class="carnet-content">
          <div class="carnet-top">
            <div class="carnet-preview">
              <h2>{{ lt('Previsualización del carné', 'Previsualització del carnet', 'Karnetaren aurrebista', 'Previsualización do carné') }}</h2>
              <div class="preview-box">
                <p><strong>{{ lt('Nombre:', 'Nom:', 'Izena:', 'Nome:') }}</strong> {{ user.full_name }}</p>
                <p><strong>NIF:</strong> {{ userNif }}</p>
                <p><strong>{{ lt('Nº de socio:', 'Núm. de soci:', 'Bazkide zk.:', 'Nº de socio:') }}</strong> {{ userNumberId }}</p>
                <p><strong>Email:</strong> {{ user.email }}</p>
                <p><strong>{{ lt('Válido desde:', 'Vàlid des de:', 'Baliozkoa noiztik:', 'Válido desde:') }}</strong> {{ affiliationDate }}</p>
                <p><strong>{{ lt('Renovación:', 'Renovació:', 'Berritze-data:', 'Renovación:') }}</strong> {{ renovationDate }}</p>
                <p><strong>{{ lt('Caducidad:', 'Caducitat:', 'Iraungitzea:', 'Caducidade:') }}</strong> {{ expiryCountdownText }}</p>
              </div>
            </div>

            <div class="carnet-visual">
              <h2>{{ lt('Vista del carné', 'Vista del carnet', 'Karnetaren ikuspegia', 'Vista do carné') }}</h2>
              <div class="carnet-mockup">
                <img class="card-template" src="/images/carnesocio.png" :alt="lt('Plantilla del carné de socio', 'Plantilla del carnet de soci', 'Bazkide txartelaren txantiloia', 'Plantilla do carné de socio')" />

                <div class="card-field card-name">{{ (user.full_name || '').toUpperCase() }}</div>
                <div class="card-field card-nif">{{ userNif }}</div>
                <div class="card-field card-number">{{ userNumberId }}</div>
                <div class="card-field card-alta">{{ affiliationDate }}</div>
                <div class="card-field card-valid">{{ renovationDate }}</div>
                <img v-if="affiliationPhotoUrl" :src="affiliationPhotoUrl" :alt="lt('Foto de socio', 'Foto de soci', 'Bazkidearen argazkia', 'Foto de socio')" class="card-photo" />
                <div v-else class="card-avatar">{{ (user.full_name || 'U').trim().charAt(0).toUpperCase() }}</div>
              </div>
            </div>
          </div>

          <div class="carnet-actions">
            <button 
              @click="downloadCarnet" 
              :disabled="isDownloading"
              class="btn btn-primary"
            >
              <span v-if="!isDownloading">
                {{ lt('Descargar carné (PNG)', 'Descarregar carnet (PNG)', 'Karneta deskargatu (PNG)', 'Descargar carné (PNG)') }}
              </span>
              <span v-else>
                {{ lt('Generando...', 'Generant...', 'Sortzen...', 'Xerando...') }}
              </span>
            </button>
            <p class="helper-text">{{ lt('El carné es un documento digital que puedes imprimir o guardar en tu dispositivo.', 'El carnet és un document digital que pots imprimir o desar al teu dispositiu.', 'Karneta dokumentu digitala da, inprimatu edo zure gailuan gorde dezakezu.', 'O carné é un documento dixital que podes imprimir ou gardar no teu dispositivo.') }}</p>
          </div>

          <div class="carnet-physical">
            <template v-if="!hasPhysicalOrder">
              <h3>{{ lt('¿Prefieres una versión física?', 'Prefereixes una versió física?', 'Nahiago duzu bertsio fisikoa?', 'Prefires unha versión física?') }}</h3>
              <p class="physical-description">{{ lt('Recibe tu carné impreso en tarjeta de plástico profesional por solo ', 'Rep el teu carnet imprès en targeta de plàstic professional per només ', 'Jaso zure karneta plastikozko txartel profesionalean soilik ', 'Recibe o teu carné impreso en tarxeta de plástico profesional por só ') }}<strong>5€</strong>. {{ lt('Envío incluido a toda España.', 'Enviament inclòs a tot Espanya.', 'Bidalketa Espainia osora barne.', 'Envío incluído a toda España.') }}</p>
            </template>

            <template v-else>
              <h3>{{ lt('Renovación de carné físico', 'Renovació de carnet físic', 'Karnet fisikoaren berritzea', 'Renovación de carné físico') }}</h3>
              <p class="physical-description">{{ lt('Ya tienes un carné físico solicitado. Cuando quieras mantenerlo al día, puedes tramitar la ', 'Ja tens un carnet físic sol·licitat. Quan vulguis mantenir-lo al dia, pots tramitar la ', 'Dagoeneko karnet fisiko bat eskatuta duzu. Eguneratuta mantentzeko, ', 'Xa tes un carné físico solicitado. Cando queiras mantelo ao día, podes tramitar a ') }}<strong>{{ lt('renovación por 5€', 'renovació per 5€', 'berritzea 5€-ren truke', 'renovación por 5€') }}</strong>.</p>
              <p v-if="lastPhysicalOrderDate" class="helper-text">{{ lt('Último pedido registrado:', 'Última comanda registrada:', 'Azken eskaera erregistratua:', 'Último pedido rexistrado:') }} {{ lastPhysicalOrderDate }}</p>
            </template>

            <div v-if="!showPhysicalForm" class="physical-cta">
              <button @click="startPhysicalForm(hasPhysicalOrder)" class="btn btn-secondary">
                {{ hasPhysicalOrder
                  ? lt('Renovar Carné Físico (5€)', 'Renovar carnet físic (5€)', 'Karnet fisikoa berritu (5€)', 'Renovar carné físico (5€)')
                  : lt('Pedir Carné Físico (5€)', 'Demanar carnet físic (5€)', 'Karnet fisikoa eskatu (5€)', 'Pedir carné físico (5€)') }}
              </button>
            </div>

            <div v-else class="physical-form-container">
              <form @submit.prevent="submitPhysicalOrder" class="physical-form">
                <div class="form-group">
                  <label>{{ lt('Nombre completo', 'Nom complet', 'Izen-abizenak', 'Nome completo') }} *</label>
                  <input v-model="physicalOrderForm.fullName" type="text" required />
                </div>

                <div class="form-group">
                  <label>Email *</label>
                  <input v-model="physicalOrderForm.email" type="email" required />
                </div>

                <div class="form-group">
                  <label>{{ lt('Teléfono', 'Telèfon', 'Telefonoa', 'Teléfono') }}</label>
                  <input v-model="physicalOrderForm.phone" type="tel" />
                </div>

                <div class="form-group">
                  <label>{{ lt('Dirección', 'Adreça', 'Helbidea', 'Enderezo') }} *</label>
                  <input v-model="physicalOrderForm.address" type="text" required :placeholder="lt('Calle, número, piso...', 'Carrer, número, pis...', 'Kalea, zenbakia, solairua...', 'Rúa, número, piso...')" />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>{{ lt('Código postal', 'Codi postal', 'Posta kodea', 'Código postal') }} *</label>
                    <input v-model="physicalOrderForm.postalCode" type="text" required />
                  </div>
                  <div class="form-group">
                    <label>{{ lt('Ciudad', 'Ciutat', 'Hiria', 'Cidade') }} *</label>
                    <input v-model="physicalOrderForm.city" type="text" required />
                  </div>
                </div>

                <div class="form-group">
                  <label>{{ lt('País', 'País', 'Herrialdea', 'País') }} *</label>
                  <input v-model="physicalOrderForm.country" type="text" required />
                </div>

                <div class="form-group">
                  <label>NIF/DNI *</label>
                  <input v-model="physicalOrderForm.nif" type="text" required />
                </div>

                <div class="stripe-container">
                  <label class="input-label">{{ lt('DATOS DE LA TARJETA', 'DADES DE LA TARGETA', 'TXARTELAREN DATUAK', 'DATOS DA TARXETA') }} *</label>
                  <StripeCard ref="stripeCardRef" @ready="stripeReady = true" @change="handleCardChange" />
                </div>

                <div v-if="physicalOrderError" class="error-message">
                  {{ physicalOrderError }}
                </div>

                <transition name="shake">
                  <div v-if="paymentNotice" :class="['payment-alert', paymentStatus]">
                    <div class="alert-content">
                      <strong>
                        {{ 
                          paymentStatus === 'success' ? lt('PAGO ACEPTADO', 'PAGAMENT ACCEPTAT', 'ORDAINKETA ONARTUA', 'PAGO ACEPTADO') : 
                          paymentStatus === 'processing' ? lt('PROCESANDO PAGO', 'PROCESSANT PAGAMENT', 'ORDAINKETA PROZESATZEN', 'PROCESANDO PAGO') : 'ERROR'
                        }}
                      </strong>
                      <p>{{ paymentNotice }}</p>
                    </div>
                  </div>
                </transition>

                <div class="payment-info">
                  <p><strong>{{ lt('Total:', 'Total:', 'Guztira:', 'Total:') }}</strong> 5,00€</p>
                  <p style="font-size: 0.85rem; color: #d9c7c8;">{{ lt('Se abrirá una pasarela segura de Stripe para completar el pago.', 'S obrirà una passarel·la segura de Stripe per completar el pagament.', 'Ordainketa osatzeko Stripe pasabide seguru bat irekiko da.', 'Abrirase unha pasarela segura de Stripe para completar o pago.') }}</p>
                </div>

                <div class="form-actions">
                  <button type="submit" :disabled="isProcessingPhysical" class="btn btn-primary">
                    <span v-if="!isProcessingPhysical">
                      {{ isRenewalOrder
                        ? lt('Pagar y Renovar (5€)', 'Pagar i renovar (5€)', 'Ordaindu eta berritu (5€)', 'Pagar e renovar (5€)')
                        : lt('Pagar y Pedir (5€)', 'Pagar i demanar (5€)', 'Ordaindu eta eskatu (5€)', 'Pagar e pedir (5€)') }}
                    </span>
                    <span v-else>
                      {{ lt('Procesando pago...', 'Processant pagament...', 'Ordainketa prozesatzen...', 'Procesando pago...') }}
                    </span>
                  </button>
                  <button type="button" @click="closePhysicalForm" class="btn btn-cancel">
                    {{ lt('Cancelar', 'Cancel·lar', 'Utzi', 'Cancelar') }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="carnet-info">
            <h3>{{ lt('Información sobre tu carné', 'Informació sobre el teu carnet', 'Zure karnetari buruzko informazioa', 'Información sobre o teu carné') }}</h3>
            <ul>
              <li>{{ lt('El carné contiene un código QR con tus datos de socio', 'El carnet conté un codi QR amb les teves dades de soci', 'Karnetak zure bazkide datuekin QR kode bat dauka', 'O carné contén un código QR cos teus datos de socio') }}</li>
              <li>{{ lt('Puedes imprimirlo en papel o presentarlo digitalmente', 'Pots imprimir-lo en paper o presentar-lo digitalment', 'Paperean inprimatu edo digitalki aurkeztu dezakezu', 'Podes imprimilo en papel ou presentalo dixitalmente') }}</li>
              <li>{{ lt('Es válido por periodos de 5 años y se renueva automáticamente por quinquenios', 'És vàlid per períodes de 5 anys i es renova automàticament per quinquennis', '5 urteko aldietan balio du eta bosturtekoetan automatikoki berritzen da', 'É válido por períodos de 5 anos e renóvase automaticamente por quinquenios') }}</li>
              <li>{{ lt('Descárgalo todas las veces que necesites', 'Descarrega l tantes vegades com necessitis', 'Deskargatu behar duzun aldi guztietan', 'Descárgao todas as veces que necesites') }}</li>
            </ul>
          </div>
        </div>

        <div v-else class="auth-required">
          <p>{{ lt('Para descargar tu carné necesitas estar registrado.', 'Per descarregar el teu carnet necessites estar registrat.', 'Zure karne deskargatzeko erregistratuta egon behar dituzu.', 'Para descargar o teu carnet necesitas estar rexistrado.') }}</p>
          <NuxtLink to="/login" class="btn btn-primary">{{ t('auth.login') }}</NuxtLink>
        </div>
      </ClientOnly>
    </section>
  </main>
</template>

<script setup>
definePageMeta({
  middleware: ['afiliado']
})

import StripeCard from '@/components/StripeCard.vue'

const { user, checkAuth } = useAuth()
const { t, locale } = useI18n()
const isDownloading = ref(false)
const showPhysicalForm = ref(false)
const isProcessingPhysical = ref(false)
const physicalOrderError = ref('')
const paymentNotice = ref('')
const paymentStatus = ref('error')
const stripeReady = ref(false)
const cardComplete = ref(false)
const stripeCardRef = ref(null)
const hasPhysicalOrder = ref(false)
const lastPhysicalOrderDate = ref('')
const isRenewalOrder = ref(false)
const affiliationPhotoUrl = ref('')
const nowTick = ref(Date.now())
let expiryTimer

const lt = (es, ca, eu, gl) => {
  if (locale.value === 'ca') return ca
  if (locale.value === 'eu') return eu
  if (locale.value === 'gl') return gl
  return es
}

const formatDate = (value) => new Date(value).toLocaleDateString('es-ES')

const userCreatedAt = computed(() => {
  const raw = user.value?.created_at
  if (!raw) {
    return new Date()
  }

  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
})

// DNI real del usuario registrado
const userNif = computed(() => {
  return String(user.value?.dni || '').toUpperCase().trim()
})

// Número de socio basado en id de usuario para evitar valor fijo
const userNumberId = computed(() => {
  const id = Number(user.value?.id || 0)
  return id > 0 ? `SOC${String(id).padStart(6, '0')}` : 'SOC000001'
})

// Vigencia en ciclos de 5 años (renovación automática cada 5 años)
const activeCycle = computed(() => {
  const now = new Date()
  let cycleStart = new Date(userCreatedAt.value)
  let cycleEnd = new Date(userCreatedAt.value)
  cycleEnd.setFullYear(cycleEnd.getFullYear() + 5)

  while (now >= cycleEnd) {
    cycleStart = new Date(cycleEnd)
    cycleEnd.setFullYear(cycleEnd.getFullYear() + 5)
  }

  return { cycleStart, cycleEnd }
})

const affiliationDate = computed(() => formatDate(activeCycle.value.cycleStart))
const renovationDate = computed(() => formatDate(activeCycle.value.cycleEnd))
const daysUntilExpiry = computed(() => {
  const today = new Date(nowTick.value)
  today.setHours(0, 0, 0, 0)

  const expiryDay = new Date(activeCycle.value.cycleEnd)
  expiryDay.setHours(0, 0, 0, 0)

  const diff = expiryDay.getTime() - today.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

const expiryCountdownText = computed(() => {
  const days = daysUntilExpiry.value
  if (days <= 0) return lt('Caduca hoy', 'Caduca avui', 'Gaur iraungitzen da', 'Caduca hoxe')
  if (days === 1) return lt('Queda 1 día', 'Queda 1 dia', 'Egun 1 falta da', 'Queda 1 día')
  return lt(`Quedan ${days} días`, `Queden ${days} dies`, `${days} egun falta dira`, `Quedan ${days} días`)
})

const physicalOrderForm = ref({
  fullName: user.value?.full_name || '',
  email: user.value?.email || '',
  phone: '',
  address: '',
  postalCode: '',
  city: '',
  country: 'España',
  nif: userNif.value === 'SIN DNI' ? '' : userNif.value
})

watchEffect(() => {
  if (!user.value) {
    return
  }

  if (!physicalOrderForm.value.fullName) {
    physicalOrderForm.value.fullName = user.value.full_name || ''
  }

  if (!physicalOrderForm.value.email) {
    physicalOrderForm.value.email = user.value.email || ''
  }

  if (!physicalOrderForm.value.nif && userNif.value !== 'SIN DNI') {
    physicalOrderForm.value.nif = userNif.value
  }
})

const startPhysicalForm = (renewal = false) => {
  showPhysicalForm.value = true
  isRenewalOrder.value = renewal
  physicalOrderError.value = ''
  paymentNotice.value = ''
}

const closePhysicalForm = () => {
  showPhysicalForm.value = false
  isRenewalOrder.value = false
  physicalOrderError.value = ''
  paymentNotice.value = ''
}

const checkExistingPhysicalOrder = async () => {
  if (!user.value) return

  try {
    const response = await $fetch('/api/carnet/my-order')
    hasPhysicalOrder.value = Boolean(response?.hasOrder)
    lastPhysicalOrderDate.value = response?.lastOrder?.createdAt
      ? formatDate(response.lastOrder.createdAt)
      : ''
  } catch (error) {
    console.error('No se pudo comprobar el estado del carné físico:', error)
  }
}

const loadAffiliationPhoto = async () => {
  if (!user.value) return

  try {
    const response = await $fetch('/api/afiliacion/photo')
    affiliationPhotoUrl.value = String(response?.photoUrl || '')
  } catch (error) {
    console.error('No se pudo cargar la foto del afiliado:', error)
    affiliationPhotoUrl.value = ''
  }
}

const handleCardChange = (complete) => {
  cardComplete.value = complete
}

const loadFabric = async () => {
  if (!process.client) {
    throw new Error('Fabric solo disponible en cliente')
  }

  if (window.fabric) {
    return window.fabric
  }

  await new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/fabric@5.3.0/dist/fabric.min.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('No se pudo cargar Fabric.js'))
    document.head.appendChild(script)
  })

  if (!window.fabric) {
    throw new Error('Fabric.js no disponible tras la carga')
  }

  return window.fabric
}

const downloadCarnet = async () => {
  if (!user.value) return

  try {
    isDownloading.value = true

    if (!userNif.value) {
      await checkAuth()
    }

    if (!userNif.value) {
      alert(lt('No se ha encontrado DNI en tu cuenta. Inicia sesión de nuevo o contacta con administración para revisar tu registro.', 'No s ha trobat DNI al teu compte. Inicia sessió de nou o contacta amb administració per revisar el teu registre.', 'Ez da NANik aurkitu zure kontuan. Hasi saioa berriro edo jarri administrazioarekin harremanetan zure erregistroa berrikusteko.', 'Non se atopou DNI na túa conta. Inicia sesión de novo ou contacta con administración para revisar o teu rexistro.'))
      return
    }

    if (!process.client) {
      return
    }

    const fabric = await loadFabric()
    const template = await new Promise((resolve, reject) => {
      fabric.Image.fromURL('/images/carnesocio.png', (img) => {
        if (!img) {
          reject(new Error('No se pudo cargar la plantilla del carné'))
          return
        }
        resolve(img)
      }, {
        crossOrigin: 'anonymous'
      })
    })

    const width = template.width || 1408
    const height = template.height || 768
    const el = document.createElement('canvas')
    const cardCanvas = new fabric.Canvas(el, {
      width,
      height,
      selection: false
    })

    template.set({
      left: 0,
      top: 0,
      selectable: false,
      evented: false
    })

    cardCanvas.add(template)

    const fullName = (user.value.full_name || 'SOCIO PCE').toUpperCase()
    const initial = fullName.trim().charAt(0) || 'U'

    // Coordenadas ajustadas a la plantilla carnesocio.png (composición 1408x768)
    const front = {
      name: { left: width * 0.239, top: height * 0.478, w: width * 0.233, size: Math.max(12, width * 0.0122) },
      nif: { left: width * 0.235, top: height * 0.550, w: width * 0.124, size: Math.max(11, width * 0.0114) },
      number: { left: width * 0.362, top: height * 0.550, w: width * 0.118, size: Math.max(11, width * 0.0114) },
      alta: { left: width * 0.239, top: height * 0.622, w: width * 0.128, size: Math.max(11, width * 0.0112) },
      valid: { left: width * 0.366, top: height * 0.622, w: width * 0.118, size: Math.max(11, width * 0.0112) },
      photo: { left: width * 0.083, top: height * 0.519, w: width * 0.112, h: height * 0.246 }
    }

    const photoCenterX = front.photo.left + front.photo.w / 2
    const photoCenterY = front.photo.top + front.photo.h / 2

    let hasDrawnRealPhoto = false

    if (affiliationPhotoUrl.value) {
      try {
        const photoImage = await new Promise((resolve, reject) => {
          fabric.Image.fromURL(affiliationPhotoUrl.value, (img) => {
            if (!img) {
              reject(new Error('No se pudo cargar la foto del afiliado'))
              return
            }
            resolve(img)
          }, {
            crossOrigin: 'anonymous'
          })
        })

        const scale = Math.max(front.photo.w / photoImage.width, front.photo.h / photoImage.height)
        const scaledWidth = photoImage.width * scale
        const scaledHeight = photoImage.height * scale

        photoImage.set({
          left: front.photo.left - (scaledWidth - front.photo.w) / 2,
          top: front.photo.top - (scaledHeight - front.photo.h) / 2,
          selectable: false,
          evented: false,
          scaleX: scale,
          scaleY: scale,
          clipPath: new fabric.Rect({
            left: front.photo.left,
            top: front.photo.top,
            width: front.photo.w,
            height: front.photo.h,
            absolutePositioned: true
          })
        })

        cardCanvas.add(photoImage)
        hasDrawnRealPhoto = true
      } catch (photoError) {
        console.warn('No se pudo aplicar la foto en el carné, se usa inicial:', photoError)
      }
    }

    if (!hasDrawnRealPhoto) {
      cardCanvas.add(new fabric.Circle({
        left: photoCenterX,
        top: photoCenterY,
        radius: Math.min(front.photo.w, front.photo.h) * 0.24,
        fill: 'rgba(114, 50, 51, 0.14)',
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      }))

      cardCanvas.add(new fabric.Text(initial, {
        left: photoCenterX,
        top: photoCenterY,
        originX: 'center',
        originY: 'center',
        fontSize: Math.max(38, Math.min(front.photo.w, front.photo.h) * 0.42),
        fontWeight: '700',
        fill: '#723233',
        fontFamily: 'Outfit',
        selectable: false,
        evented: false
      }))
    }

    cardCanvas.add(new fabric.Textbox(fullName, {
      left: front.name.left,
      top: front.name.top,
      width: front.name.w,
      fontSize: front.name.size,
      fontWeight: '500',
      fill: '#1f1f1f',
      fontFamily: 'Outfit',
      selectable: false,
      evented: false
    }))

    cardCanvas.add(new fabric.Textbox(userNif.value.toUpperCase(), {
      left: front.nif.left,
      top: front.nif.top,
      width: front.nif.w,
      fontSize: front.nif.size,
      fill: '#1f1f1f',
      fontFamily: 'Outfit',
      selectable: false,
      evented: false
    }))

    cardCanvas.add(new fabric.Textbox(userNumberId.value, {
      left: front.number.left,
      top: front.number.top,
      width: front.number.w,
      fontSize: front.number.size,
      fill: '#1f1f1f',
      fontFamily: 'Outfit',
      selectable: false,
      evented: false
    }))

    cardCanvas.add(new fabric.Textbox(affiliationDate.value, {
      left: front.alta.left,
      top: front.alta.top,
      width: front.alta.w,
      fontSize: front.alta.size,
      fill: '#1f1f1f',
      fontFamily: 'Outfit',
      selectable: false,
      evented: false
    }))

    cardCanvas.add(new fabric.Textbox(renovationDate.value, {
      left: front.valid.left,
      top: front.valid.top,
      width: front.valid.w,
      fontSize: front.valid.size,
      fill: '#1f1f1f',
      fontFamily: 'Outfit',
      selectable: false,
      evented: false
    }))

    cardCanvas.renderAll()

    const dataUrl = cardCanvas.toDataURL({
      format: 'png',
      multiplier: 2
    })

    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `carnet_socio_${userNumberId.value}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    cardCanvas.dispose()

  } catch (error) {
    console.error('Error descargando carné:', error)
    alert(lt('Error al descargar el carné. Intenta de nuevo.', 'Error en descarregar el carnet. Torna-ho a provar.', 'Errorea karneta deskargatzean. Saiatu berriro.', 'Erro ao descargar o carné. Inténtao de novo.'))
  } finally {
    isDownloading.value = false
  }
}

onMounted(async () => {
  expiryTimer = setInterval(() => {
    nowTick.value = Date.now()
  }, 60 * 60 * 1000)

  if (user.value && !user.value.dni) {
    await checkAuth()
  }

  await checkExistingPhysicalOrder()
  await loadAffiliationPhoto()
})

onBeforeUnmount(() => {
  if (expiryTimer) {
    clearInterval(expiryTimer)
  }
})

const submitPhysicalOrder = async () => {
  if (!user.value) return

  physicalOrderError.value = ''

  // Validar datos
  if (!physicalOrderForm.value.fullName || !physicalOrderForm.value.email || 
      !physicalOrderForm.value.address || !physicalOrderForm.value.city || 
      !physicalOrderForm.value.nif) {
    physicalOrderError.value = lt('Por favor completa todos los campos requeridos.', 'Si us plau, completa tots els camps requerits.', 'Mesedez, bete beharrezko eremu guztiak.', 'Por favor completa todos os campos requiridos.')
    return
  }

  if (!stripeReady.value || !cardComplete.value) {
    physicalOrderError.value = lt('Completa correctamente los datos de la tarjeta.', 'Completa correctament les dades de la targeta.', 'Bete txartelaren datuak behar bezala.', 'Completa correctamente os datos da tarxeta.')
    return
  }

  try {
    isProcessingPhysical.value = true
    paymentStatus.value = 'processing'
    paymentNotice.value = lt('Verificando datos de tarjeta...', 'Verificant dades de targeta...', 'Txartel datuak egiaztatzen...', 'Verificando datos da tarxeta...')

    // 1. Crear payment intent en servidor
    const paymentIntentResponse = await $fetch('/api/carnet/payment-intent', {
      method: 'POST',
      body: {
        amount: 500, // 5€ en centavos
        email: physicalOrderForm.value.email
      }
    })

    if (!paymentIntentResponse?.clientSecret) {
      throw new Error('No se recibió respuesta válida del servidor de pagos')
    }

    const paymentIntentId = paymentIntentResponse.id
    const isSimulated = Boolean(paymentIntentResponse.simulated)

    // 2. Confirmar pago con Stripe (igual que afiliación), salvo modo simulado
    if (!isSimulated) {
      const { stripe: stripeInstance, initStripe } = useStripe()
      await initStripe()

      if (!stripeInstance.value) {
        throw new Error('No se pudo inicializar Stripe')
      }

      const { error } = await stripeInstance.value.confirmCardPayment(paymentIntentResponse.clientSecret, {
        payment_method: {
          card: stripeCardRef.value.card,
          billing_details: {
            name: physicalOrderForm.value.fullName,
            email: physicalOrderForm.value.email
          }
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      paymentStatus.value = 'success'
      paymentNotice.value = lt('Pago aceptado correctamente.', 'Pagament acceptat correctament.', 'Ordainketa ondo onartua.', 'Pago aceptado correctamente.')
    } else {
      paymentStatus.value = 'success'
      paymentNotice.value = lt('Pago aceptado en modo de simulación (entorno de pruebas).', 'Pagament acceptat en mode simulació (entorn de proves).', 'Ordainketa simulazio moduan onartua (proba ingurunea).', 'Pago aceptado en modo de simulación (contorno de probas).')
    }

    // 3. Guardar pedido
    await $fetch('/api/carnet/order', {
      method: 'POST',
      body: {
        fullName: physicalOrderForm.value.fullName,
        email: physicalOrderForm.value.email,
        phone: physicalOrderForm.value.phone,
        address: physicalOrderForm.value.address,
        city: physicalOrderForm.value.city,
        postalCode: physicalOrderForm.value.postalCode,
        country: physicalOrderForm.value.country,
        nif: physicalOrderForm.value.nif,
        numeroSocio: userNumberId.value,
        paymentIntentId,
        status: isSimulated ? 'simulated_paid' : 'completed',
        orderType: isRenewalOrder.value ? 'renewal' : 'initial'
      }
    })

    paymentStatus.value = 'success'
    paymentNotice.value = isRenewalOrder.value
      ? lt('PAGO ACEPTADO. Tu renovación está confirmada y te llegará en unos 7 días.', 'PAGAMENT ACCEPTAT. La teva renovació està confirmada i et arribarà en uns 7 dies.', 'ORDAINKETA ONARTUA. Zure berritzea baieztatuta dago eta 7 egun inguru barru iritsiko zaizu.', 'PAGO ACEPTADO. A túa renovación está confirmada e chegarache nuns 7 días.')
      : lt('PAGO ACEPTADO. Tu pedido está confirmado y te llegará en unos 7 días.', 'PAGAMENT ACCEPTAT. La teva comanda està confirmada i et arribarà en uns 7 dies.', 'ORDAINKETA ONARTUA. Zure eskaera baieztatuta dago eta 7 egun inguru barru iritsiko zaizu.', 'PAGO ACEPTADO. O teu pedido está confirmado e chegarache nuns 7 días.')
    hasPhysicalOrder.value = true
    closePhysicalForm()

  } catch (error) {
    console.error('Error en el proceso de pago:', error)
    const errMsg = error?.data?.message || error?.message || lt('Intenta de nuevo', 'Torna-ho a provar', 'Saiatu berriro', 'Inténtao de novo')
    physicalOrderError.value = lt('Error al procesar el pago:', 'Error en processar el pagament:', 'Errorea ordainketa prozesatzean:', 'Erro ao procesar o pago:') + ' ' + errMsg
    paymentStatus.value = 'error'
    paymentNotice.value = String(errMsg)
  } finally {
    isProcessingPhysical.value = false
  }
}

useHead(() => ({
  title: `Carné de Socio - PCE`,
  meta: [
    {
      name: 'description',
      content: 'Descarga tu carné digital de socio de Protección Civil Española'
    }
  ]
}))
</script>

<style scoped>
.carnet-page {
  padding: 48px 20px 70px;
  max-width: 1240px;
}

.card {
  background: rgba(94, 44, 44, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
}

.section-head h1 {
  margin: 0;
  color: #fff;
  font-family: 'Cinzel', serif;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
}

.carnet-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 24px;
}

.carnet-top {
  display: grid;
  grid-template-columns: minmax(300px, 0.8fr) minmax(460px, 1.2fr);
  gap: 20px;
  align-items: stretch;
}

.carnet-preview {
  background: rgba(0, 0, 0, 0.18);
  border-radius: 14px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.carnet-preview h2 {
  margin: 0 0 16px;
  color: #fff;
  font-size: 1.1rem;
}

.preview-box {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 16px;
  border-left: 3px solid #f5d8b6;
}

.preview-box p {
  margin: 8px 0;
  color: #e8d6d7;
  font-size: 0.95rem;
}

.preview-box strong {
  color: #f5d8b6;
  display: inline-block;
  min-width: 120px;
}

.carnet-visual {
  background: rgba(0, 0, 0, 0.18);
  border-radius: 14px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.carnet-visual h2 {
  margin: 0 0 16px;
  color: #fff;
  font-size: 1.1rem;
}

.carnet-mockup {
  position: relative;
  width: 100%;
  aspect-ratio: 1408 / 768;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.2);
}

.carnet-mockup .card-template {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-field {
  position: absolute;
  color: #1f1f1f;
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  line-height: 1.1;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.15);
}

.card-name {
  left: 23.9%;
  top: 47.8%;
  width: 23.3%;
  font-size: clamp(0.4rem, 0.88vw, 0.82rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-nif {
  left: 23.5%;
  top: 55%;
  width: 12.4%;
  font-size: clamp(0.38rem, 0.8vw, 0.74rem);
}

.card-number {
  left: 36.2%;
  top: 55%;
  width: 11.8%;
  font-size: clamp(0.38rem, 0.8vw, 0.74rem);
}

.card-alta {
  left: 23.9%;
  top: 62.2%;
  width: 12.8%;
  font-size: clamp(0.36rem, 0.76vw, 0.7rem);
}

.card-valid {
  left: 36.6%;
  top: 62.2%;
  width: 11.8%;
  font-size: clamp(0.36rem, 0.76vw, 0.7rem);
}

.card-avatar {
  position: absolute;
  left: 13.9%;
  top: 64.2%;
  transform: translate(-50%, -50%);
  width: 4.8%;
  aspect-ratio: 1;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(114, 50, 51, 0.15);
  color: #723233;
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: clamp(0.42rem, 0.9vw, 0.82rem);
}

.carnet-mockup .card-photo {
  position: absolute;
  left: 8.3%;
  top: 51.9%;
  width: 11.2%;
  height: 24.6%;
  object-fit: cover;
  object-position: center 28%;
  border: 1px solid rgba(114, 50, 51, 0.35);
  border-radius: 2px;
}

.carnet-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.btn {
  padding: 12px 32px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #f5d8b6, #e8c99c);
  color: #5e2c2c;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(245, 216, 182, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.helper-text {
  color: #d9c7c8;
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
}

.carnet-info {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 14px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.carnet-info h3 {
  margin: 0 0 14px;
  color: #f5d8b6;
  font-size: 1rem;
}

.carnet-info ul {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.carnet-info li {
  color: #e8d6d7;
  font-size: 0.9rem;
  margin: 8px 0;
  padding-left: 20px;
  position: relative;
}

.carnet-info li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #f5d8b6;
  font-weight: bold;
}

.auth-required {
  text-align: center;
  padding: 40px 20px;
}

.auth-required p {
  color: #e8d6d7;
  font-size: 1.1rem;
  margin-bottom: 24px;
}

.auth-required .btn {
  display: inline-block;
  background: linear-gradient(135deg, #f5d8b6, #e8c99c);
  color: #5e2c2c;
}

.carnet-physical {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 14px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 24px;
}

.carnet-physical h3 {
  margin: 0 0 8px;
  color: #f5d8b6;
  font-size: 1rem;
}

.physical-description {
  color: #e8d6d7;
  font-size: 0.95rem;
  margin: 0 0 16px;
  line-height: 1.5;
}

.physical-cta {
  display: flex;
  justify-content: center;
}

.btn-secondary {
  background: linear-gradient(135deg, #d9a580, #c89470);
  color: #fff;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(217, 165, 128, 0.3);
}

.btn-cancel {
  background: transparent;
  color: #f5d8b6;
  border: 1px solid #f5d8b6;
}

.btn-cancel:hover {
  background: rgba(245, 216, 182, 0.1);
}

.physical-form-container {
  margin-top: 16px;
}

.physical-form {
  display: grid;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #f5d8b6;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.form-group input {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  padding: 10px 12px;
  color: #fff;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #f5d8b6;
  background: rgba(0, 0, 0, 0.3);
}

.form-group input::placeholder {
  color: #a89b9c;
}

.stripe-container {
  margin-top: 4px;
}

.input-label {
  display: block;
  color: #f5d8b6;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.payment-info {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 12px;
  margin: 14px 0;
}

.payment-info p {
  color: #e8d6d7;
  font-size: 0.9rem;
  margin: 4px 0;
}

.error-message {
  background: rgba(255, 100, 100, 0.2);
  color: #ff6464;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  margin: 10px 0;
  border: 1px solid rgba(255, 100, 100, 0.3);
}

.payment-alert {
  margin: 10px 0;
  padding: 12px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.payment-alert.error {
  background: rgba(255, 107, 107, 0.12);
  border: 1px solid rgba(255, 107, 107, 0.35);
}

.payment-alert.processing {
  background: rgba(255, 215, 64, 0.14);
  border: 1px solid rgba(255, 215, 64, 0.35);
}

.payment-alert.success {
  background: rgba(46, 204, 113, 0.14);
  border: 1px solid rgba(46, 204, 113, 0.35);
}

.alert-icon {
  font-size: 1.15rem;
  line-height: 1;
}

.alert-content strong {
  display: block;
  color: #f5d8b6;
  font-size: 0.83rem;
  margin-bottom: 3px;
}

.alert-content p {
  margin: 0;
  color: #e8d6d7;
  font-size: 0.88rem;
}

.form-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 16px;
}

.form-actions .btn {
  padding: 10px 16px;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .carnet-top {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .carnet-page {
    max-width: 900px;
  }

  .carnet-top {
    grid-template-columns: 1fr;
  }
}
</style>
