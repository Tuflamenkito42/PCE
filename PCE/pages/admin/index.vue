<template>
  <div class="admin-dashboard container">
    <div class="header">
      <div>
        <h1 class="page-title">{{ t('admin.title') }}</h1>
        <p class="subtitle">{{ t('admin.dashboard') }}</p>
      </div>
      <button @click="refresh" class="btn-refresh" :disabled="pending">
        <svg :class="{ spinning: pending }" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
        </svg>
        {{ pending ? lt('Cargando...', 'Carregant...', 'Kargatzen...', 'Cargando...') : lt('Actualizar', 'Actualitzar', 'Eguneratu', 'Actualizar') }}
      </button>
    </div>

    <div v-if="pending && !data" class="loading-state">
      <div class="spinner"></div>
      <p>{{ lt('Cargando datos del sistema...', 'Carregant dades del sistema...', 'Sistemako datuak kargatzen...', 'Cargando datos do sistema...') }}</p>
    </div>

    <div v-else-if="error" class="error-msg">
      <div class="error-card">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h3>{{ lt('Error de acceso', 'Error d accés', 'Sarbide errorea', 'Erro de acceso') }}</h3>
        <p>{{ error.message }}. {{ lt('Asegúrate de haber iniciado sesión como Administrador.', 'Assegura t d haver iniciat sessió com a administrador.', 'Ziurtatu administratzaile gisa saioa hasi duzula.', 'Asegúrate de ter iniciado sesión como administrador.') }}</p>
        <NuxtLink to="/login" class="btn-action primary" style="margin-top: 20px;">{{ lt('Volver al login', 'Tornar al login', 'Itzuli saioa hasteko orrira', 'Volver ao login') }}</NuxtLink>
      </div>
    </div>

    <div v-else class="dashboard-content animate-in">
      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-content-simple">
            <span class="kpi-label-simple">Afiliados:</span>
            <span class="kpi-value-simple">{{ data.stats.total_affiliates }}</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-content-simple">
            <span class="kpi-label-simple">{{ lt('Ingresos:', 'Ingressos:', 'Diru-sarrerak:', 'Ingresos:') }}</span>
            <span class="kpi-value-simple kpi-value-money">{{ formatMoney(data.stats.monthly_income) }}</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-content-simple">
            <span class="kpi-label-simple">{{ lt('Donaciones:', 'Donacions:', 'Dohaintzak:', 'Doazóns:') }}</span>
            <span class="kpi-value-simple kpi-value-money">{{ formatMoney(data.stats.total_donations) }}</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-content-simple">
            <span class="kpi-label-simple">{{ lt('Candidaturas:', 'Candidatures:', 'Hautagaitzak:', 'Candidaturas:') }}</span>
            <span class="kpi-value-simple">{{ data.stats.total_job_applications || 0 }}</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-content-simple">
            <span class="kpi-label-simple">{{ lt('Carnés físicos:', 'Carnets físics:', 'Txartel fisikoak:', 'Carnés físicos:') }}</span>
            <span class="kpi-value-simple">{{ data.stats.total_carnet_orders || 0 }}</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-content-simple">
            <span class="kpi-label-simple">{{ lt('Suscriptores:', 'Subscriptors:', 'Harpidedunak:', 'Subscritores:') }}</span>
            <span class="kpi-value-simple">{{ data.stats.total_subscribers }}</span>
          </div>
        </div>
      </div>

      <!-- Tabs and Search -->
      <div class="controls-row">
        <div class="tabs">
          <button :class="{ active: activeTab === 'affiliates' }" @click="activeTab = 'affiliates'">{{ lt('Afiliados', 'Afiliats', 'Afiliatuak', 'Afiliados') }}</button>
          <button :class="{ active: activeTab === 'donations' }" @click="activeTab = 'donations'">{{ lt('Donaciones', 'Donacions', 'Dohaintzak', 'Doazóns') }}</button>
          <button :class="{ active: activeTab === 'messages' }" @click="activeTab = 'messages'">{{ lt('Mensajes', 'Missatges', 'Mezuak', 'Mensaxes') }}</button>
          <button :class="{ active: activeTab === 'job_applications' }" @click="activeTab = 'job_applications'">{{ lt('Candidaturas', 'Candidatures', 'Hautagaitzak', 'Candidaturas') }}</button>
          <button :class="{ active: activeTab === 'carnet_orders' }" @click="activeTab = 'carnet_orders'">{{ lt('Carnés físicos', 'Carnets físics', 'Txartel fisikoak', 'Carnés físicos') }}</button>
          <button :class="{ active: activeTab === 'newsletter' }" @click="activeTab = 'newsletter'">Newsletter</button>
          <button :class="{ active: activeTab === 'votes' }" @click="activeTab = 'votes'">{{ lt('Escrutinio', 'Escrutini', 'Zenbaketa', 'Escrutinio') }}</button>
          <button :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">{{ lt('Usuarios', 'Usuaris', 'Erabiltzaileak', 'Usuarios') }}</button>
        </div>
        <div class="search-box">
          <button v-if="activeTab === 'newsletter'" @click="showNewsletterModal = true" class="btn-action primary" style="margin-right: 15px;">
            {{ lt('Enviar comunicado', 'Enviar comunicat', 'Jakinarazpena bidali', 'Enviar comunicado') }}
          </button>
          <input v-model="searchQuery" type="text" :placeholder="lt('Buscar registros...', 'Cercar registres...', 'Erregistroak bilatu...', 'Buscar rexistros...')" class="search-input" />
        </div>
      </div>

      <!-- Tables -->
      <div class="table-container glass">
        
        <!-- Affiliates Table -->
        <table v-if="activeTab === 'affiliates'" class="admin-table">
          <thead>
            <tr>
              <th>{{ lt('Socio', 'Soci', 'Bazkidea', 'Socio') }}</th>
              <th>{{ lt('Cuota', 'Quota', 'Kuota', 'Cota') }}</th>
              <th>{{ lt('Estado', 'Estat', 'Egoera', 'Estado') }}</th>
              <th>{{ lt('Fecha', 'Data', 'Data', 'Data') }}</th>
              <th class="text-right">{{ lt('Acciones', 'Accions', 'Ekintzak', 'Accións') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredAffiliates" :key="item.id" class="table-row">
              <td>
                <div class="user-info">
                  <span class="user-name">{{ item.email }}</span>
                  <span class="user-email" style="font-size: 0.85rem; color: #888;">ID: {{ item.id }}</span>
                </div>
              </td>
              <td class="font-bold">{{ item.quota }}€<small>/mes</small></td>
              <td>
                <select @change="updateStatus('affiliates', item.id, $event.target.value)" :class="['status-select', item.status]">
                  <option value="active" :selected="item.status === 'active'">{{ lt('Activo', 'Actiu', 'Aktibo', 'Activo') }}</option>
                  <option value="pending" :selected="item.status === 'pending'">{{ lt('Pendiente', 'Pendent', 'Zain', 'Pendente') }}</option>
                  <option value="inactive" :selected="item.status === 'inactive'">{{ lt('Inactivo', 'Inactiu', 'Ez-aktibo', 'Inactivo') }}</option>
                </select>
              </td>
              <td class="text-muted">{{ formatDate(item.created_at) }}</td>
              <td class="text-right">
                <button @click="deleteItem('affiliates', item.id)" class="btn-delete" :title="lt('Eliminar', 'Eliminar', 'Ezabatu', 'Eliminar')">
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
              <th>{{ lt('Donante', 'Donant', 'Emailea', 'Doante') }}</th>
              <th>{{ lt('Cantidad', 'Quantitat', 'Zenbatekoa', 'Cantidade') }}</th>
              <th>{{ lt('Estado', 'Estat', 'Egoera', 'Estado') }}</th>
              <th>{{ lt('Fecha', 'Data', 'Data', 'Data') }}</th>
              <th class="text-right">{{ lt('Acciones', 'Accions', 'Ekintzak', 'Accións') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredDonations" :key="item.id" class="table-row">
              <td class="text-muted">{{ item.email || lt('Anónimo', 'Anònim', 'Anonimoa', 'Anónimo') }}</td>
              <td class="font-bold amount">{{ formatMoney(item.amount) }}</td>
              <td>
                <select @change="updateStatus('donations', item.id, $event.target.value)" :class="['status-select', item.status]">
                  <option value="paid" :selected="item.status === 'paid'">{{ lt('Pagado', 'Pagat', 'Ordainduta', 'Pagado') }}</option>
                  <option value="pending" :selected="item.status === 'pending'">{{ lt('Pendiente', 'Pendent', 'Zain', 'Pendente') }}</option>
                  <option value="failed" :selected="item.status === 'failed'">{{ lt('Fallido', 'Fallit', 'Huts eginda', 'Fallido') }}</option>
                </select>
              </td>
              <td class="text-muted">{{ formatDate(item.created_at) }}</td>
              <td class="text-right">
                <button @click="deleteItem('donations', item.id)" class="btn-delete" :title="lt('Eliminar', 'Eliminar', 'Ezabatu', 'Eliminar')">
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
              <th>{{ lt('Remitente', 'Remitent', 'Igorlea', 'Remitente') }}</th>
              <th>{{ lt('Asunto', 'Assumpte', 'Gaia', 'Asunto') }}</th>
              <th>{{ lt('Mensaje', 'Missatge', 'Mezua', 'Mensaxe') }}</th>
              <th>{{ lt('Fecha', 'Data', 'Data', 'Data') }}</th>
              <th class="text-right">{{ lt('Acciones', 'Accions', 'Ekintzak', 'Accións') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredMessages" :key="item.id" class="table-row">
              <td>
                <div class="user-info">
                  <span class="user-name">{{ item.name || lt('Sin nombre', 'Sense nom', 'Izenik gabe', 'Sen nome') }}</span>
                  <span class="user-email">{{ item.email || '-' }}</span>
                </div>
              </td>
              <td class="font-bold">{{ item.subject || '-' }}</td>
              <td class="msg-cell clickable" @click="openMessageModal(item)" :title="item.message || ''">
                {{ (item.message || '').substring(0, 50) }}{{ (item.message || '').length > 50 ? '...' : '' }}
                <span class="read-more-hint">({{ lt('ver más', 'veure més', 'gehiago ikusi', 'ver máis') }})</span>
              </td>
              <td class="text-muted">{{ formatDate(item.created_at) }}</td>
              <td class="text-right">
                <button @click="deleteItem('contact_messages', item.id)" class="btn-delete" :title="lt('Eliminar', 'Eliminar', 'Ezabatu', 'Eliminar')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Job Applications Table -->
        <table v-if="activeTab === 'job_applications'" class="admin-table">
          <thead>
            <tr>
              <th>{{ lt('Candidato', 'Candidat', 'Hautagaia', 'Candidato') }}</th>
              <th>{{ lt('Oferta', 'Oferta', 'Eskaintza', 'Oferta') }}</th>
              <th>{{ lt('CV', 'CV', 'CV', 'CV') }}</th>
              <th>{{ lt('Disponibilidad', 'Disponibilitat', 'Eskuragarritasuna', 'Disponibilidade') }}</th>
              <th>{{ lt('Estado', 'Estat', 'Egoera', 'Estado') }}</th>
              <th>{{ lt('Fecha', 'Data', 'Data', 'Data') }}</th>
              <th class="text-right">{{ lt('Acciones', 'Accions', 'Ekintzak', 'Accións') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredJobApplications" :key="item.id" class="table-row">
              <td>
                <div class="user-info">
                  <span class="user-name">{{ item.full_name }}</span>
                  <span class="user-email">{{ item.email }} · {{ item.phone }}</span>
                </div>
              </td>
              <td>
                <div class="user-info">
                  <span class="user-name">{{ item.offer_id }}</span>
                  <span class="user-email">{{ item.city }}</span>
                </div>
              </td>
              <td>
                <a
                  v-if="item.cv_file_path"
                  class="btn-action secondary"
                  :href="`/api/admin/job_applications/${item.id}/cv`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ lt('Descargar', 'Descarregar', 'Deskargatu', 'Descargar') }}
                </a>
                <span v-else class="text-muted">{{ lt('Sin archivo', 'Sense arxiu', 'Fitxategirik ez', 'Sen arquivo') }}</span>
              </td>
              <td class="msg-cell clickable" @click="openJobApplicationModal(item)" :title="item.motivation || ''">
                {{ item.availability }}
                <br>
                <small class="text-muted">{{ (item.motivation || '').substring(0, 50) }}{{ (item.motivation || '').length > 50 ? '...' : '' }}</small>
                <span class="read-more-hint">({{ lt('ver más', 'veure més', 'gehiago ikusi', 'ver máis') }})</span>
              </td>
              <td>
                <select @change="updateStatus('job_applications', item.id, $event.target.value)" :class="['status-select', item.status]">
                  <option value="new" :selected="item.status === 'new'">{{ lt('Nueva', 'Nova', 'Berria', 'Nova') }}</option>
                  <option value="reviewing" :selected="item.status === 'reviewing'">{{ lt('En revisión', 'En revisió', 'Berrikusten', 'En revisión') }}</option>
                  <option value="interview" :selected="item.status === 'interview'">{{ lt('Entrevista', 'Entrevista', 'Elkarrizketa', 'Entrevista') }}</option>
                  <option value="accepted" :selected="item.status === 'accepted'">{{ lt('Aceptada', 'Acceptada', 'Onartuta', 'Aceptada') }}</option>
                  <option value="rejected" :selected="item.status === 'rejected'">{{ lt('Rechazada', 'Rebutjada', 'Baztertua', 'Rexeitada') }}</option>
                </select>
              </td>
              <td class="text-muted">{{ formatDate(item.created_at) }}</td>
              <td class="text-right">
                <button @click="deleteItem('job_applications', item.id)" class="btn-delete" :title="lt('Eliminar', 'Eliminar', 'Ezabatu', 'Eliminar')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Carnet Orders Table -->
        <table v-if="activeTab === 'carnet_orders'" class="admin-table">
          <thead>
            <tr>
              <th>{{ lt('Afiliado', 'Afiliat', 'Afiliatua', 'Afiliado') }}</th>
              <th>{{ lt('NIF / Nº socio', 'NIF / Nº soci', 'NIF / Bazkide zk', 'NIF / Nº socio') }}</th>
              <th>{{ lt('Dirección', 'Adreça', 'Helbidea', 'Enderezo') }}</th>
              <th>{{ lt('Pago', 'Pagament', 'Ordainketa', 'Pago') }}</th>
              <th>{{ lt('Envío', 'Enviament', 'Bidalketa', 'Envío') }}</th>
              <th>{{ lt('Fecha', 'Data', 'Data', 'Data') }}</th>
              <th class="text-right">{{ lt('Acciones', 'Accions', 'Ekintzak', 'Accións') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredCarnetOrders" :key="item.id" class="table-row">
              <td>
                <div class="user-info">
                  <span class="user-name">{{ item.full_name }}</span>
                  <span class="user-email">{{ item.email }}{{ item.phone ? ` · ${item.phone}` : '' }}</span>
                </div>
              </td>
              <td>
                <div class="user-info">
                  <span class="user-name">{{ item.nif || '-' }}</span>
                  <span class="user-email">{{ item.numero_socio || '-' }}</span>
                </div>
              </td>
              <td class="text-muted">
                {{ item.address || '-' }}<br>
                <small>{{ item.postal_code || '' }} {{ item.city || '' }}{{ item.country ? `, ${item.country}` : '' }}</small>
              </td>
              <td>
                <span :class="['status-badge', item.status === 'completed' ? 'active' : 'pending']">
                  {{ item.status || 'pending' }}
                </span>
              </td>
              <td>
                <select @change="updateStatus('carnet_orders', item.id, $event.target.value)" :class="['status-select', item.shipping_status]">
                  <option value="pending" :selected="item.shipping_status === 'pending'">{{ lt('Pendiente', 'Pendent', 'Zain', 'Pendente') }}</option>
                  <option value="processing" :selected="item.shipping_status === 'processing'">{{ lt('Preparando', 'Preparant', 'Prestatzen', 'Preparando') }}</option>
                  <option value="shipped" :selected="item.shipping_status === 'shipped'">{{ lt('Enviado', 'Enviat', 'Bidalita', 'Enviado') }}</option>
                  <option value="delivered" :selected="item.shipping_status === 'delivered'">{{ lt('Entregado', 'Entregat', 'Entregatuta', 'Entregado') }}</option>
                  <option value="cancelled" :selected="item.shipping_status === 'cancelled'">{{ lt('Cancelado', 'Cancel·lat', 'Bertan behera', 'Cancelado') }}</option>
                </select>
              </td>
              <td class="text-muted">{{ formatDate(item.created_at) }}</td>
              <td class="text-right">
                <button @click="deleteItem('carnet_orders', item.id)" class="btn-delete" :title="lt('Eliminar', 'Eliminar', 'Ezabatu', 'Eliminar')">
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
              <th>{{ lt('Email suscriptor', 'Correu subscriptor', 'Harpidedunaren emaila', 'Email do subscritor') }}</th>
              <th>{{ lt('Fecha suscripción', 'Data de subscripció', 'Harpidetza data', 'Data de subscrición') }}</th>
              <th>{{ lt('Estado', 'Estat', 'Egoera', 'Estado') }}</th>
              <th class="text-right">{{ lt('Acciones', 'Accions', 'Ekintzak', 'Accións') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredSubscribers" :key="item.id" class="table-row">
              <td class="font-bold">{{ item.email }}</td>
              <td class="text-muted">{{ formatDate(item.subscribed_at) }}</td>
              <td>
                <span :class="['status-badge', item.active ? 'active' : 'inactive']">
                  {{ item.active ? lt('Activo', 'Actiu', 'Aktibo', 'Activo') : lt('Inactivo', 'Inactiu', 'Ez-aktibo', 'Inactivo') }}
                </span>
              </td>
              <td class="text-right">
                <button @click="deleteItem('newsletter', item.id)" class="btn-delete" :title="lt('Eliminar', 'Eliminar', 'Ezabatu', 'Eliminar')">
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
                    <span class="option-stats font-bold">{{ vote.total }} {{ lt('votos', 'vots', 'boto', 'votos') }} ({{ calculatePercent(vote.total, pollTitle) }}%)</span>
                  </div>
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" :style="{ width: calculatePercent(vote.total, pollTitle) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p v-if="data.votes.length === 0" class="empty-results">
            {{ lt('No hay votos registrados todavía en el sistema.', 'Encara no hi ha vots registrats al sistema.', 'Oraindik ez dago botorik erregistratuta sisteman.', 'Aínda non hai votos rexistrados no sistema.') }}
          </p>
        </div>

        <!-- Users Table -->
        <table v-if="activeTab === 'users'" class="admin-table">
          <thead>
            <tr>
              <th>{{ lt('Usuario', 'Usuari', 'Erabiltzailea', 'Usuario') }}</th>
              <th>Email</th>
              <th>{{ lt('Rol', 'Rol', 'Rola', 'Rol') }}</th>
              <th>{{ lt('Registro', 'Registre', 'Erregistroa', 'Rexistro') }}</th>
              <th class="text-right">{{ lt('Acciones', 'Accions', 'Ekintzak', 'Accións') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredUsers" :key="item.id" class="table-row">
              <td class="font-bold">{{ item.full_name }}</td>
              <td class="text-muted">{{ item.email }}</td>
              <td><span :class="['badge-simple', item.role]">{{ item.role }}</span></td>
              <td class="text-muted">{{ formatDate(item.created_at) }}</td>
              <td class="text-right">
                <button v-if="item.role !== 'admin'" @click="deleteItem('users', item.id)" class="btn-delete" :title="lt('Eliminar usuario', 'Eliminar usuari', 'Erabiltzailea ezabatu', 'Eliminar usuario')">
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
          <h2 class="form-subtitle">{{ lt('Enviar comunicado masivo', 'Enviar comunicat massiu', 'Jakinarazpen masiboa bidali', 'Enviar comunicado masivo') }}</h2>
          <button @click="showNewsletterModal = false" class="btn-close">&times;</button>
        </div>
        <p class="modal-description">{{ lt('Este mensaje se enviará a todos los suscriptores activos del newsletter.', 'Aquest missatge s enviarà a tots els subscriptors actius del newsletter.', 'Mezu hau newsletterreko harpidedun aktibo guztiei bidaliko zaie.', 'Esta mensaxe enviarase a todos os subscritores activos da newsletter.') }}</p>
        
        <div class="modal-body">
          <div class="form-group">
            <label>{{ lt('Asunto del correo', 'Assumpte del correu', 'Mezuaren gaia', 'Asunto do correo') }}</label>
            <input v-model="newsletterForm.subject" type="text" :placeholder="lt('Ej: Novedades del mes de Febrero', 'Ex: Novetats del mes de febrer', 'Adib.: Otsaileko berritasunak', 'Ex: Novidades do mes de febreiro')" class="modal-input" />
          </div>
          <div class="form-group">
            <label>{{ lt('Contenido del mensaje', 'Contingut del missatge', 'Mezuaren edukia', 'Contido da mensaxe') }}</label>
            <textarea v-model="newsletterForm.message" :placeholder="lt('Escribe aquí el comunicado oficial...', 'Escriu aquí el comunicat oficial...', 'Idatzi hemen jakinarazpen ofiziala...', 'Escribe aquí o comunicado oficial...')" class="modal-textarea"></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showNewsletterModal = false" class="btn-action secondary">{{ lt('Cancelar', 'Cancel·lar', 'Utzi', 'Cancelar') }}</button>
          <button @click="sendBulkNewsletter" :disabled="sendingNewsletter || !newsletterForm.subject || !newsletterForm.message" class="btn-action primary">
            {{ sendingNewsletter ? lt('Enviando...', 'Enviant...', 'Bidaltzen...', 'Enviando...') : lt('Enviar ahora', 'Enviar ara', 'Bidali orain', 'Enviar agora') }}
          </button>
        </div>
      </div>
    </div>
        <!-- View Message Modal -->
    <div v-if="showViewMessageModal && selectedMessage" class="modal-overlay" @click.self="showViewMessageModal = false">
      <div class="modal-content glass animate-in">
        <div class="modal-header">
          <h2 class="form-subtitle">{{ lt('Detalle del mensaje', 'Detall del missatge', 'Mezuaren xehetasuna', 'Detalle da mensaxe') }}</h2>
          <button @click="showViewMessageModal = false" class="btn-close">&times;</button>
        </div>
        
        <div class="modal-body message-detail">
          <div class="detail-row">
            <span class="detail-label">{{ lt('Remitente:', 'Remitent:', 'Igorlea:', 'Remitente:') }}</span>
            <span class="detail-value">{{ selectedMessage?.name || lt('Sin nombre', 'Sense nom', 'Izenik gabe', 'Sen nome') }} &lt;{{ selectedMessage?.email || '-' }}&gt;</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ lt('Fecha:', 'Data:', 'Data:', 'Data:') }}</span>
            <span class="detail-value">{{ formatDate(selectedMessage?.created_at) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ lt('Asunto:', 'Assumpte:', 'Gaia:', 'Asunto:') }}</span>
            <span class="detail-value font-bold">{{ selectedMessage?.subject || '-' }}</span>
          </div>
          
          <div class="detail-divider"></div>
          
          <div class="message-content-full">
            {{ selectedMessage?.message || lt('Sin contenido', 'Sense contingut', 'Edukirik gabe', 'Sen contido') }}
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showViewMessageModal = false" class="btn-action primary">{{ lt('Cerrar', 'Tancar', 'Itxi', 'Pechar') }}</button>
        </div>
      </div>
    </div>

    <div v-if="showViewJobApplicationModal && selectedJobApplication" class="modal-overlay" @click.self="showViewJobApplicationModal = false">
      <div class="modal-content glass animate-in">
        <div class="modal-header">
          <h2 class="form-subtitle">{{ lt('Detalle de candidatura', 'Detall de candidatura', 'Hautagaitzaren xehetasuna', 'Detalle da candidatura') }}</h2>
          <button @click="showViewJobApplicationModal = false" class="btn-close">&times;</button>
        </div>

        <div class="modal-body message-detail">
          <div class="detail-row">
            <span class="detail-label">{{ lt('Candidato:', 'Candidat:', 'Hautagaia:', 'Candidato:') }}</span>
            <span class="detail-value">{{ selectedJobApplication?.full_name || '-' }} &lt;{{ selectedJobApplication?.email || '-' }}&gt;</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ lt('Oferta:', 'Oferta:', 'Eskaintza:', 'Oferta:') }}</span>
            <span class="detail-value">{{ selectedJobApplication?.offer_id || '-' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ lt('Disponibilidad:', 'Disponibilitat:', 'Eskuragarritasuna:', 'Disponibilidade:') }}</span>
            <span class="detail-value">{{ selectedJobApplication?.availability || '-' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ lt('Fecha:', 'Data:', 'Data:', 'Data:') }}</span>
            <span class="detail-value">{{ formatDate(selectedJobApplication?.created_at) }}</span>
          </div>

          <div class="detail-divider"></div>

          <div class="message-content-full">
            {{ selectedJobApplication?.motivation || lt('Sin mensaje', 'Sense missatge', 'Mezurik ez', 'Sen mensaxe') }}
          </div>
        </div>

        <div class="modal-footer">
          <a
            v-if="selectedJobApplication?.cv_file_path"
            class="btn-action secondary"
            :href="`/api/admin/job_applications/${selectedJobApplication.id}/cv`"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ lt('Descargar CV', 'Descarregar CV', 'CV deskargatu', 'Descargar CV') }}
          </a>
          <button @click="showViewJobApplicationModal = false" class="btn-action primary">{{ lt('Cerrar', 'Tancar', 'Itxi', 'Pechar') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t, locale } = useI18n()

const lt = (es, ca, eu, gl) => {
  if (locale.value === 'ca') return ca
  if (locale.value === 'eu') return eu
  if (locale.value === 'gl') return gl
  return es
}

definePageMeta({
  middleware: ['admin']
})

useHead(() => ({
  title: `${t('admin.title')} - PCE`,
  meta: [
    { name: 'description', content: `${t('admin.dashboard')} ${t('admin.statistics')}` }
  ]
}))

const activeTab = ref('affiliates')
const searchQuery = ref('')
const showNewsletterModal = ref(false)
const sendingNewsletter = ref(false)
const newsletterForm = reactive({
  subject: '',
  message: ''
})

const { data, pending, error, refresh } = await useFetch('/api/admin/data')
const toSearchable = (value) => String(value ?? '').toLowerCase()

// Filtering logic
const filteredAffiliates = computed(() => {
  if (!data.value?.affiliates) return []
  const q = toSearchable(searchQuery.value)
  return data.value.affiliates.filter(a => 
    `${a.name || ''} ${a.lastname || ''}`.toLowerCase().includes(q) ||
    toSearchable(a.email).includes(q) ||
    toSearchable(a.dni).includes(q)
  )
})

const filteredDonations = computed(() => {
  if (!data.value?.donations) return []
  const q = toSearchable(searchQuery.value)
  return data.value.donations.filter(d => 
    toSearchable(d.email).includes(q)
  )
})

const filteredMessages = computed(() => {
  if (!data.value?.messages) return []
  const q = toSearchable(searchQuery.value)
  return data.value.messages.filter(m => 
    toSearchable(m.name).includes(q) ||
    toSearchable(m.email).includes(q) ||
    toSearchable(m.subject).includes(q) ||
    toSearchable(m.message).includes(q)
  )
})

const filteredJobApplications = computed(() => {
  if (!data.value?.job_applications) return []
  const q = toSearchable(searchQuery.value)
  return data.value.job_applications.filter(item =>
    toSearchable(item.full_name).includes(q) ||
    toSearchable(item.email).includes(q) ||
    toSearchable(item.offer_id).includes(q) ||
    toSearchable(item.city).includes(q) ||
    toSearchable(item.status).includes(q) ||
    toSearchable(item.availability).includes(q)
  )
})

const filteredCarnetOrders = computed(() => {
  if (!data.value?.carnet_orders) return []
  const q = toSearchable(searchQuery.value)
  return data.value.carnet_orders.filter(item =>
    toSearchable(item.full_name).includes(q) ||
    toSearchable(item.email).includes(q) ||
    toSearchable(item.nif).includes(q) ||
    toSearchable(item.numero_socio).includes(q) ||
    toSearchable(item.address).includes(q) ||
    toSearchable(item.city).includes(q) ||
    toSearchable(item.shipping_status).includes(q)
  )
})

const filteredSubscribers = computed(() => {
  if (!data.value?.subscribers) return []
  const q = toSearchable(searchQuery.value)
  return data.value.subscribers.filter(s => 
    toSearchable(s.email).includes(q)
  )
})

const filteredUsers = computed(() => {
  if (!data.value?.users) return []
  const q = toSearchable(searchQuery.value)
  return data.value.users.filter(u => 
    toSearchable(u.full_name).includes(q) ||
    toSearchable(u.email).includes(q)
  )
})
// Scrutiny Logic
const groupedVotes = computed(() => {
  if (!data.value?.votes) return {}
  return data.value.votes.reduce((acc, vote) => {
    if (!acc[vote.poll_title]) acc[vote.poll_title] = []
    acc[vote.poll_title].push(vote)
    return acc
  }, {})
})

const calculatePercent = (votes, pollTitle) => {
  if (!data.value?.votes) return 0
  const totalPollVotes = data.value.votes
    .filter(v => v.poll_title === pollTitle)
    .reduce((sum, v) => sum + Number(v.total), 0)
  
  return totalPollVotes > 0 ? ((votes / totalPollVotes) * 100).toFixed(1) : 0
}

const formatMoney = (val) => {
  const localeMap = {
    es: 'es-ES',
    ca: 'ca-ES',
    eu: 'eu-ES',
    gl: 'gl-ES'
  }
  return new Intl.NumberFormat(localeMap[locale.value] || 'es-ES', { style: 'currency', currency: 'EUR' }).format(val)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const localeMap = {
    es: 'es-ES',
    ca: 'ca-ES',
    eu: 'eu-ES',
    gl: 'gl-ES'
  }
  return new Date(dateString).toLocaleDateString(localeMap[locale.value] || 'es-ES')
}

const showViewMessageModal = ref(false)
const selectedMessage = ref(null)
const showViewJobApplicationModal = ref(false)
const selectedJobApplication = ref(null)

const openMessageModal = (message) => {
  selectedMessage.value = message
  showViewMessageModal.value = true
}

const openJobApplicationModal = (application) => {
  selectedJobApplication.value = application
  showViewJobApplicationModal.value = true
}

// Actions
const deleteItem = async (type, id) => {
  if (!confirm(lt('¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.', 'Estàs segur que vols eliminar aquest registre? Aquesta acció no es pot desfer.', 'Ziur zaude erregistro hau ezabatu nahi duzula? Ekintza hau ezin da desegin.', 'Estás seguro de que queres eliminar este rexistro? Esta acción non se pode desfacer.'))) return

  try {
    await $fetch(`/api/admin/${type}/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (e) {
    alert(lt('Error al eliminar: ', 'Error en eliminar: ', 'Ezabatzean errorea: ', 'Erro ao eliminar: ') + (e.data?.message || e.message))
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
    alert(lt('Error al actualizar estado: ', 'Error en actualitzar l estat: ', 'Egoera eguneratzean errorea: ', 'Erro ao actualizar o estado: ') + (e.data?.message || e.message))
    await refresh() // Reverta change locally
  }
}

const sendBulkNewsletter = async () => {
  if (!confirm(lt('¿Estás seguro de enviar este comunicado a ', 'Estàs segur d enviar aquest comunicat a ', 'Ziur zaude jakinarazpen hau honi bidali nahi diozula: ', 'Estás seguro de enviar este comunicado a ') + `${data.value.stats.total_subscribers} ` + lt('suscriptores?', 'subscriptors?', 'harpidedun?', 'subscritores?'))) return

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
    alert(lt('Error al enviar: ', 'Error en enviar: ', 'Bidaltzean errorea: ', 'Erro ao enviar: ') + (e.data?.message || e.message))
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
  font-size: 2.5rem;
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
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-bottom: 50px;
}

.kpi-card {
  background: rgba(114, 50, 51, 0.95); /* More opaque brand color */
  padding: 18px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
  overflow: hidden;
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
  width: 100%;
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
  font-size: clamp(1.3rem, 2.1vw, 1.9rem);
  font-weight: bold;
  color: #fff;
  line-height: 1.1;
  white-space: nowrap;
  max-width: 100%;
}

.kpi-value-money {
  font-size: clamp(1rem, 1.35vw, 1.55rem);
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
  background: rgba(114, 50, 51, 0.85); /* Opaque brand color instead of black */
  backdrop-filter: blur(20px);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  
  th {
    background: var(--primary-red); /* Solid brand header */
    padding: 20px;
    text-align: left;
    font-family: var(--font-heading);
    font-size: 0.9rem;
    letter-spacing: 1px;
    color: #ffffff;
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
  background: linear-gradient(90deg, #999999 0%, #ffffff 100%);
  border-radius: 5px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
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

.form-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;

    label {
        font-family: var(--font-heading);
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.7);
        letter-spacing: 1px;
    }
}

.modal-input,
.modal-textarea {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 12px 15px;
    color: #fff;
    font-size: 1rem;
    font-family: 'Inter', sans-serif;
    width: 100%;

    &:focus {
        outline: none;
        border-color: var(--primary-red);
        background: rgba(0, 0, 0, 0.5);
    }
}

.modal-textarea {
    min-height: 150px;
    resize: vertical;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 30px;
}

.btn-action {
    padding: 10px 20px;
    border-radius: 8px;
    font-family: var(--font-heading);
    font-weight: bold;
    font-size: 0.9rem;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;

    &.primary {
        background: var(--primary-red);
        color: #fff;
        
        &:hover:not(:disabled) {
            background: #8B3A3A;
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    &.secondary {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;

        &:hover {
            background: rgba(255, 255, 255, 0.1);
        }
    }
}

/* Message Detail Modal Styles */
.msg-cell.clickable {
    cursor: pointer;
    position: relative;
    transition: color 0.2s ease;
    
    &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.05);
    }
}

.read-more-hint {
    font-size: 0.7rem;
    color: var(--acc-red);
    margin-left: 5px;
    font-weight: bold;
    opacity: 0.8;
}

.message-detail {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.detail-row {
    display: flex;
    gap: 15px;
    align-items: baseline;
}

.detail-label {
    font-family: var(--font-heading);
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.85rem;
    min-width: 100px;
}

.detail-value {
    color: #fff;
    font-size: 1rem;
}

.detail-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 10px 0;
}

.message-content-full {
    background: rgba(0, 0, 0, 0.2);
    padding: 20px;
    border-radius: 10px;
    white-space: pre-wrap;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    max-height: 40vh;
    overflow-y: auto;
    border: 1px solid rgba(255, 255, 255, 0.05);
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
