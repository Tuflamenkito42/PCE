<template>
  <aside class="benefits-sidebar">
    <div class="card-logo">
      <img src="/images/logo.png" alt="Logo PCE" />
    </div>
    <h3>{{ lt('POR QUÉ AFILIARTE?', 'PER QUÈ AFILIAR-TE?', 'ZERGATIK AFILIATU?', 'POR QUE AFILIARTE?') }}</h3>
    <ul class="benefits-list">
      <li>{{ lt('1. Seguridad y Bienestar', '1. Seguretat i Benestar', '1. Segurtasuna eta Ongizatea', '1. Seguridade e Benestar') }}</li>
      <li>{{ lt('2. Transparencia Total', '2. Transparència Total', '2. Gardentasun Osoa', '2. Transparencia Total') }}</li>
      <li>{{ lt('3. Justicia Proporcional', '3. Justícia Proporcional', '3. Justizia Proportzionala', '3. Xustiza Proporcional') }}</li>
    </ul>
    <button class="btn btn-join-inverse" @click="$emit('join')">{{ lt('AFÍLIATE', 'AFILIA-T', 'AFILIATU', 'AFÍLIATE') }}</button>
    <p class="small-note">{{ lt('TAMBIÉN PUEDES APOYARNOS MEDIANTE UNA DONACIÓN', 'TAMBÉ ENS POTS DONAR SUPORT MITJANÇANT UNA DONACIÓ', 'DOHAINTZA BATEKIN ERE BABES DEZAKEZU', 'TAMÉN PODES APOIARNOS MEDIANTE UNHA DOAZÓN') }}</p>
  </aside>
</template>

<script setup>
const { locale } = useI18n()

const lt = (es, ca, eu, gl) => {
  if (locale.value === 'ca') return ca
  if (locale.value === 'eu') return eu
  if (locale.value === 'gl') return gl
  return es
}

defineEmits(['join'])
</script>

<style scoped>
.benefits-sidebar {
  background-color: #D6CFCE;
  padding: 60px 40px;
  border-radius: 40px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 4px solid #5E2C2C;
}

.card-logo {
  width: 160px;
  height: 160px;
  border: 4px solid #5E2C2C;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  padding: 20px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

h3 {
  font-family: 'Cinzel', serif;
  color: #5E2C2C;
  font-size: 1.5rem;
  margin-bottom: 40px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.benefits-list {
  list-style: none;
  width: 100%;
  margin-bottom: 40px;
  
  li {
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    color: #5E2C2C;
    padding: 15px 0;
    border-bottom: 1px solid #5E2C2C;
    text-transform: uppercase;
    
    &:last-child {
      border-bottom: none;
    }
  }
}

.btn-join-inverse {
  background-color: #000 !important;
  color: #fff !important;
  padding: 15px 50px;
  border-radius: 0; /* The image shows a square-ish or slightly rounded but very angular button */
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  width: auto;
  min-width: 200px;
  border: none;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  
  &:hover {
    background-color: #333 !important;
    transform: translateY(-2px);
  }
}

.small-note {
  font-family: 'Cinzel', serif;
  font-size: 0.6rem;
  color: #5E2C2C;
  margin-top: 20px;
  opacity: 0.8;
  max-width: 200px;
  line-height: 1.4;
  text-transform: uppercase;
}
</style>
