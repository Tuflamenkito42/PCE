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
            v-if="isLoggedIn && (userRole === 'staff' || userRole === 'admin')"
            :class="{ 'voted': isVoted('Presupuestos Participativos PCE 2026') }"
            type="intern"
            title="Presupuestos Participativos PCE 2026"
            description="Gestión interna de asignación de recursos operativos para el próximo año fiscal."
            :options="['Inversión en Nuevas Sedes', 'Mejora de Equipos Emergencias']"
            @vote="handleVote"
          >
            <template #tag>{{ isVoted('Presupuestos Participativos PCE 2026') ? 'VOTO REGISTRADO' : 'SÓLO PERSONAL PCE' }}</template>
          </PollCard>

          <!-- Poll Pública -->
          <PollCard 
            :class="{ 'voted': isVoted('Prioridades de Seguridad en Barrios') }"
            type="public"
            title="Prioridades de Seguridad en Barrios"
            description="¿Qué medidas considera más urgentes para mejorar la seguridad en su distrito?"
            :options="['Más Vigilancia Policial', 'Instalación Lumínica', 'Alarmas Vecinales']"
            @vote="handleVote"
          >
            <template #tag>{{ isVoted('Prioridades de Seguridad en Barrios') ? 'VOTO REGISTRADO' : 'CONSULTA PÚBLICA' }}</template>
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

const { user } = useAuth()
const isLoggedIn = computed(() => !!user.value)
const userRole = computed(() => user.value?.role || 'public')

const votedPolls = ref([])

const fetchVotedPolls = async () => {
  if (user.value?.id) {
    const data = await $fetch('/api/votes/my-votes', {
      params: { userId: user.value.id }
    })
    votedPolls.value = data.polls || []
  }
}

onMounted(() => {
  fetchVotedPolls()
})

// Re-fetch when user changes
watch(() => user.value, () => {
    fetchVotedPolls()
})

const isVoted = (title) => votedPolls.value.includes(title)

const pollsTitle = computed(() => {
  if (!isLoggedIn.value) return 'Consultas Disponibles'
  return (userRole.value === 'staff' || userRole.value === 'admin') 
    ? 'Consultas Corporativas (Personal PCE)' 
    : 'Consultas Ciudadanas Activas'
})

const handleVote = async (data) => {
  try {
    await $fetch('/api/votes/record', {
      method: 'POST',
      body: {
        pollTitle: data.title,
        option: data.option,
        userId: user.value?.id
      }
    })
    
    alert("¡TU VOTO HA SIDO REGISTRADO DE FORMA SEGURA E ENCRIPTADA!")
    await fetchVotedPolls() // Refresh the locked state
  } catch (error) {
    console.error(error)
    alert("HUBO UN ERROR AL REGISTRAR TU VOTO.")
  }
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

.poll-card.voted {
  opacity: 0.6;
  pointer-events: none;
  filter: grayscale(0.5);
  border-left-color: #2e7d32 !important; /* Green to indicate success/done */
}

</style>
