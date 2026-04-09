# 👤 Usuario Ficticio para Pruebas

## 📋 Datos Completos del Usuario de Prueba

### 🆔 **Datos Personales**

```
Nombre:              Juan Carlos
Apellidos:           García Martínez
DNI:                 12345678Z
Fecha de Nacimiento: 15/03/1985
Email:               juan.garcia@example.com
Teléfono:            +34 612 345 678
```

---

## 🔐 **Validación DNI**

El DNI **12345678Z** es válido según el algoritmo español:
- Número: 12345678
- 12345678 % 23 = 14
- Letra en posición 14 = **Z** ✅

---

## 💳 **Datos de Pago (Stripe Test)**

### Tarjeta de Prueba - ÉXITO ✅

```
Número de tarjeta:   4242 4242 4242 4242
Fecha de caducidad:  12/34
CVC:                 123
Código postal:       28001
```

### Otras Tarjetas de Prueba

**Tarjeta Declinada** ❌
```
Número: 4000 0000 0000 0002
Fecha:  12/34
CVC:    123
```

**Sin Fondos** ❌
```
Número: 4000 0000 0000 9995
Fecha:  12/34
CVC:    123
```

---

## 💰 **Cuota Seleccionada**

```
Cuota mensual:       10€/mes (Recomendado)
Primer cargo:        Hoy
Próximo cargo:       Dentro de 1 mes
```

---

## 📄 **Datos Completos para Copiar/Pegar**

### Paso 1: Datos Personales

```
Nombre:              Juan Carlos
Apellidos:           García Martínez
DNI/NIE:             12345678Z
Fecha Nacimiento:    1985-03-15
Email:               juan.garcia@example.com
Teléfono:            612345678
```

### Paso 2: Cuota

```
Seleccionar:         10€/mes
```

### Paso 3: Datos Bancarios

```
Número tarjeta:      4242424242424242
Fecha:               12/34
CVC:                 123
Código postal:       28001
```

### Paso 4: Confirmación

```
☑ Acepto términos y condiciones
```

---

## 🎭 **Usuarios Adicionales para Pruebas**

### Usuario 2: María López

```
Nombre:              María
Apellidos:           López Fernández
DNI:                 87654321X
Fecha Nacimiento:    22/07/1990
Email:               maria.lopez@example.com
Teléfono:            +34 623 456 789
Cuota:               20€/mes
```

**Validación DNI**: 87654321 % 23 = 11 → Letra **X** ✅

### Usuario 3: Pedro Sánchez

```
Nombre:              Pedro
Apellidos:           Sánchez Ruiz
NIE:                 Y1234567Z
Fecha Nacimiento:    10/11/1988
Email:               pedro.sanchez@example.com
Teléfono:            +34 634 567 890
Cuota:               5€/mes
```

**Validación NIE**: Y=1 → 11234567 % 23 = 2 → Letra **Z** ✅

### Usuario 4: Ana Rodríguez

```
Nombre:              Ana
Apellidos:           Rodríguez Torres
DNI:                 45678912D
Fecha Nacimiento:    05/02/1995
Email:               ana.rodriguez@example.com
Teléfono:            +34 645 678 901
Cuota:               Personalizado: 15€/mes
```

**Validación DNI**: 45678912 % 23 = 3 → Letra **D** ✅

---

## 🧪 **Escenarios de Prueba**

### ✅ Escenario 1: Flujo Completo Exitoso

1. Usar datos de **Juan Carlos García**
2. Seleccionar cuota **10€/mes**
3. Pagar con tarjeta **4242 4242 4242 4242**
4. **Resultado esperado**: Pago exitoso, redirección a home

### ❌ Escenario 2: Tarjeta Declinada

1. Usar datos de **María López**
2. Seleccionar cuota **20€/mes**
3. Pagar con tarjeta **4000 0000 0000 0002**
4. **Resultado esperado**: Error "Tarjeta declinada"

### ⚠️ Escenario 3: Sin Fondos

1. Usar datos de **Pedro Sánchez**
2. Seleccionar cuota **5€/mes**
3. Pagar con tarjeta **4000 0000 0000 9995**
4. **Resultado esperado**: Error "Fondos insuficientes"

### ✅ Escenario 4: Cuota Personalizada

1. Usar datos de **Ana Rodríguez**
2. Seleccionar **Personalizado**
3. Introducir **15€**
4. Pagar con tarjeta **4242 4242 4242 4242**
5. **Resultado esperado**: Pago exitoso por 15€

---

## 📸 **Imagen DNI Ficticia para Scanner**

Si quieres probar el DNI Scanner, puedes crear una imagen con estos datos:

