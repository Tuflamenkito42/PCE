<template>
  <div class="bullpatriot-scene">
    <div class="photo-backdrop" aria-hidden="true"></div>
    <div class="scene-vignette" aria-hidden="true"></div>

    <section class="chat-stage">
      <img class="hero-logo" src="/images/bullpatriot.png" alt="Logo de Bullpatriot" />
      <h1 class="hero-title">BULLPATRIOT</h1>
      <p class="subtitle">Asistente del partido para consultas sobre actividad, programa y propuestas.</p>

      <article class="chat-shell">
        <div class="chat-toolbar">
          <div ref="historyDropdownRef" class="history-dropdown" :class="{ 'is-open': historyOpen }">
            <button
              type="button"
              class="history-toggle"
              @click="historyOpen = !historyOpen"
              :aria-expanded="historyOpen"
              aria-label="Abrir historial de chat"
            >
              <span class="history-toggle-title">{{ activeSessionTitle }}</span>
              <span class="history-toggle-chevron">▾</span>
            </button>

            <div v-if="historyOpen" class="history-menu" role="listbox" aria-label="Historial de chats">
              <button
                v-for="session in chatSessions"
                :key="session.id"
                type="button"
                class="history-menu-item"
                :class="{ 'is-active': session.id === activeSessionId }"
                @click="selectSession(session.id)"
              >
                <span class="history-menu-main">
                  <span class="history-menu-title">{{ session.title }}</span>
                  <span class="history-menu-time">{{ formatSessionDate(session.updatedAt) }}</span>
                </span>
                <span class="history-menu-remove" @click.stop="deleteSession(session.id)">×</span>
              </button>
            </div>
          </div>

          <div class="chat-toolbar-actions">
            <button type="button" class="toolbar-btn" title="Nuevo chat" @click="startNewSession">+</button>
            <button type="button" class="toolbar-btn" title="Limpiar chat" @click="clearCurrentSession">⌫</button>
            <button
              type="button"
              class="toolbar-btn toolbar-btn-danger"
              :disabled="chatSessions.length <= 1"
              title="Borrar chat"
              @click="deleteCurrentSession"
            >
              ×
            </button>
          </div>
        </div>

        <header class="chat-shell-head">
          <div class="chat-shell-status">
            <span class="status-dot" aria-hidden="true"></span>
            <span>{{ chatReady ? 'BULLPATRIOT online' : 'Inicia o elige una conversacion' }}</span>
          </div>
          <span class="chat-shell-count">{{ messages.length }} mensajes</span>
        </header>

        <div class="chat-box" ref="chatBoxRef">
          <div v-if="!chatReady" class="chat-start-state">
            <p>Para empezar, crea un chat nuevo o abre uno del historial.</p>
            <button type="button" class="chat-start-btn" @click="startNewSession">Nueva conversacion</button>
          </div>

          <template v-else>
          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            :class="['msg-row', msg.role === 'user' ? 'msg-row-user' : 'msg-row-assistant']"
          >
            <article :class="['msg-bubble', msg.role === 'user' ? 'msg-user' : 'msg-assistant']">
              <header class="msg-head">
                <strong class="msg-author">{{ msg.role === 'user' ? 'Tu' : 'BULLPATRIOT' }}</strong>
                <span class="msg-meta">{{ formatMessageMeta(msg) }}</span>
              </header>
              <p v-if="msg.role === 'user'">{{ msg.content }}</p>
              <p v-else v-html="formatAssistantContent(msg.content)"></p>
            </article>
          </div>

          <div v-if="chatLoading" class="msg-row msg-row-assistant">
            <article class="msg-bubble msg-assistant msg-loading">
              <header class="msg-head">
                <strong class="msg-author">BULLPATRIOT</strong>
                <span class="msg-meta">escribiendo...</span>
              </header>
              <p class="typing-dots" aria-label="BULLPATRIOT está escribiendo">
                <span></span><span></span><span></span>
              </p>
            </article>
          </div>
          </template>
        </div>

        <form class="chat-form" @submit.prevent="sendMessage">
          <textarea
            v-model="chatInput"
            placeholder="Pregunta lo que quieras: actualidad, propuestas o informacion del partido..."
            rows="3"
            @keydown="onComposerKeydown"
            :disabled="!chatReady"
          />
          <button class="btn" :disabled="!chatReady || chatLoading || !chatInput.trim()" type="submit">
            {{ chatLoading ? 'Enviando...' : 'Enviar' }}
          </button>
        </form>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from '#app'

