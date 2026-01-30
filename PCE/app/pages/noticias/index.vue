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

// Estado reactivo
const searchQuery = ref('')
const itemsPerPage = 6
const currentPage = ref(1)

// Base de datos de noticias reales (Neutralizadas - Enero 2026)
const allNews = ref([
  // SE ACABÓ LA FIESTA (SALF)
  {
    id: 1,
    title: 'Nueva plataforma ciudadana propone auditorías externas para todo el gasto público',
    excerpt: 'La formación liderada por Alvise Pérez intensifica su campaña contra la corrupción institucional exigiendo la publicación total de los sueldos públicos.',
    date: '2026-01-29',
    source: 'SALF',
    url: 'https://seacabolafiesta.com',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Movilizaciones digitales denuncian irregularidades en la gestión del voto por correo',
    excerpt: 'Simpatizantes de la nueva agrupación política comparten evidencias sobre presuntas faltas de seguridad en el proceso de custodia de papeletas.',
    date: '2026-01-28',
    source: 'SALF',
    url: 'https://seacabolafiesta.com',
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=800&auto=format&fit=crop'
  },
  // ALIANÇA CATALANA
  {
    id: 3,
    title: 'Debate parlamentario sobre el control migratorio y la seguridad ciudadana en Cataluña',
    excerpt: 'Líderes regionales proponen un nuevo marco de gestión que priorice la integración cultural y la seguridad en los barrios.',
    date: '2026-01-27',
    source: 'Aliança Catalana',
    url: 'https://cadenaser.com',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Estrategia de soberanía económica para proteger el comercio local catalán',
    excerpt: 'La formación de Sílvia Orriols presenta un plan de incentivos para pequeños empresarios y autónomos.',
    date: '2026-01-26',
    source: 'Aliança Catalana',
    url: 'https://elpais.com',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop'
  },
  // VOX
  {
    id: 5,
    title: 'Vox presenta un recurso contra el real decreto de regularización de inmigrantes',
    excerpt: 'Santiago Abascal califica la medida como un "efecto llamada" que compromete la seguridad nacional.',
    date: '2026-01-25',
    source: 'VOX',
    url: 'https://voxespana.es',
    image: 'https://images.unsplash.com/photo-1517732359359-3df5102b3bcd?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 6,
    title: 'Defensa de la libertad educativa y el veto parental en las aulas regionales',
    excerpt: 'La formación reclama el derecho de los padres a decidir sobre los contenidos morales y sociales de sus hijos.',
    date: '2026-01-24',
    source: 'VOX',
    url: 'https://voxespana.es',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop'
  },
  // MIX
  {
    id: 7,
    title: 'La lucha contra la corrupción se sitúa como eje central de la nueva política',
    excerpt: 'Plataformas independientes coinciden en la necesidad de reducir el gasto político superfluo.',
    date: '2026-01-23',
    source: 'Actualidad',
    url: 'https://efe.com',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 8,
    title: 'Creciente preocupación por la seguridad en las zonas rurales del interior',
    excerpt: 'Se propone un refuerzo de la presencia institucional para combatir los robos en explotaciones agrícolas.',
    date: '2026-01-22',
    source: 'Nacional',
    url: 'https://rtve.es',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 9,
    title: 'El debate lingüístico vuelve al Parlament con nuevas propuestas',
    excerpt: 'Simpatizantes del regionalismo defienden la preeminencia de la lengua propia en Cataluña.',
    date: '2026-01-21',
    source: 'Regional',
    url: 'https://ara.cat',
    image: 'https://images.unsplash.com/photo-1466093578044-38af4fefc51c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 10,
    title: 'Análisis del impacto de la inmigración en el sistema sanitario público',
    excerpt: 'Nuevos informes sugieren un aumento del gasto público por la falta de control fronterizo.',
    date: '2026-01-20',
    source: 'Estudio',
    url: 'https://infobae.com',
    image: 'https://images.unsplash.com/photo-1576091160550-217359f48f4c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 11,
    title: 'Propuesta de ley para agilizar los desalojos de propiedades ocupadas',
    excerpt: 'El texto busca devolver la seguridad jurídica a los propietarios y proteger la propiedad privada.',
    date: '2026-01-19',
    source: 'Legal',
    url: 'https://elpais.com',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 12,
    title: 'Vox anuncia una ofensiva europea contra las políticas de puertas abiertas',
    excerpt: 'La delegación española en Bruselas busca reforzar las fronteras exteriores de la Unión.',
    date: '2026-01-18',
    source: 'VOX',
    url: 'https://voxespana.es',
    image: 'https://images.unsplash.com/photo-1453944303043-30588825f385?q=80&w=800&auto=format&fit=crop'
  }
])

// Noticias filtradas por búsqueda
const filteredNews = computed(() => {
  if (!searchQuery.value) {
    return allNews.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return allNews.value.filter(news => 
    news.title.toLowerCase().includes(query) ||
    news.excerpt.toLowerCase().includes(query) ||
    news.source.toLowerCase().includes(query)
  )
})

// Noticias mostradas según paginación
const displayedNews = computed(() => {
  return filteredNews.value.slice(0, currentPage.value * itemsPerPage)
})

// Verificar si hay más noticias para cargar
const hasMoreNews = computed(() => {
  return displayedNews.value.length < filteredNews.value.length
})

// Función para cargar más noticias
const loadMore = () => {
  currentPage.value++
}

// Función para filtrar noticias
const filterNews = () => {
  currentPage.value = 1 // Resetear paginación al buscar
}
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
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);

    .hero-logo img {
      width: 100px;
      margin-bottom: 20px;
    }

    .page-title {
      font-size: 2.5rem;
      margin: 0;
      font-family: var(--font-heading);
      color: #723233;
      text-transform: uppercase;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: #723233;
      margin: 10px 0 0 0;
      font-weight: 300;
      max-width: 500px;
      text-align: center;
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

.load-more, .no-more-news, .no-results {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  .btn-load-more-sm {
    background: linear-gradient(135deg, #b2a3a4 0%, #9d8e8f 100%);
    color: #723233;
    padding: 10px 30px;
    font-size: 0.9rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, #9d8e8f 0%, #8a7b7c 100%);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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

@media (max-width: 768px) {
  .hero-box {
    padding: 20px;
    .page-title {
      font-size: 2rem;
    }
  }
}
</style>
