<template>
  <main class="page-content container">
    <h1 class="page-title">PROGRAMA</h1>

    <section class="promises-section">
      <div class="promises-grid">
        <PromiseCard v-for="(promise, idx) in promises" :key="idx" :title="promise.title">
          {{ promise.desc }}
        </PromiseCard>
      </div>
    </section>

    <section class="pdf-section">
      <div class="pdf-box">
        <iframe src="/uploads/Programa Electoral Completo.pdf" width="100%" height="600px"></iframe>
      </div>
    </section>

    <Newsletter />
  </main>
</template>

<script setup>
const promises = [
  { title: 'Control de Fronteras', desc: 'Estableceremos un protocolo de expulsión inmediata de inmigrantes ilegales en menos de 48 horas, con protección temporal únicamente para ciudadanos de países en conflicto armado reconocido internacionalmente.' },
  { title: 'Justicia Proporcional', desc: 'Endurecimiento de penas para delitos graves con prisión permanente revisable para violadores reincidentes y pederastas. Las penas se cumplirán íntegramente sin reducciones injustificadas.' },
  { title: 'Igualdad ante la Ley', desc: 'Reconocimiento equitativo de todas las víctimas de violencia sexual y de género, independientemente de su sexo. Protección legal igual para hombres y mujeres víctimas.' },
  { title: 'Reducción de Impuestos', desc: 'Reducción del IRPF del 3-5% para la clase media, IVA del 10% en productos básicos y eliminación completa del impuesto de sucesiones y donaciones para fortalecer la economía familiar.' },
  { title: 'Seguridad Pública', desc: 'Prohibición del burka y niqab en espacios públicos por razones de seguridad e identificación. Respeto total a otros símbolos religiosos que no impidan la identificación facial.' },
  { title: 'Igualdad de Género Real', desc: 'Igualdad salarial efectiva, permisos de paternidad y maternidad iguales, y eliminación de discriminación laboral. Las decisiones se basarán en competencia y méritos, no en género.' },
  { title: 'Protección del Ciudadano', desc: 'Defensor del Pueblo reforzado e independiente, transparencia total en datos públicos y protección contra vigilancia masiva sin orden judicial. Acceso a justicia rápida y gratuita.' },
  { title: 'Ayudas a Familias Españolas', desc: 'Prioridad en vivienda pública para españoles y residentes legales, cheque vivienda para jóvenes, bonificaciones en suministros básicos y ayudas reforzadas a familias numerosas.' },
  { title: 'Apoyo a Autónomos y PYMES', desc: 'Reducción de cotizaciones a la Seguridad Social del 30% al 20-25%, eliminación de burocracia innecesaria y simplificación administrativa. Digitalización total de trámites en 72 horas.' }
]

useHead({
  title: 'Programa - Protección Civil Española',
  meta: [
    { name: 'description', content: 'Conoce nuestro programa electoral. Medidas concretas para mejorar España.' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.page-title {
  font-family: var(--font-heading);
  font-size: 3rem;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 60px;
  color: #B9AFB0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background-color: var(--accent-gold);
    margin: 20px auto 0;
    border-radius: 2px;
  }
}

.promises-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 80px;
}

.pdf-section {
  display: flex;
  justify-content: center;
  margin-bottom: 80px;

  .pdf-box {
    background-color: var(--card-bg);
    width: 100%;
    max-width: 900px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);

    iframe {
      border: none;
      border-radius: 4px;
    }
  }
}
</style>
