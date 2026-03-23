<template>
  <div class="bullpatriot-scene" @mousemove="onSceneMove" @mouseleave="onSceneLeave">
    <div class="photo-backdrop" :style="photoStyle" aria-hidden="true"></div>
    <div ref="webglHost" class="hay-canvas-host" aria-hidden="true"></div>
    <div class="scene-vignette" aria-hidden="true"></div>

    <section class="chat-stage">
      <p class="brand-chip">BULLPATRIOT DE PCE</p>
      <h1>BULLPATRIOT</h1>
      <p class="subtitle">Campo hiperrealista con paja reactiva al raton y ambiente de dehesa.</p>

      <article class="chat-shell">
        <div class="chat-box" ref="chatBoxRef">
          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            :class="['msg', msg.role === 'user' ? 'msg-user' : 'msg-assistant']"
          >
            <strong>{{ msg.role === 'user' ? 'Tu' : 'BULLPATRIOT' }}:</strong>
            <p>{{ msg.content }}</p>
          </div>

          <div v-if="chatLoading" class="msg msg-assistant">
            <strong>BULLPATRIOT:</strong>
            <p>Pensando...</p>
          </div>
        </div>

        <form class="chat-form" @submit.prevent="sendMessage">
          <textarea
            v-model="chatInput"
            placeholder="Pregunta lo que quieras: actualidad, propuestas o generar idea de noticia..."
            rows="3"
          />
          <button class="btn" :disabled="chatLoading || !chatInput.trim()" type="submit">
            {{ chatLoading ? 'Enviando...' : 'Enviar al toro' }}
          </button>
        </form>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

useHead({
  title: 'BULLPATRIOT - Chat IA Local',
  meta: [
    { name: 'description', content: 'BULLPATRIOT: chat local con Ollama en un entorno visual inmersivo para PCE.' }
  ],
  bodyAttrs: {
    class: 'bullpatriot-body'
  }
})

const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: 'Hola, soy BULLPATRIOT. Puedo ayudarte con preguntas y tambien redactar noticias.'
  }
])

const chatInput = ref('')
const chatLoading = ref(false)
const chatBoxRef = ref<HTMLElement | null>(null)
const webglHost = ref<HTMLElement | null>(null)

const pointerX = ref(0)
const pointerY = ref(0)
const mouseInside = ref(false)

const photoStyle = computed(() => ({
  transform: `translate(${pointerX.value * 12}px, ${pointerY.value * -8}px) scale(1.08)`
}))

let cleanup3D: null | (() => void) = null

const onSceneMove = (event: MouseEvent) => {
  const viewportW = Math.max(window.innerWidth, 1)
  const viewportH = Math.max(window.innerHeight, 1)
  pointerX.value = (event.clientX / viewportW) * 2 - 1
  pointerY.value = -((event.clientY / viewportH) * 2 - 1)
  mouseInside.value = true
}

const onSceneLeave = () => {
  mouseInside.value = false
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatBoxRef.value) {
    chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
  }
}

const sendMessage = async () => {
  const message = chatInput.value.trim()
  if (!message || chatLoading.value) {
    return
  }

  messages.value.push({ role: 'user', content: message })
  chatInput.value = ''
  chatLoading.value = true
  await scrollToBottom()

  try {
    const history = messages.value.slice(-12)

    const response = await $fetch<{ response: string }>('/api/ai/chat', {
      method: 'POST',
      body: {
        message,
        history
      }
    })

    messages.value.push({ role: 'assistant', content: response.response })
  } catch (error: any) {
    const msg = error?.data?.statusMessage || error?.message || 'No se pudo conectar con el chat local.'
    messages.value.push({ role: 'assistant', content: `Error: ${msg}` })
  } finally {
    chatLoading.value = false
    await scrollToBottom()
  }
}

