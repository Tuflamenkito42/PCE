# 🎯 Integración del DNI Scanner en la Página de Afiliación

## Pasos para integrar el componente en `pages/afiliacion/index.vue`

### 1. Importar el componente

Añade la importación en la sección `<script setup>`:

```vue
<script setup>
import DniScanner from '@/components/DniScanner.vue'
// ... resto de imports
```

### 2. Añadir el componente en el paso 1

Dentro del `v-if="currentStep === 1"`, añade el scanner ANTES de los campos del formulario:

```vue
<div v-if="currentStep === 1" class="step-content">
  <h2 class="form-subtitle">DATOS PERSONALES</h2>
  
  <!-- DNI SCANNER - NUEVO -->
  <div class="dni-scanner-section">
    <DniScanner @dataExtracted="handleDniData" />
  </div>
  
  <div class="form-divider">
    <span>O introduce los datos manualmente</span>
  </div>
  
  <!-- Resto del formulario existente -->
  <div class="form-grid">
    <!-- ... campos existentes ... -->
  </div>
</div>
```

### 3. Añadir el manejador de datos

En el `<script setup>`, añade la función para manejar los datos extraídos:

```javascript
const handleDniData = (data) => {
  console.log('DNI Data:', data)
  
  // Auto-rellenar el formulario con los datos del DNI
  if (data.dni) {
    formData.dni = data.dni
  }
  
  if (data.nombre) {
    formData.name = data.nombre
  }
  
  if (data.apellidos) {
    formData.lastname = data.apellidos
  }
  
  // Parsear fecha de nacimiento si está disponible
  if (data.fecha_nacimiento) {
    // Formato: DD/MM/YYYY
    const [day, month, year] = data.fecha_nacimiento.split('/')
    // Aquí puedes actualizar los selectores de fecha
    // o guardar la fecha en un formato específico
  }
  
  // Mostrar notificación al usuario
  if (data.valido) {
    alert('✅ DNI válido detectado. Formulario auto-rellenado.')
  } else {
    alert('⚠️ DNI detectado pero no válido. Por favor, verifica los datos.')
  }
}
```

### 4. Añadir estilos (opcional)

Añade estos estilos en la sección `<style scoped>`:

```css
.dni-scanner-section {
  margin-bottom: 40px;
  padding: 30px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
}

.form-divider {
  text-align: center;
  margin: 30px 0;
  position: relative;
}

.form-divider::before,
.form-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.form-divider::before {
  left: 0;
}

.form-divider::after {
  right: 0;
}

.form-divider span {
  padding: 0 20px;
  background: #5E2C2C;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-family: 'Cinzel', serif;
}
```

## 🎨 Alternativa: Modal/Popup

Si prefieres que el scanner aparezca en un modal:

```vue
<template>
  <div v-if="currentStep === 1" class="step-content">
    <h2 class="form-subtitle">DATOS PERSONALES</h2>
    
    <!-- Botón para abrir el scanner -->
    <button 
      type="button" 
      class="btn-scan-dni" 
      @click="showScanner = true"
    >
      📷 Escanear DNI
    </button>
    
    <!-- Modal del scanner -->
    <div v-if="showScanner" class="scanner-modal">
      <div class="modal-content">
        <button class="close-btn" @click="showScanner = false">×</button>
        <DniScanner @dataExtracted="handleDniDataAndClose" />
      </div>
    </div>
    
    <!-- Formulario normal -->
    <div class="form-grid">
      <!-- ... -->
    </div>
  </div>
</template>

<script setup>
const showScanner = ref(false)

const handleDniDataAndClose = (data) => {
  handleDniData(data)
  showScanner.value = false
}
</script>

<style scoped>
.btn-scan-dni {
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #723233, #5E2C2C);
  color: #fff;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  cursor: pointer;
  margin-bottom: 30px;
  transition: all 0.3s ease;
}

.btn-scan-dni:hover {
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
}

.scanner-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  position: relative;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  font-size: 2rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}
</style>
```

## 📝 Notas importantes

1. **Validación**: El componente ya valida el DNI/NIE automáticamente
2. **Datos parciales**: Si no se detectan todos los datos, los campos vacíos quedarán como `null`
3. **Cara no detectada**: El componente seguirá intentando extraer texto aunque no detecte una cara
4. **Rendimiento**: La primera carga puede tardar unos segundos mientras se cargan los modelos

## 🚀 Próximos pasos

1. Integra el componente en la página de afiliación
2. Prueba con diferentes imágenes de DNI
3. Ajusta el parsing de datos según tus necesidades específicas
4. Considera añadir validación adicional para los datos extraídos
