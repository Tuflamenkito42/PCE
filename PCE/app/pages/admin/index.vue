<template>
  <div class="admin-dashboard container">
    <div class="header">
      <h1 class="page-title">PANEL DE ADMINISTRACIÓN</h1>
      <button @click="refresh" class="btn-refresh">🔄 Actualizar</button>
    </div>

    <div v-if="pending" class="loading">Cargando datos del sistema...</div>
    <div v-else-if="error" class="error-msg">
      Error: {{ error.message }}. Asegúrate de haber iniciado sesión como Administrador.
    </div>

    <div v-else class="dashboard-content">
      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <h3>Total Afiliados</h3>
          <p class="value">{{ data.stats.total_affiliates }}</p>
        </div>
        <div class="kpi-card">
          <h3>Ingresos Mensuales (Cuotas)</h3>
          <p class="value">{{ formatMoney(data.stats.monthly_income) }}</p>
        </div>
        <div class="kpi-card">
          <h3>Total Donaciones</h3>
          <p class="value">{{ formatMoney(data.stats.total_donations) }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button :class="{ active: activeTab === 'affiliates' }" @click="activeTab = 'affiliates'">Afiliaciones</button>
        <button :class="{ active: activeTab === 'donations' }" @click="activeTab = 'donations'">Donaciones</button>
        <button :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">Usuarios Web</button>
      </div>

      <!-- Tables -->
      <div class="table-container">
        
        <!-- Affiliates Table -->
        <table v-if="activeTab === 'affiliates'" class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Cuota</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data.affiliates" :key="item.id">
              <td>#{{ item.id }}</td>
              <td>{{ item.name }} {{ item.lastname }}</td>
              <td>{{ item.dni }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.quota }}€/mes</td>
              <td><span :class="['badge', item.status]">{{ item.status }}</span></td>
              <td>{{ formatDate(item.created_at) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Donations Table -->
        <table v-if="activeTab === 'donations'" class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data.donations" :key="item.id">
              <td>#{{ item.id }}</td>
              <td>{{ item.email || 'Anónimo' }}</td>
              <td>{{ formatMoney(item.amount) }}</td>
              <td><span :class="['badge', item.status]">{{ item.status }}</span></td>
              <td>{{ formatDate(item.created_at) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Users Table -->
        <table v-if="activeTab === 'users'" class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha Registro</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data.users" :key="item.id">
              <td>#{{ item.id }}</td>
              <td>{{ item.full_name }}</td>
              <td>{{ item.email }}</td>
              <td><span :class="['badge', item.role]">{{ item.role }}</span></td>
              <td>{{ formatDate(item.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: [
    function (to, from) {
      const { user } = useAuth() // Assuming useAuth composable is available globally or imported
      if (!user.value || user.value.role !== 'admin') {
        return navigateTo('/')
      }
    }
  ]
})

const activeTab = ref('affiliates')
const { data, pending, error, refresh } = await useFetch('/api/admin/data')

const formatMoney = (val) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-ES') + ' ' + new Date(dateString).toLocaleTimeString('es-ES')
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  color: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.btn-refresh {
  padding: 8px 16px;
  background: #723233;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Cinzel', serif;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.kpi-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 10px;
  }
  
  .value {
    font-size: 2rem;
    font-weight: bold;
    color: #fff;
    font-family: 'Cinzel', serif;
  }
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  
  button {
    padding: 10px 20px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    font-family: 'Cinzel', serif;
    font-weight: bold;
    border-bottom: 2px solid transparent;
    
    &.active {
      color: #fff;
      border-bottom-color: #723233;
    }
  }
}

.table-container {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  color: #fff;
  
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  th {
    font-family: 'Cinzel', serif;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.85rem;
  }
  
  tr:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: bold;
  
  &.paid, &.success, &.active, &.admin {
    background: rgba(0, 255, 0, 0.2);
    color: #4ade80;
    border: 1px solid rgba(0, 255, 0, 0.3);
  }
  
  &.pending, &.processing {
    background: rgba(255, 165, 0, 0.2);
    color: #fbbf24;
    border: 1px solid rgba(255, 165, 0, 0.3);
  }
  
  &.error, &.failed {
    background: rgba(255, 0, 0, 0.2);
    color: #f87171;
    border: 1px solid rgba(255, 0, 0, 0.3);
  }
}
</style>
