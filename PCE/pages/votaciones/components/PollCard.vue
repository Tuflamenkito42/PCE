<template>
  <div class="poll-card" :class="type">
    <div class="poll-tag"><slot name="tag" /></div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <div class="poll-options">
      <button 
        v-for="(option, idx) in options" 
        :key="idx" 
        class="btn-option" 
        @click="$emit('vote', { option, title })"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  options: Array,
  type: String // 'public' or 'intern'
})
defineEmits(['vote'])
</script>

<style scoped>
.poll-card {
  background: var(--card-bg);
  padding: 30px;
  border-radius: 8px;
  border-left: 5px solid var(--accent-gold);
  
  &.intern {
    border-color: #8B3A3A;
  }

  .poll-tag {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--accent-gold);
    margin-bottom: 10px;
  }

  h3 {
    margin-bottom: 15px;
    font-family: var(--font-body);
    font-weight: 600;
  }

  p {
    margin-bottom: 20px;
    font-size: 0.9rem;
    color: var(--text-grey);
  }

  .poll-options {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .btn-option {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      padding: 12px;
      text-align: left;
      border-radius: 4px;
      transition: all 0.3s;
      cursor: pointer;

      &:hover {
        background: rgba(114, 50, 51, 0.3);
        border-color: #723233;
      }
    }
  }
}
</style>
