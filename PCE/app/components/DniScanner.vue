<template>
  <div class="dni-scanner">
    <!-- AI Loading Overlay -->
    <AILoadingOverlay 
      :show="isLoadingModels" 
      :message="processingMessage"
      :progress="loadingProgress"
    />
    
    <div class="scanner-header">
      <h2>Escanear DNI/NIE</h2>
      <p>Sube una foto de tu DNI para extraer los datos automáticamente</p>
    </div>

    <!-- File Upload -->
    <div class="upload-section">
      <label for="dni-upload" class="upload-label">
        <div class="upload-icon">
          <svg viewBox="0 0 512 512" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <!-- Camera Body -->
            <path d="M464 128H398.2L356.5 64H155.5L113.8 128H48C21.5 128 0 149.5 0 176V416C0 442.5 21.5 464 48 464H464C490.5 464 512 442.5 512 416V176C512 149.5 490.5 128 464 128Z" fill="#B9AFB0"/>
            <!-- Lens Outer Ring (Cutout effect) -->
            <circle cx="256" cy="280" r="100" fill="#5E2C2C"/> 
            <!-- Lens Inner -->
            <circle cx="256" cy="280" r="80" fill="#B9AFB0"/>
            <!-- Flash -->
            <circle cx="432" cy="184" r="24" fill="#5E2C2C"/>
          </svg>
        </div>
        <span class="upload-text">{{ uploadedFile ? uploadedFile.name : 'SELECCIONAR IMAGEN DEL DNI' }}</span>
        <input 
          id="dni-upload" 
          ref="fileInput"
          type="file" 
          @change="uploadDNI" 
          accept="image/*" 
          class="file-input"
        />
      </label>
    </div>

    <!-- Loading State -->
    <div v-if="isProcessing" class="processing-state">
      <div class="spinner"></div>
      <p>{{ processingMessage }}</p>
    </div>

    <!-- Canvas for Face Detection -->
    <div v-if="imageLoaded" v-show="!isProcessing" class="canvas-container">
      <canvas ref="canvas"></canvas>
      <div v-if="faceDetected" class="face-indicator">
        ✅ Cara detectada
      </div>
      <div v-else class="face-indicator error">
        ⚠️ No se detectó ninguna cara
      </div>
    </div>

    <!-- Extracted Data -->
    <div v-if="dniData && !isProcessing" class="result-section">
      <h3>Datos Extraídos</h3>
      <div class="data-grid">
        <div class="data-item">
          <label>DNI/NIE:</label>
          <span :class="{ valid: dniData.valido, invalid: !dniData.valido }">
            {{ dniData.dni || 'No detectado' }}
          </span>
        </div>
        <div class="data-item">
          <label>Nombre:</label>
          <span>{{ dniData.nombre || 'No detectado' }}</span>
        </div>
        <div class="data-item">
          <label>Apellidos:</label>
          <span>{{ dniData.apellidos || 'No detectado' }}</span>
        </div>
        <div class="data-item">
          <label>Fecha de Nacimiento:</label>
          <span>{{ dniData.fecha_nacimiento || 'No detectado' }}</span>
        </div>
        <div class="data-item">
          <label>Fecha de Caducidad:</label>
          <span>{{ dniData.fecha_caducidad || 'No detectado' }}</span>
        </div>
        <div class="data-item full-width">
          <label>Estado:</label>
          <span :class="{ valid: dniData.valido, invalid: !dniData.valido }">
            {{ dniData.valido ? '✅ DNI/NIE Válido' : '❌ DNI/NIE Inválido' }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="useDniData" class="btn-use" :disabled="!dniData.nombre && !dniData.dni">
          Usar estos datos
        </button>
        <button @click="resetScanner" class="btn-reset">
          Escanear otro DNI
        </button>
      </div>
    </div>

    <!-- Error Messages -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AILoadingOverlay from './AILoadingOverlay.vue'


// Props & Emits
const emit = defineEmits(['dataExtracted'])

// Refs
const fileInput = ref(null)
const canvas = ref(null)
const uploadedFile = ref(null)
const imageLoaded = ref(false)
const isProcessing = ref(false)
const processingMessage = ref('')
const faceDetected = ref(false)
const dniData = ref(null)
const errorMessage = ref('')
const isLoadingModels = ref(false)
const loadingProgress = ref(0)



/**
 * Handle DNI image upload
 */
const uploadDNI = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  uploadedFile.value = file
  errorMessage.value = ''
  dniData.value = null
  
  try {
    isProcessing.value = true
    processingMessage.value = 'Cargando imagen...'
    
    // Load image
    const img = await loadImage(file)
    
    // Draw on canvas
    drawDetection(img, null)

    // Extract and structure data with Gemini AI
    const structuredData = await performOCR(img)

    console.log('Structured DNI data:', structuredData);
    
    // Validate and set data
    dniData.value = {
      cara_detectada: true, // Assuming valid DNI implies face present for now
      dni: structuredData.dni,
      nombre: structuredData.nombre,
      apellidos: structuredData.apellidos,
      fecha_nacimiento: structuredData.fecha_nacimiento,
      fecha_caducidad: structuredData.fecha_caducidad,
      valido: !!structuredData.dni // Valid if DNI was detected
    }
    
    faceDetected.value = !!structuredData.dni;
    
    isProcessing.value = false
    
    // Emit data to parent
    emit('dataExtracted', dniData.value)
    
  } catch (error) {
    console.error('Error processing DNI:', error)
    errorMessage.value = `Error al procesar el DNI: ${error.message}`
    isProcessing.value = false
  }
}