type Message = {
  role: 'user' | 'assistant'
  content: string
  createdAt: number
  responseSeconds?: number
}

type ConversationSession = {
  id: string
  title: string
  updatedAt: number
  messages: Message[]
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

const { user } = useAuth()
const router = useRouter()

const createWelcomeMessage = (): Message => ({
  role: 'assistant',
  content: 'Hola, soy BULLPATRIOT. Puedo ayudarte con preguntas sobre el partido y su actividad.',
  createdAt: Date.now()
})

const createSession = (): ConversationSession => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title: 'Nuevo chat',
  updatedAt: Date.now(),
  messages: [createWelcomeMessage()]
})

// ✅ SECURITY: Requiere autenticación para acceder a BULLPATRIOT
onMounted(async () => {
  if (!user.value) {
    console.warn('⛔ Acceso denegado a bullpatriot: Usuario no autenticado')
    await router.push({
      path: '/login',
      query: { redirect: '/bullpatriot' }
    })
    return
  }

  loadSessions()
})

const messages = ref<Message[]>([])

const chatSessions = ref<ConversationSession[]>([])
const activeSessionId = ref('')
const historyOpen = ref(false)
const chatReady = ref(false)
const historyDropdownRef = ref<HTMLElement | null>(null)

const chatInput = ref('')
const chatLoading = ref(false)
const chatBoxRef = ref<HTMLElement | null>(null)

const activeSessionTitle = computed(() => {
  const active = chatSessions.value.find((session) => session.id === activeSessionId.value)
  return active?.title || 'Elige o crea un chat'
})

const scrollToBottom = async () => {
  await nextTick()
  if (chatBoxRef.value) {
    chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
  }
}

const getStorageKey = () => {
  const userId = user.value?.id ? String(user.value.id) : user.value?.email || 'guest'
  return `bullpatriot-chat-history-${userId}`
}

const persistSessions = () => {
  if (!process.client) {
    return
  }

  localStorage.setItem(getStorageKey(), JSON.stringify(chatSessions.value))
}

const syncActiveSession = async () => {
  const active = chatSessions.value.find((session) => session.id === activeSessionId.value)
  chatReady.value = Boolean(active)
  messages.value = active ? active.messages : []
  await scrollToBottom()
}

const setActiveSessionMessages = (nextMessages: Message[]) => {
  messages.value = nextMessages

  const active = chatSessions.value.find((session) => session.id === activeSessionId.value)
  if (!active) {
    return
  }

  active.messages = nextMessages
  active.updatedAt = Date.now()

  const firstUserMessage = nextMessages.find((msg) => msg.role === 'user')?.content?.trim()
  if (firstUserMessage) {
    active.title = firstUserMessage.slice(0, 42)
  }

  chatSessions.value = [...chatSessions.value].sort((a, b) => b.updatedAt - a.updatedAt)
  persistSessions()
}

const loadSessions = () => {
  if (!process.client) {
    return
  }

  try {
    const raw = localStorage.getItem(getStorageKey())
    if (raw) {
      const parsed = JSON.parse(raw) as ConversationSession[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        chatSessions.value = parsed
          .filter((session) => Array.isArray(session.messages) && session.messages.length > 0)
          .sort((a, b) => b.updatedAt - a.updatedAt)
      }
    }
  } catch (error) {
    console.error('No se pudo cargar historial del chat:', error)
  }

  if (chatSessions.value.length === 0) {
    chatSessions.value = [createSession()]
    persistSessions()
  }

  activeSessionId.value = ''
  chatReady.value = false
  messages.value = []
}

const onSessionChange = () => {
  syncActiveSession()
}

const selectSession = (sessionId: string) => {
  activeSessionId.value = sessionId
  chatReady.value = true
  historyOpen.value = false
  onSessionChange()
}

