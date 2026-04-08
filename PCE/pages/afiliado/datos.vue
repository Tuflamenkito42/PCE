<template>
  <main class="datos-page container">
    <section class="card">
      <div class="header-row">
        <div>
          <h1>Datos de afiliacion</h1>
          <p>Consulta tus datos de socio y verifica el estado de tu afiliacion.</p>
        </div>
        <NuxtLink to="/afiliado/ajustes" class="btn-back">Volver</NuxtLink>
      </div>

      <div class="info-grid">
        <article class="panel">
          <h2>Ficha personal</h2>
          <div class="rows">
            <div class="row-item">
              <span>Nombre completo</span>
              <strong>{{ user?.full_name || '-' }}</strong>
            </div>
            <div class="row-item">
              <span>Email</span>
              <strong>{{ user?.email || '-' }}</strong>
            </div>
            <div class="row-item">
              <span>DNI/NIF</span>
              <strong>{{ userNif || '-' }}</strong>
            </div>
            <div class="row-item">
              <span>Numero de socio</span>
              <strong>{{ userNumberId }}</strong>
            </div>
          </div>
        </article>

        <article class="panel">
          <h2>Estado de afiliacion</h2>
          <div class="rows">
            <div class="row-item">
              <span>Alta</span>
              <strong>{{ affiliationDate }}</strong>
            </div>
            <div class="row-item">
              <span>Proxima renovacion</span>
              <strong>{{ renovationDate }}</strong>
            </div>
            <div class="row-item">
              <span>Vigencia restante</span>
              <strong>{{ daysUntilExpiry }} dias</strong>
            </div>
            <div class="row-item">
              <span>Estado</span>
              <strong class="badge ok">Activo</strong>
            </div>
          </div>
        </article>
      </div>

      <div class="actions">
        <NuxtLink to="/afiliado/actualizar" class="btn-primary">Actualizar datos de afiliacion</NuxtLink>
        <NuxtLink to="/carnet" class="btn-secondary">Ir a mi carne</NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup>
definePageMeta({
  middleware: ['afiliado']
})

const { user } = useAuth()

const formatDate = (value) => new Date(value).toLocaleDateString('es-ES')

const userCreatedAt = computed(() => {
  const raw = user.value?.created_at
  if (!raw) {
    return new Date()
  }

  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
})

const userNif = computed(() => String(user.value?.dni || '').toUpperCase().trim())

const userNumberId = computed(() => {
  const id = Number(user.value?.id || 0)
  return id > 0 ? `SOC${String(id).padStart(6, '0')}` : 'SOC000001'
})

const activeCycle = computed(() => {
  const now = new Date()
  let cycleStart = new Date(userCreatedAt.value)
  let cycleEnd = new Date(userCreatedAt.value)
  cycleEnd.setFullYear(cycleEnd.getFullYear() + 5)

  while (now >= cycleEnd) {
    cycleStart = new Date(cycleEnd)
    cycleEnd.setFullYear(cycleEnd.getFullYear() + 5)
  }

  return { cycleStart, cycleEnd }
})

const affiliationDate = computed(() => formatDate(activeCycle.value.cycleStart))
const renovationDate = computed(() => formatDate(activeCycle.value.cycleEnd))

const daysUntilExpiry = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiryDay = new Date(activeCycle.value.cycleEnd)
  expiryDay.setHours(0, 0, 0, 0)

  const diff = expiryDay.getTime() - today.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

useHead({
  title: 'Datos de afiliacion - PCE',
  meta: [
    {
      name: 'description',
      content: 'Panel de datos de afiliacion y estado de socio en PCE.'
    }
  ]
})
</script>

<style scoped>
.datos-page {
  padding: 48px 20px 70px;
}

.card {
  background: rgba(94, 44, 44, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 22px;
}

h1 {
  margin: 0;
  color: #fff;
  font-family: 'Cinzel', serif;
  font-size: clamp(1.6rem, 2.8vw, 2.2rem);
}

p {
  margin: 8px 0 0;
  color: #eadfe0;
}

.btn-back {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  padding: 10px 14px;
  color: #f4ecec;
  text-decoration: none;
  white-space: nowrap;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}

.panel {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 16px;
}

.panel h2 {
  margin: 0 0 12px;
  color: #fff;
  font-size: 1.05rem;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}

.row-item span {
  color: #dcc9ca;
  font-size: 0.9rem;
}

.row-item strong {
  color: #f4ecec;
  text-align: right;
  font-size: 0.92rem;
}

.badge.ok {
  background: rgba(78, 190, 113, 0.18);
  border: 1px solid rgba(78, 190, 113, 0.35);
  color: #b9f0c8;
  border-radius: 999px;
  padding: 2px 8px;
}

.actions {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-primary,
.btn-secondary {
  border-radius: 10px;
  padding: 10px 14px;
  text-decoration: none;
  font-weight: 600;
}

.btn-primary {
  background: linear-gradient(135deg, #f5d8b6, #e8c99c);
  color: #5e2c2c;
}

.btn-secondary {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f4ecec;
}

@media (max-width: 700px) {
  .header-row {
    flex-direction: column;
  }
}
</style>
