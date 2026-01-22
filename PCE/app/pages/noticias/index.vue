<template>
  <main class="news-page container">
    <section class="news-hero">
      <div class="hero-box">
        <div class="hero-logo">
          <img src="/images/logo.png" alt="Logo PCE" />
        </div>
        <h1 class="page-title">NOTICIAS</h1>
      </div>
    </section>

    <section class="news-search">
      <h2 class="search-label">Buscar</h2>
      <div class="search-wrapper">
        <input type="text" class="search-input" />
        <span class="filter-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H21" stroke="#5e2c2c" stroke-width="2" stroke-linecap="round" />
            <path d="M7 12H17" stroke="#5e2c2c" stroke-width="2" stroke-linecap="round" />
            <path d="M10 18H14" stroke="#5e2c2c" stroke-width="2" stroke-linecap="round" />
          </svg>
          <span class="filter-text">Filtro</span>
        </span>
      </div>
    </section>

    <section class="news-grid-section">
      <div class="news-grid">
        <NewsCard v-for="i in 9" :key="i" title="Noticia" is-square />
      </div>

      <div class="load-more">
        <a href="#" class="btn btn-load-more-sm">CARGAR MÁS</a>
      </div>
    </section>
  </main>
</template>

<script setup>
useHead({
  title: 'Noticias - Protección Civil Española',
  meta: [
    { name: 'description', content: 'Mantente al día con las últimas noticias y actualidad de Protección Civil Española (PCE).' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.news-hero {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;

  .hero-box {
    background-color: var(--card-bg);
    width: 100%;
    max-width: 600px;
    padding: 30px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);

    .hero-logo img {
      width: 100px;
      margin-bottom: 20px;
    }

    .page-title {
      font-size: 2.5rem;
      margin: 0;
    }
  }
}

.news-search {
  margin-bottom: 40px;

  .search-label {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: var(--text-white);
  }

  .search-wrapper {
    position: relative;
    display: flex;
    align-items: center;

    .search-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #723233;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 1rem;
    }

    .filter-icon {
      position: absolute;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 5px;
      color: #5e2c2c;
      font-weight: 700;
      cursor: pointer;
    }
  }
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.load-more {
  display: flex;
  justify-content: center;

  .btn-load-more-sm {
    background-color: #723233;
    color: var(--text-white);
    padding: 10px 30px;
    font-size: 0.9rem;
    
    &:hover {
      background-color: #5e2c2c;
    }
  }
}

.page-title {
  font-family: var(--font-heading);
  color: var(--text-white);
  text-transform: uppercase;
}
</style>
