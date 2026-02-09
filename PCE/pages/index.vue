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
          <NewsCard 
            title="Programa Electoral PCE"
            excerpt="Nuestro equipo presenta las soluciones reales para las próximas elecciones." 
            date="2024-03-20"
            url="/noticias/1"
            image="https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80&w=400"
          />
          <NewsCard 
            title="Nueva Sede Madrid"
            excerpt="Inauguramos nuestro nuevo espacio de atención al ciudadano." 
            date="2024-03-15"
            url="/noticias/2"
            image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400"
          />
          <NewsCard 
            title="Prevención de Incendios"
            excerpt="Campaña informativa para la protección de nuestros bosques." 
            date="2024-03-10"
            url="/noticias/3"
            image="https://images.unsplash.com/photo-1542353436-312f02c1629e?auto=format&fit=crop&q=80&w=400"
          />
        </div>
        <div class="social-box">
          <div class="x-profile-card">
            <h3>SÍGUENOS EN X</h3>
            <div class="x-profile-info">
              <div class="x-handle">@tuflamenkito42</div>
              <p>Mantente al día con nuestras últimas noticias y actualizaciones</p>
            </div>
            <a href="https://x.com/tuflamenkito42" target="_blank" rel="noopener noreferrer" class="x-follow-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Seguir en X
            </a>
          </div>
        </div>
      </div>
      <div class="news-more">
        <NuxtLink to="/noticias" class="btn btn-load-more">MÁS NOTICIAS</NuxtLink>
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
    border-radius: 4px;
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
    background: linear-gradient(135deg, rgba(94, 44, 44, 0.95) 0%, rgba(114, 50, 51, 0.95) 100%);
    height: 100%;
    min-height: 400px; 
    padding: 40px;
    overflow: hidden; 
    border-radius: 12px;
    border: 2px solid rgba(185, 175, 176, 0.2);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .x-profile-card {
    width: 100%;
    text-align: center;
  }

  .x-profile-card h3 {
    font-family: 'Cinzel', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #B9AFB0;
    margin-bottom: 30px;
    text-transform: uppercase;
    letter-spacing: 3px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  .x-profile-info {
    margin-bottom: 35px;
  }

  .x-handle {
    font-family: 'Cinzel', serif;
    font-size: 1.8rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 15px;
    letter-spacing: 1px;
  }

  .x-profile-info p {
    color: rgba(255, 255, 255, 0.85);
    font-size: 1.05rem;
    line-height: 1.6;
    max-width: 400px;
    margin: 0 auto;
  }

  .x-follow-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #000;
    color: #fff;
    padding: 15px 40px;
    border-radius: 50px;
    font-family: 'Cinzel', serif;
    font-size: 1.1rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    letter-spacing: 1px;
  }

  .x-follow-btn:hover {
    background: #1a1a1a;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  }

  .x-follow-btn svg {
    flex-shrink: 0;
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
