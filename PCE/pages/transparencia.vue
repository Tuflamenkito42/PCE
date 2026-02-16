<template>
  <main class="transparencia-page">
    <!-- Hero Section -->
    <section class="transparency-hero">
      <div class="container">
        <div class="hero-content glass animate-in">
          <h1 class="page-title">TRANSPARENCIA</h1>
          <div class="title-divider"></div>
          <p class="hero-subtitle">
            En Protección Civil Española (PCE), la transparencia no es solo una obligación legal, 
            sino un pilar fundamental de nuestro compromiso con la ciudadanía.
          </p>
        </div>
      </div>
    </section>

    <!-- Content Sections -->
    <section class="transparency-grid container">
      <!-- Section: Our Commitment -->
      <div class="info-card glass animate-in" style="animation-delay: 0.1s">
        <h2 class="section-subtitle">NUESTRO COMPROMISO</h2>
        <p>
          Creemos en una política de puertas abiertas. Aquí encontrarás toda la información relativa 
          a nuestra gestión, financiación y estructura organizativa. Nuestra meta es construir 
          un proyecto basado en la confianza mutua y la integridad absoluta.
        </p>
      </div>

      <!-- Section: Financial Stats -->
      <div class="stats-row animate-in" style="animation-delay: 0.2s">
        <div class="kpi-card">
          <div class="kpi-content-simple">
            <span class="kpi-label-simple">FINANCIACIÓN 100%</span>
            <span class="kpi-value-simple">PRIVADA</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-content-simple">
            <span class="kpi-label-simple">SUBVENCIONES</span>
            <span class="kpi-value-simple">0,00 €</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-content-simple">
            <span class="kpi-label-simple">AUDITORÍAS</span>
            <span class="kpi-value-simple">ANUALES</span>
          </div>
        </div>
      </div>

      <!-- Section: Documents -->
      <div class="documents-section animate-in" style="animation-delay: 0.3s">
        <h2 class="section-title">DOCUMENTACIÓN OFICIAL</h2>
        <div class="docs-grid">
          <div v-for="doc in documents" :key="doc.title" class="doc-card glass-hover">
            <div class="doc-icon">📄</div>
            <div class="doc-info">
              <h3>{{ doc.title }}</h3>
              <p>{{ doc.description }}</p>
            </div>
            <a :href="doc.link" class="btn-download" download>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              PDF
            </a>
          </div>
        </div>
      </div>

      <!-- Section: Ethics -->
      <div class="ethics-box glass animate-in" style="animation-delay: 0.4s">
        <h2 class="section-subtitle">CÓDIGO ÉTICO</h2>
        <p>
          Todos nuestros cargos electos y personal administrativo se rigen por un estricto código 
          de conducta profesional y personal que garantiza la ausencia de conflictos de intereses 
          y la prioridad absoluta del bienestar social.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
useHead({
  title: 'Transparencia - Protección Civil Española',
  meta: [
    { name: 'description', content: 'Consulta las cuentas, estatutos y el compromiso ético de Protección Civil Española (PCE).' }
  ]
})

const documents = [
  { 
    title: 'Estatutos del Partido', 
    description: 'Normas fundamentales que rigen nuestra organización y funcionamiento interno.',
    link: '/documents/estatutos.pdf' 
  },
  { 
    title: 'Cuentas Anuales 2023', 
    description: 'Desglose detallado de ingresos y gastos auditados del último ejercicio fiscal.',
    link: '/documents/cuentas-2023.pdf' 
  },
  { 
    title: 'Registro de Donaciones', 
    description: 'Listado transparente de aportaciones recibidas conforme a la ley vigente.',
    link: '/documents/donaciones.pdf' 
  },
  { 
    title: 'Organigrama Nacional', 
    description: 'Estructura de mando y responsables de las diferentes áreas del PCE.',
    link: '/documents/organigrama.pdf' 
  }
]
</script>

<style scoped>
.transparencia-page {
  padding-bottom: 100px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Style */
.transparency-hero {
  padding: 80px 0 60px;
  text-align: center;
}

.hero-content {
  background: rgba(114, 50, 51, 0.95);
  padding: 60px 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.page-title {
  font-family: var(--font-heading);
  font-size: 3.5rem;
  margin: 0;
  letter-spacing: 5px;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.title-divider {
  width: 80px;
  height: 3px;
  background: #fff;
  margin: 20px auto;
  border-radius: 2px;
}

.hero-subtitle {
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  color: #fff;
  opacity: 0.9;
  letter-spacing: 1px;
}

/* Grid and Sections */
.transparency-grid {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section-title {
  font-family: var(--font-heading);
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  letter-spacing: 2px;
}

.section-subtitle {
  font-family: var(--font-heading);
  margin-bottom: 15px;
  font-size: 1.4rem;
  letter-spacing: 1px;
  color: #fff;
}

.glass {
  background: rgba(114, 50, 51, 0.85); /* More opaque brand color */
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  padding: 40px;
}

.info-card p, .ethics-box p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.kpi-card {
  background: rgba(114, 50, 51, 0.85);
  padding: 30px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  text-align: center;
  transition: all 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-5px);
  border-color: #fff;
  background: rgba(114, 50, 51, 0.5);
}

.kpi-content-simple {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.kpi-label-simple {
  font-family: var(--font-heading);
  font-size: 0.8rem;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.6);
}

.kpi-value-simple {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: bold;
  color: #fff;
}

/* Documents */
.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 20px;
}

.doc-card {
  background: rgba(0, 0, 0, 0.75); /* Increased opacity from 0.4 */
  border-radius: 15px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.doc-card:hover {
  background: rgba(0, 0, 0, 0.85); /* Darker on hover instead of transparent white */
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateX(10px);
}

.doc-icon {
  font-size: 2rem;
  background: rgba(114, 50, 51, 0.4);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.doc-info {
  flex: 1;
}

.doc-info h3 {
  font-family: var(--font-heading);
  font-size: 1rem;
  margin-bottom: 5px;
}

.doc-info p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
}

.btn-download {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #723233;
  color: #fff;
  padding: 10px 18px;
  border-radius: 8px;
  text-decoration: none;
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: bold;
  transition: all 0.2s ease;
}

.btn-download:hover {
  background: #943d3d;
  transform: scale(1.05);
}

/* Animations */
.animate-in {
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .page-title { font-size: 2.5rem; }
  .hero-content { padding: 40px 20px; }
  .docs-grid { grid-template-columns: 1fr; }
}
</style>