const startNewSession = () => {
  const newSession = createSession()
  chatSessions.value = [newSession, ...chatSessions.value]
  activeSessionId.value = newSession.id
  chatReady.value = true
  historyOpen.value = false
  messages.value = newSession.messages
  persistSessions()
  scrollToBottom()
}

const clearCurrentSession = () => {
  setActiveSessionMessages([createWelcomeMessage()])
}

const deleteCurrentSession = () => {
  deleteSession(activeSessionId.value)
}

const deleteSession = (sessionId: string) => {
  if (chatSessions.value.length <= 1) {
    clearCurrentSession()
    return
  }

  const session = chatSessions.value.find((item) => item.id === sessionId)
  const sessionName = session?.title || 'este chat'

  if (process.client) {
    const shouldDelete = window.confirm(`¿Seguro que quieres eliminar "${sessionName}"?`)
    if (!shouldDelete) {
      return
    }
  }

  chatSessions.value = chatSessions.value.filter((item) => item.id !== sessionId)

  if (activeSessionId.value === sessionId) {
    activeSessionId.value = chatSessions.value[0]?.id || ''
  }

  historyOpen.value = false
  syncActiveSession()
  persistSessions()
}

const formatSessionDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const formatMessageMeta = (msg: Message) => {
  const clock = new Date(msg.createdAt).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })

  if (msg.role === 'assistant' && typeof msg.responseSeconds === 'number') {
    return `${clock} · ${msg.responseSeconds.toFixed(1)}s`
  }

  return clock
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/\"/g, '&quot;')
  .replace(/'/g, '&#39;')

const pageMentions: Array<{ pattern: RegExp; href: string }> = [
  { pattern: /\bInicio\b/gi, href: '/' },
  { pattern: /\bActualidad\b|\bNoticias\b/gi, href: '/noticias' },
  { pattern: /\bUnete\b|\bÚnete\b|\bAfiliacion\b|\bAfiliación\b/gi, href: '/afiliacion' },
  { pattern: /\bPrograma\b/gi, href: '/programa' },
  { pattern: /\bVotaciones\b/gi, href: '/votaciones' },
  { pattern: /\bContacto\b/gi, href: '/contacto' },
  { pattern: /\bTransparencia\b/gi, href: '/transparencia' },
  { pattern: /\bDona\b|\bDonaciones\b|\bDonacion\b|\bDonación\b/gi, href: '/dona' },
  { pattern: /\bPresentacion\b|\bPresentación\b/gi, href: '/presentacion' },
  { pattern: /\bBULLPATRIOT\b/gi, href: '/bullpatriot' }
]

const linkifyPageMentions = (value: string) => {
  return pageMentions.reduce((acc, item) => {
    return acc.replace(item.pattern, (label) => `<a href="${item.href}" class="chat-page-link">${label}</a>`)
  }, value)
}

const formatAssistantContent = (value: string) => {
  const escaped = escapeHtml(value)
  const withPageLinks = linkifyPageMentions(escaped)
  const withLinks = withPageLinks.replace(/(https?:\/\/[\w\-._~:/?#\[\]@!$&'()*+,;=%]+)/g, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  })
  return withLinks.replace(/\n/g, '<br>')
}

const onComposerKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const onDocumentClick = (event: MouseEvent) => {
  if (!historyOpen.value || !historyDropdownRef.value) {
    return
  }

  const target = event.target as Node | null
  if (target && !historyDropdownRef.value.contains(target)) {
    historyOpen.value = false
  }
}

const onDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && historyOpen.value) {
    historyOpen.value = false
  }
}

const sendMessage = async () => {
  if (!chatReady.value || !activeSessionId.value) {
    return
  }

  const message = chatInput.value.trim()
  if (!message || chatLoading.value) {
    return
  }

  const userMessage: Message = { role: 'user', content: message, createdAt: Date.now() }
  setActiveSessionMessages([...messages.value, userMessage])
  chatInput.value = ''
  chatLoading.value = true
  await scrollToBottom()

  try {
    const startedAt = performance.now()
    const history = messages.value.slice(-12).map(({ role, content }) => ({ role, content }))

    const response = await $fetch<{ response: string }>('/api/ai/chat', {
      method: 'POST',
      body: {
        message,
        history
      }
    })

    const responseSeconds = (performance.now() - startedAt) / 1000
    const assistantMessage: Message = {
      role: 'assistant',
      content: response.response,
      createdAt: Date.now(),
      responseSeconds
    }
    setActiveSessionMessages([...messages.value, assistantMessage])
  } catch (error: any) {
    const msg = error?.data?.statusMessage || error?.message || 'No se pudo conectar con el chat local.'
    const assistantErrorMessage: Message = {
      role: 'assistant',
      content: `Error: ${msg}`,
      createdAt: Date.now()
    }
    setActiveSessionMessages([...messages.value, assistantErrorMessage])
  } finally {
    chatLoading.value = false
    await scrollToBottom()
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
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

.chat-stage h1 {
  margin: 0;
  font-family: 'Cinzel', serif;
  font-size: clamp(2.3rem, 5vw, 3.8rem);
  color: #fff5de;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
}

.hero-logo {
  display: block;
  width: min(260px, 80%);
  margin: 2px auto 10px;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.35));
}

.hero-title {
  letter-spacing: 1.6px;
}

.subtitle {
  margin: 12px 0 22px;
  color: #fef1d9;
  font-family: 'Outfit', sans-serif;
  font-size: 1.02rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
}

.chat-shell {
  background:
    linear-gradient(160deg, rgba(31, 20, 8, 0.84) 0%, rgba(15, 10, 6, 0.78) 100%);
  border: 1px solid rgba(233, 195, 120, 0.34);
  border-radius: 20px;
  padding: 14px;
  box-shadow:
    0 24px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.chat-toolbar {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  margin-bottom: 8px;
}

.history-dropdown {
  position: relative;
}

.history-toggle {
  width: 100%;
  border: 1px solid rgba(233, 195, 120, 0.4);
  border-radius: 999px;
  background: rgba(255, 248, 226, 0.2);
  color: #f7e7c3;
  padding: 8px 12px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.92rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
}

.history-toggle-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.history-toggle-chevron {
  opacity: 0.85;
  transition: transform 0.2s ease;
}

.history-dropdown.is-open .history-toggle-chevron {
  transform: rotate(180deg);
}

.history-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 20;
  border-radius: 14px;
  border: 1px solid rgba(233, 195, 120, 0.45);
  background: linear-gradient(165deg, rgba(44, 28, 16, 0.96), rgba(30, 20, 12, 0.96));
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.38);
  max-height: 260px;
  overflow-y: auto;
  padding: 5px;
}

.history-menu-item {
  width: 100%;
  border: 0;
  background: transparent;
  color: #f8e8c8;
  border-radius: 10px;
  padding: 8px 9px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
}

.history-menu-item:hover {
  background: rgba(255, 221, 150, 0.12);
}

.history-menu-item.is-active {
  background: rgba(255, 221, 150, 0.2);
}

.history-menu-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.history-menu-title {
  font-size: 0.87rem;
  font-weight: 600;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-menu-time {
  font-size: 0.7rem;
  opacity: 0.78;
}

.history-menu-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 0.86rem;
  background: rgba(255, 120, 120, 0.2);
  color: #ffd7d7;
  flex-shrink: 0;
}

.chat-toolbar-actions {
  display: inline-flex;
  gap: 6px;
}

.toolbar-btn {
  border: 1px solid rgba(233, 195, 120, 0.35);
  background: rgba(255, 248, 226, 0.12);
  color: #f7e7c3;
  border-radius: 999px;
  min-width: 30px;
  height: 30px;
  padding: 0;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-btn-danger {
  border-color: rgba(233, 124, 120, 0.45);
  color: #ffd2d0;
}

.chat-shell-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(255, 241, 206, 0.12);
  border: 1px solid rgba(255, 238, 182, 0.25);
}

.chat-shell-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #f7e7c3;
  font-size: 0.9rem;
  font-weight: 600;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #69f0ae;
  box-shadow: 0 0 0 0 rgba(105, 240, 174, 0.8);
  animation: pulseDot 1.8s infinite;
}

