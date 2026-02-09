<template>
  <main class="news-page container">
    <section class="news-hero">
      <div class="hero-header-box">
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
          placeholder="BUSCAR NOTICIAS..."
        />
        <div class="filter-action" @click="toggleFilters">
          <span class="filter-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M7 12H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M10 18H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </span>
          <span class="filter-text">FILTRO</span>
        </div>
      </div>

      <!-- Category Filter Dropdown -->
      <transition name="fade-slide">
        <div class="filter-dropdown" v-if="showFilters">
          <button 
            v-for="source in sources" 
            :key="source"
            @click="selectSource(source)"
            :class="['filter-chip', { active: selectedSource === source }]"
          >
            {{ source }}
          </button>
        </div>
      </transition>
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

// Noticias de política de España e Inmigración centradas en el PCE
const allNews = ref([
  {
    id: 1,
    title: 'PCE exige el control inmediato de fronteras ante el aumento de la inmigración ilegal',
    excerpt: 'Lideramos la propuesta parlamentaria para reforzar los puntos críticos de entrada y garantizar la seguridad de todos los ciudadanos españoles ante el flujo migratorio descontrolado.',
    date: '2024-03-30',
    source: 'Gabinete de Seguridad',
    url: '/noticias/1',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43552e?q=80&w=800&auto=format&v=1'
  },
  {
    id: 2,
    title: 'Plan de choque en Canarias: El PCE propone medidas urgentes de gestión migratoria',
    excerpt: 'Nuestra directiva nacional visita las islas para presentar un plan de respuesta rápida y apoyo logístico a las fuerzas de seguridad en zona de costa.',
    date: '2024-03-27',
    source: 'Política Territorial',
    url: '/noticias/2',
    image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?q=80&w=800&auto=format&v=1'
  },
  {
    id: 3,
    title: 'Seguridad Nacional: PCE vincula la inmigración descontrolada con el reto de la seguridad',
    excerpt: 'Analizamos los datos de delincuencia y proponemos una política de tolerancia cero ante cualquier entrada ilegal en territorio nacional.',
    date: '2024-03-24',
    source: 'Interior',
    url: '/noticias/3',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=800&auto=format&v=1'
  },
  {
    id: 4,
    title: 'Expulsión Exprés: La nueva propuesta de Ley de Extranjería del PCE',
    excerpt: 'Establecemos marcos legales para que cualquier inmigrante ilegal sea retornado a su país de origen en tiempo récord, garantizando el cumplimiento de la ley.',
    date: '2024-03-21',
    source: 'Parlamento',
    url: '/noticias/4',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&v=1'
  },
  {
    id: 5,
    title: 'Sondeo Nacional: Los españoles respaldan las medidas del PCE sobre inmigración',
    excerpt: 'El último Barómetro de Opinión sitúa nuestras propuestas de control fronterizo como las más valoradas por la población tras los últimos incidentes.',
    date: '2024-03-18',
    source: 'Opinión Pública',
    url: '/noticias/5',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&v=1'
  },
  {
    id: 6,
    title: 'Fronteras Inteligentes: Inversión masiva en biometría y vigilancia digital',
    excerpt: 'El PCE presenta un plan tecnológico de vanguardia para blindar nuestras fronteras y detectar entradas no autorizadas de forma automática.',
    date: '2024-03-15',
    source: 'Innovación y Seguridad',
    url: '/noticias/6',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&v=1'
  },
  {
    id: 7,
    title: 'PCE advierte sobre el colapso de centros de acogida en el sur de España',
    excerpt: 'La saturación de las infraestructuras de acogida pone en riesgo la convivencia y desborda la capacidad de los servicios municipales.',
    date: '2024-03-12',
    source: 'Bienestar Social',
    url: '/noticias/7',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&v=1'
  },
  {
    id: 8,
    title: 'Reforma del Código Penal: PCE propone penas más duras para traficantes de personas',
    excerpt: 'Nuestro equipo jurídico detalla una propuesta para perseguir implacablemente a las mafias que lucran con la inmigración ilegal.',
    date: '2024-03-09',
    source: 'Justicia',
    url: '/noticias/8',
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=800&auto=format&v=1'
  },
  {
    id: 9,
    title: 'PCE refuerza su presencia en Bruselas para exigir un cambio en la política europea',
    excerpt: 'Exigimos que la Unión Europea asuma su responsabilidad y dote de más medios a los países fronterizos como España.',
    date: '2024-03-06',
    source: 'Exterior',
    url: '/noticias/9',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&v=1'
  },
  {
    id: 10,
    title: 'Vigilancia en Melilla: PCE solicita duplicar los efectivos de la Guardia Civil',
    excerpt: 'La presión migratoria en el perímetro fronterizo de Melilla hace necesario un incremento inmediato de recursos humanos y técnicos.',
    date: '2024-03-03',
    source: 'Seguridad Nacional',
    url: '/noticias/10',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&v=1'
  },
  {
    id: 11,
    title: 'Inmigración y Sanidad: El informe del PCE sobre la sostenibilidad del sistema',
    excerpt: 'Analizamos cómo la inmigración descontrolada afecta a las listas de espera y al acceso Universal de los españoles a la salud.',
    date: '2024-02-28',
    source: 'Sanidad',
    url: '/noticias/11',
    image: 'https://images.unsplash.com/photo-1505751172876-019669864d9c?q=80&w=800&auto=format&v=1'
  },
  {
    id: 12,
    title: 'PCE propone revocar la nacionalidad a inmigrantes con delitos graves',
    excerpt: 'Una medida firme para garantizar que quienes vienen a España respeten nuestras leyes y nuestra convivencia social.',
    date: '2024-02-25',
    source: 'Justicia',
    url: '/noticias/12',
    image: 'https://images.unsplash.com/photo-1555181126-cf46a03827ec?q=80&w=800&auto=format&v=1'
  },
  {
    id: 13,
    title: 'Crisis de la España Vacía: ¿Es la inmigración la solución? El PCE dice no.',
    excerpt: 'Defendemos que la repoblación debe basarse en el fomento de la natalidad nacional y no en flujos migratorios externos descontrolados.',
    date: '2024-02-22',
    source: 'Política Territorial',
    url: '/noticias/13',
    image: 'https://images.unsplash.com/photo-1596438459194-f275f413d6ff?q=80&w=800&auto=format&v=1'
  },
  {
    id: 14,
    title: 'Impacto Laboral: Cómo la mano de obra ilegal afecta a los salarios en el campo',
    excerpt: 'El PCE denuncia la explotación laboral de inmigrantes ilegales y cómo esto deprime las condiciones de los trabajadores españoles.',
    date: '2024-02-19',
    source: 'Economía y Trabajo',
    url: '/noticias/14',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&v=1'
  },
  {
    id: 15,
    title: 'PCE presenta el "Plan de Retorno Seguro" para inmigraciones irregulares',
    excerpt: 'Un programa diplomático y logístico para agilizar las repatriaciones en colaboración con los países africanos de origen.',
    date: '2024-02-16',
    source: 'Exterior',
    url: '/noticias/15',
    image: 'https://images.unsplash.com/photo-1469122312224-c5846569efe1?q=80&w=800&auto=format&v=1'
  }
])

