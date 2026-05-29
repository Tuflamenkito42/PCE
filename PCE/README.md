# Protección Civil Española (PCE) Web

Aplicación web de PCE construida con Nuxt, API server-side en Nitro, base de datos MySQL y panel privado para afiliados y administración.

## Tabla de contenidos

- [Protección Civil Española (PCE) Web](#protección-civil-española-pce-web)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Sobre el proyecto](#sobre-el-proyecto)
  - [Características](#características)
  - [Stack tecnológico](#stack-tecnológico)
  - [Estructura de carpetas](#estructura-de-carpetas)
  - [Primeros pasos](#primeros-pasos)
    - [Requisitos](#requisitos)
    - [Instalación local](#instalación-local)
    - [Variables de entorno](#variables-de-entorno)
  - [Ejecución](#ejecución)
    - [Desarrollo](#desarrollo)
    - [Docker Compose](#docker-compose)
    - [Producción](#producción)
  - [Base de datos](#base-de-datos)
  - [Seguridad](#seguridad)
  - [IA local (BULLPATRIOT)](#ia-local-bullpatriot)
  - [Roadmap](#roadmap)
  - [Contribución](#contribución)

## Sobre el proyecto

Este proyecto ofrece:

- Sitio público (programa, noticias, contacto, transparencia, donaciones).
- Flujo de afiliación con gestión de datos y carné digital.
- Área de afiliado para gestión privada.
- Panel de administración para métricas y candidaturas.
- Asistente IA local BULLPATRIOT (Ollama).

## Características

- Autenticación con cookie httpOnly firmada.
- Control de acceso por roles (usuario/admin).
- Rate limiting en endpoints sensibles, incluyendo chat IA con límite por IP y por usuario.
- Subida y descarga segura de CV para candidaturas.
- Modo oscuro con estilos globales.
- Internacionalización (es, ca, eu, gl).

## Stack tecnológico

- Frontend: Nuxt 4, Vue 3
- Backend: Nitro server routes (server/api)
- Base de datos: MySQL 8
- ORM: Prisma
- Pagos: Stripe
- IA local: Ollama
- Contenedores: Docker Compose

## Estructura de carpetas

- pages: vistas públicas y privadas
- components: componentes de interfaz
- server/api: endpoints backend
- server/utils: utilidades de auth, DB, email y conocimiento
- prisma: esquema y migraciones
- assets/css: estilos globales
- docs: guías técnicas y de operación

## Primeros pasos

### Requisitos

- Node.js 20+
- npm 10+
- MySQL 8 (o Docker)
- Opcional: Ollama para funcionalidades IA

### Instalación local

1. Instala dependencias:

```bash
npm install
```

2. Configura variables de entorno (ver sección siguiente).

3. Arranca el proyecto en desarrollo:

```bash
npm run dev
```

### Variables de entorno

Variables principales:

- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME
- DATABASE_URL
- AUTH_TOKEN_SECRET
- GEMINI_API_KEY
- STRIPE_SECRET_KEY
- STRIPE_PUBLIC_KEY
- OLLAMA_BASE_URL
- OLLAMA_CHAT_MODEL
- OLLAMA_NEWS_MODEL
- OLLAMA_CHAT_NUM_PREDICT (recomendado: 800 o superior)

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Docker Compose

```bash
docker compose up -d --build
```

### Producción

```bash
npm run build
npm run preview
```

## Base de datos

Comandos útiles:

```bash
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:studio
```

## Seguridad

- Los endpoints administrativos validan rol admin.
- Los currículums se almacenan en carpeta privada y se entregan por endpoint autenticado de administración.
- Se bloquea el acceso directo a `/uploads/curriculum/*`.
- El chat IA aplica límite por IP y por usuario autenticado para evitar bypass con múltiples IPs.

## IA local (BULLPATRIOT)

Consulta la guía: docs/setup/OLLAMA_SETUP.md

Notas:

- Si `OLLAMA_CHAT_NUM_PREDICT` es demasiado bajo, las respuestas pueden quedar cortadas.
- Valor recomendado de inicio: 800.

### Modelos de IA utilizados en el repositorio

- **Chat general del sitio (Ollama):** `llama3.1:8b` por defecto (`OLLAMA_CHAT_MODEL`) en `server/api/ai/chat.post.ts`.
- **Generación de noticias (Ollama):** `mistral:7b` por defecto (`OLLAMA_NEWS_MODEL`) en `server/api/ai/news.post.ts`.
- **Escáner de DNI (Google Gemini):** `gemini-3-flash-preview` en `server/api/scan-dni.post.ts` (requiere `GEMINI_API_KEY`).

## Roadmap

- Mejorar cobertura de tests automatizados.
- Añadir panel de auditoría de seguridad.
- Mejoras de accesibilidad y rendimiento.

## Contribución

1. Crea una rama de trabajo.
2. Implementa cambios pequeños y verificables.
3. Abre PR con descripción técnica y pasos de prueba.