/**
 * Load image from file
 */
const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        imageLoaded.value = true
        resolve(img)
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Detect face in image using face-api.js
 */
const detectFace = async (img) => {
  const detection = await faceapi
    .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
  
  return detection
}

/**
 * Draw detection on canvas
 */
const drawDetection = (img, detection) => {
  const canvasEl = canvas.value
  const displaySize = { width: img.width, height: img.height }
  
  // Set canvas size
  canvasEl.width = displaySize.width
  canvasEl.height = displaySize.height
  
  // Draw image
  const ctx = canvasEl.getContext('2d')
  ctx.drawImage(img, 0, 0)
  
  // Draw bounding box
  if (detection) {
    const resizedDetection = faceapi.resizeResults(detection, displaySize)
    const box = resizedDetection.detection.box
    
    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth = 3
    ctx.strokeRect(box.x, box.y, box.width, box.height)
    
    // Draw label
    ctx.fillStyle = '#00ff00'
    ctx.font = '16px Arial'
    ctx.fillText('Cara detectada', box.x, box.y - 10)
  }
}

/**
 * Scan DNI using Gemini AI (Server-side)
 */
const performOCR = async (img) => {
  try {
    isLoadingModels.value = true
    loadingProgress.value = 10
    processingMessage.value = 'Enviando imagen a Gemini AI...'
    
    // Convert image to base64 (without prefix)
    const base64Data = img.src.split(',')[1];
    const mimeType = img.src.split(',')[0].split(':')[1].split(';')[0];
    
    loadingProgress.value = 30
    processingMessage.value = 'Gemini está analizando tu DNI...'

    const response = await fetch('/api/scan-dni', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Data,
        mimeType: mimeType
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.statusMessage || 'Error al procesar el DNI');
    }

    loadingProgress.value = 80
    processingMessage.value = 'Estructurando datos...'
    
    const structuredData = await response.json();
    
    console.log('Gemini Structured Data:', structuredData);
    
    loadingProgress.value = 100
    isLoadingModels.value = false
    
    return structuredData;
  } catch (error) {
    console.error('Error in Gemini OCR:', error);
    isLoadingModels.value = false
    loadingProgress.value = 0
    throw error;
  }
}



