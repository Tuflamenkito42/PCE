<template>
  <main class="contact-page container">
    <h1 class="page-title">CONTACTO</h1>

    <div class="contact-layout">
      <!-- Info Section -->
      <section class="contact-info card">
        <h2 class="section-subtitle">¿TIENES ALGUNA DUDA?</h2>
        <p class="section-description">
          Estamos aquí para escucharte. Si tienes preguntas sobre nuestro programa, quieres sugerir mejoras o simplemente deseas más información, contáctanos.
        </p>

        <div class="info-items">
          <div class="info-item">
            <div class="icon">📍</div>
            <div class="text">
              <strong>OFICINA CENTRAL</strong>
              <span>Calle de la Protección, 42, Madrid</span>
            </div>
          </div>
          <div class="info-item">
            <div class="icon">📧</div>
            <div class="text">
              <strong>EMAIL</strong>
              <span>contacto@pce-web.com</span>
            </div>
          </div>
          <div class="info-item">
            <div class="icon">📞</div>
            <div class="text">
              <strong>TELÉFONO</strong>
              <span>+34 900 123 456</span>
            </div>
          </div>
        </div>

        <div class="social-links-container">
          <h3>SÍGUENOS</h3>
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
        <h2 class="section-subtitle">ESCRÍBENOS</h2>
        <form @submit.prevent="handleSubmit" class="contact-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="name">NOMBRE COMPLETO *</label>
              <input v-model="form.name" type="text" id="name" required placeholder="Tu nombre..." :disabled="loading" />
            </div>
            <div class="form-group">
              <label for="email">DIRECCIÓN DE CORREO *</label>
              <input v-model="form.email" type="email" id="email" required placeholder="tu@email.com" :disabled="loading" />
            </div>
            <div class="form-group full-width">
              <label for="subject">ASUNTO</label>
              <input v-model="form.subject" type="text" id="subject" placeholder="¿Sobre qué quieres hablarnos?" :disabled="loading" />
            </div>
            <div class="form-group full-width">
              <label for="message">MENSAJE *</label>
              <textarea v-model="form.message" id="message" required rows="6" placeholder="Escribe aquí tu mensaje..." :disabled="loading"></textarea>
            </div>
          </div>

          <div class="form-footer">
            <label class="checkbox-container">
              <input type="checkbox" v-model="form.accept" required :disabled="loading" />
              <span class="checkmark"></span>
              Acepto la <NuxtLink to="/politica-privacidad">política de privacidad</NuxtLink>
            </label>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'ENVIANDO...' : 'ENVIAR MENSAJE' }}
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

    feedback.value = '¡Mensaje enviado con éxito! Te responderemos pronto.'
    feedbackType.value = 'success'
    
    // Reset form
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    form.accept = false

  } catch (error) {
    console.error(error)
    feedback.value = error.data?.message || 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.'
    feedbackType.value = 'error'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Contacto - PCE',
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

  .icon {
    font-size: 1.5rem;
    background: rgba(255,255,255,0.1);
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .text {
    display: flex;
    flex-direction: column;
    
    strong {
      color: #fff;
      font-size: 0.8rem;
      letter-spacing: 1px;
    }

    span {
      color: #B9AFB0;
      font-size: 0.9rem;
    }
  }
}

.social-links-container {
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
