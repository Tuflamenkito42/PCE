<template>
  <main class="votes-page container">
    <h1 class="page-title">CENTRO DE VOTACIÓN Y PARTICIPACIÓN</h1>

    <div class="votes-intro">
      <p>Bienvenido al Centro de Participación Ciudadana de PCE. Aquí podrá ejercer su derecho al voto en consultas populares e internas de forma <strong>segura, anónima y encriptada</strong>.</p>
    </div>

    <div class="votes-layout">
      <!-- 1. Active Polls -->
      <section class="polls-section" :class="{ locked: !isLoggedIn }">
        <div v-if="!isLoggedIn" class="lock-overlay auth-lock">
          <p>ACCESO RESTRINGIDO: INICIE SESIÓN CON BIOMETRÍA PARA VOTAR</p>
          <NuxtLink to="/login" class="btn btn-verify-submit active" style="margin-top: 20px;">IR AL ACCESO SEGURO</NuxtLink>
        </div>

        <h2 class="section-subtitle">{{ pollsTitle }}</h2>

        <div class="polls-grid">
          <!-- Poll Interna -->
          <PollCard 
            v-if="isLoggedIn && userRole === 'staff'"
            type="intern"
            title="Presupuestos Participativos PCE 2026"
            description="Gestión interna de asignación de recursos operativos para el próximo año fiscal."
            :options="['Inversión en Nuevas Sedes', 'Mejora de Equipos Emergencias']"
            @vote="handleVote"
          >
            <template #tag>SÓLO PERSONAL PCE</template>
          </PollCard>

          <!-- Poll Pública -->
          <PollCard 
            type="public"
            title="Prioridades de Seguridad en Barrios"
            description="¿Qué medidas considera más urgentes para mejorar la seguridad en su distrito?"
            :options="['Más Vigilancia Policial', 'Instalación Lumínica', 'Alarmas Vecinales']"
            @vote="handleVote"
          >
            <template #tag>CONSULTA PÚBLICA</template>
          </PollCard>
        </div>
      </section>

      <!-- 2. Proposals Box -->
      <ProposalForm @submit="handleProposalSubmit" />
    </div>
  </main>
</template>

<script setup>
import PollCard from './components/PollCard.vue'
import ProposalForm from './components/ProposalForm.vue'

const isLoggedIn = ref(false)
const userRole = ref('public')

onMounted(() => {
  isLoggedIn.value = localStorage.getItem('pce_logged_in') === 'true'
  userRole.value = localStorage.getItem('pce_user_role') || 'public'
})

const pollsTitle = computed(() => {
  if (!isLoggedIn.value) return 'Consultas Disponibles'
  return userRole.value === 'staff' ? 'Consultas Corporativas (Staff PCE)' : 'Consultas Ciudadanas Activas'
})

const handleVote = (e) => {
  alert("Tu voto ha sido registrado de forma anónima e encriptada.")
  const btn = e.target
  const card = btn.closest('.poll-card')
  card.style.opacity = '0.5'
  card.style.pointerEvents = 'none'
}

const handleProposalSubmit = (text) => {
  alert("¡Propuesta enviada! Gracias por participar.")
}

useHead({
  title: 'Votaciones - PCE',
  meta: [
    { name: 'description', content: 'Participa en las votaciones y consultas de Protección Civil Española (PCE).' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.votes-intro {
  text-align: center;
  margin-bottom: 60px;
  font-size: 1.1rem;
  background-color: #723233;
  color: #ffffff;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  p {
    margin: 0;
    line-height: 1.8;
  }
}

.votes-layout {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.polls-section {
  position: relative;
  &.locked {
    min-height: 400px;
  }
}

.polls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

</style>
