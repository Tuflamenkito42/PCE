<template>
  <main class="page-content container">
    <h1 class="page-title">{{ t('program.title') }}</h1>

    <section class="promises-section">
      <div class="promises-grid">
        <PromiseCard v-for="(promise, idx) in promises" :key="idx" :title="promise.title">
          {{ promise.desc }}
        </PromiseCard>
      </div>
    </section>

    <!-- Modal for PDF Viewer -->
    <div v-if="isPdfModalOpen" class="pdf-modal-overlay" @click.self="closePdfModal">
      <div class="pdf-modal-content">
        <button class="close-btn" @click="closePdfModal">&times;</button>
        <div class="pdf-container">
            <iframe src="/uploads/Programa Electoral Completo.pdf" width="100%" height="100%"></iframe>
        </div>
      </div>
    </div>

    <section class="promises-actions">
        <button @click="openPdfModal" class="btn btn-action-large btn-highlight">{{ t('program.fullProgram') }}</button>
        <a href="/uploads/Programa Electoral Completo.pdf" download class="btn btn-action-large">{{ t('program.downloadPdf') }}</a>
    </section>
  </main>
  <Newsletter />
</template>

<script setup>
const { t } = useI18n()

const isPdfModalOpen = ref(false)

const openPdfModal = () => {
  isPdfModalOpen.value = true
  document.body.style.overflow = 'hidden' // Prevent scrolling when modal is open
}

const closePdfModal = () => {
  isPdfModalOpen.value = false
  document.body.style.overflow = 'auto' // Restore scrolling
}

const promises = computed(() => [
  { title: t('program.promise1'), desc: t('program.promise1Desc') },
  { title: t('program.promise2'), desc: t('program.promise2Desc') },
  { title: t('program.promise3'), desc: t('program.promise3Desc') },
  { title: t('program.promise4'), desc: t('program.promise4Desc') },
  { title: t('program.promise5'), desc: t('program.promise5Desc') },
  { title: t('program.promise6'), desc: t('program.promise6Desc') },
  { title: t('program.promise7'), desc: t('program.promise7Desc') },
  { title: t('program.promise8'), desc: t('program.promise8Desc') },
  { title: t('program.promise9'), desc: t('program.promise9Desc') }
])

useHead(() => ({
  title: t('program.meta'),
  meta: [
    { name: 'description', content: t('program.metaDesc') }
  ]
}))
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.page-title {
  font-family: var(--font-heading);
  font-size: 3rem;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 60px;
  color: #B9AFB0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background-color: var(--accent-gold);
    margin: 20px auto 0;
    border-radius: 2px;
  }
}

.promises-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 80px;
}

/* PDF Modal Styles */
.pdf-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.pdf-modal-content {
  position: relative;
  width: 100%;
  max-width: 1000px;
  height: 85vh;
  background-color: var(--card-bg, #2c2c2c);
  border-radius: 8px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.close-btn {
  position: absolute;
  top: -40px;
  right: -10px;
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
    color: var(--accent-gold, #ffd700);
  }
}

.pdf-container {
  flex: 1;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  background-color: #525659; /* Fallback pdf viewer bg color */
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.promises-actions {
  display: flex;
  justify-content: space-between; /* Align to edges matching grid */
  gap: 20px; /* Minimal gap in case of wrap */
  margin-top: 60px;
  width: 100%; /* Ensure it spans full width */
  flex-wrap: wrap;

  .btn-action-large {
    background-color: #5e2c2c;
    color: #B9AFB0;
    width: 100%;
    max-width: 300px; /* Reduced width for side buttons */
    padding: 20px;
    font-size: 1.1rem;
    text-align: center;
    transition: all 0.3s ease;
    font-family: 'Cinzel', serif;
    font-weight: 700;
    text-decoration: none;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    letter-spacing: 1px;

    &:hover {
      background-color: #723233;
      transform: translateY(-3px);
    }
    
    &.btn-highlight {
        background-color: var(--accent-gold, #c5a059); /* Use gold accent */
        color: #1a1a1a; /* Dark text for contrast on gold */
        box-shadow: 0 0 20px rgba(197, 160, 89, 0.4); /* Glow effect */
        border: 2px solid #fff; /* White border to pop */
        
        &:hover {
            background-color: #d4b06a;
            box-shadow: 0 0 30px rgba(197, 160, 89, 0.6);
            transform: translateY(-5px) scale(1.02);
        }
    }
  }
}
</style>
