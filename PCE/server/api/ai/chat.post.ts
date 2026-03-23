import { createError, defineEventHandler, readBody } from 'h3'

type ChatTurn = {
  role: 'user' | 'assistant'
  content: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const ollamaBaseUrl = config.ollamaBaseUrl || 'http://127.0.0.1:11434'
  const model = config.ollamaChatModel || 'llama3.1:8b'

  const body = await readBody<{ message?: string; history?: ChatTurn[] }>(event)
  const message = body?.message?.trim()

  if (!message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El mensaje es obligatorio'
    })
  }

  const history = Array.isArray(body?.history) ? body.history.slice(-10) : []
  const sanitizedHistory = history
    .filter((turn) => turn && (turn.role === 'user' || turn.role === 'assistant') && typeof turn.content === 'string')
    .map((turn) => ({ role: turn.role, content: turn.content.slice(0, 1000) }))

  const systemPrompt = `Eres BULLPATRIOT, asistente virtual de la web de PCE.
Responde en espanol claro, directo y respetuoso.
No inventes datos factuales: si no sabes algo, dilo y propone siguiente paso.`

  const payload = {
    model,
    stream: false,
    messages: [
      { role: 'system', content: systemPrompt },
      ...sanitizedHistory,
      { role: 'user', content: message }
    ],
    options: {
      temperature: 0.35,
      num_predict: 500
    }
  }

  try {
    const response = await fetch(`${ollamaBaseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw createError({
        statusCode: 502,
        statusMessage: `Error Ollama: ${errorText || response.statusText}`
      })
    }

    const result = await response.json() as { message?: { content?: string } }
    const content = result?.message?.content?.trim()

    if (!content) {
      throw createError({
        statusCode: 502,
        statusMessage: 'Ollama no devolvio contenido'
      })
    }

    return {
      ok: true,
      model,
      response: content
    }
  } catch (error: any) {
    console.error('Ollama chat error:', error)

    if (error?.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'No se pudo conectar con Ollama. Verifica que este activo en localhost:11434.'
    })
  }
})
