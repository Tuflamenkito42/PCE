<template>
  <section class="identity-verification" :class="{ locked: isLocked }">
    <div v-if="isLocked" class="lock-overlay auth-lock">
      <p>{{ lt('Complete el paso anterior', 'Completa el pas anterior', 'Osatu aurreko pausoa', 'Completa o paso anterior') }}</p>
    </div>
    <div class="card-header">
      <h2>{{ lt('2. Verificación Biometría', '2. Verificació biomètrica', '2. Egiaztapen biometrikoa', '2. Verificación biométrica') }}</h2>
    </div>
    <div class="camera-module">
      <div class="video-wrapper">
        <video ref="videoRef" autoplay playsinline class="camera-video"></video>
        <canvas ref="canvasRef" style="display:none;"></canvas>
        <div class="camera-overlay">
          <div class="face-guide"></div>
        </div>
      </div>
      <div class="camera-controls">
        <button class="btn btn-camera" @click="capture('dni')">{{ lt('Capturar DNI', 'Capturar DNI', 'DNI harrapatu', 'Capturar DNI') }}</button>
        <button class="btn btn-camera" @click="capture('face')">{{ lt('Comprobar cara', 'Comprovar cara', 'Aurpegia egiaztatu', 'Comprobar cara') }}</button>
      </div>
    </div>
    <div class="form-group" style="margin-top: 1rem;">
      <label>{{ lt('Confirmación DNI / NIE', 'Confirmació DNI / NIE', 'DNI / NIE berrespena', 'Confirmación DNI / NIE') }}</label>
      <input v-model="dniInput" type="text" placeholder="12345678A" class="form-input" :class="{ 'error': dniError }" />
      <span v-if="dniError" class="error-msg">{{ dniError }}</span>
    </div>
    <div class="captured-previews">
      <div class="preview-box">
        <img v-if="dniImage" :src="dniImage" class="preview-img" />
        <span v-else>DNI</span>
      </div>
      <div class="preview-box">
        <img v-if="faceImage" :src="faceImage" class="preview-img" />
        <span v-else>{{ lt('Cara', 'Cara', 'Aurpegia', 'Cara') }}</span>
      </div>
    </div>
    <button 
      class="btn btn-verify-submit" 
      :class="{ active: isReady }" 
      :disabled="!isReady || isVerifying"
      @click="handleFinalLogin"
    >
      {{ isVerifying ? lt('Verificando identidad...', 'Verificant identitat...', 'Nortasuna egiaztatzen...', 'Verificando identidade...') : lt('Iniciar sesión', 'Iniciar sessió', 'Saioa hasi', 'Iniciar sesión') }}
    </button>
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

const props = defineProps({
  isLocked: Boolean,
  requiredDni: String
})

const emit = defineEmits(['verified'])

const dniInput = ref('')
const dniImage = ref(null)
const faceImage = ref(null)
const isVerifying = ref(false)
const dniError = ref('')

const videoRef = ref(null)
const canvasRef = ref(null)

const isReady = computed(() => {
  return dniImage.value && faceImage.value && dniInput.value.length >= 8
})

const initCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    if (videoRef.value) videoRef.value.srcObject = stream
  } catch (err) {
    console.error("Camera error:", err)
    alert(lt('Acceso a cámara denegado.', 'Accés a la càmera denegat.', 'Kamerarako sarbidea ukatuta.', 'Acceso á cámara denegado.'))
  }
}

const capture = (type) => {
  if (!videoRef.value || !canvasRef.value) return
  const video = videoRef.value
  const canvas = canvasRef.value
  const context = canvas.getContext('2d')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  context.drawImage(video, 0, 0, canvas.width, canvas.height)
  const dataUrl = canvas.toDataURL('image/png')
  if (type === 'dni') dniImage.value = dataUrl
  else faceImage.value = dataUrl
}

const handleFinalLogin = () => {
  dniError.value = ''
  
  // Clean DNI format (uppercase and no spaces/hyphens)
  const cleanInput = dniInput.value.trim().toUpperCase().replace(/[-\s]/g, '')
  const cleanRequired = (props.requiredDni || '').trim().toUpperCase().replace(/[-\s]/g, '')

  console.log('DEBUG DNI Check:', {
    inputId: dniInput.value,
    cleanInput,
    requiredDni: props.requiredDni,
    cleanRequired
  })

  if (cleanInput !== cleanRequired) {
    if (!cleanRequired) {
      console.error('System Error: requiredDni is empty')
      dniError.value = lt(
        'Error interno: No se ha podido verificar tu identidad. Reinicia el proceso.',
        'Error intern: No s ha pogut verificar la teva identitat. Reinicia el procés.',
        'Barne errorea: Ezin izan da zure nortasuna egiaztatu. Berrabiarazi prozesua.',
        'Erro interno: Non se puido verificar a túa identidade. Reinicia o proceso.'
      )
    } else {
      dniError.value = lt(
        'El DNI no coincide con el usuario registrado.',
        'El DNI no coincideix amb l usuari registrat.',
        'DNIa ez dator bat erregistratutako erabiltzailearekin.',
        'O DNI non coincide co usuario rexistrado.'
      )
    }
    return
  }

  isVerifying.value = true
  setTimeout(() => {
    emit('verified')
    isVerifying.value = false
  }, 2000)
}

// Initialize camera when unlocked
watch(() => props.isLocked, (locked) => {
  if (!locked) initCamera()
})
</script>

<style scoped>
.identity-verification {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.camera-module {
  background: rgba(0,0,0,0.2);
  padding: 15px;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.05);

  .video-wrapper {
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    aspect-ratio: 4/3;
    background: #000;

    .camera-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .camera-overlay {
      position: absolute;
      inset: 0;
      border: 2px dashed rgba(255,255,255,0.3);
      margin: 20px;
      border-radius: 10px;
      pointer-events: none;
    }
  }

  .camera-controls {
    display: flex;
    gap: 10px;
    margin-top: 15px;

    .btn-camera {
      flex: 1;
      background: #4a2222;
      color: #fff;
      padding: 10px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-family: var(--font-body);
      
      &:hover {
        background: #5e2c2c;
      }
    }
  }
}

.form-group {
  label {
    display: block;
    margin-bottom: 10px;
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 0.8rem;
    color: #fff;
    letter-spacing: 1px;
  }

  input {
    width: 100%;
    background-color: rgba(180, 167, 167, 0.9);
    border: none;
    padding: 15px 25px;
    border-radius: 4px;
    color: #000;
    font-size: 1rem;
    font-family: var(--font-body);

    &:focus {
      outline: none;
      background-color: #fff;
    }
  }
}

.captured-previews {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;

  .preview-box {
    aspect-ratio: 3/2;
    background: rgba(0,0,0,0.3);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.4);
    font-family: var(--font-body);
    font-size: 0.8rem;

    .preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.error-msg {
  color: #ff9999;
  font-size: 0.8rem;
  margin-top: 8px;
  font-weight: 700;
  display: block;
}

input.error {
  border: 2px solid #ff6b6b !important;
  background-color: rgba(255, 107, 107, 0.1) !important;
}
</style>
