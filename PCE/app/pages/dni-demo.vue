<template>
  <div class="dni-scanner-demo">
    <h1>Demo: DNI Scanner Integration</h1>
    
    <div class="demo-layout">
      <!-- DNI Scanner Component -->
      <div class="scanner-section">
        <DniScanner @dataExtracted="handleDniData" />
      </div>

      <!-- Form that gets auto-filled -->
      <div class="form-section">
        <h2>Formulario Auto-rellenado</h2>
        <form @submit.prevent="submitForm" class="demo-form">
          <div class="form-group">
            <label>DNI/NIE:</label>
            <input 
              v-model="formData.dni" 
              type="text" 
              placeholder="12345678Z"
              :class="{ valid: dniValid }"
            />
            <span v-if="dniValid" class="valid-indicator">✅ Válido</span>
            <span v-else-if="formData.dni" class="invalid-indicator">❌ Inválido</span>
          </div>

          <div class="form-group">
            <label>Nombre:</label>
            <input v-model="formData.nombre" type="text" placeholder="Nombre" />
          </div>

          <div class="form-group">
            <label>Apellidos:</label>
            <input v-model="formData.apellidos" type="text" placeholder="Apellidos" />
          </div>

          <div class="form-group">
            <label>Fecha de Nacimiento:</label>
            <input v-model="formData.fecha_nacimiento" type="text" placeholder="DD/MM/YYYY" />
          </div>

          <div class="form-group">
            <label>Fecha de Caducidad:</label>
            <input v-model="formData.fecha_caducidad" type="text" placeholder="DD/MM/YYYY" />
          </div>

          <button type="submit" class="submit-btn" :disabled="!dniValid">
            Enviar Formulario
          </button>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DniScanner from '@/components/DniScanner.vue'

// Form data
const formData = ref({
  dni: '',
  nombre: '',
  apellidos: '',
  fecha_nacimiento: '',
  fecha_caducidad: ''
})

// DNI validation
const DNI_REGEX = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/
const NIE_REGEX = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/

const dniValid = computed(() => {
  if (!formData.value.dni) return false
  return DNI_REGEX.test(formData.value.dni) || NIE_REGEX.test(formData.value.dni)
})

/**
 * Handle extracted DNI data
 */
const handleDniData = (data) => {
  console.log('📄 DNI Data Extracted:', data)
  
  // Auto-fill form
  if (data.dni) formData.value.dni = data.dni
  if (data.nombre) formData.value.nombre = data.nombre
  if (data.apellidos) formData.value.apellidos = data.apellidos
  if (data.fecha_nacimiento) formData.value.fecha_nacimiento = data.fecha_nacimiento
  if (data.fecha_caducidad) formData.value.fecha_caducidad = data.fecha_caducidad
  
  // Show notification
  if (data.valido) {
    alert('✅ DNI válido detectado. Formulario auto-rellenado.')
  } else {
    alert('⚠️ DNI detectado pero no es válido. Verifica los datos.')
  }
}

/**
 * Submit form
 */
const submitForm = () => {
  console.log('📤 Submitting form:', formData.value)
  alert('Formulario enviado correctamente!')
}

useHead({
  title: 'DNI Scanner Demo - PCE',
  meta: [
    { name: 'description', content: 'Demostración del componente de escaneo de DNI con detección facial y OCR' }
  ]
})
</script>

<style scoped>
.dni-scanner-demo {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  min-height: 100vh;
}

h1 {
  font-family: 'Cinzel', serif;
  color: #fff;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 40px;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
}

.demo-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

@media (min-width: 1024px) {
  .demo-layout {
    grid-template-columns: 1fr 1fr;
  }
}

.form-section {
  background: linear-gradient(135deg, #5E2C2C 0%, #723233 100%);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.form-section h2 {
  font-family: 'Cinzel', serif;
  color: #fff;
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
}

.demo-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.form-group label {
  font-family: 'Cinzel', serif;
  color: #fff;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
}

.form-group input {
  padding: 15px 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.form-group input.valid {
  border-color: #00ff00;
  background: rgba(0, 255, 0, 0.1);
}

.valid-indicator {
  color: #00ff00;
  font-weight: bold;
  font-size: 0.9rem;
  margin-left: 10px;
}

.invalid-indicator {
  color: #ff6b6b;
  font-weight: bold;
  font-size: 0.9rem;
  margin-left: 10px;
}

.submit-btn {
  margin-top: 20px;
  padding: 15px 40px;
  background: linear-gradient(135deg, #00ff00, #00cc00);
  color: #000;
  border: none;
  border-radius: 50px;
  font-family: 'Cinzel', serif;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 255, 0, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #666;
}

.debug-section {
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
  color: #fff;
}

.debug-section summary {
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 10px;
}

.debug-section pre {
  margin-top: 15px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  overflow-x: auto;
  color: #00ff00;
  font-size: 0.9rem;
}
</style>
