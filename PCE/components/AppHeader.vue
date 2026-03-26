<script setup>
import { ref, computed, onMounted } from 'vue'

const { user, logout } = useAuth()
// Optional: user initials
const userInitials = computed(() => {
  if (user.value?.full_name) {
    return user.value.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }
  return 'U'
})

const mobileMenuOpen = ref(false)
const isDarkMode = ref(false)
const bullpatriotLogoSrc = computed(() => (isDarkMode.value ? '/images/bullpatriot2.png' : '/images/bullpatriot.png'))

const applyTheme = (dark) => {
  if (!process.client) {
    return
  }

  document.body.classList.toggle('theme-dark', dark)
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  applyTheme(isDarkMode.value)
  if (process.client) {
    localStorage.setItem('pce-theme', isDarkMode.value ? 'dark' : 'light')
  }
}

onMounted(() => {
  const saved = process.client ? localStorage.getItem('pce-theme') : null
  isDarkMode.value = saved === 'dark'
  applyTheme(isDarkMode.value)
})

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
const closeMenu = () => {
  mobileMenuOpen.value = false
}

</script>

<template>
  <header class="main-header">
    <div class="brand-left">
      <NuxtLink to="/" class="logo-link">
        <div class="logo-container">
          <div class="logo-shield">
            <img src="/images/logo.png" alt="Logo PCE" class="logo-img" />
          </div>
          <div class="logo-text">
            <span>PROTECCION</span>
            <span>CIVIL</span>
            <span>ESPAÑOLA</span>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink to="/bullpatriot" class="bullpatriot-top-link" title="Ir a BULLPATRIOT" aria-label="Ir a BULLPATRIOT">
        <img :src="bullpatriotLogoSrc" alt="BULLPATRIOT - Asistente IA" class="bullpatriot-top-icon" />
      </NuxtLink>
    </div>

    <div class="desktop-nav-actions">
      <nav class="main-nav">
        <NuxtLink to="/" class="nav-link">INICIO</NuxtLink>
        <NuxtLink to="/noticias" class="nav-link">ACTUALIDAD</NuxtLink>
        <NuxtLink to="/afiliacion" class="nav-link">ÚNETE</NuxtLink>
        <NuxtLink to="/programa" class="nav-link">PROGRAMA</NuxtLink>
        <NuxtLink to="/votaciones" class="nav-link">VOTACIONES</NuxtLink>
        <NuxtLink to="/contacto" class="nav-link">CONTACTO</NuxtLink>
        <NuxtLink to="/transparencia" class="nav-link">TRANSPARENCIA</NuxtLink>
      </nav>

      <div class="header-actions hide-mobile">
        <NuxtLink to="/dona" class="btn btn-donate">DONA</NuxtLink>
        <NuxtLink to="/afiliacion" class="btn btn-join">AFILIATE</NuxtLink>

        <button
          type="button"
          class="theme-toggle-tab"
          :class="{ 'is-dark': isDarkMode }"
          :aria-label="isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          :title="isDarkMode ? 'Modo oscuro activado' : 'Modo claro activado'"
          @click="toggleTheme"
        >
          <span class="theme-toggle-track" aria-hidden="true">
            <span class="theme-toggle-icon theme-toggle-icon-top">
              <svg viewBox="0 0 24 24" class="theme-icon theme-icon-sun" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.7 5.3l-1.7 1.7M7 17l-1.7 1.7M18.7 18.7L17 17M7 7L5.3 5.3" />
              </svg>
            </span>
            <span class="theme-toggle-icon theme-toggle-icon-bottom">
              <svg viewBox="0 0 24 24" class="theme-icon theme-icon-moon" aria-hidden="true">
                <path d="M14.53 2.3a1 1 0 00-1.17 1.31 7 7 0 11-8.98 8.98 1 1 0 00-1.3 1.17A9 9 0 1014.52 2.3z" />
              </svg>
            </span>
            <span class="theme-toggle-thumb" />
          </span>
        </button>
        
        <!-- Auth Actions -->
        <ClientOnly>
          <div v-if="user" class="auth-controls">
             <NuxtLink v-if="(user.role || '').toLowerCase() === 'admin'" to="/admin" class="btn-admin" title="Panel Administración">
               <svg viewBox="0 0 24 24" class="admin-icon">
                 <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.49l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
               </svg>
             </NuxtLink>
             <div class="user-badge" title="Usuario conectado">
                {{ userInitials }}
             </div>
             <button @click="logout" class="btn-logout" title="Cerrar Sesión">
                <svg viewBox="0 0 24 24" class="logout-icon">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
             </button>
          </div>
          <NuxtLink v-else to="/login" class="user-auth-link" title="Iniciar Sesión">
            <svg class="user-icon" viewBox="0 0 24 24">
               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </NuxtLink>
        </ClientOnly>
      </div>
    </div>

    <!-- Mobile Button -->
    <button class="mobile-toggle" @click="toggleMenu" aria-label="Toggle menu">
      <svg v-if="!mobileMenuOpen" viewBox="0 0 24 24" width="28" height="28" fill="#723233">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" width="28" height="28" fill="#723233">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
      </svg>
    </button>

    <!-- Mobile Dropdown -->
    <div class="mobile-menu" :class="{ 'is-open': mobileMenuOpen }">
      <nav class="mobile-nav" @click="closeMenu">
        <NuxtLink to="/">INICIO</NuxtLink>
        <NuxtLink to="/noticias">ACTUALIDAD</NuxtLink>
        <NuxtLink to="/afiliacion">ÚNETE</NuxtLink>
        <NuxtLink to="/programa">PROGRAMA</NuxtLink>
        <NuxtLink to="/bullpatriot">BULLPATRIOT</NuxtLink>
        <NuxtLink to="/votaciones">VOTACIONES</NuxtLink>
        <NuxtLink to="/contacto">CONTACTO</NuxtLink>
        <NuxtLink to="/transparencia">TRANSPARENCIA</NuxtLink>
        
        <div class="mobile-actions">
           <NuxtLink to="/dona" class="btn btn-donate btn-block">DONA</NuxtLink>
           <NuxtLink to="/afiliacion" class="btn btn-join btn-block">AFILIATE</NuxtLink>
           <br/>
           <ClientOnly>
             <div v-if="user" class="mobile-auth">
               <NuxtLink v-if="(user.role || '').toLowerCase() === 'admin'" to="/admin" class="btn btn-donate btn-block">PANEL ADMIN</NuxtLink>
                <div class="user-badge" title="Usuario conectado">{{ userInitials }}</div>
                <button @click="logout" class="btn-logout btn-block">CERRAR SESIÓN</button>
             </div>
             <NuxtLink v-else to="/login" class="btn btn-join btn-block">INICIAR SESIÓN</NuxtLink>
           </ClientOnly>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: var(--nav-height, 80px);
  background-color: #b2a3a4;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.theme-toggle-tab {
  --toggle-w: 32px;
  --toggle-h: 62px;
  --toggle-inset: 1px;
  --thumb-size: 30px;
  --thumb-h: 36px;
  --thumb-left: calc((var(--toggle-w) - var(--thumb-size)) / 2);
  --icon-size: 12px;
  --icon-offset: 9px;
  --thumb-travel: calc(var(--toggle-h) - (var(--toggle-inset) * 2) - var(--thumb-h));
  width: var(--toggle-w);
  height: var(--toggle-h);
  border-radius: 999px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 0;
  margin-inline: 4px;
  flex-shrink: 0;
  position: relative;
  z-index: 3;
}

