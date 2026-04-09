<template>
  <main class="cuotas-page container">
    <section class="card">
      <div class="header-row">
        <div>
          <h1>{{ lt('Historial de cuotas', 'Historial de quotes', 'Kuoten historiala', 'Historial de cotas') }}</h1>
          <p>{{ lt('Consulta tus pedidos y pagos asociados a renovaciones y carné físico.', 'Consulta les teves comandes i pagaments associats a renovacions i carnet físic.', 'Kontsultatu zure eskaerak eta berritzeekin eta karnet fisikoarekin lotutako ordainketak.', 'Consulta os teus pedidos e pagos asociados ás renovacións e ao carné físico.') }}</p>
        </div>
        <NuxtLink to="/afiliado/ajustes" class="btn-back">{{ lt('Volver', 'Tornar', 'Itzuli', 'Volver') }}</NuxtLink>
      </div>

      <div class="summary">
        <div class="summary-item">
          <span>{{ lt('Total de movimientos', 'Total de moviments', 'Mugimenduen guztira', 'Total de movementos') }}</span>
          <strong>{{ orders.length }}</strong>
        </div>
        <div class="summary-item">
          <span>{{ lt('Importe acumulado', 'Import acumulat', 'Zenbateko metatua', 'Importe acumulado') }}</span>
          <strong>{{ totalAmount }} EUR</strong>
        </div>
      </div>

      <div v-if="pending" class="state-box">{{ lt('Cargando historial...', 'Carregant historial...', 'Historia kargatzen...', 'Cargando historial...') }}</div>
      <div v-else-if="error" class="state-box error">{{ lt('No se pudo cargar el historial.', 'No s\'ha pogut carregar l\'historial.', 'Ezin izan da historia kargatu.', 'Non se puido cargar o historial.') }}</div>
      <div v-else-if="!orders.length" class="state-box">{{ lt('Todavía no tienes movimientos registrados.', 'Encara no tens moviments registrats.', 'Oraindik ez duzu erregistratutako mugimendurik.', 'Aínda non tes movementos rexistrados.') }}</div>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{{ lt('Fecha', 'Data', 'Data', 'Data') }}</th>
              <th>{{ lt('Importe', 'Import', 'Zenbatekoa', 'Importe') }}</th>
              <th>{{ lt('Pago', 'Pagament', 'Ordainketa', 'Pago') }}</th>
              <th>{{ lt('Envío', 'Enviament', 'Bidalketa', 'Envío') }}</th>
              <th>{{ lt('Referencia', 'Referència', 'Erreferentzia', 'Referencia') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in orders" :key="item.id">
              <td>{{ formatDate(item.createdAt) }}</td>
              <td>{{ Number(item.amount || 0).toFixed(2) }} EUR</td>
              <td>
                <span :class="['badge', paymentStatusClass(item.status)]">{{ paymentStatusLabel(item.status) }}</span>
              </td>
              <td>
                <span :class="['badge', shippingStatusClass(item.shippingStatus)]">{{ shippingStatusLabel(item.shippingStatus) }}</span>
              </td>
              <td>{{ item.paymentIntentId || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
definePageMeta({
  middleware: ['afiliado']
})

const { locale } = useI18n()

const lt = (es, ca, eu, gl) => {
  if (locale.value === 'ca') return ca
  if (locale.value === 'eu') return eu
  if (locale.value === 'gl') return gl
  return es
}

const { data, pending, error } = await useFetch('/api/carnet/my-orders')

const orders = computed(() => Array.isArray(data.value?.orders) ? data.value.orders : [])

const totalAmount = computed(() => {
  return orders.value
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)
    .toFixed(2)
})

const formatDate = (value) => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'

  const localeCode = locale.value === 'ca'
    ? 'ca-ES'
    : locale.value === 'eu'
      ? 'eu-ES'
      : locale.value === 'gl'
        ? 'gl-ES'
        : 'es-ES'

  return parsed.toLocaleDateString(localeCode)
}

const paymentStatusLabel = (status) => {
  if (status === 'completed' || status === 'simulated_paid') {
    return lt('Pagado', 'Pagat', 'Ordainduta', 'Pagado')
  }
  if (status === 'pending') {
    return lt('Pendiente', 'Pendent', 'Zain', 'Pendiente')
  }
  return status || lt('N/A', 'N/D', 'E/E', 'N/D')
}

const paymentStatusClass = (status) => {
  if (status === 'completed' || status === 'simulated_paid') return 'ok'
  if (status === 'pending') return 'pending'
  return 'unknown'
}

const shippingStatusLabel = (status) => {
  if (status === 'pending') return lt('Pendiente', 'Pendent', 'Zain', 'Pendiente')
  if (status === 'shipped') return lt('Enviado', 'Enviat', 'Bidalita', 'Enviado')
  if (status === 'delivered') return lt('Entregado', 'Entregat', 'Entregatuta', 'Entregado')
  return status || lt('N/A', 'N/D', 'E/E', 'N/D')
}

const shippingStatusClass = (status) => {
  if (status === 'pending') return 'pending'
  if (status === 'shipped' || status === 'delivered') return 'ok'
  return 'unknown'
}

useHead(() => ({
  title: `${lt('Historial de cuotas', 'Historial de quotes', 'Kuoten historiala', 'Historial de cotas')} - PCE`,
  meta: [
    {
      name: 'description',
      content: lt(
        'Historial de cuotas y pedidos del afiliado en PCE.',
        'Historial de quotes i comandes de l\'afiliat a PCE.',
        'PCEko afiliatuaren kuoten eta eskaeren historia.',
        'Historial de cotas e pedidos do afiliado en PCE.'
      )
    }
  ]
}))
</script>

<style scoped>
.cuotas-page {
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
  margin-bottom: 16px;
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

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.summary-item {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 12px;
}

.summary-item span {
  display: block;
  color: #dcc9ca;
  font-size: 0.88rem;
}

.summary-item strong {
  color: #fff;
  font-size: 1.1rem;
}

.state-box {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 16px;
  color: #f4ecec;
}

.state-box.error {
  border-color: rgba(255, 120, 120, 0.35);
  color: #ffd0d0;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #f4ecec;
  font-size: 0.9rem;
}

th {
  color: #eadfe0;
  font-weight: 700;
}

.badge {
  display: inline-block;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.76rem;
  border: 1px solid transparent;
}

.badge.ok {
  background: rgba(78, 190, 113, 0.18);
  border-color: rgba(78, 190, 113, 0.35);
  color: #b9f0c8;
}

.badge.pending {
  background: rgba(255, 194, 102, 0.18);
  border-color: rgba(255, 194, 102, 0.35);
  color: #ffe1b3;
}

.badge.unknown {
  background: rgba(180, 180, 180, 0.18);
  border-color: rgba(200, 200, 200, 0.35);
  color: #e7e7e7;
}

@media (max-width: 700px) {
  .header-row {
    flex-direction: column;
  }
}
</style>
