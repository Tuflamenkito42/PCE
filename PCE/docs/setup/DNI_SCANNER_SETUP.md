# 🚀 DNI Scanner Component - Setup Guide

## 📋 Overview

Este componente Vue 3 permite escanear DNI/NIE españoles con:
- ✅ **Detección facial** usando face-api.js
- ✅ **OCR** con Tesseract.js para extraer texto
- ✅ **Validación** de DNI/NIE con regex y algoritmo de letra

## 🔧 Instalación

### 1. Instalar dependencias

```bash
npm install
```

Esto instalará:
- `face-api.js` (v0.22.2) - Detección facial
- `tesseract.js` (v5.1.1) - OCR

### 2. Descargar modelos de Face-API

Los modelos de detección facial deben estar en la carpeta `public/models/`.

**Opción A: Descarga manual**

1. Ve a: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
2. Descarga estos archivos a `public/models/`:
   - `tiny_face_detector_model-weights_manifest.json`
   - `tiny_face_detector_model-shard1`
   - `face_landmark_68_model-weights_manifest.json`
   - `face_landmark_68_model-shard1`
   - `face_recognition_model-weights_manifest.json`
   - `face_recognition_model-shard1`
   - `face_recognition_model-shard2`

**Opción B: Script automático (PowerShell)**

```powershell
# Crear directorio
New-Item -ItemType Directory -Force -Path "public/models"

# Descargar modelos
$baseUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"
$models = @(
    "tiny_face_detector_model-weights_manifest.json",
    "tiny_face_detector_model-shard1",
    "face_landmark_68_model-weights_manifest.json",
    "face_landmark_68_model-shard1",
    "face_recognition_model-weights_manifest.json",
    "face_recognition_model-shard1",
    "face_recognition_model-shard2"
)

foreach ($model in $models) {
    $url = "$baseUrl/$model"
    $output = "public/models/$model"
    Invoke-WebRequest -Uri $url -OutFile $output
    Write-Host "✅ Downloaded: $model"
}
```

## 📁 Estructura de archivos

```
PCE/
├── app/
│   ├── components/
│   │   └── DniScanner.vue          ← Componente principal
│   └── pages/
│       └── afiliacion/
│           └── index.vue            ← Página de afiliación
├── public/
│   └── models/                      ← Modelos de face-api.js
│       ├── tiny_face_detector_model-*
│       ├── face_landmark_68_model-*
│       └── face_recognition_model-*
└── package.json
```

## 🎯 Uso del componente

### En tu página Vue:

```vue
<template>
  <div>
    <DniScanner @dataExtracted="handleDniData" />
  </div>
</template>

<script setup>
const handleDniData = (data) => {
  console.log('Datos del DNI:', data)
  // Usar los datos extraídos
  // data.dni
  // data.nombre
  // data.apellidos
  // data.fecha_nacimiento
  // data.valido
}
</script>
```

## 📊 Formato de datos extraídos

```json
{
  "cara_detectada": true,
  "dni": "12345678Z",
  "nombre": "JUAN",
  "apellidos": "PÉREZ GARCÍA",
  "fecha_nacimiento": "01/01/1990",
  "fecha_caducidad": "01/01/2030",
  "valido": true
}
```

## ✅ Validación DNI/NIE

### DNI
- **Formato**: 8 dígitos + letra
- **Regex**: `/^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/`
- **Validación**: Letra calculada con módulo 23

### NIE
- **Formato**: X/Y/Z + 7 dígitos + letra
- **Regex**: `/^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/`
- **Validación**: Letra calculada con módulo 23 (X=0, Y=1, Z=2)

## 🎨 Características

1. **Detección facial**
   - Usa TinyFaceDetector para velocidad
   - Dibuja bounding box verde alrededor de la cara
   - Indica si se detectó o no una cara

2. **OCR**
   - Tesseract.js con idioma español
   - Barra de progreso durante el reconocimiento
   - Extrae todo el texto visible

3. **Parsing inteligente**
   - Busca DNI/NIE con regex
   - Extrae fechas en formato DD/MM/YYYY
   - Identifica nombre y apellidos (mayúsculas)

4. **UI/UX**
   - Drag & drop para subir imagen
   - Estados de carga con spinner
   - Visualización de datos extraídos
   - Botones para usar datos o resetear
   - Vista JSON completa

## 🐛 Troubleshooting

### Error: "Models not loaded"
- Verifica que los modelos estén en `public/models/`
- Comprueba la consola del navegador para errores de carga

### No se detecta la cara
- Asegúrate de que la imagen sea clara
- La foto debe mostrar claramente el rostro del DNI
- Prueba con mejor iluminación

### OCR no extrae datos correctamente
- Usa imágenes de alta calidad
- Evita imágenes borrosas o con reflejos
- El DNI debe estar bien enfocado

## 🚀 Próximos pasos

Para integrar en la página de afiliación:

1. Importa el componente en `pages/afiliacion/index.vue`
2. Añádelo en el paso 1 (Datos Personales)
3. Usa el evento `@dataExtracted` para rellenar el formulario automáticamente

## 📝 Notas

- El componente funciona mejor con imágenes claras y bien iluminadas
- La detección facial puede tardar unos segundos la primera vez
- El OCR es más preciso con texto en mayúsculas
- Los modelos de face-api.js se cargan una sola vez al montar el componente
