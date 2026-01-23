<template>
  <main class="login-page">
    <div class="login-container container">
      <div class="auth-intro">
        <h1>SISTEMA DE ACCESO SEGURO</h1>
        <p>Identifíquese para acceder a sus servicios personalizados y centro de votación.</p>
      </div>

      <div class="auth-grid">
        <!-- Step 1: Login Credentials -->
        <section class="auth-card" :class="{ completed: currentStep > 1 }">
          <div class="card-header">
            <h2>1. Credenciales</h2>
          </div>
          <form class="auth-form" @submit.prevent="handleStep1">
            <div class="form-group">
              <label>Usuario / Email</label>
              <input v-model="email" type="text" placeholder="Correo electrónico" required />
            </div>
            <div class="form-group">
              <label>Contraseña</label>
              <input v-model="password" type="password" placeholder="••••••••" required />
            </div>
            <button type="submit" class="btn btn-verify-submit active">Continuar a Biometría</button>
          </form>
        </section>

        <!-- Step 2: Biometry IdentityVerification Component -->
        <IdentityVerification 
          :is-locked="currentStep === 1" 
          class="auth-card"
          @verified="handleFinalSuccess"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import IdentityVerification from './components/IdentityVerification.vue'

const currentStep = ref(1)
const email = ref('')
const password = ref('')

const handleStep1 = () => {
  const role = (email.value.toLowerCase().includes('staff') || email.value.toLowerCase().includes('pce')) ? 'staff' : 'public'
  localStorage.setItem('pce_user_role', role)
  localStorage.setItem('pce_logged_in', 'pending')
  
  currentStep.value = 2
  alert("Credenciales correctas. Realice la verificación biométrica.")
}

const handleFinalSuccess = () => {
  localStorage.setItem('pce_logged_in', 'true')
  alert("¡Identidad verificada! Bienvenido al sistema PCE.")
  navigateTo('/')
}

useHead({
  title: 'Acceso Seguro - PCE',
  meta: [
    { name: 'description', content: 'Identifíquese de forma segura para acceder al centro de votación y servicios de Protección Civil Española (PCE).' }
  ]
})
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  align-items: center;
  justify-content: center;
  /* Lightened background with a warmer radial gradient */
  background: radial-gradient(circle at center, #723233 0%, #4a2222 100%);
  padding: 80px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("/images/bg-pattern.png");
    background-size: 600px;
    opacity: 0.1;
    pointer-events: none;
  }
}

.auth-intro {
  text-align: center;
  margin-bottom: 4rem;
  
  h1 {
    font-family: 'Cinzel', serif;
    color: #ffffff;
    font-size: 3rem;
    margin-bottom: 1rem;
    letter-spacing: 4px;
    text-shadow: 0 4px 15px rgba(0,0,0,0.5);
  }
  
  p {
    color: var(--accent-gold);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.9rem;
  }
}

.auth-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  max-width: 1100px;
  width: 100%;
  
  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
}

.auth-card {
  background: rgba(110, 54, 54, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 4px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &.completed {
    opacity: 0.4;
    filter: grayscale(0.8);
    pointer-events: none;
    transform: scale(0.95);
  }

  .card-header {
    margin-bottom: 2.5rem;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 15px;
    
    h2 { 
      font-size: 1.8rem; 
      color: #fff; 
      font-family: 'Cinzel', serif;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 12px;

    label {
      font-family: 'Cinzel', serif;
      font-weight: 700;
      font-size: 0.85rem;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    input {
      background-color: rgba(180, 167, 167, 0.9);
      border: none;
      padding: 18px 25px;
      border-radius: 4px;
      color: #000;
      font-size: 1rem;
      font-family: 'Cinzel', serif;
      transition: all 0.3s ease;

      &::placeholder {
        color: rgba(0,0,0,0.3);
      }
      
      &:focus {
        outline: none;
        background-color: #fff;
        box-shadow: 0 0 15px rgba(255,255,255,0.2);
      }
    }
  }
}

.btn-verify-submit {
  background-color: #000 !important;
  color: #fff !important;
  padding: 18px !important;
  border-radius: 4px !important;
  font-family: 'Cinzel', serif;
  font-size: 1.1rem !important;
  letter-spacing: 1px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    background-color: #1a1a1a !important;
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.5);
  }
}
</style>
