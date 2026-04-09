# 💳 Guía de Configuración Stripe

## 🚀 Configuración Rápida

### 1. Obtener claves de Stripe

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Crea una cuenta (o inicia sesión)
3. Activa el **modo de prueba** (toggle en la esquina superior derecha)
4. Ve a **Developers → API keys**
5. Copia las claves:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

### 2. Configurar variables de entorno

Edita el archivo `.env` en la raíz del proyecto:

```env
STRIPE_PUBLIC_KEY=pk_test_TU_CLAVE_PUBLICA_AQUI
STRIPE_SECRET_KEY=sk_test_TU_CLAVE_SECRETA_AQUI
```

### 3. Reiniciar el servidor

```bash
# Detener el servidor (Ctrl+C)
# Limpiar caché
rmdir /s /q .nuxt

# Reiniciar
npm run dev
```

---

## 🧪 Tarjetas de Prueba

Usa estas tarjetas oficiales de Stripe para probar:

| Tarjeta | Resultado | Uso |
|---------|-----------|-----|
| `4242 4242 4242 4242` | ✅ Éxito | Pago exitoso |
| `4000 0000 0000 0002` | ❌ Declinada | Tarjeta declinada |
| `4000 0000 0000 9995` | ❌ Sin fondos | Fondos insuficientes |
| `4000 0000 0000 0341` | ❌ Fracción | Error de procesamiento |
| `4000 0025 0000 3155` | 🔄 3D Secure | Requiere autenticación |

**Datos adicionales:**
- **Fecha de caducidad**: Cualquier fecha futura (ej: 12/34)
- **CVC**: Cualquier 3 dígitos (ej: 123)
- **Código postal**: Cualquier código válido (ej: 28001)

---

## 📋 Flujo de Pago

```
1. Usuario completa formulario de afiliación
   ↓
2. Selecciona cuota mensual (5€, 10€, 20€, 50€ o personalizado)
   ↓
3. Introduce datos de tarjeta (Stripe Elements)
   ↓
4. Revisa y confirma
   ↓
5. Sistema crea Payment Intent (server/api/payment-intent.post.ts)
   ↓
6. Stripe procesa el pago
   ↓
7. Webhook recibe confirmación (server/api/webhook.post.ts)
   ↓
8. Usuario recibe confirmación
```

---

## 🔧 Estructura de Archivos

```
app/
├── composables/
│   └── useStripe.ts              # Hook de Stripe
├── components/
│   ├── DniScanner.vue            # Escáner DNI
│   └── StripeCard.vue            # Formulario de tarjeta
├── server/
│   └── api/
│       ├── payment-intent.post.ts  # Crear pago
│       └── webhook.post.ts         # Recibir eventos
└── pages/
    └── afiliacion/
        └── index.vue             # Página principal
```

---

## 🎯 Características Implementadas

### ✅ Paso 1: Datos Personales
- Escáner DNI con face-api.js y Tesseract.js
- Auto-rellenado de formulario
- Validación DNI/NIE en tiempo real
- Campos: nombre, apellidos, DNI, fecha nacimiento, email, teléfono

### ✅ Paso 2: Cuota
- Opciones predefinidas: 5€, 10€, 20€, 50€
- Opción personalizada (mínimo 5€)
- Indicador de cuota recomendada
- Visualización clara de la selección

### ✅ Paso 3: Datos Bancarios
- Integración Stripe Elements
- Formulario de tarjeta seguro
- Información de próximo cargo
- Tarjetas de prueba disponibles
- Validación en tiempo real

### ✅ Paso 4: Confirmación
- Resumen de todos los datos
- Checkbox de términos y condiciones
- Botón de finalización
- Procesamiento de pago con Stripe

---

## 🔒 Seguridad

- ✅ Claves secretas solo en servidor (nunca en cliente)
- ✅ Stripe Elements (PCI compliant)
- ✅ Validación server-side
- ✅ Webhook signature verification
- ✅ HTTPS requerido en producción

---

## 🐛 Troubleshooting

### Error: "Stripe public key not found"
**Solución**: Verifica que `.env` tenga `STRIPE_PUBLIC_KEY` configurado

### Error: "Payment intent creation failed"
**Solución**: Verifica que `STRIPE_SECRET_KEY` sea válido

### Tarjeta no se procesa
**Solución**: 
1. Verifica que uses tarjetas de prueba
2. Comprueba que el modo de prueba esté activo en Stripe
3. Revisa la consola del navegador

### Webhook no funciona
**Solución**: 
1. Para desarrollo local, usa Stripe CLI
2. Instala: `stripe listen --forward-to localhost:3000/api/webhook`
3. Copia el webhook secret al `.env`

---

## 📚 Recursos

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Elements](https://stripe.com/docs/stripe-js)
- [Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Webhooks](https://stripe.com/docs/webhooks)

---

## 🎓 Próximos Pasos

1. **Configurar webhook en producción**
   - Stripe Dashboard → Webhooks
   - Añadir endpoint: `https://tudominio.com/api/webhook`
   - Copiar signing secret

2. **Guardar afiliaciones en base de datos**
   - Crear tabla `afiliaciones`
   - Guardar datos en webhook `payment_intent.succeeded`

3. **Enviar emails de confirmación**
   - Integrar servicio de email (SendGrid, Mailgun, etc.)
   - Enviar confirmación al usuario
   - Enviar notificación al admin

4. **Implementar suscripciones recurrentes**
   - Usar Stripe Subscriptions en lugar de Payment Intents
   - Configurar planes mensuales
   - Gestionar cancelaciones

---

**¡Listo para usar!** 🎉

Visita: http://localhost:3000/afiliacion
