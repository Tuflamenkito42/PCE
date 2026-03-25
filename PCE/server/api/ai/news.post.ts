import { createError, defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const ollamaBaseUrl = config.ollamaBaseUrl || 'http://127.0.0.1:11434'
  const model = config.ollamaNewsModel || 'mistral:7b'
  const needsDockerFallback = /localhost|127\.0\.0\.1/i.test(ollamaBaseUrl)
  const candidateBaseUrls = Array.from(new Set([
    ollamaBaseUrl,
    ...(needsDockerFallback
      ? ['http://host.docker.internal:11434', 'http://172.17.0.1:11434']
      : [])
  ]))

  const body = await readBody<{
    topic?: string
    tone?: string
    audience?: string
    length?: 'corta' | 'media' | 'larga'
    keyPoints?: string
  }>(event)

  const topic = body?.topic?.trim()
  const tone = body?.tone?.trim() || 'institucional'
  const audience = body?.audience?.trim() || 'ciudadania general'
  const length = body?.length || 'media'
  const keyPoints = body?.keyPoints?.trim() || ''

  if (!topic) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El tema de la noticia es obligatorio'
    })
  }

  const lengthGuide: Record<string, string> = {
    corta: 'entre 130 y 180 palabras',
    media: 'entre 220 y 320 palabras',
    larga: 'entre 380 y 520 palabras'
  }

  const prompt = `Redacta una noticia en espanol para una web politica.

Tema: ${topic}
Tono: ${tone}
Publico objetivo: ${audience}
Extension: ${lengthGuide[length] || lengthGuide.media}
Puntos clave (si existen): ${keyPoints || 'sin puntos adicionales'}

Formato de salida exacto:
TITULO: <titulo impactante y breve>
RESUMEN: <2 frases maximo>
CUERPO:
<noticia completa en 2 o 4 parrafos>

Reglas:
- Evita afirmaciones imposibles de verificar.
- No uses insultos ni lenguaje violento.
- Escribe para lectura web clara.`

  let lastError: any = null

  for (const baseUrl of candidateBaseUrls) {
    try {
      const response = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          options: {
            temperature: 0.45,
            num_predict: 800
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        lastError = createError({
          statusCode: 502,
          statusMessage: `Error Ollama (${baseUrl}): ${errorText || response.statusText}`
        })
        continue
      }

      const result = await response.json() as { response?: string }
      const content = result?.response?.trim()

      if (!content) {
        lastError = createError({
          statusCode: 502,
          statusMessage: `Ollama no devolvio contenido para la noticia (${baseUrl})`
        })
        continue
      }

      return {
        ok: true,
        model,
        article: content
      }
    } catch (error: any) {
      lastError = error
      console.error(`Ollama news error (${baseUrl}):`, error)
    }
  }

  if (lastError?.statusCode) {
    throw lastError
  }

  throw createError({
    statusCode: 500,
    statusMessage:
      `No se pudo generar la noticia con Ollama. URLs probadas: ${candidateBaseUrls.join(', ')}. ` +
      'Verifica que Ollama este activo y, si usas Docker, configura OLLAMA_BASE_URL=http://host.docker.internal:11434.'
  })
})
