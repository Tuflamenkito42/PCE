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
          <div class="kpi-content-simple">
            <span class="kpi-label-simple">AFILIADOS:</span>
            <span class="kpi-value-simple">{{ data.stats.total_affiliates }}</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-content-simple">
            <span class="kpi-label-simple">INGRESOS:</span>
            <span class="kpi-value-simple">{{ formatMoney(data.stats.monthly_income) }}</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-content-simple">
            <span class="kpi-label-simple">DONACIONES:</span>
            <span class="kpi-value-simple">{{ formatMoney(data.stats.total_donations) }}</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-content-simple">
            <span class="kpi-label-simple">MENSAJES:</span>
            <span class="kpi-value-simple">{{ data.stats.total_messages }}</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon affiliates">🗞️</div>
          <div>
            <h3>Suscriptores</h3>
            <p class="value">{{ data.stats.total_subscribers }}</p>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-content-simple">
            <span class="kpi-label-simple">VOTOS:</span>
            <span class="kpi-value-simple">{{ data.stats.total_votes }}</span>
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
          <button v-if="activeTab === 'newsletter'" @click="showNewsletterModal = true" class="btn-action primary" style="margin-right: 15px;">
            ENVIAR COMUNICADO
          </button>
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

        <!-- Newsletter Table -->
        <table v-if="activeTab === 'newsletter'" class="admin-table">
          <thead>
            <tr>
              <th>Email Suscriptor</th>
              <th>Fecha Suscripción</th>
              <th>Estado</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredSubscribers" :key="item.id" class="table-row">
              <td class="font-bold">{{ item.email }}</td>
              <td class="text-muted">{{ formatDate(item.subscribed_at) }}</td>
              <td>
                <span :class="['status-badge', item.active ? 'active' : 'inactive']">
                  {{ item.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="text-right">
                <button @click="deleteItem('newsletter', item.id)" class="btn-delete" title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Votes Results (Escrutinio) -->
        <div v-if="activeTab === 'votes'" class="votes-results animate-in">
          <div class="results-grid">
            <div v-for="(group, pollTitle) in groupedVotes" :key="pollTitle" class="poll-result-card glass">
              <h3 class="poll-title-display">{{ pollTitle }}</h3>
              <div class="options-container">
                <div v-for="vote in group" :key="vote.option_selected" class="option-row">
                  <div class="option-info">
                    <span class="option-label">{{ vote.option_selected }}</span>
                    <span class="option-stats font-bold">{{ vote.total }} votos ({{ calculatePercent(vote.total, pollTitle) }}%)</span>
                  </div>
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" :style="{ width: calculatePercent(vote.total, pollTitle) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p v-if="data.votes.length === 0" class="empty-results">
            No hay votos registrados todavía en el sistema.
          </p>
        </div>

        <!-- Users Table -->
        <table v-if="activeTab === 'users'" class="admin-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Registro</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredUsers" :key="item.id" class="table-row">
              <td class="font-bold">{{ item.full_name }}</td>
              <td class="text-muted">{{ item.email }}</td>
              <td><span :class="['badge-simple', item.role]">{{ item.role }}</span></td>
              <td class="text-muted">{{ formatDate(item.created_at) }}</td>
              <td class="text-right">
                <button v-if="item.role !== 'admin'" @click="deleteItem('users', item.id)" class="btn-delete" title="Eliminar Usuario">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Newsletter Modal -->
    <div v-if="showNewsletterModal" class="modal-overlay" @click.self="showNewsletterModal = false">
      <div class="modal-content glass animate-in">
        <div class="modal-header">
          <h2 class="form-subtitle">ENVIAR COMUNICADO MASIVO</h2>
          <button @click="showNewsletterModal = false" class="btn-close">&times;</button>
        </div>
        <p class="modal-description">Este mensaje se enviará a todos los suscriptores activos del newsletter.</p>
        
        <div class="modal-body">
          <div class="form-group">
            <label>ASUNTO DEL CORREO</label>
            <input v-model="newsletterForm.subject" type="text" placeholder="Ej: Novedades del mes de Febrero" class="modal-input" />
          </div>
          <div class="form-group">
            <label>CONTENIDO DEL MENSAJE</label>
            <textarea v-model="newsletterForm.message" placeholder="Escribe aquí el comunicado oficial..." class="modal-textarea"></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showNewsletterModal = false" class="btn-action secondary">CANCELAR</button>
          <button @click="sendBulkNewsletter" :disabled="sendingNewsletter || !newsletterForm.subject || !newsletterForm.message" class="btn-action primary">
            {{ sendingNewsletter ? 'ENVIANDO...' : 'ENVIAR AHORA' }}
          </button>
        </div>
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
const showNewsletterModal = ref(false)
const sendingNewsletter = ref(false)
const newsletterForm = reactive({
  subject: '',
  message: ''
})

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

const sendBulkNewsletter = async () => {
  if (!confirm(`¿Estás seguro de enviar este comunicado a ${data.value.stats.total_subscribers} suscriptores?`)) return

  sendingNewsletter.value = true
  try {
    const res = await $fetch('/api/admin/newsletter/send', {
      method: 'POST',
      body: newsletterForm
    })
    alert(res.message)
    showNewsletterModal.value = false
    newsletterForm.subject = ''
    newsletterForm.message = ''
  } catch (e) {
    alert('Error al enviar: ' + (e.data?.message || e.message))
  } finally {
    sendingNewsletter.value = false
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
  font-family: var(--font-heading);
  font-size: 3.5rem;
  margin: 0;
  letter-spacing: 4px;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  background: none;
  -webkit-text-fill-color: initial;
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
  background: #723233;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  cursor: pointer;
  font-family: var(--font-heading);
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
  background: rgba(114, 50, 51, 0.95); /* More opaque brand color */
  padding: 20px 30px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: #fff;
  }
}

.kpi-content-simple {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  text-align: center;
}

.kpi-label-simple {
  font-family: var(--font-heading);
  font-size: 0.85rem;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: bold;
}

.kpi-value-simple {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: bold;
  color: #fff;
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
    padding: 10px 20px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    font-family: var(--font-heading);
    font-weight: bold;
    border-radius: 10px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &.active {
      background: var(--primary-red);
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
  font-family: var(--font-heading);

  &:focus {
    outline: none;
    border-color: var(--primary-red);
    background: rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7); /* Light white color for visibility */
    opacity: 1; /* Ensure full opacity for the color */
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 1px;
  }
}

/* Tables */
.table-container {
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass {
  background: rgba(114, 50, 51, 0.4); /* Opaque brand color instead of black */
  backdrop-filter: blur(20px);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  
  th {
    background: rgba(114, 50, 51, 0.9); /* Opaque brand header */
    padding: 20px;
    text-align: left;
    font-family: var(--font-heading);
    font-size: 0.9rem;
    letter-spacing: 2px;
    color: #ffffff;
    text-transform: uppercase;
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

/* Results Scrutiny Visualization */
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 25px;
  padding: 10px;
}

.poll-result-card {
  padding: 25px;
  border-radius: 20px;
}

.poll-title-display {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  margin-bottom: 25px;
  color: #fff;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 15px;
}

.option-row {
  margin-bottom: 20px;
  
  &:last-child { margin-bottom: 0; }
}

.option-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.option-label { opacity: 0.9; }

.progress-bar-bg {
  height: 10px;
  background: rgba(255,255,255,0.1);
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-red) 0%, var(--acc-red) 100%);
  border-radius: 5px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.empty-results {
  padding: 60px;
  text-align: center;
  color: rgba(255,255,255,0.4);
  font-family: var(--font-heading);
  font-size: 1.2rem;
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
  border-top-color: var(--primary-red);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 20px;
}

.animate-in {
  animation: fadeInUp 0.6s ease-out forwards;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 600px;
  background: #5E2C2C;
  border-radius: 24px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-close {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.5;
  &:hover { opacity: 1; }
}

.modal-description {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 30px;
}

.modal-input, .modal-textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
  color: #fff;
  font-family: inherit;
  margin-top: 10px;
  
  &:focus {
    outline: none;
    border-color: #fbbf24;
  }
}

.modal-textarea {
  min-height: 200px;
  resize: vertical;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 40px;
}

.btn-action {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: bold;
  font-family: 'Cinzel', serif;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  &.primary {
    background: #fbbf24;
    color: #000;
    &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(251, 191, 36, 0.4); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    &:hover { background: rgba(255, 255, 255, 0.2); }
  }
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: bold;
  &.active { background: rgba(74, 222, 128, 0.2); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.3); }
  &.inactive { background: rgba(248, 113, 113, 0.2); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.3); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
