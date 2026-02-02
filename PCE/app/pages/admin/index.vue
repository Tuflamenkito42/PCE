<template>
  <div class="admin-dashboard container">
    <div class="header">
      <div>
        <h1 class="page-title">PANEL DE ADMINISTRACIÓN</h1>
        <p class="subtitle">Gestión centralizada de socios y aportaciones</p>
      </div>
      <button @click="refresh" class="btn-refresh" :disabled="pending">
        <svg :class="{ spinning: pending }" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
        </svg>
        {{ pending ? 'CARGANDO...' : 'ACTUALIZAR' }}
      </button>
    </div>

    <div v-if="pending && !data" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando datos del sistema...</p>
    </div>

    <div v-else-if="error" class="error-msg">
      <div class="error-card">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h3>Error de Acceso</h3>
        <p>{{ error.message }}. Asegúrate de haber iniciado sesión como Administrador.</p>
        <NuxtLink to="/login" class="btn-action primary" style="margin-top: 20px;">VOLVER AL LOGIN</NuxtLink>
      </div>
    </div>

    <div v-else class="dashboard-content animate-in">
      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon affiliates">👤</div>
          <div>
            <h3>Total Afiliados</h3>
            <p class="value">{{ data.stats.total_affiliates }}</p>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon income">💶</div>
          <div>
            <h3>Ingresos Mensuales</h3>
            <p class="value">{{ formatMoney(data.stats.monthly_income) }}</p>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon donations">❤️</div>
          <div>
            <h3>Total Donaciones</h3>
            <p class="value">{{ formatMoney(data.stats.total_donations) }}</p>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon messages">✉️</div>
          <div>
            <h3>Mensajes</h3>
            <p class="value">{{ data.stats.total_messages }}</p>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon votes">🗳️</div>
          <div>
            <h3>Votos</h3>
            <p class="value">{{ data.stats.total_votes }}</p>
          </div>
        </div>
      </div>

      <!-- Tabs and Search -->
      <div class="controls-row">
        <div class="tabs">
          <button :class="{ active: activeTab === 'affiliates' }" @click="activeTab = 'affiliates'">Afiliados</button>
          <button :class="{ active: activeTab === 'donations' }" @click="activeTab = 'donations'">Donaciones</button>
          <button :class="{ active: activeTab === 'messages' }" @click="activeTab = 'messages'">Mensajes</button>
          <button :class="{ active: activeTab === 'votes' }" @click="activeTab = 'votes'">Escrutinio</button>
          <button :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">Admins</button>
        </div>
        <div class="search-box">
          <input v-model="searchQuery" type="text" placeholder="Buscar registros..." class="search-input" />
        </div>
      </div>

      <!-- Tables -->
      <div class="table-container glass">
        
        <!-- Affiliates Table -->
        <table v-if="activeTab === 'affiliates'" class="admin-table">
          <thead>
            <tr>
              <th>Socio</th>
              <th>DNI</th>
              <th>Cuota</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredAffiliates" :key="item.id" class="table-row">
              <td>
                <div class="user-info">
                  <span class="user-name">{{ item.name }} {{ item.lastname }}</span>
                  <span class="user-email">{{ item.email }}</span>
                </div>
              </td>
              <td class="mono">{{ item.dni }}</td>
              <td class="font-bold">{{ item.quota }}€<small>/mes</small></td>
              <td>
                <select @change="updateStatus('affiliates', item.id, $event.target.value)" :class="['status-select', item.status]">
                  <option value="active" :selected="item.status === 'active'">Activo</option>
                  <option value="pending" :selected="item.status === 'pending'">Pendiente</option>
                  <option value="inactive" :selected="item.status === 'inactive'">Inactivo</option>
                </select>
              </td>
              <td class="text-muted">{{ formatDate(item.created_at) }}</td>
              <td class="text-right">
                <button @click="deleteItem('affiliates', item.id)" class="btn-delete" title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Donations Table -->
        <table v-if="activeTab === 'donations'" class="admin-table">
          <thead>
            <tr>
              <th>Donante</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredDonations" :key="item.id" class="table-row">
              <td class="text-muted">{{ item.email || 'Anónimo' }}</td>
              <td class="font-bold amount">{{ formatMoney(item.amount) }}</td>
              <td>
                <select @change="updateStatus('donations', item.id, $event.target.value)" :class="['status-select', item.status]">
                  <option value="paid" :selected="item.status === 'paid'">Pagado</option>
                  <option value="pending" :selected="item.status === 'pending'">Pendiente</option>
                  <option value="failed" :selected="item.status === 'failed'">Fallido</option>
                </select>
              </td>
              <td class="text-muted">{{ formatDate(item.created_at) }}</td>
              <td class="text-right">
                <button @click="deleteItem('donations', item.id)" class="btn-delete" title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Messages Table -->
        <table v-if="activeTab === 'messages'" class="admin-table">
          <thead>
            <tr>
              <th>Remitente</th>
              <th>Asunto</th>
              <th>Mensaje</th>
              <th>Fecha</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredMessages" :key="item.id" class="table-row">
              <td>
                <div class="user-info">
                  <span class="user-name">{{ item.name }}</span>
                  <span class="user-email">{{ item.email }}</span>
                </div>
              </td>
              <td class="font-bold">{{ item.subject }}</td>
              <td class="msg-cell" :title="item.message">{{ item.message.substring(0, 50) }}{{ item.message.length > 50 ? '...' : '' }}</td>
              <td class="text-muted">{{ formatDate(item.created_at) }}</td>
              <td class="text-right">
                <button @click="deleteItem('contact_messages', item.id)" class="btn-delete" title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Votes Results (Escrutinio) -->
        <div v-if="activeTab === 'votes'" class="votes-results">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Consulta / Pregunta</th>
                        <th>Opción Seleccionada</th>
                        <th style="text-align: right;">Total Votos</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(vote, idx) in data.votes" :key="idx">
                        <td style="font-weight: bold; color: #fbbf24; padding: 20px;">{{ vote.poll_title }}</td>
                        <td>{{ vote.option_selected }}</td>
                        <td style="text-align: right; font-size: 1.2rem; font-weight: bold; padding: 20px;">{{ vote.total }}</td>
                    </tr>
                </tbody>
            </table>
            <p v-if="data.votes.length === 0" style="padding: 40px; text-align: center; color: rgba(255,255,255,0.4);">
                No hay votos registrados todavía en el sistema.
            </p>
        </div>

        <!-- Users Table -->
        <table v-if="activeTab === 'users'" class="admin-table">
          <thead>
            <tr>
              <th>Administrador</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Registro</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredUsers" :key="item.id" class="table-row">
              <td class="font-bold">{{ item.full_name }}</td>
              <td class="text-muted">{{ item.email }}</td>
              <td><span :class="['badge-simple', item.role]">{{ item.role }}</span></td>
              <td class="text-muted">{{ formatDate(item.created_at) }}</td>
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
      const { user } = useAuth()
      if (!user.value || user.value.role !== 'admin') {
        return navigateTo('/login')
      }
    }
  ]
})

