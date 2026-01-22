<template>
  <section class="newsletter-section">
    <div class="newsletter-content">
      <h3>Recibe todas las novedades en tu email</h3>
      <form class="newsletter-form" @submit.prevent="handleSubmit">
        <label for="email">Dirección de correo</label>
        <input v-model="email" type="email" id="email" class="newsletter-input" required />
        <div class="checkbox-group">
          <input v-model="privacy" type="checkbox" id="privacy" required />
          <label for="privacy">Acepto la política de privacidad</label>
        </div>
        <div class="form-footer-right">
          <button type="submit" class="btn btn-submit">Enviar</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
const email = ref('')
const privacy = ref(false)

const handleSubmit = () => {
  if (!email.value || !privacy.value) return
  alert("¡Gracias por suscribirte!")
  email.value = ''
  privacy.value = false
}
</script>

<style scoped>
.newsletter-section {
  background-color: #B4A7A7;
  padding: 40px 20px;
  color: #5E2C2C;
  margin-top: 50px;

  .newsletter-content {
    max-width: 800px;
    margin: 0 auto;

    h3 {
      font-family: 'Cinzel', serif;
      font-weight: 700;
      font-size: 1.4rem;
      color: #8B3A3A;
      margin-bottom: 30px;
    }

    .newsletter-form {
      display: flex;
      flex-direction: column;
      gap: 15px;

      label {
        font-family: 'Cinzel', serif;
        font-weight: 700;
        color: #5E2C2C;
      }

      .newsletter-input {
        background: transparent;
        border: none;
        border-bottom: 2px solid #8B3A3A;
        padding: 10px 0;
        width: 100%;
        font-family: 'Cinzel', serif;
        font-size: 1rem;
        outline: none;
      }

      .checkbox-group {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.9rem;
        font-weight: 700;
      }

      .form-footer-right {
        display: flex;
        justify-content: flex-end;

        .btn-submit {
          background-color: #6E3636;
          color: #B9AFB0;
          padding: 10px 40px;
          
          &:hover {
            background-color: #804040;
          }
        }
      }
    }
  }
}
</style>
