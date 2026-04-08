<template>
  <main class="update-page container">
    <section class="card">
      <div class="head">
        <div>
          <h1>Actualizar datos de afiliacion</h1>
          <p>Modifica tus datos personales y de contacto sin volver a afiliarte.</p>
        </div>
        <NuxtLink to="/afiliado/ajustes" class="btn-back">Volver</NuxtLink>
      </div>

      <div v-if="pending" class="state-box">Cargando tus datos...</div>
      <div v-else-if="loadError" class="state-box error">No se pudieron cargar tus datos.</div>
      <div v-else-if="!hasActiveAffiliation" class="state-box warning">
        Aun no tienes una afiliacion activa. Primero debes completar tu afiliacion.
        <NuxtLink to="/afiliacion" class="inline-link">Ir a afiliarme</NuxtLink>
      </div>

      <form v-else class="form" @submit.prevent="saveData">
        <div class="grid">
          <label>
            Nombre
            <input v-model="form.name" type="text" required />
          </label>

          <label>
            Apellidos
            <input v-model="form.lastname" type="text" required />
          </label>

          <label>
            DNI/NIF
            <input v-model="form.dni" type="text" required />
          </label>

          <label>
            Fecha de nacimiento
            <input v-model="form.birthdate" type="date" required />
          </label>

          <label>
            Telefono
            <input v-model="form.phone" type="tel" required />
          </label>

          <label>
            Email
            <input :value="profile?.affiliation?.email || profile?.user?.email || '-'" type="email" disabled />
          </label>
        </div>

        <div class="photo-section">
          <!-- Si hay una foto ya guardada y NO hay preview nuevo -->
          <div v-if="profile?.affiliation?.photoUrl && !photoPreview">
            <div class="photo-preview">
              <div class="photo-container">
                <img :src="profile.affiliation.photoUrl" alt="Foto de perfil actual" class="photo-img" />
              </div>
            </div>
            <label class="photo-input-label">
              Cambiar foto
              <input
                type="file"
                accept="image/*"
                @change="handlePhotoSelect"
                :disabled="savingPhoto"
              />
            </label>
          </div>

          <!-- Si no hay foto guardada -->
          <div v-else-if="!profile?.affiliation?.photoUrl && !photoPreview">
            <div class="photo-preview">
              <div class="photo-placeholder">Sin foto</div>
            </div>
            <label class="photo-input-label">
              Seleccionar foto
              <input
                type="file"
                accept="image/*"
                @change="handlePhotoSelect"
                :disabled="savingPhoto"
              />
            </label>
          </div>

          <!-- EDITOR DE FOTO (cuando selecciona un archivo) -->
          <div v-if="photoPreview" class="photo-editor-section">
            <div class="editor-container">
              <div class="crop-area">
                <img
                  :src="photoPreview"
                  :style="{
                    transform: `scale(${photoZoom}) translateX(${photoPanX}px) translateY(${photoPanY}px)`,
                    cursor: photoDragging ? 'grabbing' : 'grab',
                    transition: photoDragging ? 'none' : 'transform 0.2s'
                  }"
                  @mousedown="startDrag"
                  @mousemove="doDrag"
                  @mouseup="endDrag"
                  @mouseleave="endDrag"
                  class="editable-img"
                />
              </div>
              
              <div class="editor-controls">
                <div class="zoom-control">
                  <span class="control-label">Zoom</span>
                  <input
                    v-model.number="photoZoom"
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    class="zoom-slider"
                  />
                  <span class="zoom-value">{{ Math.round(photoZoom * 100) }}%</span>
                </div>

                <div class="action-buttons">
                  <button
                    type="button"
                    @click="cancelPhotoEdit"
                    class="btn-cancel"
                    :disabled="savingPhoto"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    @click="confirmPhotoEdit"
                    class="btn-confirm"
                    :disabled="savingPhoto"
                  >
                    <span v-if="savingPhoto">Guardando...</span>
                    <span v-else>Confirmar foto</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p v-if="photoError" class="msg error">{{ photoError }}</p>
          <p v-if="photoSuccess" class="msg ok">{{ photoSuccess }}</p>
        </div>

        <div class="actions">
          <button class="btn-primary" type="submit" :disabled="saving">
            <span v-if="saving">Guardando...</span>
            <span v-else>Guardar cambios</span>
          </button>
          <NuxtLink class="btn-secondary" to="/afiliado/datos">Ver ficha</NuxtLink>
        </div>

        <p v-if="message" class="msg ok">{{ message }}</p>
        <p v-if="errorMessage" class="msg error">{{ errorMessage }}</p>
      </form>
    </section>
  </main>
</template>

<script setup>
definePageMeta({
  middleware: ['afiliado']
})

const { data, pending, error: loadError, refresh } = await useFetch('/api/afiliacion/my-data')

const profile = computed(() => data.value || null)
const hasActiveAffiliation = computed(() => {
  const status = String(profile.value?.affiliation?.status || '')
  return ['paid', 'active', 'simulated_paid'].includes(status)
})

const form = reactive({
  name: '',
  lastname: '',
  dni: '',
  birthdate: '',
  phone: ''
})

