<template>
  <main class="transparencia-page">
    <!-- Hero Section -->
    <section class="transparency-hero">
      <div class="container animate-in">
        <div class="hero-brand-overlay">
          <h1 class="page-title">{{ t('transparency.title') }}</h1>
        </div>
        <div class="title-divider"></div>
        <div class="subtitle-glass">
          <p class="hero-subtitle">
            {{ t('transparency.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Content Sections -->
    <section class="transparency-content container">

      <div class="categories-grid">
        
        <!-- Category 1: Información Institucional y Organizativa -->
        <div class="category-section animate-in" style="animation-delay: 0.1s">
          <div class="category-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <h2>{{ t('transparency.institutional') }}</h2>
          </div>
          <p class="category-desc">{{ t('transparency.institutionalDesc') }}</p>
          <div class="docs-list">
            <a v-for="doc in docsInstitucional" :key="doc.title" :href="doc.link" target="_blank" class="doc-item glass-hover">
              <span class="doc-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><text x="7" y="16" font-family="Arial" font-size="6" font-weight="900" fill="currentColor" stroke="none">PDF</text></svg>
              </span>
              <div class="doc-info">
                <span class="doc-title">{{ doc.title }}</span>
                <span class="doc-date">{{ doc.date }}</span>
              </div>
              <span class="download-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </span>
            </a>
          </div>
        </div>

        <!-- Category 2: Información Económica y Financiera -->
        <div class="category-section animate-in" style="animation-delay: 0.2s">
          <div class="category-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/></svg>
            <h2>{{ t('transparency.economic') }}</h2>
          </div>
          <p class="category-desc">{{ t('transparency.economicDesc') }}</p>
          <div class="docs-list">
            <a v-for="doc in docsEconomica" :key="doc.title" :href="doc.link" target="_blank" class="doc-item glass-hover">
              <span class="doc-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><text x="7" y="16" font-family="Arial" font-size="6" font-weight="900" fill="currentColor" stroke="none">PDF</text></svg>
              </span>
              <div class="doc-info">
                <span class="doc-title">{{ doc.title }}</span>
                <span class="doc-date">{{ doc.date }}</span>
              </div>
              <span class="download-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </span>
            </a>
          </div>
        </div>

        <!-- Category 3: Contratos y Convenios -->
        <div class="category-section animate-in" style="animation-delay: 0.3s">
          <div class="category-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <h2>{{ t('transparency.contracts') }}</h2>
          </div>
          <p class="category-desc">{{ t('transparency.contractsDesc') }}</p>
          <div class="docs-list">
            <a v-for="doc in docsContratos" :key="doc.title" :href="doc.link" target="_blank" class="doc-item glass-hover">
              <span class="doc-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><text x="7" y="16" font-family="Arial" font-size="6" font-weight="900" fill="currentColor" stroke="none">PDF</text></svg>
              </span>
              <div class="doc-info">
                <span class="doc-title">{{ doc.title }}</span>
                <span class="doc-date">{{ doc.date }}</span>
              </div>
              <span class="download-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </span>
            </a>
          </div>
        </div>

        <!-- Category 4: Altos Cargos y Retribuciones -->
        <div class="category-section animate-in" style="animation-delay: 0.4s">
          <div class="category-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            <h2>{{ t('transparency.executives') }}</h2>
          </div>
          <p class="category-desc">{{ t('transparency.executivesDesc') }}</p>
          <div class="docs-list">
            <a v-for="doc in docsCargos" :key="doc.title" :href="doc.link" target="_blank" class="doc-item glass-hover">
              <span class="doc-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><text x="7" y="16" font-family="Arial" font-size="6" font-weight="900" fill="currentColor" stroke="none">PDF</text></svg>
              </span>
              <div class="doc-info">
                <span class="doc-title">{{ doc.title }}</span>
                <span class="doc-date">{{ doc.date }}</span>
              </div>
              <span class="download-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </span>
            </a>
          </div>
        </div>

      </div>

      <!-- Info Box -->
      <div class="info-box glass animate-in" style="animation-delay: 0.5s">
        <div class="info-box-content">
          <h3>{{ t('transparency.auditTitle') }}</h3>
          <p>{{ t('transparency.auditDesc') }}</p>
        </div>
      </div>

    </section>
  </main>
</template>

<script setup>
const { t } = useI18n()

useHead(() => ({
  title: `${t('transparency.title')} - Protección Civil Española`,
  meta: [
    { name: 'description', content: t('transparency.intro') }
  ]
}))

const docsInstitucional = computed(() => [
  { title: t('transparency.estatutos'), date: 'Actualizado: Enero 2024', link: '/documents/estatutos-del-partido.pdf' },
  { title: t('transparency.doc.ethicsCode'), date: 'Actualizado: Febrero 2024', link: '/documents/codigo-etico-de-conducta.pdf' },
  { title: t('transparency.doc.orgChart'), date: 'Actualizado: Marzo 2024', link: '/documents/organigrama-directiva.pdf' },
  { title: t('transparency.doc.orgRules'), date: 'Actualizado: Diciembre 2023', link: '/documents/reglamento-organizacion.pdf' }
])

const docsEconomica = computed(() => [
  { title: t('transparency.presupuestos'), date: 'Aprobado: Enero 2024', link: '/documents/presupuestos-2024.pdf' },
  { title: t('transparency.doc.accounts'), date: 'Publicado: Marzo 2024', link: '/documents/cuentas-anuales-2023.pdf' },
  { title: t('transparency.doc.auditReport'), date: 'Publicado: Marzo 2024', link: '/documents/auditoria-externa-2023.pdf' },
  { title: t('transparency.doc.donationRegistry'), date: 'Publicado: Abril 2024', link: '/documents/registro-donaciones.pdf' },
  { title: t('transparency.doc.publicGrants'), date: 'Actualizado: Anual', link: '/documents/subvenciones-publicas.pdf' }
])

const docsContratos = computed(() => [
  { title: t('transparency.doc.minorContracts'), date: 'Publicado: Enero 2024', link: '/documents/contratos-menores-2023.pdf' },
  { title: t('transparency.doc.providers'), date: 'Actualizado: Mensual', link: '/documents/contratos-proveedores.pdf' },
  { title: t('transparency.doc.agreements'), date: 'Actualizado: Anual', link: '/documents/convenios-entidades.pdf' }
])

const docsCargos = computed(() => [
  { title: t('transparency.doc.salaries'), date: 'Actualizado: Enero 2024', link: '/documents/retribuciones-cargos.pdf' },
  { title: t('transparency.doc.expenses'), date: 'Actualizado: Semestral', link: '/documents/gastos-representacion.pdf' },
  { title: t('transparency.doc.assets'), date: 'Actualizado: Anual', link: '/documents/declaracion-bienes.pdf' }
])
</script>

<style scoped>
.transparencia-page {
  padding-bottom: 100px;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Style */
.transparency-hero {
  padding: 120px 0 80px;
  text-align: center;
  position: relative;
}

.hero-brand-overlay {
  margin-bottom: 20px;
}

.page-title {
  font-family: var(--font-heading, system-ui);
  font-size: 4rem;
  margin: 0;
  letter-spacing: 5px;
  color: #ffffff;
  font-weight: 800;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(0,0,0,0.8), 2px 2px 10px rgba(0,0,0,0.5);
}

.title-divider {
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg, transparent, var(--accent-gold, #b2a3a4), transparent);
  margin: 25px auto 40px;
  border-radius: 2px;
}

.subtitle-glass {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 30px 40px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.2rem;
  line-height: 1.8;
  margin: 0;
  color: #ffffff;
  font-weight: 400;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.category-section {
  background: var(--card-bg, #6E3636);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.category-header svg {
  color: var(--accent-gold, #b2a3a4);
}

.category-header h2 {
  font-family: var(--font-heading, system-ui);
  font-size: 1.5rem;
  margin: 0;
  color: #ffffff;
  font-weight: 600;
}

.category-desc {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 30px;
  line-height: 1.5;
}

/* Documents List */
.docs-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.doc-item {
  display: flex;
  align-items: center;
  padding: 20px 25px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.doc-item:hover {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.doc-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: #ffffff;
  opacity: 0.9;
}

.doc-item:hover .doc-icon {
  color: #ff4d4f;
}

.doc-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.doc-title {
  font-size: 1.1rem;
  color: #ffffff;
  font-weight: 500;
  transition: color 0.2s ease;
}

.doc-item:hover .doc-title {
  color: #ff4d4f;
}

.doc-date {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.download-icon {
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.2s ease, transform 0.2s ease;
}

.doc-item:hover .download-icon {
  color: #ffffff;
  transform: translateY(2px);
}

/* Info Box */
.info-box {
  background: var(--card-bg, #6E3636);
  border-left: 4px solid var(--accent-gold, #b2a3a4);
  border-radius: 8px;
  padding: 40px;
  margin-top: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.info-box-content h3 {
  font-family: var(--font-heading, system-ui);
  color: #ffffff;
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 20px;
}

.info-box-content p {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
  margin: 0;
  font-size: 1.05rem;
}

/* Animations */
.animate-in {
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  .categories-grid { grid-template-columns: 1fr; }
  .page-title { font-size: 2.8rem; }
}

@media (max-width: 600px) {
  .transparency-hero { padding: 60px 0 40px; }
  .page-title { font-size: 2.2rem; }
  .category-section { padding: 25px; }
  .doc-item { padding: 15px; }
  .info-box { padding: 25px; }
}
</style>