const initCanvasScene = () => {
  if (!webglHost.value) {
    return
  }

  const host = webglHost.value
  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  host.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return
  }

  const straw = Array.from({ length: 650 }).map(() => ({
    x: Math.random(),
    depth: Math.random(),
    h: 0.2 + Math.random() * 0.8,
    phase: Math.random() * Math.PI * 2,
    width: 0.8 + Math.random() * 2.2,
    hue: 32 + Math.random() * 16
  }))

  let raf = 0
  let lastT = performance.now()

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.max(1, host.clientWidth)
    const h = Math.max(1, host.clientHeight)
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  window.addEventListener('resize', resize)
  resize()

  const drawFrame = (now: number) => {
    const dt = Math.min(0.033, (now - lastT) / 1000)
    lastT = now

    const w = host.clientWidth
    const h = host.clientHeight
    const wind = mouseInside.value ? pointerX.value * 1.35 : 0

    ctx.clearRect(0, 0, w, h)

    const hayY = h * 0.72
    for (const blade of straw) {
      const x = blade.x * w
      const depthScale = 0.45 + blade.depth * 1.2
      const baseY = hayY + blade.depth * h * 0.26
      const length = (18 + blade.h * 110) * depthScale
      const sway = Math.sin(now * 0.0045 + blade.phase) * (4 + blade.depth * 10) + wind * (11 + blade.depth * 10)

      ctx.strokeStyle = `hsla(${blade.hue}, 78%, ${42 + blade.depth * 24}%, ${0.14 + blade.depth * 0.56})`
      ctx.lineWidth = blade.width * depthScale
      ctx.beginPath()
      ctx.moveTo(x, baseY)
      ctx.quadraticCurveTo(x + sway * 0.4, baseY - length * 0.5, x + sway, baseY - length)
      ctx.stroke()
    }

    const hayPileX = w * 0.63 + pointerX.value * 18
    const hayPileY = h * 0.76 + pointerY.value * 6
    ctx.fillStyle = 'rgba(0,0,0,0.2)'
    ctx.beginPath()
    ctx.ellipse(hayPileX, hayPileY + 24, 120, 34, 0, 0, Math.PI * 2)
    ctx.fill()

    const hayGrad = ctx.createLinearGradient(hayPileX - 90, hayPileY - 60, hayPileX + 90, hayPileY + 20)
    hayGrad.addColorStop(0, 'rgba(235, 195, 114, 0.72)')
    hayGrad.addColorStop(1, 'rgba(164, 123, 61, 0.64)')
    ctx.fillStyle = hayGrad
    ctx.beginPath()
    ctx.ellipse(hayPileX, hayPileY, 100, 30, 0, 0, Math.PI * 2)
    ctx.fill()

    for (let i = 0; i < 80; i += 1) {
      const t = (i / 80) * Math.PI * 2
      const radius = 30 + Math.sin(t * 3 + now * 0.002) * 9
      const px = hayPileX + Math.cos(t) * radius
      const py = hayPileY + Math.sin(t) * 12
      ctx.strokeStyle = `rgba(214, 168, 84, ${0.35 + (i % 7) * 0.04})`
      ctx.lineWidth = 1 + (i % 3) * 0.6
      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(px + Math.sin(t + now * 0.003) * 10, py - 16 - (i % 5))
      ctx.stroke()
    }

    const vignette = ctx.createLinearGradient(0, h * 0.58, 0, h)
    vignette.addColorStop(0, 'rgba(47, 35, 14, 0)')
    vignette.addColorStop(1, 'rgba(47, 35, 14, 0.45)')
    ctx.fillStyle = vignette
    ctx.fillRect(0, h * 0.58, w, h * 0.42)

    const dustOpacity = mouseInside.value ? Math.min(0.12, Math.abs(pointerX.value) * 0.15 + dt) : 0.03
    ctx.fillStyle = `rgba(232, 204, 152, ${dustOpacity})`
    for (let i = 0; i < 25; i += 1) {
      const px = (i / 24) * w + Math.sin(now * 0.0008 + i) * 18
      const py = h * (0.62 + (i % 5) * 0.06) + Math.cos(now * 0.0012 + i) * 6
      ctx.beginPath()
      ctx.arc(px, py, 1.5 + (i % 4), 0, Math.PI * 2)
      ctx.fill()
    }

    raf = window.requestAnimationFrame(drawFrame)
  }

  raf = window.requestAnimationFrame(drawFrame)

  cleanup3D = () => {
    window.cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
    if (canvas.parentElement === host) {
      host.removeChild(canvas)
    }
  }
}