```
┌─────────────────────────────────────────┐
│  DOCUMENTO NACIONAL DE IDENTIDAD        │
│                                         │
│  [FOTO]    GARCÍA MARTÍNEZ              │
│            JUAN CARLOS                  │
│                                         │
│  Nacionalidad: ESP                      │
│  Fecha Nac.: 15 MAR 1985                │
│  DNI: 12345678Z                         │
│  Válido hasta: 15 MAR 2035              │
│                                         │
│  ESPAÑA                                 │
└─────────────────────────────────────────┘
```

**Nota**: Para el scanner, necesitarás una imagen real de un DNI. Puedes usar un DNI de ejemplo de internet o crear uno con Photoshop/Canva.

---

## 🔄 **Flujo de Prueba Paso a Paso**

### 1. Abrir la Página

```
http://localhost:3000/afiliacion
```

### 2. Paso 1: Datos Personales

**Opción A: Usar DNI Scanner**
- Click en "Seleccionar imagen del DNI"
- Subir imagen de DNI
- Esperar a que se auto-rellene

**Opción B: Introducir manualmente**
- Nombre: `Juan Carlos`
- Apellidos: `García Martínez`
- DNI/NIE: `12345678Z`
- Fecha: `1985-03-15`
- Email: `juan.garcia@example.com`
- Teléfono: `612345678`

Click en **"Siguiente"**

### 3. Paso 2: Cuota

- Click en la tarjeta **"10€/mes"** (Recomendado)
- Click en **"Siguiente"**

### 4. Paso 3: Datos Bancarios

- Número: `4242 4242 4242 4242`
- Fecha: `12 / 34`
- CVC: `123`
- CP: `28001`

Click en **"Siguiente"**

### 5. Paso 4: Confirmación

- Revisar todos los datos
- ☑ Marcar "Acepto términos y condiciones"
- Click en **"Finalizar Afiliación"**

### 6. Resultado

- ✅ Ver mensaje de éxito
- ✅ Redirección a home
- ✅ Verificar en Stripe Dashboard (modo test)

---

## 📊 **Verificar en Stripe Dashboard**

1. Ve a https://dashboard.stripe.com
2. Asegúrate de estar en **"Test mode"**
3. Click en **"Payments"**
4. Deberías ver el pago de **10.00 EUR**
5. Click en el pago para ver detalles:
   - Customer: Juan Carlos García Martínez
   - Email: juan.garcia@example.com
   - Amount: €10.00
   - Status: Succeeded

---

## 🎯 **Datos Rápidos (Copiar y Pegar)**

Para prueba rápida, copia estos datos:

```
PASO 1:
Nombre: Juan Carlos
Apellidos: García Martínez
DNI: 12345678Z
Fecha: 1985-03-15
Email: juan.garcia@example.com
Teléfono: 612345678

PASO 2:
Cuota: 10€/mes

PASO 3:
Tarjeta: 4242424242424242
Fecha: 12/34
CVC: 123
CP: 28001

PASO 4:
☑ Acepto términos
```

---

## 🔍 **Validación de Datos**

### DNI/NIE Válidos para Pruebas

| DNI/NIE | Válido | Letra Correcta |
|---------|--------|----------------|
| 12345678Z | ✅ | Z |
| 87654321X | ✅ | X |
| 45678912D | ✅ | D |
| Y1234567Z | ✅ | Z (NIE) |
| 00000000T | ✅ | T |
| 99999999R | ✅ | R |

### DNI/NIE Inválidos (para probar validación)

| DNI/NIE | Válido | Razón |
|---------|--------|-------|
| 12345678A | ❌ | Letra incorrecta (debería ser Z) |
| 1234567Z | ❌ | Faltan dígitos |
| ABCD1234Z | ❌ | Formato incorrecto |
| 12345678 | ❌ | Falta letra |

---

## 💡 **Tips para Pruebas**

1. **Modo Incógnito**: Usa el navegador en modo incógnito para pruebas limpias
2. **Consola del Navegador**: Abre DevTools (F12) para ver logs
3. **Network Tab**: Verifica las llamadas a la API
4. **Stripe Dashboard**: Mantén abierto para ver pagos en tiempo real
5. **Múltiples Usuarios**: Prueba con diferentes usuarios para verificar que todo funciona

---

## 🎉 **¡Listo para Probar!**

Usa estos datos ficticios para probar todo el flujo de afiliación.

**URL de prueba**: http://localhost:3000/afiliacion

**Usuario recomendado**: Juan Carlos García Martínez
**Tarjeta recomendada**: 4242 4242 4242 4242

¡Buena suerte con las pruebas! 🚀