const activeTab = ref('affiliates')
const searchQuery = ref('')
const { data, pending, error, refresh } = await useFetch('/api/admin/data')

// Filtering logic
const filteredAffiliates = computed(() => {
  if (!data.value?.affiliates) return []
  return data.value.affiliates.filter(a => 
    `${a.name} ${a.lastname}`.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    a.dni.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredDonations = computed(() => {
  if (!data.value?.donations) return []
  return data.value.donations.filter(d => 
    (d.email || '').toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredMessages = computed(() => {
  if (!data.value?.messages) return []
  return data.value.messages.filter(m => 
    m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    m.message.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredUsers = computed(() => {
  if (!data.value?.users) return []
  return data.value.users.filter(u => 
    u.full_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const formatMoney = (val) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-ES')
}

// Actions
const deleteItem = async (type, id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.')) return

  try {
    await $fetch(`/api/admin/${type}/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (e) {
    alert('Error al eliminar: ' + (e.data?.message || e.message))
  }
}

const updateStatus = async (type, id, newStatus) => {
  try {
    await $fetch(`/api/admin/${type}/${id}`, { 
      method: 'PATCH',
      body: { status: newStatus }
    })
    await refresh()
  } catch (e) {
    alert('Error al actualizar estado: ' + (e.data?.message || e.message))
    await refresh() // Reverta change locally
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600&display=swap');

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
  color: #fff;
}

.page-title {
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  margin: 0;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #fff 0%, #723233 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: rgba(255, 255, 255, 0.6);
  margin-top: 5px;
  font-size: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: rgba(114, 50, 51, 0.2);
  color: #fff;
  border: 1px solid rgba(114, 50, 51, 0.5);
  border-radius: 12px;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-weight: bold;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  
  &:hover:not(:disabled) {
    background: rgba(114, 50, 51, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
}

.kpi-card {
  background: rgba(94, 44, 44, 0.4);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(114, 50, 51, 0.5);
  }
  
  .kpi-icon {
    font-size: 1.5rem;
    width: 45px;
    height: 45px;
    background: rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
  }

  h3 {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .value {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 2px 0 0 0;
    font-family: 'Cinzel', serif;
  }
}

/* Controls */
.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 20px;
}

.tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  padding: 5px;
  border-radius: 12px;
  
  button {
    padding: 10px 25px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    font-family: 'Cinzel', serif;
    font-weight: bold;
    border-radius: 10px;
    transition: all 0.2s ease;
    
    &.active {
      background: #723233;
      color: #fff;
      box-shadow: 0 4px 12px rgba(114, 50, 51, 0.3);
    }
  }
}

.search-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  border-radius: 12px;
  color: #fff;
  width: 300px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #723233;
    background: rgba(255, 255, 255, 0.1);
  }
}

/* Tables */
.table-container {
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  
  th {
    background: rgba(0, 0, 0, 0.3);
    padding: 15px 20px;
    text-align: left;
    font-family: 'Cinzel', serif;
    font-size: 0.8rem;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.6);
  }
  
  td {
    padding: 12px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
}

.table-row {
  transition: background 0.2s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
}

.msg-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.85rem;
  opacity: 0.9;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  display: block;
}

.user-email {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.mono { font-family: 'Courier New', monospace; }
.font-bold { font-weight: 600; }
.text-right { text-align: right; }
.text-muted { color: rgba(255, 255, 255, 0.5); font-size: 0.9rem; }

/* Status Styles */
.status-select {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 25px;

  &.active, &.paid { color: #4ade80; border-color: rgba(74, 222, 128, 0.3); }
  &.pending { color: #fbbf24; border-color: rgba(251, 191, 36, 0.3); }
  &.inactive, &.failed { color: #f87171; border-color: rgba(248, 113, 113, 0.3); }
}

.badge-simple {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  text-transform: uppercase;
  background: rgba(114, 50, 51, 0.3);
  border: 1px solid rgba(114, 50, 51, 0.5);
}

.btn-delete {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #f87171;
    background: rgba(248, 113, 113, 0.1);
  }
}

/* States */
.loading-state, .error-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #723233;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 20px;
}

.animate-in {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
