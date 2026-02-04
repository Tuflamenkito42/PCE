# DNI Scanner con IA - Documentación Técnica

## 🚀 Tecnología Implementada

El escáner de DNI ahora utiliza **Inteligencia Artificial local** (ejecutada 100% en el navegador) para extraer y estructurar datos de documentos de identidad españoles.

### Stack Tecnológico

1. **@xenova/transformers** - Librería de Transformers.js para ejecutar modelos de IA en el navegador
2. **TrOCR (Transformer-based OCR)** - Modelo de reconocimiento óptico de caracteres
3. **LaMini-Flan-T5** - Modelo de lenguaje pequeño para estructuración de datos

## 🔄 Flujo de Procesamiento

```
1. Usuario sube imagen del DNI
   ↓
2. [Opcional] Detección facial con face-api.js
   ↓
3. OCR con TrOCR (Xenova/trocr-small-printed)
   → Extrae texto crudo del documento
   ↓
4. Estructuración con LLM (Xenova/LaMini-Flan-T5-783M)
   → Convierte texto en JSON estructurado
   ↓
5. Validación y presentación de datos
```

## 📊 Modelos Utilizados

### TrOCR (OCR)
- **Modelo**: `Xenova/trocr-small-printed`
- **Tamaño**: ~50MB (descarga en primera ejecución)
- **Propósito**: Reconocimiento de texto impreso
- **Optimizado para**: Documentos oficiales como DNI, pasaportes

### LaMini-Flan-T5 (LLM)
- **Modelo**: `Xenova/LaMini-Flan-T5-783M`
- **Tamaño**: ~300MB (descarga en primera ejecución)
- **Propósito**: Extracción y estructuración de información
- **Salida**: JSON con campos estructurados

## 📝 Formato de Salida

```json
{
  "dni": "12345678A",
  "nombre": "JUAN",
  "apellidos": "GARCÍA LÓPEZ",
  "fecha_nacimiento": "15/03/1990",
  "fecha_caducidad": "15/03/2030"
}
```

## ⚙️ Configuración

Los modelos se configuran en `app/utils/transformers-config.js`:

```javascript
export const MODELS = {
  OCR: {
    name: 'Xenova/trocr-small-printed',
    task: 'image-to-text'
  },
  LLM: {
    name: 'Xenova/LaMini-Flan-T5-783M',
    task: 'text-generation'
  }
}
```

## 🎯 Ventajas vs Tesseract.js

| Característica | Tesseract.js | TrOCR + LLM |
|---------------|--------------|-------------|
| Precisión OCR | Media | Alta |
| Salida estructurada | No (requiere parsing manual) | Sí (JSON directo) |
| Manejo de caracteres especiales | Regular | Excelente |
| Tamaño | ~2MB | ~350MB |
| Primera carga | Rápida | Lenta (descarga modelos) |
| Cargas posteriores | Rápida | Rápida (caché) |
| Ejecución | Navegador | Navegador |

## 🔧 Optimizaciones Implementadas

1. **Caché de modelos**: Los modelos se descargan una sola vez y se almacenan en IndexedDB
2. **Carga dinámica**: Los modelos solo se cargan cuando se necesitan (no en SSR)
3. **Mensajes de progreso**: Feedback visual durante todo el proceso
4. **Fallback inteligente**: Si el LLM falla, usa el parser regex tradicional
5. **Manejo de errores robusto**: Múltiples capas de validación

## 📱 Rendimiento

### Primera ejecución (descarga de modelos)
- Tiempo estimado: 30-60 segundos (depende de la conexión)
- Descarga total: ~350MB

### Ejecuciones posteriores (modelos en caché)
- Tiempo de procesamiento: 5-15 segundos
- Sin descargas adicionales

## 🛠️ Troubleshooting

### Los modelos tardan mucho en cargar
- **Causa**: Primera descarga de modelos
- **Solución**: Es normal, los modelos se cachean para futuras ejecuciones

### Error "Out of memory"
- **Causa**: Dispositivo con poca RAM
- **Solución**: Considerar usar modelos más pequeños o API externa

### JSON inválido en la salida
- **Causa**: El LLM no pudo estructurar correctamente
- **Solución**: El sistema usa automáticamente el parser de fallback

## 🔐 Privacidad

✅ **100% Local**: Todo el procesamiento ocurre en el navegador del usuario
✅ **Sin servidor**: No se envían imágenes ni datos a servidores externos
✅ **Sin tracking**: Los modelos se descargan de Hugging Face CDN

## 📚 Referencias

- [Transformers.js Documentation](https://huggingface.co/docs/transformers.js)
- [TrOCR Paper](https://arxiv.org/abs/2109.10282)
- [LaMini Models](https://huggingface.co/MBZUAI/LaMini-Flan-T5-783M)
