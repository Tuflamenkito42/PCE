<template>
  <main class="contact-page container">
    <h1 class="page-title">{{ t('contact.title') }}</h1>

    <div class="contact-layout">
      <!-- Info Section -->
      <section class="contact-info card">
        <h2 class="section-subtitle">{{ t('contact.questionTitle') }}</h2>
        <p class="section-description">
          {{ t('contact.questionDesc') }}
        </p>

        <div class="info-items">
          <div class="info-item">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#723233" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div class="text">
              <strong>{{ t('contact.officeLabel') }}</strong>
              <span>{{ t('contact.officeAddress') }}</span>
            </div>
          </div>
          <div class="info-item">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#723233" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <div class="text">
              <strong>{{ t('contact.emailLabel') }}</strong>
              <span>{{ t('contact.email') }}</span>
            </div>
          </div>
          <div class="info-item">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#723233" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div class="text">
              <strong>{{ t('contact.phoneLabel') }}</strong>
              <span>{{ t('contact.phone') }}</span>
            </div>
          </div>
        </div>

        <div class="contact-offices-box" aria-label="Sedes de PCE">
          <h3 class="offices-title">Sedes</h3>
          <h5 class="offices-subtitle">Sedes en España</h5>
          <div class="contact-spain-map" role="img" aria-label="Mapa de España con sedes de PCE">
            <svg class="contact-map-svg" viewBox="-32 0 720 544" aria-hidden="true">
              <image class="contact-map-shape" :href="localMapSrc" x="-10" y="16" width="632" height="562" preserveAspectRatio="xMidYMid meet" />
              <g v-for="office in mainlandOffices" :key="`office-${office.name}`" class="contact-map-pin" :class="{ hq: office.hq }">
                <line
                  class="contact-map-leader"
                  :x1="office.x"
                  :y1="office.y"
                  :x2="office.x + (office.dx * 0.72)"
                  :y2="office.y + (office.dy * 0.72)"
                />
                <circle class="contact-map-dot" :cx="office.x" :cy="office.y" :r="office.hq ? 7 : 5" />
                <text
                  class="contact-map-label"
                  :x="office.x + office.dx"
                  :y="office.y + office.dy"
                  :text-anchor="office.anchor || 'start'"
                >{{ office.name }}</text>
              </g>
            </svg>
          </div>
          <div class="offices-badges">
            <span
              v-for="office in offices"
              :key="office.name"
              class="office-badge"
              :class="{ hq: office.hq }"
            >
              {{ office.name }}
            </span>
          </div>
          <p class="offices-note">Sede principal: Barcelona</p>
        </div>

        <div class="social-links-container">
          <h3>{{ t('contact.followUs') }}</h3>
          <div class="social-flex">
            <!-- Social icons (reusing logic from Footer simplified) -->
            <span class="social-badge">YT</span>
            <span class="social-badge">X</span>
            <span class="social-badge">IG</span>
            <span class="social-badge">TG</span>
          </div>
        </div>
      </section>

      <!-- Form Section -->
      <section class="contact-form-section card">
        <h2 class="section-subtitle">{{ t('contact.formTitle') }}</h2>
        <form @submit.prevent="handleSubmit" class="contact-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="name">{{ t('contact.fullName') }}</label>
              <input v-model="form.name" type="text" id="name" required :placeholder="t('contact.fullNamePlaceholder')" :disabled="loading" />
            </div>
            <div class="form-group">
              <label for="email">{{ t('contact.emailFormLabel') }}</label>
              <input v-model="form.email" type="email" id="email" required :placeholder="t('contact.emailPlaceholder')" :disabled="loading" />
            </div>
            <div class="form-group full-width">
              <label for="subject">{{ t('contact.subject') }}</label>
              <input v-model="form.subject" type="text" id="subject" :placeholder="t('contact.subjectPlaceholder')" :disabled="loading" />
            </div>
            <div class="form-group full-width">
              <label for="message">{{ t('contact.message') }}</label>
              <textarea v-model="form.message" id="message" required rows="6" :placeholder="t('contact.messagePlaceholder')" :disabled="loading"></textarea>
            </div>
          </div>

          <div class="form-footer">
            <label class="checkbox-container">
              <input type="checkbox" v-model="form.accept" required :disabled="loading" />
              <span class="checkmark"></span>
              {{ t('contact.policyAccept') }}
            </label>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? t('contact.sending') : t('contact.sendBtn') }}
            </button>
          </div>

          <transition name="fade">
            <p v-if="feedback" :class="['feedback-msg', feedbackType]">
              {{ feedback }}
            </p>
          </transition>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const localMapSrc = computed(() => `${runtimeConfig.app.baseURL}images/spain-real.svg`)

