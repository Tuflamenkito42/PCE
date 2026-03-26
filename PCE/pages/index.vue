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

    <section class="ia-promo-section">
      <div class="container">
        <div class="ia-promo-card">
          <div class="ia-promo-copy">
            <p class="ia-promo-chip">NUEVO</p>
            <h2>Prueba Nuestra IA</h2>
            <p>
              Haz clic en el toro y entra en BULLPATRIOT para resolver dudas,
              consultar propuestas y generar contenido al instante. Tambien puedes
              encontrar el acceso directo en la barra de navegación superior.
            </p>
            <NuxtLink to="/bullpatriot" class="btn btn-pce-primary">ABRIR BULLPATRIOT</NuxtLink>
          </div>

          <NuxtLink
            to="/bullpatriot"
            class="ia-promo-bull"
            aria-label="Prueba nuestra IA clicando el toro"
          >
            <img src="/images/bullpatriot.png" alt="Toro BULLPATRIOT" />
            <span>Prueba nuestra IA clicando el toro</span>
          </NuxtLink>
        </div>
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
          <strong>Justicia implacable:</strong> Pena de muerte para violadores y pederastas: medida extrema pero necesaria contra crímenes irreversibles que destruyen vidas y dignidad humana. Justicia firme para víctimas, infancia y sociedad.
        </PromiseCard>
        <PromiseCard>
          <strong>Control de Fronteras:</strong> Estableceremos un protocolo de expulsión inmediata de inmigrantes ilegales en menos de 48 horas, con protección temporal únicamente para ciudadanos de países en conflicto armado reconocido internacionalmente.
        </PromiseCard>
        <PromiseCard>
          <strong>Fomento de la Natalidad:</strong> Implementación de la misma norma que Rusia en la baja por maternidad y paternidad, extendiéndola hasta los 3 años de duración para fomentar la natalidad y asegurar el bienestar de las familias españolas.
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

.ia-promo-section {
  padding: 12px 0 62px;
}

.ia-promo-card {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
  align-items: center;
  padding: 30px;
  border-radius: 22px;
  border: 1px solid rgba(214, 188, 148, 0.35);
  background:
    radial-gradient(circle at 8% 12%, rgba(214, 188, 148, 0.16), transparent 34%),
    radial-gradient(circle at 85% 85%, rgba(255, 255, 255, 0.08), transparent 40%),
    linear-gradient(125deg, rgba(35, 16, 16, 0.98) 0%, rgba(88, 32, 34, 0.94) 55%, rgba(62, 27, 29, 0.95) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 18px 34px rgba(0, 0, 0, 0.38);
}

.ia-promo-card::before {
  content: '';
  position: absolute;
  inset: 8px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  pointer-events: none;
  z-index: -1;
}

.ia-promo-copy h2 {
  margin: 0 0 12px;
  font-family: 'Cinzel', serif;
  font-size: clamp(1.7rem, 3.2vw, 2.4rem);
  color: #ffffff;
  letter-spacing: 1.2px;
  text-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}

.ia-promo-copy p {
  margin: 0 0 22px;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.62;
  max-width: 62ch;
}

.ia-promo-chip {
  display: inline-block;
  margin: 0 0 12px;
  padding: 7px 13px;
  border-radius: 999px;
  font-size: 0.75rem;
  letter-spacing: 0.8px;
  font-weight: 700;
  color: #3f1e1e;
  background: linear-gradient(120deg, #e6d2ae, #d7c3a0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.ia-promo-bull {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 250px;
  border-radius: 16px;
  text-decoration: none;
  padding: 20px;
  border: 1px solid rgba(214, 188, 148, 0.32);
  background: #B9AFB0;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.ia-promo-bull:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.34);
  border-color: rgba(214, 188, 148, 0.58);
}

.ia-promo-bull img {
  width: min(235px, 76%);
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.45));
  animation: bullFloat 2.8s ease-in-out infinite;
}

.ia-promo-bull span {
  text-align: center;
  color: #3e1f1f;
  font-weight: 700;
  letter-spacing: 0.45px;
  text-transform: uppercase;
  font-size: 0.92rem;
}

@keyframes bullFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
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

  .ia-promo-card {
    grid-template-columns: 1fr;
    padding: 22px;
  }

  .ia-promo-copy {
    text-align: center;
  }

  .ia-promo-copy h2 {
    font-size: 1.6rem;
  }

  .ia-promo-bull {
    min-height: 200px;
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
