import { createError, defineEventHandler, getHeader, readBody } from 'h3'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { searchWebsiteKnowledge } from '../../utils/site-knowledge'

type ChatTurn = {
  role: 'user' | 'assistant'
  content: string
}

type Hit = { source: string; snippet: string; score?: number }

type Intent =
  | 'contact'
  | 'program'
  | 'transparency'
  | 'affiliation'
  | 'voting'
  | 'donation'
  | 'news'
  | 'newsletter'
  | 'presentation'
  | 'general'

type ContactInfo = {
  office: string | null
  email: string | null
  phone: string | null
}

let contactInfoCache: ContactInfo | null = null

const chatAttempts = new Map<string, { count: number; resetAt: number }>()

const checkRateLimit = (ip: string) => {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const limit = 40

  const entry = chatAttempts.get(ip)
  if (!entry || now > entry.resetAt) {
    chatAttempts.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) {
    return false
  }

  entry.count += 1
  return true
}

const userTechnicalPattern = /(tecnic|arquitect|ia|modelo|ollama|integraci|api|codigo|docker|infraestructura|prompt|regex|json)/i
const noisySnippetPattern = /(regex|json|interceptar la respuesta|extraer quirurgicamente|script setup|\bconst\b|\bimport\b|\bfetch\b|\bpayload\b)/i
const nonTechnicalSourceExcludes = [
  /(memoria_tecnica|implementation|integrat|setup|readme|guia_colaboracion|quick_start|docker|stripe_cli|ollama_setup)/i,
  /affiliation_complete/i
]

