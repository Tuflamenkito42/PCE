<template>
  <main class="qr-card-page container">
    <section class="card-shell">
      <h1>Carnet digital verificado</h1>

      <div v-if="pending" class="state-box">Cargando carnet...</div>
      <div v-else-if="error || !card" class="state-box error">No se pudo validar este QR.</div>

      <div v-else class="content">
        <div class="card-view" ref="cardViewRef">
          <img class="card-template" src="/images/carnesocio.png" alt="Plantilla carnet" />

          <div class="card-field card-name">{{ (card.fullName || '').toUpperCase() }}</div>
          <div class="card-field card-nif">{{ card.dni }}</div>
          <div class="card-field card-number">{{ card.numberId }}</div>
          <div class="card-field card-alta">{{ formatDate(card.createdAt) }}</div>
          <div class="card-field card-valid">{{ formatDate(card.renovationAt) }}</div>

          <img v-if="card.photoUrl" :src="card.photoUrl" alt="Foto de socio" class="card-photo" />
          <div v-else class="card-avatar">{{ (card.fullName || 'U').trim().charAt(0).toUpperCase() }}</div>
        </div>

        <div class="actions">
          <button class="btn-primary" @click="downloadImage" :disabled="downloading">
            {{ downloading ? 'Generando imagen...' : 'Guardar imagen del carnet' }}
          </button>
          <button class="btn-secondary" @click="shareCard">
            Compartir / Guardar en movil
          </button>
          <p class="help">Consejo: desde iPhone/Android puedes compartir esta tarjeta y guardarla en apps de cartera o como acceso rapido.</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
const route = useRoute()
const token = computed(() => String(route.params.token || ''))

const { data, pending, error } = await useFetch(() => `/api/carnet/public/${token.value}`)

const card = computed(() => data.value?.card || null)
const downloading = ref(false)
const cardViewRef = ref(null)

