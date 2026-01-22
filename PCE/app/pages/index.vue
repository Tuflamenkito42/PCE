<template>
  <div class="page-home">
    <section class="hero">
      <div class="video-container">
        <video autoplay muted loop class="hero-video">
          <source src="/images/videopce.mp4" type="video/mp4" />
        </video>
      </div>
      <div class="hero-overlay">
        <div class="container">
          <p>
            Protección Civil Española (PCE) es un partido comprometido con la seguridad, el bienestar y la protección de la ciudadanía. Trabajamos por una sociedad más preparada, solidaria y transparente, poniendo en el centro la prevención, la respuesta ante emergencias y el apoyo a quienes más lo necesitan. Descubre quienes somos, nuestras propuestas y cómo puedes formar parte del cambio.
          </p>
        </div>
      </div>
    </section>

    <section class="cta container">
      <NuxtLink to="/afiliacion" class="btn btn-big-cta">AFILIATE</NuxtLink>
    </section>

    <section class="news container">
      <h2 class="section-title">NOTICIAS</h2>
      <div class="news-layout">
        <div class="news-list">
          <NewsCard excerpt="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis aliquet lacus, vitae finibus diam." />
          <NewsCard excerpt="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis aliquet lacus, vitae finibus diam." />
          <NewsCard excerpt="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis aliquet lacus, vitae finibus diam." />
        </div>
        <div class="social-box">
          <h3>enlace a red social</h3>
        </div>
      </div>
      <div class="news-more">
        <NuxtLink to="/noticias" class="btn btn-load-more">CARGAR MÁS</NuxtLink>
      </div>
    </section>

    <section class="promises container">
      <h2 class="section-title">PROMESAS ELECTORALES</h2>
      <div class="promises-grid">
        <PromiseCard>
          <strong>Control de Fronteras:</strong> Estableceremos un protocolo de expulsión inmediata de inmigrantes ilegales en menos de 48 horas.
        </PromiseCard>
        <PromiseCard>
          <strong>Justicia Proporcional:</strong> Endurecimiento de penas graves con prisión permanente revisable para violadores y pederastas.
        </PromiseCard>
        <PromiseCard>
          <strong>Igualdad ante la Ley:</strong> Reconocimiento equitativo de todas las víctimas de violencia, independientemente de su sexo.
        </PromiseCard>
      </div>
      <div class="promises-actions">
        <NuxtLink to="/programa" class="btn btn-action-large">Más promesas</NuxtLink>
        <a href="#" class="btn btn-action-large">Descargar PDF electoral</a>
      </div>
    </section>

    <Newsletter />
  </div>
</template>

<script setup>
useHead({
  title: 'Protección Civil Española - PCE',
  meta: [
    { name: 'description', content: 'Protección Civil Española (PCE) es un partido comprometido con la seguridad, el bienestar y la protección de la ciudadanía.' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero {
  position: relative;
  width: 100%;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .video-container {
    width: 100%;
    height: 590px;
    overflow: hidden;
    position: relative;

    .hero-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .hero-overlay {
    width: 100%;
    background-color: rgba(94, 44, 44, 0.9);
    display: flex;
    justify-content: center;
    padding: 30px 0;

    p {
      text-align: center;
      font-size: 1rem;
      max-width: 900px;
    }
  }
}

.cta {
  text-align: center;
  padding: 30px 0;

  .btn-big-cta {
    background-color: #7A3535;
    color: #B9AFB0;
    font-size: 1.5rem;
    padding: 15px 50px;
    border-radius: 30px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

    &:hover {
      transform: translateY(-2px);
      background-color: #8f4040;
    }
  }
}

.news {
  padding: 50px 0;

  .news-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .news-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .social-box {
    background-color: var(--card-bg);
    height: 100%;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    padding: 20px;
  }

  .news-more {
    display: flex;
    justify-content: center;
    margin-top: 40px;

    .btn-load-more {
      background-color: rgba(94, 44, 44, 0.7);
      color: #B9AFB0;
      padding: 16px 50px;
      font-size: 1rem;

      &:hover {
        background-color: var(--primary-red);
      }
    }
  }
}

.promises {
  padding: 50px 0;

  .promises-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }

  .promises-actions {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-top: 50px;
    flex-wrap: wrap;

    .btn-action-large {
      background-color: #5e2c2c;
      color: #B9AFB0;
      width: 100%;
      max-width: 350px;
      padding: 20px;
      font-size: 1.1rem;
      text-align: center;
      transition: all 0.3s ease;

      &:hover {
        background-color: #723233;
        transform: translateY(-3px);
      }
    }
  }
}

.section-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  text-transform: uppercase;
  margin-bottom: 30px;
  color: #B9AFB0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