const canonicalSourcesByIntent: Record<Exclude<Intent, 'general'>, RegExp[]> = {
  contact: [/pages\/contacto\.vue/i],
  program: [/pages\/programa\/index\.vue/i],
  transparency: [/pages\/transparencia\.vue/i],
  affiliation: [/pages\/afiliacion\/index\.vue/i],
  voting: [/pages\/votaciones\/index\.vue/i, /pages\/votaciones\/components\//i],
  donation: [/pages\/dona\.vue/i],
  news: [/pages\/noticias\//i],
  newsletter: [/components\/Newsletter\.vue/i, /server\/api\/newsletter\//i],
  presentation: [/pages\/presentacion\.vue/i]
}

const canonicalNoDataMessage: Record<Exclude<Intent, 'general'>, string> = {
  contact: 'No veo ahora mismo telefono, email u oficina central con suficiente claridad. Si quieres, te guio a la seccion Contacto para revisarlo juntos.',
  program: 'No me aparece suficiente detalle para responder fino. Si vas a Programa y me dices la medida concreta, te lo explico al momento.',
  transparency: 'No me aparece suficiente detalle en esta consulta. Si quieres, revisamos Transparencia por bloques: presupuestos, cuentas, auditorias o contratos.',
  affiliation: 'No me aparece suficiente detalle para concretarlo bien. Si vas a Afiliacion, te explico paso a paso requisitos, cuota y proceso.',
  voting: 'No me aparece suficiente detalle para cerrarlo del todo. Si vas a Votaciones, te indico consultas activas y como participar.',
  donation: 'No me aparece suficiente detalle para concretarlo bien. Si vas a Donaciones, te explico importes y proceso de pago.',
  news: 'No me aparece suficiente detalle para responder con precision. Si me dices el tema o noticia concreta, te lo resumo rapido desde Actualidad.',
  newsletter: 'No me aparece suficiente detalle del newsletter ahora mismo. Si quieres, te guio para suscribirte desde la seccion principal.',
  presentation: 'No me aparece suficiente detalle para responder fino. Si vas a Presentacion, te resumo mision y tecnologia en dos lineas.'
}

const intentHeading: Record<Exclude<Intent, 'general'>, string> = {
  contact: 'Si vas al apartado Contacto, veras esto:',
  program: 'Si vas al apartado Programa, veras esto:',
  transparency: 'Si vas al Portal de Transparencia, veras esto:',
  affiliation: 'Si vas al apartado Afiliacion, veras esto:',
  voting: 'Si vas al apartado Votaciones y Participacion, veras esto:',
  donation: 'Si vas al apartado Donaciones, veras esto:',
  news: 'Si vas al apartado Noticias y Actualidad, veras esto:',
  newsletter: 'Sobre el newsletter, en la web aparece esto:',
  presentation: 'Si vas al apartado Presentacion, veras esto:'
}

const clip = (value: string, max = 220) => {
  const compact = value.replace(/\s+/g, ' ').trim()
  if (compact.length <= max) {
    return compact
  }
  return `${compact.slice(0, max).trim()}...`
}

const cleanSnippet = (value: string) => value
  .replace(/{{[^}]+}}/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const isTechnicalUserQuery = (normalized: string) => userTechnicalPattern.test(normalized)

const sanitizeHitsForResponse = (hits: Hit[], normalized: string) => {
  const technical = isTechnicalUserQuery(normalized)

  return hits
    .map((hit) => ({ ...hit, snippet: cleanSnippet(hit.snippet) }))
    .filter((hit) => hit.snippet.length >= 45)
    .filter((hit) => technical || !noisySnippetPattern.test(hit.snippet))
}

const buildFastGroundedResponse = (
  hits: Array<{ source: string; snippet: string }>,
  normalized: string
) => {
  const top = sanitizeHitsForResponse(hits, normalized).slice(0, 2)
  const parts = top.map((hit) => clip(hit.snippet, 210))

  if (parts.length === 0) {
    return 'No tengo suficiente informacion clara para responderte bien ahora mismo. Si quieres, afinamos la pregunta y lo miramos juntos.'
  }

  if (parts.length === 1) {
    return `Por lo que aparece en la web, ${parts[0]}`
  }

  return `Por lo que aparece en la web, ${parts[0]} Ademas, ${parts[1]}`
}

const buildTopicGroundedResponse = (intent: Exclude<Intent, 'general'>, hits: Hit[], normalized: string) => {
  const top = sanitizeHitsForResponse(hits, normalized).slice(0, 3)
  if (top.length === 0) {
    return null
  }

  const lines = [intentHeading[intent], ...top.map((hit) => `- ${clip(hit.snippet, 190)}`)]
  return lines.join('\n')
}

const detectIntent = (normalized: string): Intent => {
  if (/(telefono|email|correo|mail|oficina|sede|direccion|ubicacion)/.test(normalized)) return 'contact'
  if (/(programa|medidas|propuestas|promesas|electoral|plan)/.test(normalized)) return 'program'
  if (/(transparenc|auditoria|presupuesto|cuentas|subvenciones|contratos|convenios|retribuciones|estatutos|codigo etico)/.test(normalized)) return 'transparency'
  if (/(afili|afiliar|cuota|alta|milita|suscripcion|dni|requisito)/.test(normalized)) return 'affiliation'
  if (/(votaci|voto|consulta|participacion|encuesta)/.test(normalized)) return 'voting'
  if (/(donaci|donar|dono|apoyo economico|stripe|pago|tarjeta|dinero|importe|cantidad)/.test(normalized)) return 'donation'
  if (/(newsletter|boletin|boletín|suscrib|suscriptor)/.test(normalized)) return 'newsletter'
  if (/(noticia|actualidad|novedad|prensa|gabinete)/.test(normalized)) return 'news'
  if (/(presentacion|mision|vision|tecnologia|video publicitario)/.test(normalized)) return 'presentation'
  return 'general'
}

const buildContactResponse = (hits: Hit[]) => {
  const combined = hits.map((hit) => hit.snippet).join(' \n ')

  const emailMatch = combined.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)
  const phoneMatch = combined.match(/\+?\d{1,3}[\s-]?\d{2,3}[\s-]?\d{3}[\s-]?\d{3,4}/)
  const officeMatch = combined.match(/oficina\s*central[^\n:]*[:\-]?\s*([^\n]+)/i)

  const office = officeMatch?.[1]?.trim()
  const email = emailMatch?.[0]?.trim()
  const phone = phoneMatch?.[0]?.trim()

  if (!office && !email && !phone) {
    return null
  }

  const lines: string[] = ['Si vas al apartado Contacto, veras lo siguiente:']
  if (office) lines.push(`- Oficina central: ${office}`)
  if (email) lines.push(`- Email: ${email}`)
  if (phone) lines.push(`- Telefono: ${phone}`)
  lines.push('Si quieres, te indico tambien donde esta cada dato en la pagina.')

  return lines.join('\n')
}

const readContactInfoFromPage = async (): Promise<ContactInfo> => {
  if (contactInfoCache) {
    return contactInfoCache
  }

  try {
    const contactoPath = path.join(process.cwd(), 'pages', 'contacto.vue')
    const content = await fs.readFile(contactoPath, 'utf8')

    const officeMatch = content.match(/OFICINA CENTRAL<\/strong>\s*<span>([^<]+)<\/span>/i)
    const emailMatch = content.match(/EMAIL<\/strong>\s*<span>([^<]+)<\/span>/i)
    const phoneMatch = content.match(/TEL[EÉ]FONO<\/strong>\s*<span>([^<]+)<\/span>/i)

    contactInfoCache = {
      office: officeMatch?.[1]?.trim() || null,
      email: emailMatch?.[1]?.trim() || null,
      phone: phoneMatch?.[1]?.trim() || null
    }

    return contactInfoCache
  } catch {
    contactInfoCache = { office: null, email: null, phone: null }
    return contactInfoCache
  }
}

const fetchWithTimeout = async (url: string, init: RequestInit, timeoutMs: number) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal
    })
  } finally {
    clearTimeout(timer)
  }
}

