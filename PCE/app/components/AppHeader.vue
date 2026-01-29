<script setup>
const { user, logout } = useAuth()
// Optional: user initials
const userInitials = computed(() => {
  if (user.value?.full_name) {
    return user.value.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }
  return 'U'
})
</script>

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
      <NuxtLink to="/dona" class="btn btn-donate">DONA</NuxtLink>
      <NuxtLink to="/afiliacion" class="btn btn-join">AFILIATE</NuxtLink>
      
      <!-- Auth Actions -->
      <ClientOnly>
        <div v-if="user" class="auth-controls">
           <NuxtLink v-if="user.role === 'admin'" to="/admin" class="btn-admin" title="Panel Administración">
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
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
            />
          </svg>
        </NuxtLink>
      </ClientOnly>
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

  .logo-link {
    text-decoration: none;
  }

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

      .auth-controls {
      display: flex;
      align-items: center;
      gap: 10px;

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

        &:hover {
          background: #723233;
          color: #fff;
          transform: rotate(90deg);
        }

        .admin-icon {
          width: 24px;
          height: 24px;
          fill: currentColor;
        }
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

        &:hover {
          transform: scale(1.1);
          color: #000;
        }

        .logout-icon {
          width: 24px;
          height: 24px;
          fill: currentColor;
        }
      }
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
