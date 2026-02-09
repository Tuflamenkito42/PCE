<template>
  <Transition name="slide-up">
    <div v-if="isOpen" class="cookie-banner">
      <div class="cookie-content">
        <div class="cookie-text">
          <h3>POLÍTICA DE COOKIES</h3>
          <p>
            Utilizamos cookies propias y de terceros para mejorar su experiencia y nuestros servicios, analizando la navegación en nuestro sitio web.
          </p>
        </div>
        <div class="cookie-actions">
          <button @click="rejectCookies" class="btn btn-reject">RECHAZAR</button>
          <button @click="acceptCookies" class="btn btn-accept">ACEPTAR</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const isOpen = useCookieControl()

onMounted(() => {
  const consent = localStorage.getItem('pce_cookie_consent')
  if (!consent) {
    // Small delay for animation
    setTimeout(() => {
      isOpen.value = true
    }, 1000)
  }
})

const acceptCookies = () => {
  localStorage.setItem('pce_cookie_consent', 'accepted')
  isOpen.value = false
}

const rejectCookies = () => {
  localStorage.setItem('pce_cookie_consent', 'rejected')
  isOpen.value = false
}
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  z-index: 9999;
  box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
}

.cookie-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.cookie-text {
  h3 {
    font-family: 'Cinzel', serif;
    color: #fff;
    font-size: 1.1rem;
    margin-bottom: 5px;
    letter-spacing: 1px;
  }
  
  p {
    color: #ccc;
    font-size: 0.9rem;
    max-width: 600px;
    line-height: 1.5;
  }
}

.cookie-actions {
  display: flex;
  gap: 15px;

  .btn {
    padding: 10px 25px;
    border-radius: 4px;
    font-family: 'Cinzel', serif;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
  }

  .btn-accept {
    background-color: #723233;
    color: #fff;
    border: 1px solid #723233;

    &:hover {
      background-color: #5e2c2c;
      transform: translateY(-2px);
    }
  }

  .btn-reject {
    background-color: #b2a3a4;
    color: #4a2222;
    border: 1px solid #b2a3a4;

    &:hover {
      background-color: #9e8e8f;
      border-color: #9e8e8f;
      transform: translateY(-2px);
    }
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
