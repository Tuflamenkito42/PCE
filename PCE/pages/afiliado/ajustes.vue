<template>
  <main class="settings-page container">
    <section class="card">
      <h1 class="title">{{ t('nav.settings') }}</h1>
      <p class="subtitle">Centro privado para afiliados. Desde aquí puedes gestionar tu cuenta y tu carné.</p>

      <div class="grid">
        <NuxtLink to="/carnet" class="action-card">
          <h2>{{ t('nav.carnet') }}</h2>
          <p>Descarga tu carné digital y solicita versión física.</p>
        </NuxtLink>

        <div class="action-card muted">
          <h2>Datos de afiliación</h2>
          <p>Próximamente podrás actualizar datos personales y de contacto.</p>
        </div>

        <div class="action-card muted">
          <h2>Historial de cuotas</h2>
          <p>Próximamente podrás consultar pagos y renovaciones.</p>
        </div>

        <button type="button" class="action-card logout" @click="logout">
          <h2>{{ t('auth.logout') }}</h2>
          <p>Cierra sesión de forma segura.</p>
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
definePageMeta({
  middleware: ['afiliado']
})

const { logout } = useAuth()
const { t } = useI18n()

useHead(() => ({
  title: `${t('nav.settings')} - PCE`,
  meta: [
    {
      name: 'description',
      content: 'Panel de ajustes para afiliados de Protección Civil Española.'
    }
  ]
}))
</script>

<style scoped>
.settings-page {
  padding: 48px 20px 70px;
}

.card {
  background: rgba(94, 44, 44, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
}

.title {
  margin: 0;
  color: #fff;
  font-family: 'Cinzel', serif;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
}

.subtitle {
  color: #eadfe0;
  margin-top: 10px;
  margin-bottom: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.action-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 16px;
  color: #f4ecec;
  text-decoration: none;
  text-align: left;
}

.action-card h2 {
  margin: 0 0 6px;
  color: #fff;
  font-size: 1.05rem;
}

.action-card p {
  margin: 0;
  color: #dcc9ca;
  line-height: 1.45;
}

.action-card.muted {
  opacity: 0.8;
}

.action-card.logout {
  cursor: pointer;
  border: 1px solid rgba(255, 180, 180, 0.35);
}

.action-card:hover {
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}
</style>
