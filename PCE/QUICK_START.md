# 🚀 Quick Start - DNI Scanner

## ⚡ Inicio Rápido (5 minutos)

### 1️⃣ Ver la Demo
```bash
npm run dev
```
Abre tu navegador en: **http://localhost:3000/dni-demo**

---

### 2️⃣ Usar el Componente

```vue
<template>
  <DniScanner @dataExtracted="handleData" />
</template>

<script setup>
import DniScanner from '@/components/DniScanner.vue'

const handleData = (data) => {
  console.log(data)
  // {
  //   cara_detectada: true,
  //   dni: "12345678Z",
  //   nombre: "JUAN",
  //   apellidos: "PÉREZ GARCÍA",
  //   fecha_nacimiento: "01/01/1990",
  //   fecha_caducidad: "01/01/2030",
  //   valido: true
  // }
}
</script>
```

---

### 3️⃣ Integrar en Afiliación

**Archivo**: `pages/afiliacion/index.vue`

```vue
<script setup>
import DniScanner from '@/components/DniScanner.vue'

// Añadir manejador
const handleDniData = (data) => {
  if (data.valido) {
    formData.dni = data.dni
    formData.name = data.nombre
    formData.lastname = data.apellidos
  }
}
</script>

<template>
  <div v-if="currentStep === 1" class="step-content">
    <h2 class="form-subtitle">DATOS PERSONALES</h2>
    
    <!-- AÑADIR AQUÍ -->
    <DniScanner @dataExtracted="handleDniData" />
    
    <!-- Resto del formulario -->
    <div class="form-grid">
      <!-- ... campos existentes ... -->
    </div>
  </div>
</template>
```

---

## ✅ ¿Todo Listo?

- [x] Dependencias instaladas (`npm install` ✅)
- [x] Modelos descargados (`public/models/` ✅)
- [x] Componente creado (`DniScanner.vue` ✅)
- [x] Demo disponible (`/dni-demo` ✅)

---

## 📖 Documentación Completa

- **Setup**: `DNI_SCANNER_SETUP.md`
- **Integración**: `INTEGRATION_GUIDE.md`
- **Resumen**: `DNI_SCANNER_SUMMARY.md`

---

## 🎯 Características Principales

| Característica | Estado |
|---------------|--------|
| Detección Facial | ✅ |
| OCR Español | ✅ |
| Validación DNI | ✅ |
| Validación NIE | ✅ |
| UI Premium | ✅ |
| Responsive | ✅ |

---

## 🔧 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Descargar modelos (si faltan)
.\download-models.ps1

# Iniciar desarrollo
npm run dev

# Ver demo
# http://localhost:3000/dni-demo
```

---

## 💡 Tips

1. **Mejor calidad**: Usa imágenes claras y bien iluminadas
2. **Formato**: JPG, PNG funcionan perfectamente
3. **Tamaño**: No hay límite, pero imágenes más pequeñas son más rápidas
4. **Privacidad**: Todo se procesa en el navegador, no se envía nada al servidor

---

## 🐛 Problemas Comunes

**No carga los modelos**
```bash
# Re-descargar modelos
.\download-models.ps1
```

**No detecta la cara**
- Asegúrate de que la foto del DNI sea visible
- Prueba con mejor iluminación

**OCR no funciona bien**
- Usa imágenes de alta resolución
- Evita reflejos y sombras

---

## 🎉 ¡Listo!

Ya puedes usar el DNI Scanner en tu aplicación.

**¿Necesitas ayuda?** Consulta la documentación completa en:
- `DNI_SCANNER_SUMMARY.md`
