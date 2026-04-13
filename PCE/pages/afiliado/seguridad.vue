<template>
  <main class="settings-page container">
    <section class="card">
      <div class="head">
        <div>
          <h1>{{ lt('Seguridad y suscripción', 'Seguretat i subscripció', 'Segurtasuna eta harpidetza', 'Seguridade e subscrición') }}</h1>
          <p>{{ lt('Gestiona tu contraseña y tu estado de afiliación.', 'Gestiona la teva contrasenya i l\'estat d\'afiliació.', 'Kudeatu zure pasahitza eta afiliazio egoera.', 'Xestiona o teu contrasinal e o estado da afiliación.') }}</p>
        </div>
        <NuxtLink to="/afiliado/ajustes" class="btn-back">{{ lt('Volver', 'Tornar', 'Itzuli', 'Volver') }}</NuxtLink>
      </div>

      <div class="grid">
        <article class="panel">
          <h2>{{ lt('Cambiar contraseña', 'Canviar contrasenya', 'Pasahitza aldatu', 'Cambiar contrasinal') }}</h2>
          <form class="form" @submit.prevent="changePassword">
            <label>
              {{ lt('Contraseña actual', 'Contrasenya actual', 'Uneko pasahitza', 'Contrasinal actual') }}
              <input v-model="currentPassword" type="password" required />
            </label>
            <label>
              {{ lt('Nueva contraseña', 'Nova contrasenya', 'Pasahitz berria', 'Novo contrasinal') }}
              <input v-model="newPassword" type="password" minlength="8" required />
            </label>
            <label>
              {{ lt('Confirmar nueva contraseña', 'Confirma la nova contrasenya', 'Pasahitz berria berretsi', 'Confirmar novo contrasinal') }}
              <input v-model="confirmPassword" type="password" minlength="8" required />
            </label>
            <button class="btn-primary" type="submit" :disabled="savingPassword">
              <span v-if="savingPassword">{{ lt('Guardando...', 'Desant...', 'Gordetzen...', 'Gardando...') }}</span>
              <span v-else>{{ lt('Actualizar contraseña', 'Actualitzar contrasenya', 'Pasahitza eguneratu', 'Actualizar contrasinal') }}</span>
            </button>
          </form>
        </article>

        <article class="panel danger">
          <h2>{{ lt('Darse de baja', 'Donar-se de baixa', 'Baja eman', 'Darse de baixa') }}</h2>
          <p>{{ lt('Si cancelas tu afiliación, tu estado pasará a cancelado hasta que vuelvas a activarla.', 'Si cancel·les l\'afiliació, l\'estat passarà a cancel·lat fins que la tornis a activar.', 'Afiliazioa ezeztatzen baduzu, egoera ezeztatuta geldituko da berriro aktibatu arte.', 'Se cancelas a afiliación, o estado pasará a cancelado ata que a reactives.') }}</p>
          <button class="btn-danger" type="button" :disabled="cancelling" @click="cancelAffiliation">
            <span v-if="cancelling">{{ lt('Cancelando...', 'Cancel·lant...', 'Ezeztatzen...', 'Cancelando...') }}</span>
            <span v-else>{{ lt('Cancelar afiliación', 'Cancel·lar afiliació', 'Afiliazioa ezeztatu', 'Cancelar afiliación') }}</span>
          </button>
        </article>
      </div>

      <p v-if="successMessage" class="msg ok">{{ successMessage }}</p>
      <p v-if="errorMessage" class="msg error">{{ errorMessage }}</p>
    </section>
  </main>
</template>

<script setup>
definePageMeta({
  middleware: ['afiliado']
})

const { user, checkAuth } = useAuth()
const { locale } = useI18n()

const lt = (es, ca, eu, gl) => {
  if (locale.value === 'ca') return ca
  if (locale.value === 'eu') return eu
  if (locale.value === 'gl') return gl
  return es
}

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const savingPassword = ref(false)
const cancelling = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const clearMessages = () => {
  successMessage.value = ''
  errorMessage.value = ''
}

const changePassword = async () => {
  clearMessages()

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = lt('Las contraseñas no coinciden.', 'Les contrasenyes no coincideixen.', 'Pasahitzak ez datoz bat.', 'Os contrasinais non coinciden.')
    return
  }

  savingPassword.value = true
  try {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      }
    })

    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    successMessage.value = lt('Contraseña actualizada correctamente.', 'Contrasenya actualitzada correctament.', 'Pasahitza ondo eguneratu da.', 'Contrasinal actualizado correctamente.')
  } catch (err) {
    errorMessage.value = err?.data?.message || err?.message || lt('No se pudo actualizar la contraseña.', 'No s\'ha pogut actualitzar la contrasenya.', 'Ezin izan da pasahitza eguneratu.', 'Non se puido actualizar o contrasinal.')
  } finally {
    savingPassword.value = false
  }
}

const cancelAffiliation = async () => {
  clearMessages()
  if (!confirm(lt('¿Seguro que quieres cancelar tu afiliación?', 'Segur que vols cancel·lar la teva afiliació?', 'Ziur zaude afiliazioa ezeztatu nahi duzula?', 'Seguro que queres cancelar a túa afiliación?'))) {
    return
  }

  cancelling.value = true
  try {
    if (!user.value?.email) {
      await checkAuth()
    }

    if (!user.value?.email) {
      throw new Error(lt('No se pudo identificar tu usuario.', 'No s\'ha pogut identificar el teu usuari.', 'Ezin izan da zure erabiltzailea identifikatu.', 'Non se puido identificar o teu usuario.'))
    }

    await $fetch('/api/afiliacion/cancel', {
      method: 'POST',
      body: { email: user.value.email }
    })

    successMessage.value = lt('Afiliación cancelada correctamente.', 'Afiliació cancel·lada correctament.', 'Afiliazioa ondo ezeztatu da.', 'Afiliación cancelada correctamente.')
  } catch (err) {
    errorMessage.value = err?.data?.message || err?.message || lt('No se pudo cancelar la afiliación.', 'No s\'ha pogut cancel·lar l\'afiliació.', 'Ezin izan da afiliazioa ezeztatu.', 'Non se puido cancelar a afiliación.')
  } finally {
    cancelling.value = false
  }
}

useHead(() => ({
  title: `${lt('Seguridad y suscripción', 'Seguretat i subscripció', 'Segurtasuna eta harpidetza', 'Seguridade e subscrición')} - PCE`
}))
</script>

<style scoped>
.settings-page {
  padding: 48px 20px 70px;
}

.card {
  background: rgba(94, 44, 44, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  padding: 8px 14px;
  min-height: 40px;
  line-height: 1;
  color: #f4ecec;
  text-decoration: none;
}

.grid {
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
  margin: 0 0 10px;
  color: #fff;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #eadfe0;
  font-size: 0.92rem;
}

input {
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.22);
  color: #fff;
  padding: 10px 12px;
}

.btn-primary,
.btn-danger {
  border-radius: 10px;
  padding: 10px 14px;
  text-decoration: none;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #f5d8b6, #e8c99c);
  color: #5e2c2c;
}

.panel.danger {
  border-color: rgba(255, 140, 140, 0.35);
}

.btn-danger {
  background: #b43b3b;
  color: #fff;
}

.msg {
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 0.9rem;
}

.msg.ok {
  background: rgba(78, 190, 113, 0.18);
  border: 1px solid rgba(78, 190, 113, 0.35);
  color: #b9f0c8;
}

.msg.error {
  background: rgba(255, 120, 120, 0.18);
  border: 1px solid rgba(255, 120, 120, 0.35);
  color: #ffd0d0;
}
</style>
