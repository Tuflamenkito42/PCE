<template>
  <main class="news-detail-page container" v-if="news">
    <div class="back-link">
      <NuxtLink to="/noticias" class="btn-back">
        <span class="arrow">←</span> Volver a noticias
      </NuxtLink>
    </div>

    <article class="news-article">
      <header class="article-header">
        <div class="article-meta">
          <span class="date">{{ formattedDate }}</span>
          <span class="separator">|</span>
          <span class="source">{{ news.source }}</span>
        </div>
        <h1 class="article-title">{{ news.title }}</h1>
      </header>

      <div class="article-image" v-if="news.image">
        <img :src="news.image" :alt="news.title" />
      </div>

      <div class="article-content">
        <p class="lead-text">{{ news.excerpt }}</p>
        
        <div class="main-text">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          
          <h3>Compromiso con la ciudadanía</h3>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
            eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
          
          <blockquote>
            "Nuestra prioridad absoluta es garantizar la seguridad y el bienestar de cada ciudadano, implementando medidas 
            transparentes y eficaces que respondan a los retos de nuestra sociedad actual."
          </blockquote>
          
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores 
            eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, 
            consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam 
            quaerat voluptatem.
          </p>
        </div>
      </div>
      
      <footer class="article-footer">
        <div class="share-box">
          <span>Compartir:</span>
          <div class="social-icons">
            <a href="#" class="social-icon">X</a>
            <a href="#" class="social-icon">FB</a>
            <a href="#" class="social-icon">WS</a>
          </div>
        </div>
      </footer>
    </article>
  </main>
  
  <main class="container error-container" v-else>
    <h1>Noticia no encontrada</h1>
    <p>Lo sentimos, la noticia que buscas no existe o ha sido movida.</p>
    <NuxtLink to="/noticias" class="btn btn-primary">Volver a noticias</NuxtLink>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id

// En un caso real, esto se pediría al servidor o a un store
const allNews = [
  {
    id: 1,
    title: 'PCE presenta su programa para las próximas elecciones',
    excerpt: 'Nuestro equipo ha trabajado intensamente para ofrecer soluciones reales a los problemas actuales de seguridad y bienestar social. Un plan integral para el futuro.',
    date: '2024-03-20',
    source: 'Gabinete de Prensa',
    image: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 2,
    title: 'Inauguración de la nueva sede en Madrid',
    excerpt: 'Acompañanos en la apertura de nuestro nuevo espacio de atención al ciudadano donde escucharemos todas tus propuestas en un ambiente moderno y accesible.',
    date: '2024-03-15',
    source: 'Eventos',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 3,
    title: 'Campaña de concienciación sobre prevención de incendios',
    excerpt: 'Protección Civil Española lanza una iniciativa para educar sobre los riesgos y medidas preventivas en hogares y espacios públicos durante este verano.',
    date: '2024-03-10',
    source: 'Social',
    image: 'https://images.unsplash.com/photo-1542353436-312f02c1629e?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 4,
    title: 'Reunión con asociaciones de vecinos para mejorar la seguridad',
    excerpt: 'Escuchamos las preocupaciones de los barrios para integrar sus necesidades en nuestro plan estratégico de seguridad local y convivencia ciudadana.',
    date: '2024-03-05',
    source: 'Local',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 5,
    title: 'PCE propone mejoras en las infraestructuras de emergencias',
    excerpt: 'Un plan detallado para modernizar los parques de bomberos y centros de mando de respuesta rápida en todo el territorio nacional.',
    date: '2024-02-28',
    source: 'Infraestructura',
    image: 'https://images.unsplash.com/photo-1582649580432-8495a8e03001?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 6,
    title: 'Nuevo sistema de voluntariado digital',
    excerpt: 'Ahora puedes colaborar con PCE desde cualquier lugar a través de nuestra nueva plataforma de voluntariado en línea optimizada para móviles.',
    date: '2024-02-20',
    source: 'Tecnología',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 7,
    title: 'Análisis del impacto económico local y propuestas de mejora',
    excerpt: 'Presentamos un estudio detallado sobre la situación económica actual y nuestras propuestas para incentivar el comercio de barrio.',
    date: '2024-02-15',
    source: 'Economía',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 8,
    title: 'PCE se une a la red europea de protección civil',
    excerpt: 'Un paso histórico para coordinar esfuerzos en grandes emergencias y compartir protocolos de actuación con nuestros socios europeos.',
    date: '2024-02-10',
    source: 'Internacional',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 9,
    title: 'Plan de choque para la limpieza y mantenimiento de parques',
    excerpt: 'Nuestras plazas y jardines son el corazón de la ciudad. Proponemos un aumento inmediato en las labores de mantenimiento y seguridad.',
    date: '2024-02-05',
    source: 'Urbanismo',
    image: 'https://images.unsplash.com/photo-1596438459194-f275f413d6ff?auto=format&fit=crop&q=80&w=1200'
  }
]