const mapOffices = [
  { name: 'Vigo', x: 255, y: 75, dx: 14, dy: 0, hq: false },
  { name: 'Bilbao', x: 418, y: 35, dx: 10, dy: -12, hq: false },
  { name: 'Madrid', x: 395, y: 140, dx: 8, dy: 18, hq: false },
  { name: 'Zaragoza', x: 478, y: 110, dx: -14, dy: -10, anchor: 'end', hq: false },
  { name: 'Barcelona', x: 565, y: 105, dx: 12, dy: -1, hq: true },
  { name: 'Valencia', x: 493, y: 180, dx: 10, dy: 16, hq: false },
  { name: 'Sevilla', x: 330, y: 250, dx: 12, dy: 0, hq: false },
  { name: 'Mallorca', x: 584, y: 175, dx: 12, dy: 5, hq: false },
  { name: 'Las Palmas', x: 69, y: 560, dx: 14, dy: -4, hq: false }
]

const mainlandOffices = computed(() => mapOffices)
const offices = computed(() => mapOffices.map(({ name, hq }) => ({ name, hq })))

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  accept: false
})

const loading = ref(false)
const feedback = ref('')
const feedbackType = ref('success')

const handleSubmit = async () => {
  if (!form.accept) return

  loading.value = true
  feedback.value = ''

  try {
    const response = await $fetch('/api/contact/send', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message
      }
    })

    feedback.value = t('contact.successMsg')
    feedbackType.value = 'success'
    
    // Reset form
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    form.accept = false

  } catch (error) {
    console.error(error)
    feedback.value = error.data?.message || t('contact.errorMsg')
    feedbackType.value = 'error'
  } finally {
    loading.value = false
  }
}

useHead({
  title: `${t('contact.title')} - PCE`,
  meta: [
    { name: 'description', content: 'Contacta con Protección Civil Española. Estamos aquí para escucharte y resolver tus dudas.' }
  ]
})
</script>

<style scoped>
.contact-page {
  padding: 60px 20px;
  min-height: 80vh;
}

.page-title {
  font-family: 'Cinzel', serif;
  font-size: 3rem;
  color: #B9AFB0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  margin-bottom: 40px;
  text-align: center;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  max-width: 1100px;
  margin: 0 auto;

  @media (min-width: 992px) {
    grid-template-columns: 400px 1fr;
  }
}

.card {
  background-color: #5E2C2C;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  height: fit-content;
}

.section-subtitle {
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.section-description {
  color: #B9AFB0;
  margin-bottom: 30px;
  line-height: 1.6;
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 40px;
}

.info-item {
  display: flex;
  gap: 15px;
  align-items: center;

  .icon-wrapper {
    background: #b2a3a4; /* Matching your theme's lighter grey-beige */
    width: 60px;
    height: 60px;
    flex-shrink: 0; /* Important for alignment */
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

    &:hover {
      background: #ffffff;
      transform: scale(1.1);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    }
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    strong {
      color: #fff;
      font-size: 0.9rem;
      letter-spacing: 2px;
      font-family: 'Cinzel', serif;
      font-weight: 800;
    }

    span {
      color: #B9AFB0;
      font-size: 1rem;
      font-weight: 500;
    }
  }
}

.social-links-container {
  margin-top: 24px;

  h3 {
    font-size: 0.9rem;
    color: #fff;
    margin-bottom: 15px;
    letter-spacing: 2px;
  }

  .social-flex {
    display: flex;
    gap: 15px;

    .social-badge {
      background: #723233;
      padding: 8px 12px;
      border-radius: 5px;
      font-weight: bold;
      font-size: 0.8rem;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: #8B3A3A;
        transform: translateY(-2px);
      }
    }
  }
}

.contact-offices-box {
  margin-top: -12px;
  padding: 12px;
  border: 1px solid rgba(185, 175, 176, 0.3);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.16);
}