.chat-shell-count {
  font-size: 0.78rem;
  color: rgba(255, 241, 206, 0.86);
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 238, 182, 0.24);
}

.chat-box {
  background: rgba(255, 251, 241, 0.82);
  border: 1px solid rgba(255, 227, 157, 0.52);
  border-radius: 14px;
  height: 420px;
  overflow-y: auto;
  padding: 14px;
  margin-bottom: 14px;
  text-align: left;
  box-shadow: inset 0 10px 26px rgba(0, 0, 0, 0.08);
}

.chat-start-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: #4f3414;
  text-align: center;
  padding: 18px;
}

.chat-start-state p {
  margin: 0;
  font-weight: 600;
}

.chat-start-btn {
  border: 1px solid rgba(90, 48, 24, 0.38);
  background: linear-gradient(95deg, #6b3a1d 0%, #955325 100%);
  color: #fff0cf;
  border-radius: 999px;
  padding: 10px 18px;
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  cursor: pointer;
}

.chat-box::-webkit-scrollbar {
  width: 10px;
}

.chat-box::-webkit-scrollbar-track {
  background: rgba(67, 40, 20, 0.12);
  border-radius: 999px;
}

.chat-box::-webkit-scrollbar-thumb {
  background: rgba(94, 60, 23, 0.42);
  border-radius: 999px;
}

.msg-row {
  display: flex;
  margin-bottom: 12px;
}

.msg-row-user {
  justify-content: flex-end;
}

.msg-row-assistant {
  justify-content: flex-start;
}

.msg-bubble {
  width: fit-content;
  max-width: min(86%, 640px);
  padding: 12px 14px 11px;
  border-radius: 14px;
  border: 1px solid transparent;
  box-shadow: 0 10px 16px rgba(33, 20, 8, 0.12);
}

.msg-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.msg-author {
  font-weight: 700;
  letter-spacing: 0.2px;
}

.msg-meta {
  font-size: 0.75rem;
  opacity: 0.82;
  background: rgba(0, 0, 0, 0.08);
  padding: 2px 7px;
  border-radius: 999px;
}

.msg-bubble p {
  margin: 6px 0 0;
  white-space: pre-wrap;
}

.msg-bubble :deep(.chat-page-link) {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 700;
}

.msg-user {
  background: linear-gradient(145deg, rgba(147, 217, 188, 0.95), rgba(117, 196, 163, 0.92));
  border-color: rgba(46, 132, 99, 0.45);
  border-top-right-radius: 6px;
  color: #17382c;
}

.msg-assistant {
  background: linear-gradient(145deg, rgba(248, 228, 180, 0.95), rgba(241, 213, 152, 0.95));
  border-color: rgba(139, 99, 33, 0.32);
  border-top-left-radius: 6px;
  color: #4f3414;
}

.msg-loading {
  animation: msgPulse 1.2s ease-in-out infinite;
}

.typing-dots {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 12px;
}

.typing-dots span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(79, 52, 20, 0.7);
  animation: bounceDot 1s infinite ease-in-out;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes msgPulse {
  0%,
  100% {
    opacity: 0.78;
  }
  50% {
    opacity: 1;
  }
}

.chat-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

textarea,
input {
  border: 1px solid rgba(76, 40, 18, 0.32);
  border-radius: 12px;
  padding: 14px;
  font-family: 'Outfit', sans-serif;
  resize: vertical;
  background: rgba(255, 252, 245, 0.96);
  color: #3a2512;
}

.btn {
  background: linear-gradient(95deg, #5a3018 0%, #8a4c20 100%);
  color: #fff0cf;
  border: none;
  border-radius: 12px;
  padding: 14px 16px;
  font-family: 'Cinzel', serif;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(46, 24, 12, 0.35);
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

  .chat-toolbar {
    grid-template-columns: 1fr;
  }

  .chat-toolbar-actions {
    width: auto;
    justify-content: flex-end;
  }

  .chat-shell-head {
    padding: 8px;
  }

  .chat-shell-count {
    display: none;
  }

  .hero-title {
    font-size: clamp(2.1rem, 11vw, 3rem);
  }

  .chat-box {
    height: 340px;
  }
}

@keyframes pulseDot {
  0% {
    box-shadow: 0 0 0 0 rgba(105, 240, 174, 0.8);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(105, 240, 174, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(105, 240, 174, 0);
  }
}

@keyframes bounceDot {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  40% {
    transform: translateY(-4px);
    opacity: 1;
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