.theme-toggle-tab:hover {
  transform: none;
}

.theme-toggle-track {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 999px;
  background: #723233;
  position: relative;
  border: none;
  box-shadow: none;
  overflow: hidden;
  transition: background-color 0.25s ease;
}

.theme-toggle-tab.is-dark .theme-toggle-track {
  background: #000000;
}

.theme-toggle-thumb {
  position: absolute;
  left: var(--thumb-left);
  top: var(--toggle-inset);
  width: var(--thumb-size);
  height: var(--thumb-h);
  border-radius: 999px;
  background: #000000;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease, background-color 0.25s ease;
  transform: translateY(var(--thumb-travel));
  z-index: 1;
  pointer-events: none;
}

.theme-toggle-tab.is-dark .theme-toggle-thumb {
  background: #723233;
  transform: translateY(0);
}

.theme-toggle-icon {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.theme-toggle-icon-top {
  top: var(--icon-offset);
}

.theme-toggle-icon-bottom {
  bottom: var(--icon-offset);
}

.theme-icon {
  width: var(--icon-size);
  height: var(--icon-size);
}

.theme-icon-moon {
  color: #723233;
  fill: currentColor;
}

.theme-icon-sun {
  color: #000000;
}

.brand-left {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 3;
}

.logo-link {
  text-decoration: none;
  z-index: 1001;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-shield {
  width: 50px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-text {
  display: flex;
  flex-direction: column;
  font-family: var(--font-heading, serif);
  font-weight: 800;
  font-size: 0.8rem;
  line-height: 1.2;
  color: #723233;
  border-left: 1px solid #723233;
  padding-left: 10px;
}

.desktop-nav-actions {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-left: auto;
  position: relative;
  z-index: 3;
}

.bullpatriot-top-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background: transparent;
  border: none;
  padding: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  z-index: 4;
}

.bullpatriot-top-link:hover,
.bullpatriot-top-link.router-link-active {
  transform: scale(1.08);
  filter: drop-shadow(0 4px 8px rgba(94, 44, 44, 0.4));
}

.bullpatriot-top-icon {
  width: 70px;
  height: 70px;
  border-radius: 4px;
  object-fit: cover;
  border: none;
  display: block;
  transition: transform 0.3s ease;
}

.bullpatriot-top-link span {
  display: none;
}

.main-nav {
  display: none;
  gap: 20px;
}

@media (min-width: 1024px) {
  .main-nav { display: flex; }
}

@media (max-width: 1023px) {
  .brand-left {
    gap: 8px;
  }

  .bullpatriot-top-link {
    padding: 4px;
  }

  .bullpatriot-top-icon {
    width: 55px;
    height: 55px;
  }
}

.main-nav .nav-link {
  color: #723233;
  text-decoration: none;
  font-family: var(--font-heading, serif);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: color 0.3s;
}

.main-nav .nav-link:visited,
.main-nav .nav-link.router-link-active,
.main-nav .nav-link.router-link-exact-active {
  color: #723233;
}

.main-nav .nav-link:hover {
  color: #5e2c2c;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.hide-mobile {
  display: none;
}

@media (min-width: 1024px) {
  .hide-mobile { display: flex; }
}

.auth-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-admin {
  background: transparent;
  color: #723233;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #723233;
  transition: all 0.2s;
  width: 40px;
  height: 40px;
}

.btn-admin:hover {
  background: #723233;
  color: #fff;
  transform: rotate(90deg);
}

.admin-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.user-badge {
  width: 40px;
  height: 40px;
  background-color: #723233;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-family: 'Cinzel', serif;
  border: 2px solid #fff;
}

.btn-logout {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  color: #000;
  transition: transform 0.2s;
}

.btn-logout:hover {
  transform: scale(1.1);
}

.logout-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.user-auth-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  background: #000;
  border-radius: 50%;
  color: #B9AFB0;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.user-auth-link:hover,
.user-auth-link.router-link-active {
  background: #723233;
  border-color: #B9AFB0;
  transform: scale(1.1);
}

.user-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

/* Mobile Toggle */
.mobile-toggle {
  display: block;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
  padding: 5px;
}

@media (min-width: 1024px) {
  .mobile-toggle { display: none; }
}

/* Mobile Menu */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #b2a3a4;
  padding: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transform: translateY(-150%);
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
  z-index: 1000;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.mobile-menu.is-open {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
}

@media (min-width: 1024px) {
  .mobile-menu {
    display: none;
  }
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mobile-nav a:not(.btn) {
  color: #723233;
  text-decoration: none;
  font-family: var(--font-heading, serif);
  font-size: 1.1rem;
  font-weight: 700;
  padding: 10px 0;
  border-bottom: 1px solid rgba(114, 50, 51, 0.2);
}

.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.btn-block {
  width: 100%;
  text-align: center;
  padding: 12px;
}

.mobile-auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.mobile-auth .btn-logout {
  background: #723233;
  color: white;
  border-radius: 4px;
  font-family: var(--font-heading, serif);
  font-weight: bold;
}

@media (max-width: 600px) {
  .main-header {
    padding: 0 15px;
  }

  .logo-text {
    font-size: 0.6rem;
  }
}
</style>