onMounted(() => {
  initCanvasScene()
})

onBeforeUnmount(() => {
  if (cleanup3D) {
    cleanup3D()
  }
})
</script>

<style scoped>
.bullpatriot-scene {
  position: relative;
  min-height: calc(100vh - 82px);
  padding: 44px 20px 96px;
  overflow: hidden;
  background: #5f4b2b;
}

.photo-backdrop {
  position: absolute;
  inset: -8%;
  z-index: 0;
  background-image:
    linear-gradient(180deg, rgba(8, 18, 24, 0.04), rgba(42, 28, 10, 0.2)),
    url('/images/bullpatriot-farm.jpg');
  background-size: cover;
  background-position: center center;
  transition: transform 0.25s ease-out;
}

.hay-canvas-host {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hay-canvas-host :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

.scene-vignette {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(circle at 80% 22%, rgba(255, 230, 156, 0.26) 0%, transparent 17%),
    linear-gradient(180deg, rgba(8, 10, 12, 0.08) 0%, rgba(8, 10, 12, 0.02) 40%, rgba(9, 7, 4, 0.2) 100%);
}

.chat-stage {
  position: relative;
  z-index: 2;
  width: min(760px, 95vw);
  margin: 0 auto;
  text-align: center;
  transform: translateY(12px);
}

.brand-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  margin: 0 0 14px;
  border-radius: 999px;
  font-family: 'Cinzel', serif;
  color: #fff6d0;
  background: rgba(36, 20, 8, 0.6);
  border: 1px solid rgba(255, 240, 190, 0.5);
  letter-spacing: 1px;
}

.chat-stage h1 {
  margin: 0;
  font-family: 'Cinzel', serif;
  font-size: clamp(2.3rem, 5vw, 3.8rem);
  color: #fff5de;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
}

.subtitle {
  margin: 10px 0 22px;
  color: #fef1d9;
  font-family: 'Outfit', sans-serif;
  font-size: 1.06rem;
}

.chat-shell {
  background: rgba(31, 18, 8, 0.68);
  border: 1px solid rgba(255, 238, 182, 0.26);
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 30px 40px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
}

.chat-box {
  background: rgba(248, 237, 203, 0.9);
  border: 1px solid rgba(72, 38, 16, 0.2);
  border-radius: 12px;
  height: 420px;
  overflow-y: auto;
  padding: 12px;
  margin-bottom: 14px;
  text-align: left;
}

.msg {
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 10px;
}

.msg p {
  margin: 6px 0 0;
  white-space: pre-wrap;
}

.msg-user {
  background: rgba(175, 226, 204, 0.85);
}

.msg-assistant {
  background: rgba(247, 226, 175, 0.86);
}

.chat-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

textarea,
input {
  border: 1px solid rgba(76, 40, 18, 0.32);
  border-radius: 10px;
  padding: 12px;
  font-family: 'Outfit', sans-serif;
  resize: vertical;
  background: rgba(255, 249, 236, 0.92);
}

.btn {
  background: linear-gradient(90deg, #4e2a14 0%, #6f411d 100%);
  color: #ffeecd;
  border: none;
  border-radius: 10px;
  padding: 13px 16px;
  font-family: 'Cinzel', serif;
  cursor: pointer;
  letter-spacing: 0.5px;
}

.btn:disabled {
  opacity: 0.66;
  cursor: not-allowed;
}

@media (max-width: 780px) {
  .bullpatriot-scene {
    padding: 24px 14px 60px;
    min-height: calc(100vh - 78px);
  }

  .chat-shell {
    padding: 12px;
  }

  .chat-box {
    height: 340px;
  }
}

:global(.bullpatriot-body .web-container) {
  background:
    radial-gradient(circle at 10% 8%, rgba(255, 224, 172, 0.2), transparent 40%),
    linear-gradient(180deg, #7ea0bf 0%, #c8a15d 56%, #8d6e36 100%);
}

:global(.bullpatriot-body .main-footer) {
  background:
    linear-gradient(180deg, rgba(111, 84, 40, 0.25) 0%, rgba(62, 39, 17, 0.55) 100%);
}
</style>
