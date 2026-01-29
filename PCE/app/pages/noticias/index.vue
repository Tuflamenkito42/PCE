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

// Base de datos de noticias reales (Aliança Catalana y VOX - Enero 2026)
const allNews = ref([
  // Aliança Catalana
  {
    id: 1,
    title: 'Partido catalán se reúne con empresarios de la región',
    excerpt: 'La líder del partido se reunirá el 31 de enero con un grupo de empresarios organizados por Emilio Cuatrecasas, señalando un creciente interés del sector económico catalán.',
    date: '2026-01-29',
    source: 'Aliança Catalana',
    url: 'https://cadenaser.com',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=450&fit=crop'
  },
  {
    id: 2,
    title: 'Encuestas proyectan cambios significativos en el Parlament',
    excerpt: 'Las últimas encuestas proyectan que un partido emergente podría conseguir hasta 20 escaños en el Parlament de Catalunya, generando preocupación en las fuerzas tradicionales.',
    date: '2026-01-28',
    source: 'Aliança Catalana',
    url: 'https://elpais.com',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=450&fit=crop'
  },
  {
    id: 3,
    title: 'Formación política abre nueva sede en Barcelona',
    excerpt: 'El partido continúa su estrategia de expansión territorial con la apertura de una nueva sede en Barcelona, la tercera en Cataluña, consolidando su presencia en el territorio.',
    date: '2026-01-27',
    source: 'Aliança Catalana',
    url: 'https://infobae.com',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=450&fit=crop'
  },
  {
    id: 4,
    title: 'Intensificación del debate sobre defensa lingüística',
    excerpt: 'Un partido catalán intensifica su discurso en defensa del catalán, buscando posicionarse como líder en la protección lingüística y cultural catalana.',
    date: '2026-01-26',
    source: 'Aliança Catalana',
    url: 'https://elcatalan.es',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop'
  },
  {
    id: 5,
    title: 'Tensiones internas en formación política catalana',
    excerpt: 'Militantes de Berga cuestionaron en diciembre decisiones de liderazgo sobre nombramientos electorales, generando tensiones internas en el partido.',
    date: '2026-01-25',
    source: 'Aliança Catalana',
    url: 'https://elpais.com',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=450&fit=crop'
  },
  {
    id: 6,
    title: 'Partido centra estrategia en inmigración y seguridad',
    excerpt: 'Una formación política aprovecha el descontento con los partidos tradicionales enfatizando temas como inmigración y seguridad ciudadana.',
    date: '2026-01-24',
    source: 'Aliança Catalana',
    url: 'https://ara.cat',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=450&fit=crop'
  },

  // VOX
  {
    id: 7,
    title: 'Partido de derecha recurre regularización de inmigrantes',
    excerpt: 'Una formación política anuncia que recurrirá el real decreto que permitiría regularizar a medio millón de inmigrantes, calificando la medida como controvertida.',
    date: '2026-01-29',
    source: 'VOX',
    url: 'https://efe.com',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=450&fit=crop'
  },
  {
    id: 8,
    title: 'Líder político activa ofensiva europea contra regularización',
    excerpt: 'Un dirigente político moviliza a sus aliados europeos y solicita reunión urgente con el comisario Brunner para frenar la regularización extraordinaria de inmigrantes.',
    date: '2026-01-28',
    source: 'VOX',
    url: 'https://voxespana.es',
    image: 'https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?w=800&h=450&fit=crop'
  },
  {
    id: 9,
    title: 'Formación política utiliza inmigración para captar afiliados',
    excerpt: 'Un partido envía correos a simpatizantes animándolos a afiliarse, aprovechando la polémica sobre la regularización de inmigrantes.',
    date: '2026-01-27',
    source: 'VOX',
    url: 'https://elindependiente.com',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=450&fit=crop'
  },
  {
    id: 10,
    title: 'Oposición tumba decreto de pensiones y escudo social',
    excerpt: 'Tres partidos rechazan en el Congreso un decreto que incluía la revalorización de pensiones y la prórroga del "escudo social", criticando la mezcla de ambas medidas.',
    date: '2026-01-26',
    source: 'VOX',
    url: 'https://eldiario.es',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=450&fit=crop'
  },
  {
    id: 11,
    title: 'Críticas al bipartidismo en campaña electoral de Aragón',
    excerpt: 'Un líder político acompaña a su candidato en Aragón, criticando duramente al PP y atacando la gestión del Gobierno central.',
    date: '2026-01-25',
    source: 'VOX',
    url: 'https://rtve.es',
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&h=450&fit=crop'
  },
  {
    id: 12,
    title: 'Polémica por mensajes sobre inmigración en redes sociales',
    excerpt: 'Publicaciones de un partido en redes sociales sobre inmigración han provocado una avalancha de comentarios con contenido polémico.',
    date: '2026-01-24',
    source: 'VOX',
    url: 'https://elpais.com',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop'
  },

  // Más noticias mixtas
  {
    id: 13,
    title: 'Partido catalán atrae votantes de diversos perfiles',
    excerpt: 'A pesar de su discurso polarizante, una formación política está captando votantes de diversos perfiles, incluyendo personas no independentistas.',
    date: '2026-01-23',
    source: 'Aliança Catalana',
    url: 'https://infobae.com',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=450&fit=crop'
  },
  {
    id: 14,
    title: 'Denuncias sobre problemas en el servicio ferroviario',
    excerpt: 'Un líder político aprovecha los problemas en el servicio ferroviario para criticar la gestión del ejecutivo central.',
    date: '2026-01-23',
    source: 'VOX',
    url: 'https://rtve.es',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=450&fit=crop'
  },
  {
    id: 15,
    title: 'Preocupación por fuga de votantes en partidos tradicionales',
    excerpt: 'Formaciones políticas tradicionales muestran preocupación por la fuga de votantes hacia nuevos partidos de cara a las elecciones municipales.',
    date: '2026-01-22',
    source: 'Aliança Catalana',
    url: 'https://elpais.com',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=450&fit=crop'
  },
  {
    id: 16,
    title: 'Rechazo parlamentario a prohibición de desahucios',
    excerpt: 'Un partido vota en contra del decreto que incluía la prohibición de desahucios, argumentando que el Gobierno mezcla medidas para forzar su aprobación.',
    date: '2026-01-22',
    source: 'VOX',
    url: 'https://elpais.com',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=450&fit=crop'
  },
  {
    id: 17,
    title: 'Formación política refuerza presencia municipal',
    excerpt: 'Un partido acelera su implantación territorial con vistas a las próximas elecciones municipales, abriendo nuevas sedes y captando militantes.',
    date: '2026-01-21',
    source: 'Aliança Catalana',
    url: 'https://elcatalan.es',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=450&fit=crop'
  },
  {
    id: 18,
    title: 'Acusaciones de cobardía política entre partidos',
    excerpt: 'Un líder político arremete contra el Partido Popular por su gestión en comunidades autónomas y su postura ante el Gobierno central.',
    date: '2026-01-21',
    source: 'VOX',
    url: 'https://voxespana.es',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=450&fit=crop'
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
    max-width: 700px;
    padding: 50px 40px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    text-align: center;

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
      font-weight: 300;
      max-width: 500px;
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

.load-more,
.no-more-news,
.no-results {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  .btn-load-more-sm {
    background-color: #723233;
    color: var(--text-white);
    padding: 12px 40px;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    &:hover {
      background-color: #5e2c2c;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(114, 50, 51, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }

  p {
    color: var(--text-grey);
    font-size: 1.1rem;
    font-style: italic;
  }
}

.page-title {
  font-family: var(--font-heading);
  color: var(--text-white);
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }

  .news-hero {
    margin-bottom: 40px;

    .hero-box {
      padding: 40px 24px;
      max-width: 100%;

      .hero-logo img {
        width: 80px;
      }

      .page-title {
        font-size: 2rem;
        letter-spacing: 1.5px;
      }

      .hero-subtitle {
        font-size: 0.95rem;
      }
    }
  }

  .news-search {
    .search-label {
      font-size: 1rem;
    }
  }
}
</style>
