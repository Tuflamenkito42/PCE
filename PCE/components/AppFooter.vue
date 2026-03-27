<script setup>
const isOpen = useCookieControl()
const { t, locale } = useI18n()

const lt = (es, ca, eu, gl) => {
  if (locale.value === 'ca') return ca
  if (locale.value === 'eu') return eu
  if (locale.value === 'gl') return gl
  return es
}

const runtimeConfig = useRuntimeConfig()
const localMapSrc = computed(() => `${runtimeConfig.app.baseURL}images/spain-real.svg`)

const mapOffices = [
  { name: 'Vigo', x: 214, y: 183, dx: 14, dy: 0, hq: false },
  { name: 'Bilbao', x: 356, y: 145, dx: 10, dy: -12, hq: false },
  { name: 'Madrid', x: 337, y: 226, dx: 8, dy: 18, hq: false },
  { name: 'Zaragoza', x: 390, y: 188, dx: -14, dy: -10, anchor: 'end', hq: false },
  { name: 'Barcelona', x: 455, y: 201, dx: 12, dy: -1, hq: true },
  { name: 'Valencia', x: 432, y: 248, dx: 10, dy: 16, hq: false },
  { name: 'Sevilla', x: 279, y: 310, dx: 12, dy: 0, hq: false },
  { name: 'Mallorca', x: 535, y: 218, dx: 12, dy: 5, hq: false },
  { name: 'Las Palmas', x: 86, y: 492, dx: 12, dy: -2, hq: false },
]
</script>