const news = ref(allNews.find(n => n.id === parseInt(id)))

const formattedDate = computed(() => {
  if (!news.value?.date) return ''
  const date = new Date(news.value.date)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('es-ES', options)
})

useHead({
  title: news.value ? `${news.value.title} - PCE` : 'Noticia no encontrada - PCE',
  meta: [
    { name: 'description', content: news.value?.excerpt || 'Página de detalle de noticia' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.back-link {
  margin-bottom: 30px;
  
  .btn-back {
    color: var(--text-white);
    background: rgba(114, 50, 51, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    text-decoration: none;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    border-radius: 8px;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.9rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    
    .arrow {
      transition: transform 0.3s ease;
      font-size: 1.2rem;
    }
    
    &:hover {
      background: rgba(114, 50, 51, 0.85);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
      border-color: rgba(255, 255, 255, 0.4);
      
      .arrow {
        transform: translateX(-4px);
      }
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

.news-article {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.article-header {
  margin-bottom: 30px;
  
  .article-meta {
    font-size: 0.9rem;
    color: var(--text-grey);
    margin-bottom: 15px;
    letter-spacing: 1px;
    
    .separator {
      margin: 0 10px;
      opacity: 0.5;
    }
  }
  
  .article-title {
    font-family: var(--font-heading);
    font-size: 2.5rem;
    color: var(--text-white);
    line-height: 1.2;
    margin: 0;
  }
}

.article-image {
  width: 100%;
  height: 450px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 40px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.article-content {
  .lead-text {
    font-size: 1.25rem;
    color: var(--text-white);
    line-height: 1.6;
    margin-bottom: 30px;
    font-weight: 500;
    border-left: 4px solid #723233;
    padding-left: 20px;
  }
  
  .main-text {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.8;
    
    p {
      margin-bottom: 25px;
    }
    
    h3 {
      font-family: var(--font-body);
      font-size: 1.5rem;
      color: var(--text-white);
      margin: 40px 0 20px 0;
    }
    
    blockquote {
      margin: 40px 0;
      padding: 30px;
      background: rgba(114, 50, 51, 0.1);
      border-radius: 8px;
      font-style: italic;
      color: var(--text-white);
      font-size: 1.3rem;
      text-align: center;
      position: relative;
      
      &::before {
        content: '"';
        position: absolute;
        top: 10px;
        left: 20px;
        font-size: 4rem;
        opacity: 0.1;
        font-family: serif;
      }
    }
  }
}

.article-footer {
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  .share-box {
    display: flex;
    align-items: center;
    gap: 20px;
    color: var(--text-grey);
    
    .social-icons {
      display: flex;
      gap: 15px;
      
      .social-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-white);
        text-decoration: none;
        font-size: 0.8rem;
        font-weight: bold;
        transition: all 0.3s ease;
        
        &:hover {
          background: #723233;
          transform: translateY(-3px);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .news-article {
    padding: 25px;
  }
  
  .article-header {
    .article-title {
      font-size: 2rem;
    }
  }
  
  .article-image {
    height: 300px;
  }
}
</style>
