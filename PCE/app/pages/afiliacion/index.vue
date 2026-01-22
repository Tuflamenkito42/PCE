<template>
  <main class="affiliation-page container">
    <h1 class="page-title">AFILIACIÓN</h1>

    <div class="affiliation-layout">
      <!-- Left: Form -->
      <div class="form-container card">
        <!-- Steps Header -->
        <div class="form-steps">
          <div v-for="step in 4" :key="step" :class="['step', { active: currentStep === step }]">
            <div class="step-circle">{{ step }}</div>
            <span class="step-label">{{ stepLabels[step - 1] }}</span>
          </div>
        </div>

        <!-- Form Content -->
        <form class="main-form" @submit.prevent="handleSubmit">
          <transition name="fade" mode="out-in">
            <div :key="currentStep">
              <div v-if="currentStep === 1" class="step-content">
                <h2 class="form-subtitle">DATOS PERSONALES</h2>
                <div class="form-grid">
                  <div class="form-group">
                    <label>NOMBRE *</label>
                    <input type="text" placeholder="Nombre" required />
                  </div>
                  <div class="form-group">
                    <label>APELLIDOS *</label>
                    <input type="text" placeholder="Apellidos" required />
                  </div>
                  <div class="form-group">
                    <label>DNI / NIE *</label>
                    <input type="text" placeholder="Ejemplo: 12345678A" required />
                  </div>
                  <div class="form-group">
                    <label>FECHA DE NACIMIENTO *</label>
                    <div class="date-row">
                      <select><option>Dia</option></select>
                      <select><option>Mes</option></select>
                      <select><option>Año</option></select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>EMAIL PRINCIPAL *</label>
                    <input type="email" placeholder="Email principal" required />
                  </div>
                  <div class="form-group">
                    <label>TELÉFONO PRINCIPAL *</label>
                    <input type="tel" placeholder="Teléfono principal" required />
                  </div>
                </div>
              </div>

              <div v-else-if="currentStep === 2" class="step-content">
                <h2 class="form-subtitle">CUOTA</h2>
                <p>Selecciona tu cuota de afiliación mensual...</p>
              </div>

              <div v-else-if="currentStep === 3" class="step-content">
                <h2 class="form-subtitle">DATOS BANCARIOS</h2>
                <p>Introduce tus datos bancarios para el cobro...</p>
              </div>

              <div v-else-if="currentStep === 4" class="step-content">
                <h2 class="form-subtitle">CONFIRMACIÓN</h2>
                <p>Revisa tus datos antes de finalizar.</p>
              </div>
            </div>
          </transition>

          <div class="form-nav">
            <button v-if="currentStep > 1" type="button" class="btn" @click="currentStep--">Anterior</button>
            <button v-if="currentStep < 4" type="button" class="btn btn-next" @click="currentStep++">Siguiente</button>
            <button v-if="currentStep === 4" type="submit" class="btn btn-next">Finalizar Afiliación</button>
          </div>
        </form>
      </div>

      <!-- Right: Benefits -->
      <AffiliationSidebar @join="currentStep = 1" />
    </div>
  </main>
</template>

<script setup>
import AffiliationSidebar from './components/AffiliationSidebar.vue'

const currentStep = ref(1)
const stepLabels = ['Datos personales', 'Cuota', 'Datos Bancarios', 'Confirmación']

const handleSubmit = () => {
  alert("¡Gracias por afiliarte a PCE! Pronto recibirás un correo de confirmación.")
}

useHead({
  title: 'Afiliación - PCE',
  meta: [
    { name: 'description', content: 'Únete a Protección Civil Española (PCE) y forma parte del cambio. Proceso de afiliación sencillo y rápido.' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.affiliation-page {
  .page-title {
    font-family: 'Cinzel', serif;
    font-size: 3.5rem;
    color: #F0F0F0;
    text-shadow: 2px 2px 10px rgba(0,0,0,0.5);
    margin-bottom: 40px;
  }
}

.affiliation-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 60px;
  align-items: start;

  @media (min-width: 1024px) {
    grid-template-columns: 1.8fr 1fr;
  }
}

.form-container {
  background-color: #5E2C2C;
  padding: 50px 60px;
  border-radius: 30px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

.form-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;
  position: relative;
  padding: 0 20px;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 40px;
    right: 40px;
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
    z-index: 0;
  }

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    position: relative;
    z-index: 1;
    width: 80px;

    &.active {
      .step-circle {
        background-color: #ffffff;
        color: #000;
        box-shadow: 0 0 20px rgba(255,255,255,0.4);
      }
      .step-label {
        color: #fff;
        opacity: 1;
      }
    }

    .step-circle {
      width: 40px;
      height: 40px;
      background-color: #723233;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: #fff;
      font-family: 'Cinzel', serif;
    }
  }
}

.form-subtitle {
  font-family: 'Cinzel', serif;
  color: #fff;
  font-size: 1.8rem;
  margin-bottom: 30px;
  letter-spacing: 2px;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    font-family: 'Cinzel', serif;
    font-weight: 700;
    font-size: 0.85rem;
    color: #fff;
    text-transform: uppercase;
  }

  input {
    background-color: #B4A7A7;
    border: none;
    padding: 18px 25px;
    border-radius: 50px;
    color: #000;
    font-size: 1rem;
    font-family: var(--font-body);

    &::placeholder {
      color: rgba(0,0,0,0.4);
    }
    
    &:focus {
      outline: none;
      background-color: #fff;
    }
  }
}

.date-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  
  select {
    background-color: #B4A7A7;
    border: none;
    padding: 18px 25px;
    border-radius: 50px;
    color: #444;
    font-size: 1rem;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M1 4l5 5 5-5' stroke='%23444' stroke-width='2' fill='none'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 20px center;
    cursor: pointer;

    &:focus {
      outline: none;
      background-color: #fff;
    }
  }
}

.form-nav {
  display: flex;
  justify-content: center;
  margin-top: 50px;

  .btn-next {
    background-color: #000 !important;
    color: #fff !important;
    padding: 15px 60px;
    border-radius: 50px;
    font-size: 1.1rem;
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.4);
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
