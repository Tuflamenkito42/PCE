// @ts-nocheck
import { promises as fs } from 'fs'
import path from 'path'

type KnowledgeChunk = {
  source: string
  text: string
  normalized: string
}

type KnowledgeSearchResult = {
  source: string
  snippet: string
  score: number
}

type SearchOptions = {
  includeSourcePatterns?: RegExp[]
  excludeSourcePatterns?: RegExp[]
  minScore?: number
}

const INCLUDED_EXTENSIONS = new Set(['.vue', '.md', '.txt', '.ts'])
const ROOT_FILES = [
  'README.md',
  'INTEGRATION_GUIDE.md',
  'MEMORIA_TECNICA.md',
  'GUIA_COLABORACION.md',
  'QUICK_START.md'
]
const ROOT_DIRS = ['pages', 'components', 'docs', 'utils']
const MAX_FILE_SIZE_BYTES = 300_000
const MIN_CHUNK_LENGTH = 70
const MAX_CHUNK_LENGTH = 520

let knowledgeCache: KnowledgeChunk[] | null = null
let loadingPromise: Promise<KnowledgeChunk[]> | null = null

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const stopWords = new Set([
  'de', 'la', 'el', 'los', 'las', 'y', 'o', 'u', 'en', 'con', 'que', 'por', 'para',
  'un', 'una', 'unos', 'unas', 'del', 'al', 'es', 'se', 'como', 'a', 'sobre', 'su',
  'sus', 'mi', 'tu', 'me', 'te', 'lo', 'le', 'les', 'si', 'no', 'ya', 'mas', 'muy',
  'cual', 'cuales', 'donde', 'cuando', 'quien', 'quienes', 'esta', 'este', 'estos', 'estas',
  'hay', 'ser', 'estar', 'opina', 'opinion'
])

const genericPoliticalTerms = new Set([
  'partido', 'politico', 'politica', 'politicas', 'programa', 'propuesta', 'propuestas',
  'actualidad', 'transparencia', 'contacto', 'noticia', 'noticias', 'votaciones', 'afiliacion',
  'eleccion', 'elecciones', 'gobierno', 'campana', 'medida', 'medidas', 'pce'
])

const technicalSourcesPattern = /(memoria_tecnica|implementation|integrat|setup|readme|guia_colaboracion|quick_start)/i
const technicalQueryPattern = /(tecnic|arquitect|ia|modelo|ollama|integraci|api|codigo|docker|infraestructura)/i

const extractTerms = (query: string) => {
  const normalized = normalizeText(query)
  const terms = normalized
    .split(/[^a-z0-9]+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 3 && !stopWords.has(term))

  return Array.from(new Set(terms))
}

const stripVueText = (content: string) => {
  const withoutScripts = content.replace(/<script[\s\S]*?<\/script>/gi, ' ')
  const withoutStyles = withoutScripts.replace(/<style[\s\S]*?<\/style>/gi, ' ')
  const noTags = withoutStyles.replace(/<[^>]+>/g, ' ')
  const noEntities = noTags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

  return noEntities
}

const toChunks = (source: string, raw: string): KnowledgeChunk[] => {
  const compact = raw
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()

  if (!compact) {
    return []
  }

  const blocks = compact
    .split(/\n\n+/)
    .flatMap((block) => block.split(/(?<=[.!?])\s+/))
    .map((part) => part.trim())
    .filter((part) => part.length >= MIN_CHUNK_LENGTH)

  const chunks: KnowledgeChunk[] = []

  for (const block of blocks) {
    if (block.length <= MAX_CHUNK_LENGTH) {
      chunks.push({ source, text: block, normalized: normalizeText(block) })
      continue
    }

    let cursor = 0
    while (cursor < block.length) {
      const slice = block.slice(cursor, cursor + MAX_CHUNK_LENGTH).trim()
      if (slice.length >= MIN_CHUNK_LENGTH) {
        chunks.push({ source, text: slice, normalized: normalizeText(slice) })
      }
      cursor += MAX_CHUNK_LENGTH
    }
  }

  return chunks
}

