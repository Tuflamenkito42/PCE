<template>
  <header class="main-header">
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

    <nav class="main-nav">
      <NuxtLink to="/">INICIO</NuxtLink>
      <NuxtLink to="/noticias">ACTUALIDAD</NuxtLink>
      <NuxtLink to="/afiliacion">ÚNETE</NuxtLink>
      <NuxtLink to="/programa">PROGRAMA</NuxtLink>
      <NuxtLink to="/votaciones">VOTACIONES</NuxtLink>
      <NuxtLink to="/#transparencia">TRANSPARENCIA</NuxtLink>
    </nav>

    <div class="header-actions">
      <a href="#" class="btn btn-donate">DONA</a>
      <NuxtLink to="/afiliacion" class="btn btn-join">AFILIATE</NuxtLink>
      <NuxtLink to="/login" class="user-auth-link" title="Iniciar Sesión">
        <svg class="user-icon" viewBox="0 0 24 24">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
          />
        </svg>
      </NuxtLink>
    </div>
  </header>
</template>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: var(--nav-height);
  background-color: #b2a3a4;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;

  .logo-container {
    display: flex;
    align-items: center;
    gap: 15px;

    .logo-shield {
      width: 50px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;

      .logo-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      font-family: var(--font-heading);
      font-weight: 800;
      font-size: 0.8rem;
      line-height: 1.2;
      color: #723233;
      border-left: 1px solid #723233;
      padding-left: 10px;
    }
  }

  .main-nav {
    display: none;
    gap: 20px;

    @media (min-width: 1024px) {
      display: flex;
    }

    a {
      color: #723233;
      text-decoration: none;
      font-family: var(--font-heading);
      font-size: 0.8rem;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
      transition: color 0.3s;

      &:hover, &.router-link-active {
        color: #5e2c2c;
      }
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 15px;

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

      &:hover, &.router-link-active {
        background: #723233;
        border-color: #B9AFB0;
        transform: scale(1.1);
      }

      .user-icon {
        width: 24px;
        height: 24px;
        fill: currentColor;
      }
    }
  }
}
</style>
