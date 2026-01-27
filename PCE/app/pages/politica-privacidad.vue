<script setup>
useHead({
  title: 'Política de Privacidad - PCE',
  meta: [
    { name: 'description', content: 'Política de Privacidad de Protección Civil Española (PCE). Conozca cómo tratamos sus datos personales.' }
  ]
})
</script>

<template>
  <main class="legal-page">
    <div class="legal-container">
      <h1>POLÍTICA DE PRIVACIDAD</h1>
      
      <div class="legal-content card">
        <p class="last-update">Última actualización: 27 de Enero de 2026</p>

        <section>
          <h2>1. INFORMACIÓN GENERAL</h2>
          <p>
            La presente Política de Privacidad describe cómo Protección Civil Española (PCE) recopila, utiliza y protege la información personal de los usuarios que acceden a nuestro sitio web y servicios. Nos comprometemos a garantizar la privacidad y seguridad de sus datos de acuerdo con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).
          </p>
        </section>

        <section>
          <h2>2. RESPONSABLE DEL TRATAMIENTO</h2>
          <p>
            Identidad: Protección Civil Española (PCE)<br>
            Domicilio social: Calle Ejemplo, 123, 08013 Barcelona<br>
            Email de contacto: privacidad@pce.es
          </p>
        </section>

        <section>
          <h2>3. FINALIDAD DEL TRATAMIENTO</h2>
          <p>Tratamos sus datos personales para las siguientes finalidades:</p>
          <ul>
            <li>Gestionar su registro y acceso como usuario o afiliado.</li>
            <li>Procesar su participación en votaciones y consultas ciudadanas.</li>
            <li>Enviar comunicaciones informativas sobre nuestras actividades y acciones.</li>
            <li>Gestionar donaciones y aportaciones.</li>
            <li>Garantizar la seguridad y el correcto funcionamiento del sitio web.</li>
          </ul>
        </section>

        <section>
          <h2>4. LEGITIMACIÓN</h2>
          <p>
            La base legal para el tratamiento de su datos es:
          </p>
          <ul>
            <li>El consentimiento del interesado (al registrarse o suscribirse).</li>
            <li>La ejecución de un contrato o precontrato (afiliación).</li>
            <li>El cumplimiento de obligaciones legales.</li>
            <li>El interés legítimo de PCE.</li>
          </ul>
        </section>

        <section>
          <h2>5. CONSERVACIÓN DE DATOS</h2>
          <p>
            Conservaremos sus datos personales mientras se mantenga la relación con PCE o hasta que solicite su supresión. Posteriormente, se mantendrán bloqueados durante los plazos legalmente establecidos para atender posibles responsabilidades.
          </p>
        </section>
        
        <section>
          <h2>6. DERECHOS DEL USUARIO</h2>
          <p>
            Usted tiene derecho a acceder, rectificar y suprimir sus datos, así como a limitar u oponerse a su tratamiento. Puede ejercer estos derechos enviando una solicitud a nuestro correo electrónico de contacto.
          </p>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
.legal-page {
  padding: 120px 20px 60px;
  min-height: 80vh;
  display: flex;
  justify-content: center;
}

.legal-container {
  max-width: 900px;
  width: 100%;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  letter-spacing: 2px;
}

.legal-content {
  padding: 40px;
  background: rgba(110, 54, 54, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
}

.last-update {
  font-style: italic;
  margin-bottom: 2rem;
  color: var(--accent-gold);
  text-align: right;
  font-size: 0.9rem;
}

section {
  margin-bottom: 2.5rem;

  h2 {
    font-family: 'Cinzel', serif;
    font-size: 1.4rem;
    margin-bottom: 1rem;
    color: var(--accent-gold);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 0.5rem;
  }

  p, li {
    font-family: 'Outfit', sans-serif; /* Usar sans-serif para lectura larga si está disponible, sino hereda */
    font-size: 1rem;
    line-height: 1.7;
    color: #e0e0e0;
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: disc;
    padding-left: 2rem;
    margin-bottom: 1rem;
  }
}

@media (max-width: 768px) {
  .legal-content {
    padding: 20px;
  }
  
  h1 {
    font-size: 2rem;
  }
}
</style>
