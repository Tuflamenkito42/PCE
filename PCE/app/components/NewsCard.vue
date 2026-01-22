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
defineProps({
  title: String,
  excerpt: String,
  isSquare: Boolean
})
</script>

<style scoped>
.news-card {
  background-color: var(--card-bg);
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  &.square {
    aspect-ratio: 1 / 1;
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
    h3 {
      font-family: var(--font-heading);
      margin-bottom: 10px;
      color: var(--text-white);
    }

    p {
      font-size: 1rem;
      color: var(--text-grey);
    }
  }
}
</style>
