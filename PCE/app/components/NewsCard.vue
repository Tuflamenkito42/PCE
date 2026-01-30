<template>
  <article :class="['news-card', { square: isSquare }]">
    <div class="news-content">
      <h3 v-if="title">{{ title }}</h3>
      <slot>
        <p>{{ excerpt }}</p>
      </slot>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  excerpt: String,
  date: String,
  source: String,
  url: String,
  image: String
})

const formattedDate = computed(() => {
  if (!props.date) return ''
  
  const date = new Date(props.date)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('es-ES', options)
})
</script>

<style scoped>
.news-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
  }

  .news-link {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    
    h3 {
      font-size: 1.5rem;
      margin: 0;
    }
  }

  .news-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .news-meta {
      margin-bottom: 12px;

      .news-date {
        font-size: 0.8rem;
        color: var(--text-grey);
        font-weight: 500;
      }
    }

    h3 {
      font-family: var(--font-heading);
      font-size: 1.35rem;
      margin: 0 0 14px 0;
      color: var(--text-white);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-weight: 600;
    }

    .news-excerpt {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin-bottom: 20px;
      flex-grow: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .read-more-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 14px 24px;
      background: linear-gradient(135deg, #b2a3a4 0%, #9d8e8f 100%);
      color: #723233;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      letter-spacing: 0.3px;
      margin-top: auto;

      .arrow-icon {
        transition: transform 0.3s ease;
      }

      &:hover {
        background: linear-gradient(135deg, #9d8e8f 0%, #8a7b7c 100%);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        transform: translateY(-2px);

        .arrow-icon {
          transform: translateX(4px);
        }
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

@media (max-width: 768px) {
  .news-card {
    .news-image {
      height: 180px;
    }

    .news-content {
      padding: 20px;

      h3 {
        font-size: 1.15rem;
      }

      .news-excerpt {
        font-size: 0.9rem;
      }

      .read-more-btn {
        padding: 12px 20px;
        font-size: 0.9rem;
      }
    }
  }
}
</style>

