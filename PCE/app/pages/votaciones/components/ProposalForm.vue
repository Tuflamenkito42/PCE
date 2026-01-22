<template>
  <section class="proposals-section card">
    <div class="card-header">
      <h2>Tu Voz: Propuestas Electorales</h2>
    </div>
    <div class="card-body">
      <p>Escriba aquí las propuestas o promesas que le gustaría ver en nuestro programa electoral.</p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <textarea v-model="text" placeholder="Escribe aquí tu propuesta detallada..." rows="4"></textarea>
        </div>
        <button type="submit" class="btn btn-verify-submit active">Enviar Propuesta</button>
      </form>
      <div class="stats">
        <span>Ya hemos recibido 1,240 sugerencias esta semana.</span>
      </div>
    </div>
  </section>
</template>

<script setup>
const text = ref('')
const emit = defineEmits(['submit'])

const handleSubmit = () => {
  if (text.value.length < 10) {
    alert("Por favor, describe tu propuesta con más detalle.")
    return
  }
  emit('submit', text.value)
  text.value = ''
}
</script>

<style scoped>
.card {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;

  .card-header {
    background: #4a2222;
    padding: 20px;
    h2 { font-size: 1.5rem; margin: 0; font-family: var(--font-heading); color: white; }
  }

  .card-body {
    padding: 30px;

    p { margin-bottom: 20px; color: var(--text-grey); }

    textarea {
      width: 100%;
      background: rgba(0,0,0,0.2);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      font-family: var(--font-body);
    }
  }
}

.stats {
  margin-top: 20px;
  font-size: 0.8rem;
  color: var(--text-grey);
  text-align: right;
}
</style>