<template>
  <footer class="main-footer">
    <div class="footer-shell">
      <div class="footer-content">
        <div class="footer-brand-col">
          <NuxtLink to="/" class="footer-logo">
            <div class="logo-shield big-shield">
              <img src="/images/logo.png" alt="Logo PCE" class="logo-img-lg" />
            </div>
          </NuxtLink>

          <div class="footer-brand-text">
            <h3>{{ t('brand.proteccion') }}</h3>
            <h3>{{ t('brand.civil') }}</h3>
            <h3>{{ t('brand.espanola') }}</h3>
          </div>

          <div class="footer-buttons">
            <NuxtLink to="/dona" class="btn btn-donate-sm">{{ t('cta.donate') }}</NuxtLink>
            <NuxtLink to="/afiliacion" class="btn btn-join-sm">{{ t('cta.join') }}</NuxtLink>
          </div>
        </div>

        <div class="footer-links-col">
          <h4>{{ lt('Enlaces', 'Enllaços', 'Estekak', 'Ligazóns') }}</h4>
          <div class="footer-links-list">
            <NuxtLink to="/">{{ t('nav.home') }}</NuxtLink>
            <NuxtLink to="/afiliacion">{{ t('nav.join') }}</NuxtLink>
            <NuxtLink to="/dona">{{ t('cta.donate') }}</NuxtLink>
            <NuxtLink to="/transparencia">{{ t('nav.transparency') }}</NuxtLink>
            <NuxtLink to="/politica-privacidad">{{ t('footer.privacy') }}</NuxtLink>
            <NuxtLink to="/condiciones-uso">{{ t('footer.terms') }}</NuxtLink>
            <a href="#" @click.prevent="isOpen = true">{{ t('footer.cookies') }}</a>
          </div>
        </div>

        <div class="footer-contact-col">
          <h4>{{ t('nav.contact') }}</h4>
          <a class="contact-mail" href="mailto:pcepartidopolitico@gmail.com">pcepartidopolitico@gmail.com</a>

          <div class="footer-social">
            <a href="#" class="social-icon youtube" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.498-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a href="#" class="social-icon x" aria-label="X">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" class="social-icon instagram" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.846-10.405a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
              </svg>
            </a>
            <a href="#" class="social-icon telegram" aria-label="Telegram">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-.135-.089-1.294-.849-.039-1.964l.006-.005 3.16-2.863c.241-.218.468-.532-.019-.537-.585-.006-4.223 2.693-4.485 2.872-.375.257-2.651 1.636-2.73 1.684-.666.405-1.341.6-1.904.595-.626-.005-1.832-.363-2.724-.61-1.094-.303-1.464-.471-1.408-.992.029-.271.361-.555.952-.843 3.684-1.635 6.142-2.721 7.375-3.258 3.507-1.528 4.234-1.795 4.708-1.801z" />
              </svg>
            </a>
          </div>

          <div class="footer-reporting">
            <h5>{{ lt('Canal de Denuncias', 'Canal de Denúncies', 'Salaketa Kanala', 'Canle de Denuncias') }}</h5>
            <NuxtLink class="btn-reporting" to="/canal-denuncias">
              {{ lt('Abrir canal', 'Obrir canal', 'Ireki kanala', 'Abrir canle') }}
            </NuxtLink>
          </div>
        </div>

        <div class="footer-map-col">
          <h4>{{ lt('Sedes', 'Seus', 'Egoitzak', 'Sedes') }}</h4>
          <div class="footer-map">
            <h5>{{ lt('Sedes en España', 'Seus a Espanya', 'Egoitzak Espainian', 'Sedes en España') }}</h5>
            <div class="spain-map" role="img" :aria-label="lt('Mapa de España con sedes de PCE', 'Mapa d\'Espanya amb seus de PCE', 'Espainiako mapa PCE egoitzekin', 'Mapa de España con sedes de PCE')">
              <svg class="map-svg" viewBox="0 0 613 544" aria-hidden="true">
                <image class="map-shape" :href="localMapSrc" x="-10" y="16" width="632" height="562" preserveAspectRatio="xMidYMid meet" />

                <g v-for="office in mapOffices" :key="`shape-${office.name}`" class="map-pin" :class="{ hq: office.hq }">
                  <line
                    class="map-leader"
                    :x1="office.x"
                    :y1="office.y"
                    :x2="office.x + (office.dx * 0.72)"
                    :y2="office.y + (office.dy * 0.72)"
                  />
                  <circle class="map-dot" :cx="office.x" :cy="office.y" :r="office.hq ? 7 : 5" />
                  <text
                    class="map-label"
                    :x="office.x + office.dx"
                    :y="office.y + office.dy"
                    :text-anchor="office.anchor || 'start'"
                  >{{ office.name }}</text>
                </g>
              </svg>
            </div>
            <p class="hq-note">{{ lt('Sede principal: Barcelona', 'Seu principal: Barcelona', 'Egoitza nagusia: Barcelona', 'Sede principal: Barcelona') }}</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.main-footer {
  margin-top: 40px;
  background: linear-gradient(180deg, #5a2525 0%, #3a1717 100%);
  border-top: 1px solid rgba(185, 175, 176, 0.4);
}

.footer-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 56px 20px 46px;
}

.footer-content {
  display: grid;
  grid-template-columns: 1.05fr 0.9fr 0.95fr 1.3fr;
  gap: 28px;
  align-items: start;
}

.footer-brand-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-logo {
  display: inline-flex;
  text-decoration: none;
}

.logo-shield {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 5px solid rgba(114, 50, 51, 0.95);
  border-radius: 50%;
  background: #d6cfce;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  overflow: hidden;

  &.big-shield {
    width: 210px;
    height: 210px;
  }
}

.logo-img-lg {
  width: 72%;
  height: 72%;
  object-fit: contain;
}

.footer-brand-text h3 {
  margin: 0;
  font-family: 'Cinzel', serif;
  font-size: 1.65rem;
  line-height: 0.96;
  letter-spacing: 0.8px;
  color: #f0ebec;
}

.footer-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.footer-links-col h4,
.footer-contact-col h4,
.footer-map-col h4 {
  margin: 0 0 20px;
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  color: #ffffff;
}

.footer-map-col {
  min-width: 0;
}

