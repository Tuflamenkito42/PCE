<template>
  <article class="promise-card">
    <div class="card-content">
      <h3 v-if="title">{{ title }}</h3>
      <p><slot /></p>
    </div>
  </article>
</template>

<script setup>
defineProps({
  title: String
})
</script>

<style scoped>
.promise-card {
  background: linear-gradient(145deg, var(--card-bg), var(--primary-red-dark));
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
  height: 100%;
  transition: all 0.4s ease;
  border: 1px solid rgba(178, 163, 164, 0.1);
  display: flex;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 1px solid rgba(178, 163, 164, 0.3);
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: 'PCE';
    position: absolute;
    bottom: -15px;
    right: -5px;
    font-family: var(--font-heading);
    font-size: 5rem;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.15);
    pointer-events: none;
    z-index: 0;
    transform: rotate(-10deg);
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    background: linear-gradient(145deg, var(--card-bg), var(--primary-red));

    &::before {
      border-color: rgba(178, 163, 164, 0.6);
    }
  }

  .card-content {
    position: relative;
    z-index: 2;
    width: 100%;

    h3 {
      font-family: var(--font-heading);
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--accent-gold);
      text-transform: uppercase;
      text-align: center;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid rgba(178, 163, 164, 0.3);
    }

    p {
      font-family: var(--font-body);
      font-size: 1.1rem;
      color: #F0F0F0;
      line-height: 1.6;
      text-align: justify;
    }

    :deep(strong) {
      color: var(--accent-gold);
      font-family: var(--font-heading);
      display: block;
      font-size: 1.3rem;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid rgba(178, 163, 164, 0.3);
      text-transform: uppercase;
      text-align: center;
    }
  }
}
</style>
