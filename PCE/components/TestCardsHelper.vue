<template>
  <div class="test-cards-helper">
    <h3 class="helper-title">🛠️ Tarjetas de Prueba (Stripe)</h3>
    <div class="cards-grid">
      <div 
        v-for="(card, index) in cards" 
        :key="index"
        class="card-item"
        @click="copyToClipboard(card.number)"
      >
        <div class="card-icon">{{ card.icon }}</div>
        <div class="card-info">
          <span class="card-brand">{{ card.brand }}</span>
          <span class="card-number">{{ card.number }}</span>
          <span class="card-desc">{{ card.desc }}</span>
        </div>
        <div class="copy-hint" v-if="copied === card.number">¡Copiado!</div>
        <div class="copy-hint" v-else>Copiar</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const copied = ref('')

const cards = [
  { brand: 'Visa (Éxito)', number: '4242 4242 4242 4242', desc: 'Pago exitoso', icon: '💳' },
  { brand: 'Mastercard', number: '5555 5555 5555 4444', desc: 'Pago exitoso', icon: '💳' },
  { brand: 'Amex', number: '3782 822463 10005', desc: 'Pago exitoso', icon: '💳' },
  { brand: 'Discover', number: '6011 1111 1111 1117', desc: 'Pago exitoso', icon: '💳' },
  { brand: 'Diners Club', number: '3000 0000 0000 04', desc: 'Pago exitoso', icon: '💳' },
  { brand: 'JCB', number: '3528 2121 2121 2121', desc: 'Pago exitoso', icon: '💳' },
  { brand: 'Visa (Error)', number: '4000 0000 0000 0002', desc: 'Pago rechazado', icon: '❌' },
  { brand: 'Visa (3DS)', number: '4000 0000 0000 3063', desc: 'Requiere Auth', icon: '🔐' },
]

const copyToClipboard = async (text) => {
  try {
    const cleanNumber = text.replace(/\s/g, '')
    await navigator.clipboard.writeText(cleanNumber)
    copied.value = text
    setTimeout(() => {
      copied.value = ''
    }, 2000)
  } catch (err) {
    console.error('Error al copiar', err)
  }
}
</script>

<style scoped>
.test-cards-helper {
  margin-top: 40px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.helper-title {
  font-family: 'Cinzel', serif;
  color: #fff;
  margin-bottom: 20px;
  font-size: 1.1rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 10px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.card-item {
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

.card-icon {
  font-size: 1.5rem;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.card-brand {
  color: #fff;
  font-weight: bold;
  font-size: 0.85rem;
  font-family: 'Cinzel', serif;
}

.card-number {
  color: rgba(255, 255, 255, 0.7);
  font-family: monospace;
  font-size: 0.8rem;
  margin: 2px 0;
}

.card-desc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.7rem;
}

.copy-hint {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.6rem;
  background: rgba(0, 255, 0, 0.2);
  color: #0f0;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
