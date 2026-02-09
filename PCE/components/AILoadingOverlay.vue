<template>
  <div v-if="show" class="ai-loading-info">
    <div class="info-card">
      <div class="info-icon">
        <div class="logo-circle">
          <img src="/images/logo.png" alt="PCE Logo" class="loading-logo" />
        </div>
      </div>
      <div class="info-content">
        <h3>Cargando Inteligencia Artificial</h3>
        <p>{{ message }}</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.info-card {
  background: linear-gradient(145deg, rgba(74, 34, 34, 0.85) 0%, rgba(114, 50, 51, 0.85) 100%);
  padding: 50px 40px;
  border-radius: 24px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6);
  text-align: center;
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(185, 175, 176, 0.15);
  backdrop-filter: blur(15px);
}

@keyframes slideUp {
  from {
    transform: translateY(30px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.info-icon {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}

.logo-circle {
  width: 120px;
  height: 120px;
  background: rgba(185, 175, 176, 0.1);
  border: 2px solid #B9AFB0;
  border-radius: 50%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(185, 175, 176, 0.2), inset 0 0 15px rgba(185, 175, 176, 0.1);
  animation: pulseGold 3s ease-in-out infinite;
}

.loading-logo {
  max-width: 80%;
  max-height: 80%;
  width: auto;
  height: auto;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.1));
}

@keyframes pulseGold {
  0%, 100% { border-color: #B9AFB0; box-shadow: 0 0 20px rgba(185, 175, 176, 0.2); transform: scale(1); }
  50% { border-color: #D1CDCE; box-shadow: 0 0 40px rgba(185, 175, 176, 0.4); transform: scale(1.02); }
}

.info-content h3 {
  font-family: 'Cinzel', serif;
  color: #B9AFB0;
  font-size: 1.6rem;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
}

.info-content p {
  color: #fff;
  font-size: 1rem;
  margin-bottom: 24px;
  font-family: 'Montserrat', sans-serif;
  opacity: 0.9;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #B9AFB0, #D1CDCE);
  border-radius: 10px;
  transition: width 0.4s cubic-bezier(0.1, 0, 0, 1);
  box-shadow: 0 0 20px rgba(185, 175, 176, 0.5);
}


</style>
