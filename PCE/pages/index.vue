<template>
  <div class="page-home">
    <!-- 1. Hero con Video Limpio -->
    <section class="hero">
      <div class="video-container">
        <video autoplay muted loop playsinline class="hero-video">
          <source src="/images/videopce.mp4" type="video/mp4" />
        </video>
        <div class="video-overlay"></div>
      </div>
    </section>

    <!-- 2. Sección de Introducción -->
    <section class="welcome-section">
      <div class="container welcome-container">
        <div class="welcome-box animate-in">
          <p class="welcome-intro-text">
            Protección Civil Española (PCE) es un partido comprometido con la seguridad, el bienestar y la protección de la ciudadanía. Trabajamos por una sociedad más preparada, solidaria y transparente, poniendo en el centro la prevención, la respuesta ante emergencias y el apoyo a quienes más lo necesitan. Descubre quiénes somos, nuestras propuestas y cómo puedes formar parte del cambio.
          </p>
        </div>
      </div>
    </section>

    <!-- 3. Sección del Botón AFILIATE (Ahora rectangular como los demás, con estilo premium) -->
    <section class="affiliate-cta-section">
      <div class="container cta-container">
        <NuxtLink to="/afiliacion" class="btn btn-pce-primary btn-xl">AFILIATE</NuxtLink>
      </div>
    </section>

    <section class="bullpatriot-section">
      <div class="container">
        <NuxtLink to="/bullpatriot" class="bullpatriot-card" aria-label="Ir al chat BULLPATRIOT">
          <img
            :src="bullPatriotImage"
            alt="BULLPATRIOT"
            class="bullpatriot-image"
            @error="onBullPatriotImageError"
          />
          <div class="bullpatriot-copy">
            <h2>BULLPATRIOT</h2>
            <p>Asistente IA local con Ollama para responder dudas y generar noticias al instante.</p>
            <span class="bullpatriot-action">ENTRAR AL CHAT</span>
          </div>
        </NuxtLink>
      </div>
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
        <NuxtLink to="/noticias" class="btn btn-pce-secondary">MÁS NOTICIAS</NuxtLink>
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
        <NuxtLink to="/programa" class="btn btn-pce-primary">MÁS PROMESAS</NuxtLink>
        <a href="#" class="btn btn-pce-primary">DESCARGAR PDF ELECTORAL</a>
      </div>
    </section>

    <Newsletter />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const bullPatriotImage = ref('/images/bullpatriot.png')

const onBullPatriotImageError = () => {
  bullPatriotImage.value = '/images/logo.png'
}

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

/* 1. HERO ESTILO LIMPIO */
.hero {
  position: relative;
  width: 100%;
  height: 60vh;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;

  .video-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;

    .hero-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.1);
    }
  }
}

/* 2. SECCION BIENVENIDA / INTRO TEXT */
.welcome-section {
  padding: 0;
  background-color: #723233;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  position: relative;
  z-index: 20;
}

.welcome-box {
  padding: 60px 20px;
  text-align: center;
  width: 100%;
}

.welcome-intro-text {
  font-size: 1.3rem;
  line-height: 1.6;
  color: #ffffff;
  text-align: center;
  max-width: 1000px;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

/* 3. SISTEMA DE BOTONES VISTOSOS (FORMATO WEB) */
.btn-pce-primary {
  background-color: #5e2c2c; /* Rojo PCE */
  color: #B9AFB0;
  padding: 16px 30px;
  font-family: 'Cinzel', serif; /* Usando Cinzel para consistencia */
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: #723233;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.5);
    color: #ffffff;
  }
}

.btn-pce-secondary {
  background-color: rgba(94, 44, 44, 0.7);
  color: #B9AFB0;
  padding: 16px 50px;
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #5e2c2c;
    color: #ffffff;
  }
}

.btn-xl {
  font-size: 1.5rem;
  padding: 25px 80px;
  width: auto;
  min-width: 300px;
}

.affiliate-cta-section {
  padding: 60px 0;
  background-color: transparent;
  display: flex;
  justify-content: center;
}

.bullpatriot-section {
  padding: 20px 0 55px;
}

.bullpatriot-card {
  background: linear-gradient(140deg, #1a1a1a 0%, #2d1515 70%, #5e2c2c 100%);
  border: 2px solid rgba(185, 175, 176, 0.25);
  border-radius: 18px;
  text-decoration: none;
  display: grid;
  grid-template-columns: 190px 1fr;
  gap: 26px;
  align-items: center;
  padding: 22px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.bullpatriot-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.45);
}

.bullpatriot-image {
  width: 190px;
  height: 190px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.16);
  background: #111;
}

.bullpatriot-copy h2 {
  margin: 0 0 10px;
  font-family: 'Cinzel', serif;
  font-size: 2.2rem;
  color: #ffffff;
  letter-spacing: 2px;
}

.bullpatriot-copy p {
  margin: 0 0 16px;
  color: rgba(255, 255, 255, 0.87);
  line-height: 1.55;
  font-size: 1.02rem;
}

.bullpatriot-action {
  display: inline-flex;
  padding: 12px 20px;
  border-radius: 40px;
  background: #b9afb0;
  color: #3e1f1f;
  font-family: 'Cinzel', serif;
  font-weight: 700;
  letter-spacing: 1px;
}

.news-more {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.promises-actions {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 50px;
  flex-wrap: wrap;

  .btn-pce-primary {
    flex: 1;
    min-width: 250px;
    padding: 22px;
  }
}

@media (max-width: 768px) {
  .hero {
    height: 40vh;
  }
  .welcome-intro-text {
    font-size: 1.1rem;
  }
  .btn-xl {
    font-size: 1.25rem;
    padding: 20px 40px;
    min-width: 100%;
  }
  .promises-actions .btn-pce-primary {
    min-width: 100%;
  }

  .bullpatriot-card {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 20px;
  }

  .bullpatriot-image {
    width: 150px;
    height: 150px;
    margin: 0 auto;
  }

  .bullpatriot-copy h2 {
    font-size: 1.7rem;
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
}

.promises {
  padding: 50px 0;

  .promises-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  text-transform: uppercase;
  margin-bottom: 30px;
  color: #B9AFB0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
