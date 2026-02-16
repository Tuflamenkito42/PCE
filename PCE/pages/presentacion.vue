<template>
  <div class="presentation-wrapper" :style="{ '--current-slide': currentSlide }">
    <!-- Navigation Controls -->
    <div class="controls">
      <button @click="prevSlide" :disabled="currentSlide === 0" class="control-btn">
        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <div class="slide-indicator">
        {{ currentSlide + 1 }} / {{ totalSlides }}
      </div>
      <button @click="nextSlide" :disabled="currentSlide === totalSlides - 1" class="control-btn">
        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
      </button>
    </div>

    <!-- Progress Bar -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: ((currentSlide + 1) / totalSlides) * 100 + '%' }"></div>
    </div>

    <div class="slides-container" :style="{ transform: `translateX(-${currentSlide * 100}vw)` }">
      
      <!-- SLIDE 1: INTRO -->
      <section class="slide slide-intro">
        <div class="glass-card animate-fade-in shadow-pce">
          <div class="logo-shield-container">
            <img src="/images/logo.png" alt="PCE Logo" class="main-logo" />
          </div>
          <h1 class="brand-title">Protección Civil Española</h1>
          <p class="brand-subtitle">Seguridad • Bienestar • Transparencia</p>
          <div class="divider"></div>
          <p class="intro-text">Presentación Oficial del Proyecto PCE 2024</p>
        </div>
      </section>

      <!-- SLIDE 2: NUESTRA MISIÓN -->
      <section class="slide slide-mission">
        <div class="container grid-2">
          <div class="content animate-slide-left">
            <h2 class="section-title">Nuestra Misión</h2>
            <p>PCE nace como respuesta a la necesidad de una sociedad más segura y transparente.</p>
            <ul class="mission-list">
              <li>
                <span class="icon">🛡️</span>
                <div>
                  <strong>Seguridad Ciudadana</strong>
                  <p>Protocolos de actuación rápidos y efectivos.</p>
                </div>
              </li>
              <li>
                <span class="icon">💎</span>
                <div>
                  <strong>Transparencia Total</strong>
                  <p>Gestión pública auditable por cualquier ciudadano.</p>
                </div>
              </li>
              <li>
                <span class="icon">🤝</span>
                <div>
                  <strong>Solidaridad</strong>
                  <p>Apoyo directo a las familias y colectivos vulnerables.</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="image-area animate-slide-right">
             <div class="decorative-box">
                <span class="big-text">PCE</span>
             </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 3: VIDEO PUBLICITARIO -->
      <section class="slide slide-video">
        <div class="video-presentation-container">
          <h2 class="video-overlay-title">Video Publicitario</h2>
          <div class="video-wrapper">
             <video controls class="ad-video" ref="adVideo">
               <source src="/videos/promocion_pce.mp4" type="video/mp4" />
               Tu navegador no soporta videos.
             </video>
          </div>
          <p class="video-caption">Campaña de lanzamiento - "Protegiendo el mañana"</p>
        </div>
      </section>

      <!-- SLIDE 4: INNOVACIÓN TECNOLÓGICA -->
      <section class="slide slide-tech">
        <div class="container">
          <h2 class="section-title text-center">Tecnología al Servicio del Ciudadano</h2>
          <div class="tech-grid">
            <div class="tech-card">
              <div class="tech-icon">🔍</div>
              <h3>AI DNI Scanner</h3>
              <p>Proceso de afiliación 100% digital con verificación biométrica en segundos.</p>
            </div>
            <div class="tech-card">
              <div class="tech-icon">📊</div>
              <h3>Escrutinio Real</h3>
              <p>Visualización en tiempo real de votaciones y resultados internos.</p>
            </div>
            <div class="tech-card">
              <div class="tech-icon">💳</div>
              <h3>Donaciones Seguras</h3>
              <p>Integración con Stripe para una recaudación de fondos transparente.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 5: COMPROMISO ELECTORAL -->
      <section class="slide slide-promises">
        <div class="container">
           <h2 class="section-title">Pilares de Nuestro Programa</h2>
           <div class="promises-showcase">
              <div class="promise-item">
                 <div class="promise-num">01</div>
                 <div class="promise-content">
                    <h3>Control de Fronteras</h3>
                    <p>Expulsión inmediata de inmigración ilegal en menos de 48 horas.</p>
                 </div>
              </div>
              <div class="promise-item">
                 <div class="promise-num">02</div>
                 <div class="promise-content">
                    <h3>Justicia Proporcional</h3>
                    <p>Prisión permanente revisable para los delitos más graves.</p>
                 </div>
              </div>
              <div class="promise-item">
                 <div class="promise-num">03</div>
                 <div class="promise-content">
                    <h3>Igualdad Real</h3>
                    <p>Protección a todas las víctimas sin distinción de género.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <!-- SLIDE 6: CONTACTO / CIERRE -->
      <section class="slide slide-outro">
        <div class="glass-card animate-zoom-in shadow-pce">
          <img src="/images/logo.png" alt="PCE Logo" class="outro-logo" />
          <h2 class="brand-title">Únete al Cambio</h2>
          <p>Tu participación es la clave para una España más fuerte.</p>
          <div class="cta-links">
            <div class="cta-item">
              <span>🌐</span>
              <p>www.pce.org</p>
            </div>
            <div class="cta-item">
              <span>📧</span>
              <p>contacto@pce.org</p>
            </div>
          </div>
          <button class="btn-presentation">Afíliate ahora</button>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentSlide = ref(0)