const searchQuery = ref('')
const selectedSource = ref('Todas')
const showFilters = ref(false)
const itemsPerPage = ref(3)
const currentPage = ref(1)

// Get unique sources from news
const sources = computed(() => {
  const allSources = allNews.value.map(n => n.source)
  return ['Todas', ...new Set(allSources)]
})

const filteredNews = computed(() => {
  let filtered = allNews.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(news => 
      news.title.toLowerCase().includes(query) || 
      news.excerpt.toLowerCase().includes(query)
    )
  }

  // Filter by selected source
  if (selectedSource.value !== 'Todas') {
    filtered = filtered.filter(news => news.source === selectedSource.value)
  }
  
  return filtered
})

const displayedNews = computed(() => {
  return filteredNews.value.slice(0, currentPage.value * itemsPerPage.value)
})

const hasMoreNews = computed(() => {
  return displayedNews.value.length < filteredNews.value.length
})

const loadMore = () => {
  currentPage.value++
}

const filterNews = () => {
  currentPage.value = 1
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const selectSource = (source) => {
  selectedSource.value = source
  filterNews()
  showFilters.value = false
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
  align-items: center;
  margin-bottom: 60px;
  padding: 40px 0;

  .hero-header-box {
    background: rgba(114, 50, 51, 0.85);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 40px 60px;
    border-radius: 8px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    text-align: center;
    max-width: 900px;
    width: 100%;

    .page-title {
      font-size: 3.5rem;
      margin: 0 0 20px 0;
      font-family: var(--font-heading);
      color: var(--text-white);
      text-transform: uppercase;
      letter-spacing: 4px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    .hero-subtitle {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 2px;
      display: inline-block;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
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
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(114, 50, 51, 0.3);
      padding: 16px 120px 16px 25px;
      border-radius: 8px;
      font-size: 1rem;
      letter-spacing: 1px;
      font-family: var(--font-heading);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &::placeholder {
        color: #999;
        text-transform: uppercase;
      }

      &:focus {
        outline: none;
        border-color: #723233;
        background: #ffffff;
        box-shadow: 0 6px 20px rgba(114, 50, 51, 0.2);
      }
    }

    .filter-action {
      position: absolute;
      right: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #723233;
      font-weight: 700;
      cursor: pointer;
      padding: 8px 15px;
      border-radius: 6px;
      transition: all 0.3s ease;
      font-family: var(--font-heading);
      letter-spacing: 1px;

      &:hover {
        background: rgba(114, 50, 51, 0.1);
      }

      .filter-icon {
        display: flex;
        align-items: center;
      }

      .filter-text {
        font-size: 0.9rem;
      }
    }
  }
}

.filter-dropdown {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  margin-top: -30px;
  margin-bottom: 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  border: 1px solid rgba(114, 50, 51, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 10;

  .filter-chip {
    padding: 8px 18px;
    border-radius: 50px;
    border: 1px solid rgba(114, 50, 51, 0.2);
    background: transparent;
    color: #723233;
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(114, 50, 51, 0.05);
      border-color: #723233;
    }

    &.active {
      background: #723233;
      color: white;
      border-color: #723233;
      box-shadow: 0 4px 12px rgba(114, 50, 51, 0.3);
    }
  }
}

/* Transitions */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease-out;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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