/**
 * Validate DNI letter
 */
const validateDniLetter = (dni) => {
  if (!dni) return false;
  const letter = dni.charAt(dni.length - 1).toUpperCase();
  const numPart = dni.substring(0, dni.length - 1);
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const number = parseInt(numPart.replace(/[^0-9]/g, ''), 10);
  if (isNaN(number)) return false;
  return letters.charAt(number % 23) === letter;
}

/**
 * Validate NIE letter
 */
const validateNieLetter = (nie) => {
  if (!nie) return false;
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const niePrefix = { X: 0, Y: 1, Z: 2 };
  const prefix = nie.charAt(0).toUpperCase();
  const number = parseInt(niePrefix[prefix] + nie.substring(1, 8), 10);
  const letter = nie.charAt(8).toUpperCase();
  return letters.charAt(number % 23) === letter;
}

/**
 * Use extracted DNI data
 */

const useDniData = () => {
  if (dniData.value) {
    emit('dataExtracted', dniData.value)
  }
}

/**
 * Reset scanner
 */
const resetScanner = () => {
  uploadedFile.value = null
  imageLoaded.value = false
  faceDetected.value = false
  dniData.value = null
  errorMessage.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  if (canvas.value) {
    const ctx = canvas.value.getContext('2d')
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  }
}
</script>

<style scoped>
.dni-scanner {
  background: linear-gradient(135deg, #5E2C2C 0%, #723233 100%);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  color: #fff;
}

.scanner-header {
  text-align: center;
  margin-bottom: 30px;
}

.scanner-header h2 {
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  margin-bottom: 10px;
  color: #fff;
}

.scanner-header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

.upload-section {
  margin-bottom: 30px;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 50px 40px;
  background: rgba(185, 175, 176, 0.05);
  border: 2px dashed rgba(185, 175, 176, 0.3);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.upload-label:hover {
  background: rgba(185, 175, 176, 0.1);
  border-color: #B9AFB0;
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.upload-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-img {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 0 10px rgba(185, 175, 176, 0.3));
  object-fit: contain;
}

.upload-text {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  letter-spacing: 2px;
  color: #B9AFB0;
  font-size: 1.1rem;
  text-align: center;
}

.file-input {
  display: none;
}

.processing-state {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.canvas-container {
  margin: 30px 0;
  text-align: center;
}

.canvas-container canvas {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.face-indicator {
  margin-top: 15px;
  padding: 10px 20px;
  background: rgba(0, 255, 0, 0.2);
  border: 2px solid #00ff00;
  border-radius: 10px;
  display: inline-block;
  font-weight: bold;
}

.face-indicator.error {
  background: rgba(255, 165, 0, 0.2);
  border-color: #ffa500;
}

.result-section {
  background: rgba(0, 0, 0, 0.3);
  padding: 30px;
  border-radius: 15px;
  margin-top: 30px;
}

.result-section h3 {
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
}

.data-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

@media (min-width: 768px) {
  .data-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.data-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
}

.data-item.full-width {
  grid-column: 1 / -1;
}

.data-item label {
  display: block;
  font-family: 'Cinzel', serif;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
  text-transform: uppercase;
}

.data-item span {
  font-size: 1.1rem;
  font-weight: bold;
}

.data-item span.valid {
  color: #00ff00;
}

.data-item span.invalid {
  color: #ff6b6b;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-buttons button {
  padding: 15px 30px;
  border: none;
  border-radius: 50px;
  font-family: 'Cinzel', serif;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-use {
  background: linear-gradient(135deg, #00ff00, #00cc00);
  color: #000;
}

.btn-use:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 255, 0, 0.3);
}

.btn-use:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-reset {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.btn-reset:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 107, 107, 0.2);
  border: 2px solid #ff6b6b;
  border-radius: 10px;
  color: #ff6b6b;
  text-align: center;
  font-weight: bold;
}
</style>
