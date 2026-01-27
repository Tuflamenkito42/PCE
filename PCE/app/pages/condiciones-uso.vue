<script setup>
useHead({
  title: 'Condiciones de Uso - PCE',
  meta: [
    { name: 'description', content: 'Condiciones de uso y aviso legal del sitio web de Protección Civil Española (PCE).' }
  ]
})
</script>

<template>
  <main class="legal-page">
    <div class="legal-container">
      <h1>CONDICIONES DE USO</h1>
      
      <div class="legal-content card">
        <p class="last-update">Última actualización: 27 de Enero de 2026</p>

        <section>
          <h2>1. INTRODUCCIÓN</h2>
          <p>
            Bienvenido al sitio web de Protección Civil Española (PCE). El acceso y uso de este sitio web atribuye la condición de usuario e implica la aceptación rotunda de las presentes Condiciones de Uso. Le recomendamos leerlas atentamente.
          </p>
        </section>

        <section>
          <h2>2. USO DEL SITIO WEB</h2>
          <p>
            El usuario se compromete a hacer un uso adecuado y lícito del sitio web y de sus contenidos, de conformidad con la legislación aplicable, la moral, las buenas costumbres y el orden público. Queda prohibido el uso del sitio web con fines ilícitos o lesivos contra PCE o terceros.
          </p>
        </section>

        <section>
          <h2>3. PROPIEDAD INTELECTUAL E INDUSTRIAL</h2>
          <p>
            Todos los contenidos del sitio web (textos, imágenes, logos, diseño, código fuente, etc.) son propiedad intelectual de PCE o de terceros que han autorizado su uso. Queda expresamente prohibida la reproducción, distribución o comunicación pública de los mismos sin la autorización previa y por escrito de PCE.
          </p>
        </section>

        <section>
          <h2>4. REGISTRO Y CONTRASEÑAS</h2>
          <p>
            Para acceder a determinados servicios, como la votación o el área de afiliados, el usuario deberá registrarse. El usuario es responsable de aportar información veraz y lícita. Como consecuencia de este registro, el usuario deberá crear una contraseña de la cual será responsable, comprometiéndose a hacer un uso diligente y confidencial de la misma.
          </p>
        </section>

        <section>
          <h2>5. EXCLUSIÓN DE GARANTÍAS Y RESPONSABILIDAD</h2>
          <p>
            PCE no garantiza la disponibilidad continua y permanente de los servicios, quedando exonerado de cualquier responsabilidad por posibles daños y perjuicios causados como consecuencia de la falta de disponibilidad del servicio por causas de fuerza mayor o errores en las redes telemáticas de transferencia de datos.
          </p>
        </section>
        
        <section>
          <h2>6. MODIFICACIONES</h2>
          <p>
            PCE se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados.
          </p>
        </section>

        <section>
          <h2>7. LEY APLICABLE Y JURISDICCIÓN</h2>
          <p>
            La relación entre PCE y el usuario se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y tribunales de la ciudad de Barcelona, salvo que la ley aplicable disponga otra cosa.
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
    font-family: 'Outfit', sans-serif;
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