export default defineEventHandler(async (event) => {
  const clientIp = String(getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown')
  if (!checkRateLimit(clientIp)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Demasiadas peticiones de chat. Espera un poco e intentalo de nuevo.'
    })
  }

  const config = useRuntimeConfig()
  const ollamaBaseUrl = config.ollamaBaseUrl || 'http://127.0.0.1:11434'
  const model = config.ollamaChatModel || 'llama3.1:8b'
  const needsDockerFallback = /localhost|127\.0\.0\.1/i.test(ollamaBaseUrl)
  const candidateBaseUrls = Array.from(new Set([
    ollamaBaseUrl,
    ...(needsDockerFallback
      ? ['http://host.docker.internal:11434', 'http://172.17.0.1:11434']
      : [])
  ]))

  const body = await readBody<{ message?: string; history?: ChatTurn[] }>(event)
  const message = body?.message?.trim()

  if (!message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El mensaje es obligatorio'
    })
  }

  if (message.length > 1500) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El mensaje es demasiado largo (maximo 1500 caracteres).'
    })
  }

  const normalized = message
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (/(partido comunista espanol|partido comunista espanola|pce comunista|comunista)/.test(normalized)) {
    return {
      ok: true,
      model: 'rule-based',
      response:
        'Aclaracion rapida: aqui PCE significa Proteccion Civil Espanola. Si quieres, te explico programa, propuestas o actualidad dentro de esta web.'
    }
  }

  if (/(\bvox\b|\bpsoe\b|\bpp\b|\bsumar\b|\bpodemos\b|\bciudadanos\b|\berc\b|\bbildu\b)/.test(normalized)) {
    return {
      ok: true,
      model: 'rule-based',
      response:
        'Te ayudo encantado, pero solo con informacion de Proteccion Civil Espanola dentro de esta web.'
    }
  }

  const isGreeting = /^(hola|buenas|hey|holi|hi|buenos dias|buenas tardes|buenas noches)[\s!.?]*$/.test(normalized)

  if (isGreeting) {
    return {
      ok: true,
      model: 'rule-based',
      response:
        'Hola. Soy BULLPATRIOT. Puedo ayudarte con programa, propuestas, afiliacion, votaciones, actualidad y organizacion de PCE.'
    }
  }

  const intent = detectIntent(normalized)
  const asksReasoning = /(por que|porque|como|cómo|opina|opinion|opinión|analiza|analisis|análisis|razona|explica|compar|pros|contras|deberia|debería|crees|argumenta|ventaja|desventaja)/.test(normalized)
  const needsDeepGeneration = /(redacta|escribe|analiza|desarrolla|explica en detalle|comparativa|manifiesto|discurso|propuesta completa|resumen largo)/.test(normalized) || asksReasoning
  const factualShortQuery = /^(que|qué|cual|cuál|cuando|cuándo|donde|dónde|cuanto|cuánto|hay|tiene|tienen)\b/.test(normalized) && message.length <= 90 && !asksReasoning

  const baseSearchOptions = isTechnicalUserQuery(normalized)
    ? { minScore: 1 }
    : { excludeSourcePatterns: nonTechnicalSourceExcludes, minScore: 1 }

  let canonicalHits: Hit[] = []
  if (intent !== 'general') {
    canonicalHits = await searchWebsiteKnowledge(message, 8, {
      ...baseSearchOptions,
      includeSourcePatterns: canonicalSourcesByIntent[intent]
    })
  }

  let knowledgeHits: Hit[] = canonicalHits
  if (knowledgeHits.length === 0) {
    knowledgeHits = await searchWebsiteKnowledge(message, 8, baseSearchOptions)
  }

  const contactIntent = intent === 'contact'
  if (contactIntent) {
    const directContact = await readContactInfoFromPage()
    if (directContact.office || directContact.email || directContact.phone) {
      const lines: string[] = ['En la seccion Contacto de la web aparece:']
      if (directContact.office) lines.push(`- Oficina central: ${directContact.office}`)
      if (directContact.email) lines.push(`- Email: ${directContact.email}`)
      if (directContact.phone) lines.push(`- Telefono: ${directContact.phone}`)
      return {
        ok: true,
        model: 'local-knowledge-contact',
        response: lines.join('\n')
      }
    }

    const contactHits = (canonicalHits.length > 0 ? canonicalHits : knowledgeHits)
      .filter((hit) => /pages\/contacto\.vue/i.test(hit.source))
    const answer = buildContactResponse(contactHits)

    if (answer) {
      return {
        ok: true,
        model: 'local-knowledge-contact',
        response: answer
      }
    }

    return {
      ok: true,
      model: 'rule-based',
      response: canonicalNoDataMessage.contact
    }
  }

  if (intent !== 'general' && !needsDeepGeneration && factualShortQuery) {
    const topicalHits = canonicalHits.length > 0 ? canonicalHits : knowledgeHits
    const topicResponse = buildTopicGroundedResponse(intent, topicalHits, normalized)

    if (topicResponse) {
      return {
        ok: true,
        model: `local-knowledge-${intent}`,
        response: topicResponse
      }
    }

    return {
      ok: true,
      model: 'rule-based',
      response: canonicalNoDataMessage[intent]
    }
  }

  if (knowledgeHits.length === 0) {
    return {
      ok: true,
      model: 'rule-based',
      response:
        'No tengo suficiente informacion clara para responderte bien ahora mismo. Si concretas un poco la pregunta, te ayudo enseguida.'
    }
  }

  // Camino rapido solo para preguntas factuales cortas.
  if (!needsDeepGeneration && factualShortQuery) {
    return {
      ok: true,
      model: 'local-knowledge-fast',
      response: buildFastGroundedResponse(knowledgeHits, normalized)
    }
  }

  const history = Array.isArray(body?.history) ? body.history.slice(-8) : []
  const sanitizedHistory = history
    .filter((turn) => turn && (turn.role === 'user' || turn.role === 'assistant') && typeof turn.content === 'string')
    .map((turn) => ({ role: turn.role, content: turn.content.slice(0, 1000) }))

  const websiteContext = `Contexto valido de esta web:
- Nombre correcto: Proteccion Civil Espanola (PCE).
- Areas: actualidad, programa, votaciones, afiliacion, donaciones, transparencia y contacto.
- El asistente debe apoyar al usuario sobre contenido y funcionamiento de la web y del partido en esta web.`

  const knowledgeContext = knowledgeHits
    .map((hit, index) => `[K${index + 1}] Fuente: ${hit.source}\n${hit.snippet}`)
    .join('\n\n')

  const systemPrompt = `Eres BULLPATRIOT, asistente virtual oficial de la web de Proteccion Civil Espanola (PCE).
Regla critica: PCE aqui significa Proteccion Civil Espanola, nunca Partido Comunista Espanol.
Responde solo con base en el contexto de esta web y en el mensaje del usuario. No uses Internet ni inventes fuentes externas.
Obligatorio: usa como base unicamente los fragmentos [K] proporcionados abajo.
Si falta informacion en [K], dilo claramente y no inventes nada.
Si la pregunta se sale del partido/web, responde con una sola frase corta indicando el alcance.
Responde en espanol claro, directo y util.
Si la pregunta pide opinion, analisis o comparacion: responde en 3 bloques breves.
1) Hecho observado en [K]
2) Interpretacion razonada
3) Conclusion practica
No inventes datos fuera de [K].

${websiteContext}

Fragmentos verificados de la web:
${knowledgeContext}`

  const payload = {
    model,
    stream: false,
    messages: [
      { role: 'system', content: systemPrompt },
      ...sanitizedHistory,
      { role: 'user', content: `${message}\n\nResponde solo con informacion de [K].` }
    ],
    options: {
      temperature: 0.25,
      num_predict: 220
    }
  }

  let lastError: any = null

  for (const baseUrl of candidateBaseUrls) {
    try {
      const response = await fetchWithTimeout(
        `${baseUrl}/api/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        },
        5500
      )

      if (!response.ok) {
        const errorText = await response.text()
        lastError = createError({
          statusCode: 502,
          statusMessage: `Error Ollama (${baseUrl}): ${errorText || response.statusText}`
        })
        continue
      }

      const result = await response.json() as { message?: { content?: string } }
      const content = result?.message?.content?.trim()

      if (!content) {
        lastError = createError({
          statusCode: 502,
          statusMessage: `Ollama no devolvio contenido (${baseUrl})`
        })
        continue
      }

      return {
        ok: true,
        model,
        response: content
      }
    } catch (error: any) {
      lastError = error
      console.error(`Ollama chat error (${baseUrl}):`, error)
    }
  }

  // Si Ollama falla, devolvemos de forma inmediata una respuesta verificada por web.
  return {
    ok: true,
    model: 'local-knowledge-fallback',
    response: buildFastGroundedResponse(knowledgeHits, normalized)
  }
})