.contact-spain-map {
  position: relative;
  height: 380px;
  margin-top: 10px;
  border-radius: 10px;
  background: linear-gradient(145deg, rgba(91, 37, 37, 0.95), rgba(58, 23, 23, 0.95));
  border: 1px solid rgba(185, 175, 176, 0.24);
  overflow: hidden;
}

.contact-spain-map::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 26px 26px;
  pointer-events: none;
  z-index: 1;
}

.contact-map-svg {
  position: absolute;
  inset: 6px;
  width: calc(100% - 12px);
  height: calc(100% - 12px);
  border-radius: 8px;
  z-index: 2;
}

.contact-map-shape {
  background: #d8d4d6;
  filter:
    brightness(0) saturate(100%)
    invert(93%) sepia(9%) saturate(254%) hue-rotate(291deg) brightness(105%) contrast(90%)
    drop-shadow(0 4px 10px rgba(0, 0, 0, 0.25));
  opacity: 0.96;
}

.contact-map-pin {
  pointer-events: none;
}

.contact-map-leader {
  stroke: rgba(244, 237, 239, 0.9);
  stroke-width: 1.3;
  stroke-linecap: round;
}

.contact-map-dot {
  fill: #f4eef0;
  stroke: #4a1819;
  stroke-width: 2;
}

.contact-map-label {
  fill: #111111;
  font-size: 20px;
  font-weight: 700;
  paint-order: stroke;
  stroke: rgba(245, 238, 240, 0.95);
  stroke-width: 1.8;
  stroke-linejoin: round;
  dominant-baseline: middle;
  pointer-events: none;
}

.contact-map-pin.hq .contact-map-dot {
  fill: #ffffff;
  stroke: #b42e31;
  stroke-width: 2.8;
}

.contact-map-pin.hq .contact-map-label {
  fill: #111111;
  stroke: rgba(245, 238, 240, 0.95);
  stroke-width: 2;
}

.offices-subtitle {
  margin: 0 0 10px;
  color: #f1e9ea;
  font-size: 0.95rem;
  font-family: 'Cinzel', serif;
  letter-spacing: 0.2px;
}

.offices-title {
  margin: 0;
  color: #f1e9ea;
  font-size: 0.95rem;
  font-family: 'Cinzel', serif;
  letter-spacing: 1px;
}

.offices-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.office-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid rgba(185, 175, 176, 0.34);
  background: rgba(255, 255, 255, 0.06);
  color: #f5eef0;
  font-size: 0.8rem;
  line-height: 1;
}

.office-badge.hq {
  border-color: rgba(180, 46, 49, 0.8);
  background: rgba(180, 46, 49, 0.16);
  color: #ffffff;
}

.offices-note {
  margin: 10px 0 0;
  color: #ddd2d3;
  font-size: 0.84rem;
}

.contact-form {
  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;

    @media (min-width: 600px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &.full-width {
      grid-column: 1 / -1;
    }

    label {
      font-family: 'Cinzel', serif;
      font-size: 0.75rem;
      color: #B9AFB0;
      font-weight: 700;
    }

    input, textarea {
      padding: 15px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(0,0,0,0.1);
      color: #fff;
      font-family: inherit;
      outline: none;
      transition: all 0.3s;

      &:focus {
        border-color: #8B3A3A;
        background: rgba(0,0,0,0.2);
      }

      &::placeholder {
        color: rgba(255,255,255,0.3);
      }
    }
  }
}

.form-footer {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 600px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.checkbox-container {
  font-size: 0.85rem;
  color: #B9AFB0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;

  a {
    color: #fff;
    text-decoration: underline;
  }
}

.btn-primary {
  background-color: #723233;
  color: #fff;
  padding: 15px 30px;
  border-radius: 8px;
  font-family: 'Cinzel', serif;
  font-weight: bold;
  letter-spacing: 1px;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);

  &:hover {
    background-color: #8B3A3A;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.feedback-msg {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;

  &.success {
    background: rgba(46, 125, 50, 0.2);
    color: #4caf50;
    border: 1px solid #4caf50;
  }

  &.error {
    background: rgba(198, 40, 40, 0.2);
    color: #ff5252;
    border: 1px solid #ff5252;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