.footer-links-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.footer-links-list a {
  color: #ddd2d3;
  text-decoration: none;
  font-size: 1.12rem;
  transition: color 0.2s ease;
}

.footer-links-list a:hover {
  color: #ffffff;
}

.contact-mail {
  display: inline-flex;
  color: #ddd2d3;
  text-decoration: none;
  font-size: 1.08rem;
  margin-bottom: 22px;
}

.footer-social {
  display: flex;
  gap: 14px;
  margin-bottom: 20px;
}

.social-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #7c5a5b;
  color: #ffffff;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.social-icon:hover {
  transform: translateY(-2px);
  background: #9a7678;
}

.footer-reporting {
  background: rgba(185, 175, 176, 0.09);
  border: 1px solid rgba(185, 175, 176, 0.35);
  border-radius: 10px;
  padding: 12px;
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
}

.footer-reporting h5 {
  margin: 0;
  color: #f1e9ea;
  font-size: 0.95rem;
  font-family: 'Cinzel', serif;
}

.footer-map {
  margin-top: 14px;
  padding: 12px;
  border: 1px solid rgba(185, 175, 176, 0.3);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.16);
}

.footer-map h5 {
  margin: 0 0 10px;
  color: #f1e9ea;
  font-size: 0.95rem;
  font-family: 'Cinzel', serif;
}

.spain-map {
  position: relative;
  height: 300px;
  border-radius: 10px;
  background:
    linear-gradient(145deg, rgba(91, 37, 37, 0.95), rgba(58, 23, 23, 0.95));
  border: 1px solid rgba(185, 175, 176, 0.24);
  overflow: hidden;
}

.spain-map::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 26px 26px;
  pointer-events: none;
  z-index: 1;
}

.map-svg {
  position: absolute;
  inset: 8px;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  border-radius: 8px;
  z-index: 2;
}

.map-shape {
  background: #d8d4d6;
  filter:
    brightness(0) saturate(100%)
    invert(93%) sepia(9%) saturate(254%) hue-rotate(291deg) brightness(105%) contrast(90%)
    drop-shadow(0 4px 10px rgba(0, 0, 0, 0.25));
  opacity: 0.96;
}

.map-leader {
  stroke: rgba(244, 237, 239, 0.9);
  stroke-width: 1.3;
  stroke-linecap: round;
}

.map-dot {
  fill: #f4eef0;
  stroke: #4a1819;
  stroke-width: 2;
}

.map-label {
  fill: #f5eef0;
  font-size: 13px;
  font-weight: 700;
  paint-order: stroke;
  stroke: rgba(58, 23, 23, 0.95);
  stroke-width: 2.1;
  stroke-linejoin: round;
  dominant-baseline: middle;
  pointer-events: none;
}

.map-pin.hq .map-dot {
  fill: #ffffff;
  stroke: #b42e31;
  stroke-width: 2.8;
}

.map-pin.hq .map-label {
  fill: #ffffff;
  stroke: #8d1f22;
  stroke-width: 2.4;
}

.hq-note {
  margin: 10px 0 0;
  color: #ddd2d3;
  font-size: 0.84rem;
}

.btn-reporting {
  background: #000;
  color: #fff;
  border: 1px solid #b9afb0;
  border-radius: 8px;
  padding: 8px 12px;
  font-family: 'Cinzel', serif;
  font-size: 0.78rem;
  text-decoration: none;
}

.btn-reporting:hover {
  background: #723233;
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }

  .footer-brand-text h3 {
    font-size: 1.4rem;
  }

  .logo-shield {
    &.big-shield {
      width: 180px;
      height: 180px;
    }
  }

  .footer-links-col h4,
  .footer-contact-col h4,
  .footer-map-col h4 {
    font-size: 1.5rem;
    margin-bottom: 14px;
  }

  .spain-map {
    height: 260px;
  }
}

@media (max-width: 760px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
