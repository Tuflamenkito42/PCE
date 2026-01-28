# 🔑 Cómo Obtener tus Claves de Stripe (Paso a Paso)

## 📋 Guía Visual Completa

### 1️⃣ Crear Cuenta en Stripe

1. Ve a **https://dashboard.stripe.com/register**
2. Completa el formulario:
   - Email
   - Nombre completo
   - País (España)
   - Contraseña
3. Click en **"Create account"**
4. Verifica tu email

---

### 2️⃣ Activar Modo de Prueba

Una vez dentro del dashboard:

1. Busca el **toggle** en la esquina superior derecha
2. Asegúrate de que diga **"Test mode"** (modo de prueba)
3. Si dice "Live mode", haz click para cambiar a "Test mode"

```
┌─────────────────────────────────┐
│  Stripe Dashboard               │
│                    [Test mode ▼]│ ← Debe estar activado
└─────────────────────────────────┘
```

---

### 3️⃣ Obtener las Claves API

#### Opción A: Desde el Dashboard Principal

1. En el dashboard principal, busca la sección **"For developers"**
2. Verás tus claves directamente:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...) - Click en "Reveal test key"

#### Opción B: Desde el Menú Developers

1. Click en **"Developers"** en el menú superior
2. Click en **"API keys"** en el menú lateral
3. Verás dos claves:

```
┌─────────────────────────────────────────────────┐
│  API keys                                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Publishable key                                │
│  pk_test_51Qc...                    [Copy]      │
│  ↑ Esta es tu STRIPE_PUBLIC_KEY                 │
│                                                 │
│  Secret key                                     │
│  sk_test_51Qc...          [Reveal] [Copy]       │
│  ↑ Esta es tu STRIPE_SECRET_KEY                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### 4️⃣ Copiar las Claves

#### Publishable Key (Clave Pública)

1. Click en el botón **"Copy"** junto a "Publishable key"
2. La clave empieza con `pk_test_`
3. Guárdala temporalmente

#### Secret Key (Clave Secreta)

1. Click en **"Reveal test key"** (si está oculta)
2. Click en el botón **"Copy"**
3. La clave empieza con `sk_test_`
4. ⚠️ **IMPORTANTE**: Nunca compartas esta clave públicamente

---

### 5️⃣ Configurar en tu Proyecto

1. Abre el archivo `.env` en la raíz de tu proyecto
2. Reemplaza las claves de ejemplo:

```env
# Antes (ejemplo)
STRIPE_PUBLIC_KEY=pk_test_51QcVxwEwVGPRPrSBVGPRPrSB...

# Después (tus claves reales)
STRIPE_PUBLIC_KEY=pk_test_TU_CLAVE_AQUI
STRIPE_SECRET_KEY=sk_test_TU_CLAVE_AQUI
```

3. **Guarda el archivo**

---

### 6️⃣ Reiniciar el Servidor

```bash
# En la terminal, detén el servidor (Ctrl+C)

# Limpia la caché
rmdir /s /q .nuxt

# Reinicia
npm run dev
```

---

## ✅ Verificar que Funciona

### Prueba Rápida

1. Ve a **http://localhost:3000/afiliacion**
2. Completa los pasos hasta llegar a "Datos Bancarios"
3. Si ves el formulario de tarjeta de Stripe, ¡funciona! ✅

### Prueba Completa

1. Completa todo el formulario de afiliación
2. En "Datos Bancarios", usa esta tarjeta de prueba:
   ```
   Número: 4242 4242 4242 4242
   Fecha: 12/34
   CVC: 123
   ```
3. Click en "Finalizar Afiliación"
4. Si el pago se procesa correctamente, ¡todo está configurado! 🎉

---

## 🔍 Verificar en Stripe Dashboard

Después de hacer una prueba:

1. Ve a **Stripe Dashboard**
2. Click en **"Payments"** en el menú lateral
3. Deberías ver tu pago de prueba listado
4. Click en el pago para ver los detalles

---

## 🔒 Seguridad de las Claves

### ✅ Claves de Prueba (Test Keys)

- Empiezan con `pk_test_` y `sk_test_`
- **Seguras para desarrollo**
- No procesan pagos reales
- Puedes compartirlas en tu equipo de desarrollo

### ⚠️ Claves de Producción (Live Keys)

- Empiezan con `pk_live_` y `sk_live_`
- **NUNCA las compartas**
- **NUNCA las subas a GitHub**
- Solo úsalas en producción
- Procesan pagos reales con dinero real

---

## 📝 Archivo .env Completo

Tu archivo `.env` debería verse así:

```env
# 🔐 STRIPE TEST KEYS
STRIPE_PUBLIC_KEY=pk_test_51QcVxwEwVGPRPrSBYOUR_ACTUAL_KEY_HERE
STRIPE_SECRET_KEY=sk_test_51QcVxwEwVGPRPrSBYOUR_ACTUAL_KEY_HERE

# Webhook secret (opcional para desarrollo local)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# 🗄️ DATABASE (MySQL)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=pce_db
```

---

## 🐛 Problemas Comunes

### Error: "Stripe public key not found"

**Causa**: La clave pública no está configurada correctamente

**Solución**:
1. Verifica que `.env` tenga `STRIPE_PUBLIC_KEY`
2. Verifica que la clave empiece con `pk_test_`
3. Reinicia el servidor

### Error: "Invalid API Key provided"

**Causa**: La clave es incorrecta o está mal copiada

**Solución**:
1. Ve a Stripe Dashboard → Developers → API keys
2. Copia las claves de nuevo
3. Asegúrate de no tener espacios extra
4. Reinicia el servidor

### Error: "No such payment_intent"

**Causa**: Estás usando claves de producción en modo de prueba (o viceversa)

**Solución**:
1. Verifica que estés en "Test mode" en Stripe
2. Usa claves que empiecen con `pk_test_` y `sk_test_`

---

## 🎓 Próximos Pasos

### Para Desarrollo
1. ✅ Usa claves de prueba
2. ✅ Prueba con tarjetas de prueba
3. ✅ Verifica pagos en Stripe Dashboard (test mode)

### Para Producción
1. Completa la verificación de tu cuenta Stripe
2. Activa tu cuenta para pagos reales
3. Obtén claves de producción (pk_live_, sk_live_)
4. Configura webhook en producción
5. Actualiza `.env` en el servidor de producción

---

## 📚 Recursos Útiles

- **Stripe Dashboard**: https://dashboard.stripe.com
- **Documentación API**: https://stripe.com/docs/api
- **Tarjetas de Prueba**: https://stripe.com/docs/testing
- **Webhooks**: https://stripe.com/docs/webhooks
- **Soporte**: https://support.stripe.com

---

## ✅ Checklist

- [ ] Cuenta de Stripe creada
- [ ] Email verificado
- [ ] Modo de prueba activado
- [ ] Clave pública copiada (pk_test_...)
- [ ] Clave secreta copiada (sk_test_...)
- [ ] Archivo .env actualizado
- [ ] Servidor reiniciado
- [ ] Prueba realizada con tarjeta 4242...
- [ ] Pago visible en Stripe Dashboard

---

**¿Todo listo?** 🎉

Ahora puedes probar el sistema de afiliación completo en:
**http://localhost:3000/afiliacion**

¡Buena suerte! 🚀