const saving = ref(false)
const message = ref('')
const errorMessage = ref('')

const {
  photoPreview,
  photoFile,
  photoZoom,
  photoPanX,
  photoPanY,
  photoDragging,
  photoError,
  photoSuccess,
  savingPhoto,
  handlePhotoSelect,
  startDrag,
  doDrag,
  endDrag,
  cancelPhotoEdit,
  cropAndExportPhoto
} = usePhotoEditor()

watchEffect(() => {
  const affiliation = profile.value?.affiliation
  if (!affiliation) return

  form.name = String(affiliation.name || '')
  form.lastname = String(affiliation.lastname || '')
  form.dni = String(affiliation.dni || '')
  form.birthdate = affiliation.birthdate ? new Date(affiliation.birthdate).toISOString().slice(0, 10) : ''
  form.phone = String(affiliation.phone || '')
})

const saveData = async () => {
  message.value = ''
  errorMessage.value = ''
  saving.value = true

  try {
    await $fetch('/api/afiliacion/update-data', {
      method: 'POST',
      body: {
        name: form.name,
        lastname: form.lastname,
        dni: form.dni,
        birthdate: form.birthdate,
        phone: form.phone
      }
    })

    await refresh()
    message.value = 'Tus datos se han actualizado correctamente.'
  } catch (err) {
    errorMessage.value = err?.data?.message || err?.message || 'No se pudieron guardar los cambios.'
  } finally {
    saving.value = false
  }
}

const confirmPhotoEdit = async () => {
  if (!photoFile.value || !photoPreview.value) return

  savingPhoto.value = true
  try {
    const blob = await cropAndExportPhoto()
    if (!blob) throw new Error('No se pudo procesar la imagen')

    const formData = new FormData()
    formData.append('photo', blob, 'photo.jpg')

    await $fetch('/api/afiliacion/update-photo', {
      method: 'POST',
      body: formData
    })

    await refresh()
    photoSuccess.value = 'Foto actualizada correctamente.'
    cancelPhotoEdit()
  } catch (err) {
    photoError.value = err?.data?.message || err?.message || 'No se pudo actualizar la foto.'
  } finally {
    savingPhoto.value = false
  }
}

useHead({
  title: 'Actualizar datos de afiliacion - PCE',
  meta: [
    {
      name: 'description',
      content: 'Apartado privado para actualizar datos de afiliacion en PCE.'
    }
  ]
})
</script>

<style scoped>
.update-page {
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
  white-space: nowrap;
}

.state-box {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 14px;
  color: #f4ecec;
}

.state-box.error {
  border-color: rgba(255, 120, 120, 0.35);
}

.state-box.warning {
  border-color: rgba(255, 194, 102, 0.35);
}

.inline-link {
  margin-left: 8px;
  color: #f5d8b6;
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #eadfe0;
  font-size: 0.9rem;
}

input {
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.22);
  color: #fff;
  padding: 10px 12px;
}

input:disabled {
  opacity: 0.7;
}

.actions {
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
  border: none;
  cursor: pointer;
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

.msg {
  margin: 0;
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

.photo-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 14px;
}

.photo-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  overflow: hidden;
}

.photo-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.photo-img {
  max-width: 100%;
  max-height: 350px;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
}

.photo-placeholder {
  color: rgba(234, 223, 224, 0.5);
  font-size: 1rem;
}

.photo-input-label {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5d8b6, #e8c99c);
  border: none;
  border-radius: 12px;
  padding: 14px 20px;
  color: #5e2c2c;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 8px;
  min-height: 48px;
}

.photo-input-label:hover {
  background: linear-gradient(135deg, #f7e0c7, #ead3ad);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.photo-input-label input {
  display: none;
}

.photo-input-label:has(input:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

.photo-editor-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 14px;
}

.editor-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.crop-area {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  max-width: 500px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(245, 216, 182, 0.5);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
}

.editable-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  cursor: grab;
  transition: cursor 0.2s;
}

.editable-img:active {
  cursor: grabbing;
}

.editor-controls {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.zoom-control {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
  padding: 14px 16px;
  border-radius: 12px;
  flex-wrap: wrap;
}

.control-label {
  color: #eadfe0;
  font-weight: 700;
  min-width: 50px;
  font-size: 0.95rem;
}

.zoom-slider {
  flex: 1;
  min-width: 150px;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.zoom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5d8b6, #e8c99c);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s;
}

.zoom-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.zoom-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5d8b6, #e8c99c);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s;
}

.zoom-slider::-moz-range-thumb:hover {
  transform: scale(1.15);
}

.zoom-value {
  color: #f5d8b6;
  font-weight: 700;
  min-width: 55px;
  text-align: right;
  font-size: 0.95rem;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-cancel,
.btn-confirm {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
  font-size: 0.95rem;
}

.btn-cancel {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f4ecec;
}

.btn-cancel:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.35);
}

.btn-confirm {
  background: linear-gradient(135deg, #f5d8b6, #e8c99c);
  color: #5e2c2c;
}

.btn-confirm:hover:not(:disabled) {
  background: linear-gradient(135deg, #f7e0c7, #ead3ad);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.btn-cancel:disabled,
.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 700px) {
  .head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