const readAndChunkFile = async (filePath: string): Promise<KnowledgeChunk[]> => {
  const stat = await fs.stat(filePath)
  if (!stat.isFile() || stat.size > MAX_FILE_SIZE_BYTES) {
    return []
  }

  const extension = path.extname(filePath).toLowerCase()
  if (!INCLUDED_EXTENSIONS.has(extension)) {
    return []
  }

  const raw = await fs.readFile(filePath, 'utf8')
  const relative = path.relative(process.cwd(), filePath).replace(/\\/g, '/')
  const text = extension === '.vue' ? stripVueText(raw) : raw

  return toChunks(relative, text)
}

const walkDirectory = async (dirPath: string): Promise<string[]> => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === '.nuxt') {
      continue
    }

    const absolute = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      const nested = await walkDirectory(absolute)
      files.push(...nested)
    } else if (entry.isFile()) {
      files.push(absolute)
    }
  }

  return files
}

const buildKnowledgeBase = async (): Promise<KnowledgeChunk[]> => {
  const cwd = process.cwd()
  const files: string[] = []

  for (const rootFile of ROOT_FILES) {
    const filePath = path.join(cwd, rootFile)
    try {
      await fs.access(filePath)
      files.push(filePath)
    } catch {
      // ignore missing optional files
    }
  }

  for (const rootDir of ROOT_DIRS) {
    const absoluteDir = path.join(cwd, rootDir)
    try {
      const stat = await fs.stat(absoluteDir)
      if (!stat.isDirectory()) {
        continue
      }
      const nestedFiles = await walkDirectory(absoluteDir)
      files.push(...nestedFiles)
    } catch {
      // ignore missing optional directories
    }
  }

  const chunks: KnowledgeChunk[] = []
  for (const filePath of files) {
    try {
      const fileChunks = await readAndChunkFile(filePath)
      chunks.push(...fileChunks)
    } catch {
      // ignore unreadable files
    }
  }

  return chunks
}

const ensureKnowledgeLoaded = async () => {
  if (knowledgeCache) {
    return knowledgeCache
  }

  if (!loadingPromise) {
    loadingPromise = buildKnowledgeBase().then((chunks) => {
      knowledgeCache = chunks
      return chunks
    }).finally(() => {
      loadingPromise = null
    })
  }

  return loadingPromise
}

const sourceIsAllowed = (source: string, options?: SearchOptions) => {
  if (!options) {
    return true
  }

  const { includeSourcePatterns, excludeSourcePatterns } = options

  if (includeSourcePatterns && includeSourcePatterns.length > 0) {
    const included = includeSourcePatterns.some((pattern) => pattern.test(source))
    if (!included) {
      return false
    }
  }

  if (excludeSourcePatterns && excludeSourcePatterns.length > 0) {
    const excluded = excludeSourcePatterns.some((pattern) => pattern.test(source))
    if (excluded) {
      return false
    }
  }

  return true
}

export const searchWebsiteKnowledge = async (
  query: string,
  limit = 6,
  options?: SearchOptions
): Promise<KnowledgeSearchResult[]> => {
  const chunks = await ensureKnowledgeLoaded()
  const terms = extractTerms(query)
  const specificTerms = terms.filter((term) => !genericPoliticalTerms.has(term))
  const queryLooksTechnical = technicalQueryPattern.test(normalizeText(query))

  if (terms.length === 0 || chunks.length === 0) {
    return []
  }

  const scored = chunks
    .filter((chunk) => sourceIsAllowed(chunk.source, options))
    .map((chunk) => {
      let score = 0
      let specificMatches = 0

      for (const term of terms) {
        if (chunk.normalized.includes(term)) {
          const isGeneric = genericPoliticalTerms.has(term)
          if (isGeneric) {
            score += 1
          } else {
            specificMatches += 1
            score += term.length > 6 ? 4 : 3
          }
        }
      }

      if (specificTerms.length > 0 && specificMatches === 0) {
        return { chunk, score: 0 }
      }

      // Slight boost for core political pages/docs
      if (/pages\/(programa|transparencia|votaciones|afiliacion)|docs\//.test(chunk.source)) {
        score += 1
      }

      // Reduce technical docs unless the user explicitly asks a technical question.
      if (!queryLooksTechnical && technicalSourcesPattern.test(chunk.source)) {
        score -= 2
      }

      if (options?.minScore && score < options.minScore) {
        return { chunk, score: 0 }
      }

      return { chunk, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scored.map(({ chunk, score }) => ({
    source: chunk.source,
    snippet: chunk.text,
    score
  }))
}
