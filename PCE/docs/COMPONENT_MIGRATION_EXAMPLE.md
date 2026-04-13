# Ejemplo: Cómo Actualizar Componentes a Traducción Automática

## 📝 Componente NewsCard - ANTES vs DESPUÉS

### ANTES (Hardcodeado)

```vue
<template>
  <div class="news-card">
    <h3>{{ newsTitle }}</h3>
    <p>{{ newsDesc }}</p>
    <button>{{ buttonText }}</button>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()

const translations = {
  es: {
    title: 'Noticias PCE',
    desc: 'Últimas actualizaciones',
    button: 'Leer más'
  },
  ca: {
    title: 'Notícies PCE',
    desc: 'Últimes actualitzacions',
    button: 'Llegir més'
  },
  eu: {
    title: 'PCE Berriak',
    desc: 'Azken eguneraketak',
    button: 'Irakurri gehiago'
  },
  gl: {
    title: 'Noticias PCE',
    desc: 'Últimas actualizacións',
    button: 'Ler máis'
  }
}

const newsTitle = computed(() => translations[locale.value].title)
const newsDesc = computed(() => translations[locale.value].desc)
const buttonText = computed(() => translations[locale.value].button)
</script>
```

### DESPUÉS (Automático)

```vue
<template>
  <div class="news-card">
    <h3>{{ newsTitle }}</h3>
    <p>{{ newsDesc }}</p>
    <button>{{ buttonText }}</button>
  </div>
</template>

<script setup lang="ts">
const { t } = useAutoTranslate()

const newsTitle = t('news.card.title', 'Noticias PCE')
const newsDesc = t('news.card.desc', 'Últimas actualizaciones')
const buttonText = t('news.card.button', 'Leer más')

// Si usas await (necesita onMounted):
onMounted(async () => {
  newsTitle.value = await t('news.card.title', 'Noticias PCE')
  newsDesc.value = await t('news.card.desc', 'Últimas actualizaciones')
  buttonText.value = await t('news.card.button', 'Leer más')
})
</script>
```

---

## 🎯 Patrón Recomendado para Nuevos Componentes

### Usando `tRef` (más fácil):

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  </div>
</template>

<script setup>
const { tRef } = useAutoTranslate()

// Crea refs reactivos que se traducen automáticamente
const title = tRef('home.title', 'Bienvenido a PCE')
const description = tRef('home.desc', 'Protección Civil Española es...')
</script>
```

### Usando `tMultiple` (para muchos strings):

```vue
<script setup>
const { tMultiple } = useAutoTranslate()

const strings = await tMultiple({
  title: ['home.title', 'Bienvenido a PCE'],
  description: ['home.desc', 'Protección Civil Española es...'],
  button: ['common.button', 'Continuar'],
  error: ['common.error', 'Algo salió mal']
})

// Acceso: strings.title, strings.description, etc.
</script>
```

---

## 🚀 Pasos para Actualizar un Componente

1. **Identifica los strings hardcodeados**
   ```vue
   // ❌ Esto queremos cambiar:
   const title = computed(() => ({
     es: 'Título',
     ca: 'Títol',
     eu: 'Titulua',
     gl: 'Título'
   }[locale.value]))
   ```

2. **Reemplaza con `tRef`**
   ```vue
   // ✅ Así quedará:
   const title = tRef('page.title', 'Título')
   ```

3. **Si hay muchos strings, usa `tMultiple`**
   ```vue
   const { title, subtitle, button } = await tMultiple({
     title: ['page.title', 'Título'],
     subtitle: ['page.subtitle', 'Subtítulo'],
     button: ['page.button', 'Aceptar']
   })
   ```

4. **Actualiza `utils/i18n.ts` con las nuevas claves**
   ```typescript
   export const translations = {
     es: {
       'page.title': 'Título',
       'page.subtitle': 'Subtítulo',
       'page.button': 'Aceptar'
     }
   }
   ```

---

## 💡 Ejemplos Específicos por Componente

### Header/Navigation

```vue
<script setup>
const { tRef, tMultiple } = useAutoTranslate()

// Opción 1: Individual
const homeLabel = tRef('nav.home', 'INICIO')
const newsLabel = tRef('nav.news', 'NOTICIAS')

// Opción 2: Múltiples
const navItems = await tMultiple({
  home: ['nav.home', 'INICIO'],
  news: ['nav.news', 'NOTICIAS'],
  program: ['nav.program', 'PROGRAMA'],
  events: ['nav.events', 'EVENTOS']
})
</script>

<template>
  <nav>
    <a href="/">{{ homeLabel }}</a>
    <a href="/news">{{ newsLabel }}</a>
    <!-- O con navItems: -->
    <a href="/">{{ navItems.home }}</a>
    <a href="/news">{{ navItems.news }}</a>
  </nav>
</template>
```

### Formularios

```vue
<script setup>
const { tRef, t } = useAutoTranslate()

const labels = {
  name: tRef('form.name', 'NOMBRE COMPLETO'),
  email: tRef('form.email', 'CORREO ELECTRÓNICO'),
  message: tRef('form.message', 'MENSAJE')
}

const handleSubmit = async () => {
  const successMsg = await t('form.success', '¡Enviado correctamente!')
  console.log(successMsg)
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <label>{{ labels.name }}</label>
    <input type="text" required />
    
    <label>{{ labels.email }}</label>
    <input type="email" required />
    
    <label>{{ labels.message }}</label>
    <textarea required></textarea>
    
    <button type="submit">Enviar</button>
  </form>
</template>
```

---

## ⚙️ Flujo de Traducción

```
Usuario cambia idioma
        ↓
setLocale() trigger
        ↓
useAutoTranslate() watch
        ↓
Busca en caché (localStorage)
        ↓
¿Está en caché?
   S → Devuelve del caché
   N → Envía al backend
        ↓
Backend (LibreTranslate)
   es → eu/ca/gl
        ↓
Guarda en caché
        ↓
Renderiza traducción
```

---

## 🐛 Troubleshooting

### "El texto no se traduce"
```javascript
// Verifica que estés usando useAutoTranslate():
const { t } = useAutoTranslate() // ✅ Correcto
const { t } = useI18n() // ❌ Este va a devolver la clave

// O verifica que el string exista en utils/i18n.ts
```

### "La traducción se demora"
```javascript
// Esto es normal la primera vez (caché vacío)
// Usa el estado isTranslating si necesitas mostrar loader:
const { isTranslating } = useAutoTranslate()

<template>
  <div v-if="isTranslating">Traduciendo...</div>
  <div v-else>{{ title }}</div>
</template>
```

### "Caché no se actualiza"
```javascript
// Limpia el localStorage y recarga:
localStorage.removeItem('pce-translated-strings')
location.reload()
```

---

## 📋 Checklist de Migración

- [ ] Identifica todos los componentes con código hardcodeado
- [ ] Reemplaza con `tRef()` o `tMultiple()`
- [ ] Actualiza claves en `utils/i18n.ts`
- [ ] Prueba en cada idioma (es, ca, eu, gl)
- [ ] Verifica caché en DevTools
- [ ] Confirma performance (sin delays)

---

**Nota**: No es necesario actualizar TODOS los componentes de una vez. Puedes hacerlo gradualmente.
