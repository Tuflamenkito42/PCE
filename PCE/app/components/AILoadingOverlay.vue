<template>
  <div v-if="show" class="ai-loading-info">
    <div class="info-card">
      <div class="info-icon">🤖</div>
      <div class="info-content">
        <h3>Cargando Inteligencia Artificial</h3>
        <p>{{ message }}</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="info-note">
          <strong>Primera vez:</strong> Los modelos de IA se están descargando (~350MB). 
          Esto solo ocurre una vez, luego se guardan en tu navegador.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Preparando modelos de IA...'
  },
  progress: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.ai-loading-info {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.info-card {
  background: linear-gradient(135deg, #5E2C2C 0%, #723233 100%);
  padding: 40px;
  border-radius: 20px;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  text-align: center;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.info-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.info-content h3 {
  font-family: 'Cinzel', serif;
  color: #fff;
  font-size: 1.8rem;
  margin-bottom: 15px;
}

.info-content p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff00, #00cc00);
  border-radius: 10px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.info-note {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border-left: 3px solid #00ff00;
}

.info-note strong {
  color: #00ff00;
}
</style>
