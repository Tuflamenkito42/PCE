<template>
  <main class="settings-page container">
    <section class="card">
      <h1 class="title">{{ t('nav.settings') }}</h1>
      <p class="subtitle">{{ lt('Centro privado para afiliados. Desde aquí puedes gestionar tu cuenta y tu carné.', 'Centre privat per a afiliats. Des d\'aquí pots gestionar el teu compte i el teu carnet.', 'Afiliatuentzako gune pribatua. Hemendik zure kontua eta karneta kudea ditzakezu.', 'Centro privado para afiliados. Desde aquí podes xestionar a túa conta e o teu carné.') }}</p>

      <div class="grid">
        <NuxtLink to="/carnet" class="action-card">
          <h2>{{ t('nav.carnet') }}</h2>
          <p>{{ lt('Descarga tu carné digital y solicita versión física.', 'Descarrega el teu carnet digital i sol·licita versió física.', 'Deskargatu zure karnet digitala eta eskatu bertsio fisikoa.', 'Descarga o teu carné dixital e solicita versión física.') }}</p>
        </NuxtLink>

        <NuxtLink to="/afiliado/datos" class="action-card">
          <h2>{{ lt('Datos de afiliación', 'Dades d\'afiliació', 'Afiliazio datuak', 'Datos de afiliación') }}</h2>
          <p>{{ lt('Revisa y actualiza tus datos personales y de contacto.', 'Revisa i actualitza les teves dades personals i de contacte.', 'Berrikusi eta eguneratu zure datu pertsonalak eta harremanetarakoak.', 'Revisa e actualiza os teus datos persoais e de contacto.') }}</p>
        </NuxtLink>

        <NuxtLink to="/afiliado/cuotas" class="action-card">
          <h2>{{ lt('Historial de cuotas', 'Historial de quotes', 'Kuoten historiala', 'Historial de cotas') }}</h2>
          <p>{{ lt('Consulta tu estado de renovación y últimos movimientos.', 'Consulta el teu estat de renovació i els últims moviments.', 'Kontsultatu zure berritze egoera eta azken mugimenduak.', 'Consulta o teu estado de renovación e os últimos movementos.') }}</p>
        </NuxtLink>

        <button type="button" class="action-card logout" @click="logout">
          <h2>{{ t('auth.logout') }}</h2>
          <p>{{ lt('Cierra sesión de forma segura.', 'Tanca la sessió de manera segura.', 'Itxi saioa modu seguruan.', 'Pecha sesión de forma segura.') }}</p>
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
const { t, locale } = useI18n()

const lt = (es, ca, eu, gl) => {
  if (locale.value === 'ca') return ca
  if (locale.value === 'eu') return eu
  if (locale.value === 'gl') return gl
  return es
}

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

.action-card.logout {
  cursor: pointer;
  border: 1px solid rgba(255, 180, 180, 0.35);
}

.action-card:hover {
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}
</style>
