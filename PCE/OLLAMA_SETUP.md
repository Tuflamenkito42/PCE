# BULLPATRIOT + Ollama local (Windows)

## 1) Instalar Ollama

1. Descarga e instala Ollama desde: https://ollama.com/download/windows
2. Reinicia terminal y comprueba:

PowerShell:
ollama --version

## 2) Descargar modelos

Para chat general (recomendado):
ollama pull llama3.1:8b

Para redaccion de noticias:
ollama pull mistral:7b

## 3) Levantar servicio local

En Windows normalmente se inicia al abrir Ollama.
Puedes verificar con:
ollama list

Si no responde, abre la app de Ollama y vuelve a probar.

## 4) Configurar variables del proyecto

En tu archivo .env (a partir de .env.example) usa:

OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_CHAT_MODEL=llama3.1:8b
OLLAMA_NEWS_MODEL=mistral:7b

## 5) Ejecutar la web

npm install
npm run dev

## 6) Usar BULLPATRIOT

- Home: pulsa la tarjeta/imagen BULLPATRIOT.
- Ruta directa: /bullpatriot
- Chat usa endpoint: /api/ai/chat
- Noticias usa endpoint: /api/ai/news

## 7) Imagen del boton BULLPATRIOT

Coloca la imagen del toro en:
public/images/bullpatriot.png

Si no existe ese fichero, la web usa fallback a /images/logo.png.

## 8) Prueba rapida de API local

PowerShell:
Invoke-RestMethod -Uri http://127.0.0.1:11434/api/generate -Method POST -ContentType 'application/json' -Body '{"model":"llama3.1:8b","prompt":"Di hola","stream":false}'