const totalSlides = 6
const adVideo = ref(null)

const nextSlide = () => {
  if (currentSlide.value < totalSlides - 1) {
    currentSlide.value++
    handleSlideChange()
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
    handleSlideChange()
  }
}

const handleSlideChange = () => {
  // Pause video if we move away from slide index 2 (Slide 3)
  if (currentSlide.value !== 2 && adVideo.value) {
    adVideo.value.pause()
  }
}

const handleKeyDown = (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') nextSlide()
  if (e.key === 'ArrowLeft') prevSlide()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

useHead({
  title: 'Presentación PCE - Proyecto Oficial',
  meta: [
    { name: 'description', content: 'Presentación de los pilares y tecnología de Protección Civil Española.' }
  ]
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Outfit:wght@300;400;600&display=swap');

.presentation-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #0d0d0d;
  color: #B9AFB0;
  font-family: 'Outfit', sans-serif;
  position: relative;
}

.slides-container {
  display: flex;
  width: 600vw;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.slide {
  width: 100vw;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-sizing: border-box;
  background-size: cover;
  background-position: center;
  position: relative;
}

/* Backgrounds */
.slide-intro {
  background: radial-gradient(circle at center, #5e2c2c 0%, #1a0a0a 100%);
}

.slide-mission {
  background: linear-gradient(135deg, #1a0a0a 0%, #2c1414 100%);
}

.slide-video {
  background: #000;
}

.slide-tech {
  background: radial-gradient(circle at top right, #3d1c1c 0%, #0d0d0d 100%);
}

.slide-promises {
  background: linear-gradient(to bottom, #1a0a0a, #3d1c1c);
}

.slide-outro {
  background: radial-gradient(circle at bottom, #5e2c2c 0%, #0d0d0d 100%);
}

/* Common elements */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 60px;
  border-radius: 24px;
  text-align: center;
  max-width: 800px;
  width: 90%;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.main-logo {
  width: 140px;
  height: 170px;
  object-fit: contain;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.4));
}

.outro-logo {
  width: 100px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

.shadow-pce {
  box-shadow: 0 0 40px rgba(122, 53, 53, 0.3), 0 20px 50px rgba(0, 0, 0, 0.6);
}

.logo-shield-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.brand-title {
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  letter-spacing: 4px;
}

.brand-subtitle {
  font-size: 1.1rem;
  letter-spacing: 2px;
  color: #B9AFB0;
  opacity: 0.8;
}

.divider {
  width: 100px;
  height: 4px;
  background: #7A3535;
  margin: 30px auto;
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 30px;
  letter-spacing: 2px;
}

/* Controls */
.controls {
  position: absolute;
  bottom: 40px;
  right: 40px;
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 100;
}

.control-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.control-btn:hover:not(:disabled) {
  background: #7A3535;
  transform: scale(1.1);
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.slide-indicator {
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 101;
}

.progress-fill {
  height: 100%;
  background: #7A3535;
  transition: width 0.8s ease;
}

/* Mission Layout */
.grid-2 {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 60px;
  align-items: center;
}

.mission-list {
  list-style: none;
  padding: 0;
  margin-top: 40px;
}

.mission-list li {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.icon {
  font-size: 2rem;
  background: rgba(122, 53, 53, 0.2);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.decorative-box {
  width: 100%;
  height: 400px;
  border: 4px solid #7A3535;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.big-text {
  font-family: 'Cinzel', serif;
  font-size: 8rem;
  font-weight: 700;
  color: rgba(122, 53, 53, 0.3);
}

/* Video Slide */
.video-presentation-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.video-wrapper {
  width: 80%;
  max-width: 1000px;
  aspect-ratio: 16/9;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 100px rgba(122, 53, 53, 0.4);
}

.ad-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay-title {
  font-family: 'Cinzel', serif;
  margin-bottom: 20px;
  letter-spacing: 4px;
  font-size: 1.5rem;
}

.video-caption {
  margin-top: 20px;
  font-style: italic;
  opacity: 0.6;
}

/* Tech Grid */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 60px;
}

.tech-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.4s;
}

.tech-card:hover {
  background: rgba(122, 53, 53, 0.1);
  transform: translateY(-10px);
}

.tech-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

/* Promises Showcase */
.promises-showcase {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
}

.promise-item {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.02);
  border-left: 5px solid #7A3535;
  transition: 0.3s;
}

.promise-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(10px);
}

.promise-num {
  font-family: 'Cinzel', serif;
  font-size: 3rem;
  font-weight: 700;
  color: #7A3535;
}

/* Outro */
.cta-links {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 40px 0;
}

.cta-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-presentation {
  background: #7A3535;
  color: #fff;
  border: none;
  padding: 18px 45px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.3s;
}

.btn-presentation:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(122, 53, 53, 0.5);
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 1.5s ease;
}

.animate-slide-left {
  animation: slideLeft 1s ease;
}

.animate-slide-right {
  animation: slideRight 1s ease;
}

.animate-zoom-in {
  animation: zoomIn 1s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideLeft {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideRight {
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 768px) {
  .grid-2 { grid-template-columns: 1fr; }
  .tech-grid { grid-template-columns: 1fr; }
  .brand-title { font-size: 2rem; }
  .section-title { font-size: 1.8rem; }
  .image-area { display: none; }
}
</style>
