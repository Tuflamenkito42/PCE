<template>
  <main class="news-page container">
    <section class="news-hero">
      <div class="hero-box">
        <div class="hero-logo">
          <img src="/images/logo.png" alt="Logo PCE" />
        </div>
        <h1 class="page-title">NOTICIAS Y ACTUALIDAD</h1>
        <p class="hero-subtitle">Mantente informado sobre los acontecimientos políticos más relevantes</p>
      </div>
    </section>

    <section class="news-search">
      <h2 class="search-label">Buscar</h2>
      <div class="search-wrapper">
        <input 
          type="text" 
          class="search-input" 
          v-model="searchQuery"
          @input="filterNews"
          placeholder="Buscar noticias..."
        />
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
        <NewsCard 
          v-for="news in displayedNews" 
          :key="news.id" 
          :title="news.title"
          :excerpt="news.excerpt"
          :date="news.date"
          :source="news.source"
          :url="news.url"
          :image="news.image"
        />
      </div>

      <div class="load-more" v-if="hasMoreNews">
        <button @click="loadMore" class="btn btn-load-more-sm">CARGAR MÁS</button>
      </div>

      <div class="no-more-news" v-else-if="displayedNews.length > 0">
        <p>No hay más noticias disponibles</p>
      </div>

      <div class="no-results" v-if="filteredNews.length === 0 && searchQuery">
        <p>No se encontraron noticias con "{{ searchQuery }}"</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

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
  margin-bottom: 50px;

  .hero-box {
    background: linear-gradient(135deg, #b2a3a4 0%, #9d8e8f 100%);
    width: 100%;
    max-width: 600px;
    padding: 30px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);

    .hero-logo {
      margin-bottom: 24px;

      img {
        width: 100px;
        height: auto;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
      }
    }

    .page-title {
      font-size: 2.8rem;
      margin: 0 0 16px 0;
      font-family: var(--font-heading);
      color: #723233;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: #723233;
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

      &::placeholder {
        color: #999;
      }

      &:focus {
        outline: none;
        border-color: #5e2c2c;
        box-shadow: 0 0 0 3px rgba(114, 50, 51, 0.1);
      }
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
      pointer-events: none;
    }
  }
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  .btn-load-more-sm {
    background-color: #723233;
    color: var(--text-white);
    padding: 10px 30px;
    font-size: 0.9rem;
    
    &:hover {
      background-color: #5e2c2c;
    }
  }
  
  p {
    color: var(--text-grey);
    font-style: italic;
  }
}

.page-title {
  font-family: var(--font-heading);
  color: var(--text-white);
  text-transform: uppercase;
}
</style>
