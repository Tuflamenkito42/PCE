# Sistema de Traducción Automática con LibreTranslate

## 📋 Resumen

El proyecto ahora usa **LibreTranslate** para traducción automática en lugar de archivos hardcodeados. Cuando cambias de idioma, todos los strings se traducen automáticamente al catalán, vasco y gallego.

## 🎯 Cómo Funciona

1. **Español es el idioma base** - Todos los strings están en español
2. **Cambio de idioma** - Cuando el usuario cambia el idioma:
   - Se busca en caché (localStorage)
   - Si no existe, se envía al backend
   - Backend usa LibreTranslate para traducir
   - Se cachea la traducción (7 días)
   - Se muestra la traducción

3. **Sin delays** - Las traducciones se obtienen automáticamente en el background

## 🚀 Instalación

### 1. Iniciar LibreTranslate (ya está en docker-compose)

```bash
docker compose up -d
```

LibreTranslate estará disponible en `http://localhost:5000`

### 2. Los tipos ya están listos

Se agregaron nuevos tipos en `types/i18n.ts`:
- `TranslationRequest` - Request al backend
- `TranslationResponse` - Response del backend
- `CachedTranslations` - Estructura del caché

### 3. Composables disponibles

- **useI18n()** - Gestor de idiomas (actualizado)
  - `locale` - Idioma actual
  - `setLocale(lang)` - Cambiar idioma
  - `t(key)` - Obtener traducción
  - `translateString(key, spanishText)` - Traducir string específico
  - `isTranslating` - True mientras se traduce

- **useTranslationCache()** - Gestor de caché (nuevo)
  - `getCache()` - Obtener caché completo
  - `getCachedTranslation(locale, key)` - Una traducción específica
  - `setCachedTranslation(locale, key, value)` - Guardar una traducción
  - `clearCache()` - Limpiar caché después de 7 días

## 💻 Uso en Componentes

### Opción 1: Traducción Simple (Recomendado)

```vue
<template>
  <div>
    <h1>{{ t('home.welcome') }}</h1>
    <p v-if="translatedStrings[locale]['home.welcome']">
      {{ translatedStrings[locale]['home.welcome'] }}
    </p>
  </div>
</template>

<script setup>
const { locale, t, translatedStrings } = useI18n()
</script>
```

### Opción 2: Traducción con Watcher

```vue
<template>
  <div>
    <h1>{{ currentTitle }}</h1>
  </div>
</template>

<script setup>
const { locale, translateString } = useI18n()
const currentTitle = ref('Cargando...')

const updateTranslation = async () => {
  currentTitle.value = await translateString(
    'home.welcome', 
    'Protección Civil Española (PCE) es un partido...'
  )
}

watch(locale, () => {
  updateTranslation()
}, { immediate: true })
</script>
```

### Opción 3: Traducción Bulk (Para Varias Frases)

```vue
<script setup>
const { locale, translateString } = useI18n()
const translations = ref({})

const loadTranslations = async () => {
  const strings = {
    title: 'NOTICIAS',         // Spanish = key
    desc: 'Últimas noticias',   // Spanish = key
    button: 'Leer Más'          // Spanish = key
  }

  for (const [key, text] of Object.entries(strings)) {
    translations.value[key] = await translateString(key, text)
  }
}

onMounted(() => {
  loadTranslations()
})
</script>
```

## 🔄 Migración de Componentes

### ANTES (Hardcodeado):
```vue
<script setup>
const { locale, t } = useI18n()
const title = computed(() => ({
  es: 'NOTICIAS',
  ca: 'NOTÍCIES',
  eu: 'BERRIAK',
  gl: 'NOTICIAS'
}[locale.value]))
</script>
```

### DESPUÉS (Automático):
```vue
<script setup>
const { locale, translateString } = useI18n()
const spanishTitle = 'NOTICIAS'
const title = ref(spanishTitle)

const loadTitle = async () => {
  title.value = await translateString('news.title', spanishTitle)
}

watch(locale, loadTitle, { immediate: true })
</script>
```

## 📝 Agregar Nuevos Strings

1. **Actualiza `utils/i18n.ts`** - Solo la parte `es`:

```typescript
export const translations = {
  es: {
    // ... strings existentes
    'my.newKey': 'Mi nuevo string en español',
    'my.otherKey': 'Otro string'
  },
  // ca, eu, gl están vacíos (auto-generados)
  ca: {},
  eu: {},
  gl: {}
}
```

2. **Usa en componentes** - Automáticamente se traducirá

```vue
{{ translateString('my.newKey', 'Mi nuevo string en español') }}
```

## 🔧 Backend

### Endpoint: `POST /api/i18n/translate`

**Request:**
```json
{
  "text": "Hola mundo",
  "targetLocale": "eu"
}
```

**Response:**
```json
{
  "success": true,
  "translatedText": "Kaixo mundua"
}
```

## 💾 Caché

El caché se guarda en `localStorage` bajo:
- **Key**: `pce-translated-strings`
- **Expiry**: `pce-translations-expiry` (7 días)

Estructura del caché:
```json
{
  "eu": {
    "home.welcome": "Translated text...",
    "nav.home": "HASIERA"
  },
  "ca": {
    "home.welcome": "Text traduit...",
    "nav.home": "INICI"
  },
  "gl": { ... }
}
```

## 🐛 Debugging

### Ver qué se está cacheando:
```javascript
// En la consola del navegador
localStorage.getItem('pce-translated-strings')
```

### Limpiar caché:
```javascript
// En la consola
localStorage.removeItem('pce-translated-strings')
localStorage.removeItem('pce-translations-expiry')
// O desde el composable:
const cache = useTranslationCache()
cache.clearCache()
```

### Ver estado de traducción:
```javascript
const { isTranslating } = useI18n()
// true = está traduciendo
// false = listo
```

## ✅ Checklist de Actualización

- [x] LibreTranslate en docker-compose
- [x] Endpoint backend `/api/i18n/translate`
- [x] Tipos TypeScript actualizados
- [x] Composable `useI18n` actualizado
- [x] Composable `useTranslationCache` creado
- [x] Sistema de caché (7 días)
- [ ] **PENDIENTE**: Actualizar componentes existentes para usar el nuevo sistema

## 🌍 Idiomas Soportados

- **es** (Español) - Idioma base
- **ca** (Catalán) - Auto-generado
- **eu** (Euskera) - Auto-generado
- **gl** (Gallego) - Auto-generado

## ⚡ Performance

- First load: ~500ms-1s (primera traducción)
- Cached loads: <10ms (desde localStorage)
- Background queries: No bloquea renderizado

## 📚 Referencias

- [LibreTranslate Docs](https://github.com/LibreTranslate/LibreTranslate)
- [Nuxt 3 Docs](https://nuxt.com)
- [Vue Docs](https://vuejs.org)

---

**¿Preguntas?** Revisa los ejemplos en los composables o endpoints del servidor.
