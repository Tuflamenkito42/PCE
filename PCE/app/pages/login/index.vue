<script setup>
import IdentityVerification from './components/IdentityVerification.vue'

import { isValidEmail, isStrongPassword, isValidDNI } from '@/utils/validation'

const currentStep = ref(1)
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const fullName = ref('')
const dni = ref('')
const errors = ref({})

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value
  errors.value = {}
}

const handleStep1 = async () => {
  errors.value = {}
  
  if (!isValidEmail(email.value)) {
    errors.value.email = "Introduce un email válido (ej: usuario@dominio.com)"
  }
  
  if (password.value.length < 8) {
     errors.value.password = "La contraseña debe tener al menos 8 caracteres"
  }

  if (!isLogin.value) {
    if (!isValidDNI(dni.value)) {
      errors.value.dni = "DNI/NIE no válido. Formato incorrecto o letra no coincide."
    }
  }

  if (Object.keys(errors.value).length > 0) return

  try {
    const { validate, register } = useAuth()

    if (isLogin.value) {
      // Step 1: Validate credentials WITHOUT logging in (no cookie set yet)
      await validate(email.value, password.value)
      
      // If successful, proceed to biometrics
      currentStep.value = 2
    } else {
      // Register flow
      await register({
        email: email.value,
        password: password.value,
        fullName: fullName.value,
        dni: dni.value
      })
      
      // Do NOT login yet. Wait for verification.
      
      alert("¡Registro completado! Ahora verifique su identidad.")
       currentStep.value = 2
    }
  } catch (err) {
    console.error(err)
    if (err.data && err.data.message) {
      errors.value.general = err.data.message
    } else {
      errors.value.general = "Error de conexión o credenciales incorrectas"
    }
  }
}

const handleFinalSuccess = async () => {
  try {
    // Final Step: Perform actual login to set session/cookie
    const { login } = useAuth()
    await login(email.value, password.value)

    alert("¡Verificación completada! Bienvenido al sistema PCE.")
    window.location.href = '/'
  } catch (err) {
    console.error("Error final login:", err)
    alert("Error al finalizar autenticación. Inténtelo de nuevo.")
  }
}

useHead({
  title: isLogin.value ? 'Acceso Seguro - PCE' : 'Registro Seguro - PCE',
  meta: [
    { name: 'description', content: 'Identifíquese de forma segura para acceder al centro de votación y servicios de Protección Civil Española (PCE).' }
  ]
})
</script>

<template>
  <main class="login-page">
    <div class="login-container container">
      <div class="auth-intro">
        <h1>{{ isLogin ? 'SISTEMA DE ACCESO SEGURO' : 'REGISTRO DE NUEVO USUARIO' }}</h1>
        <p>{{ isLogin ? 'Identifíquese para acceder a sus servicios personalizados y centro de votación.' : 'Cree su cuenta para participar en las consultas y votaciones de PCE.' }}</p>
      </div>

      <div class="auth-grid">
        <!-- Step 1: Credentials -->
        <section class="auth-card" :class="{ completed: currentStep > 1 }">
          <div class="card-header">
            <h2>1. {{ isLogin ? 'Credenciales' : 'Datos Personales' }}</h2>
          </div>
          <form class="auth-form" @submit.prevent="handleStep1">
            <div v-if="!isLogin" class="form-group slide-in">
              <label>Nombre Completo</label>
              <input v-model="fullName" type="text" placeholder="Tu nombre y apellidos" required />
            </div>
            <div v-if="!isLogin" class="form-group slide-in">
              <label>DNI / NIE</label>
              <input v-model="dni" type="text" placeholder="12345678A" required :class="{ 'error': errors.dni }" />
              <span v-if="errors.dni" class="error-msg">{{ errors.dni }}</span>
            </div>
            <div class="form-group">
              <label>Usuario / Email</label>
              <input v-model="email" type="text" placeholder="Correo electrónico" required :class="{ 'error': errors.email }" />
              <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
            </div>
            <div class="form-group">
              <label>Contraseña</label>
              <input v-model="password" type="password" placeholder="••••••••" required :class="{ 'error': errors.password }" />
              <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
            </div>
            
            <div class="auth-actions">
              <p v-if="Object.keys(errors).length > 0" class="general-error">
                 {{ errors.general || 'Por favor revise los errores en el formulario.' }}
              </p>
              <button type="submit" class="btn btn-verify-submit active">
                {{ isLogin ? 'Continuar a Biometría' : 'Registrar y Continuar' }}
              </button>
              
              <p class="toggle-auth" @click="toggleAuthMode">
                {{ isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión' }}
              </p>
            </div>
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
.auth-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;

  .toggle-auth {
    color: var(--accent-gold);
    font-size: 0.85rem;
    cursor: pointer;
    text-decoration: underline;
    font-family: 'Cinzel', serif;
    transition: color 0.3s;

    &:hover {
      color: #fff;
    }
  }
}

.slide-in {
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  to { opacity: 1; transform: translateY(0); }
}

.error-msg {
  color: #ff9999;
  font-size: 0.8rem;
  margin-top: 5px;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.general-error {
  color: #ff9999;
  font-size: 0.9rem;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 700;
  background: rgba(0,0,0,0.3);
  padding: 5px;
  border-radius: 4px;
}

input.error {
  border: 2px solid #ff6b6b !important;
  background-color: rgba(255, 107, 107, 0.2) !important;
}
</style>