const formatDate = (value) => {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('es-ES')
}

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`))
    img.src = src
  })
}

const drawCover = (ctx, img, targetX, targetY, targetW, targetH, alignX = 0.5, alignY = 0.28) => {
  const scale = Math.max(targetW / img.width, targetH / img.height)
  const drawW = img.width * scale
  const drawH = img.height * scale
  const drawX = targetX + (targetW - drawW) * alignX
  const drawY = targetY + (targetH - drawH) * alignY
  ctx.drawImage(img, drawX, drawY, drawW, drawH)
}

const downloadImage = async () => {
  if (!card.value) return

  try {
    downloading.value = true

    const template = await loadImage('/images/carnesocio.png')
    const canvas = document.createElement('canvas')
    canvas.width = template.width
    canvas.height = template.height

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('No se pudo iniciar el lienzo')

    ctx.drawImage(template, 0, 0)

    const width = canvas.width
    const height = canvas.height

    const front = {
      name: { x: width * 0.239, y: height * 0.478, maxW: width * 0.233, size: Math.max(12, width * 0.0122) },
      nif: { x: width * 0.235, y: height * 0.55, maxW: width * 0.124, size: Math.max(11, width * 0.0114) },
      number: { x: width * 0.362, y: height * 0.55, maxW: width * 0.118, size: Math.max(11, width * 0.0114) },
      alta: { x: width * 0.239, y: height * 0.622, maxW: width * 0.128, size: Math.max(11, width * 0.0112) },
      valid: { x: width * 0.366, y: height * 0.622, maxW: width * 0.118, size: Math.max(11, width * 0.0112) },
      photo: { x: width * 0.083, y: height * 0.519, w: width * 0.112, h: height * 0.246 }
    }

    const text = (value, cfg, bold = false) => {
      ctx.fillStyle = '#1f1f1f'
      ctx.font = `${bold ? '600' : '500'} ${cfg.size}px Outfit, Arial, sans-serif`
      ctx.fillText(String(value || ''), cfg.x, cfg.y, cfg.maxW)
    }

    if (card.value.photoUrl) {
      try {
        const photo = await loadImage(card.value.photoUrl)
        ctx.save()
        ctx.beginPath()
        ctx.rect(front.photo.x, front.photo.y, front.photo.w, front.photo.h)
        ctx.clip()
        drawCover(ctx, photo, front.photo.x, front.photo.y, front.photo.w, front.photo.h)
        ctx.restore()
      } catch {
        ctx.fillStyle = 'rgba(114, 50, 51, 0.14)'
        ctx.fillRect(front.photo.x, front.photo.y, front.photo.w, front.photo.h)
      }
    } else {
      ctx.fillStyle = 'rgba(114, 50, 51, 0.14)'
      ctx.fillRect(front.photo.x, front.photo.y, front.photo.w, front.photo.h)
    }

    text((card.value.fullName || '').toUpperCase(), front.name, true)
    text(card.value.dni || '', front.nif)
    text(card.value.numberId || '', front.number)
    text(formatDate(card.value.createdAt), front.alta)
    text(formatDate(card.value.renovationAt), front.valid)

    const dataUrl = canvas.toDataURL('image/png', 1)
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${card.value.numberId || 'carnet'}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    alert('No se pudo generar la imagen del carnet.')
  } finally {
    downloading.value = false
  }
}

const shareCard = async () => {
  const url = window.location.href
  if (navigator.share) {
    await navigator.share({
      title: 'Carnet digital PCE',
      text: 'Carnet digital verificado',
      url
    })
    return
  }

  await navigator.clipboard.writeText(url)
  alert('Enlace copiado. Ya puedes guardarlo en tu movil.')
}

useHead({
  title: 'Carnet digital verificado - PCE',
  meta: [
    {
      name: 'description',
      content: 'Vista verificada del carnet digital PCE mediante QR.'
    }
  ]
})
</script>

<style scoped>
.qr-card-page {
  padding: 36px 20px 70px;
}

.card-shell {
  background: rgba(94, 44, 44, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
}

h1 {
  margin: 0 0 16px;
  color: #fff;
  font-family: 'Cinzel', serif;
  font-size: clamp(1.4rem, 2.8vw, 2rem);
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
  color: #ffd0d0;
}

.content {
  display: grid;
  gap: 16px;
}

.card-view {
  position: relative;
  width: min(100%, 900px);
  aspect-ratio: 1408 / 768;
  margin: 0 auto;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-template {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-field {
  position: absolute;
  color: #1f1f1f;
  font-family: 'Outfit', sans-serif;
  line-height: 1;
}

.card-name {
  left: 23.9%;
  top: 47.8%;
  width: 23.3%;
  font-size: clamp(10px, 1vw, 17px);
  font-weight: 600;
}

.card-nif {
  left: 23.5%;
  top: 55%;
  width: 12.4%;
  font-size: clamp(9px, 0.85vw, 15px);
}

.card-number {
  left: 36.2%;
  top: 55%;
  width: 11.8%;
  font-size: clamp(9px, 0.85vw, 15px);
}

.card-alta {
  left: 23.9%;
  top: 62.2%;
  width: 12.8%;
  font-size: clamp(9px, 0.85vw, 15px);
}

.card-valid {
  left: 36.6%;
  top: 62.2%;
  width: 11.8%;
  font-size: clamp(9px, 0.85vw, 15px);
}

.card-photo {
  position: absolute;
  left: 8.3%;
  top: 51.9%;
  width: 11.2%;
  height: 24.6%;
  object-fit: cover;
  object-position: center 28%;
}

.card-avatar {
  position: absolute;
  left: 8.3%;
  top: 51.9%;
  width: 11.2%;
  height: 24.6%;
  display: grid;
  place-items: center;
  color: #723233;
  font-size: clamp(14px, 1.8vw, 36px);
  font-weight: 700;
  background: rgba(114, 50, 51, 0.14);
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

.help {
  margin: 2px 0 0;
  color: #dcc9ca;
  font-size: 0.86rem;
}
</style>
