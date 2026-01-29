# 🛠️ Instalación de Stripe CLI (Windows)

El error "no se reconoce como programa interno o externo" significa que **Stripe CLI** no está instalado en tu ordenador. Es una herramienta necesaria para recibir los eventos de pago en local.

## Opción 1: Descarga Directa (Más sencilla)

1.  Descarga el programa desde este enlace oficial:
    👉 [Descargar stripe_1.19.2_windows_x86_64.zip](https://github.com/stripe/stripe-cli/releases/latest/download/stripe_windows_x86_64.zip)

2.  Descomprime el archivo `.zip`. Verás un archivo `stripe.exe`.

3.  Mueve ese archivo `stripe.exe` a la carpeta de tu proyecto:
    `C:\Users\sergi\OneDrive\Documentos\GitHub\PCE\PCE`

4.  Ahora, en lugar de `stripe listen`, ejecuta esto en la terminal (PowerShell):
    ```powershell
    .\stripe.exe listen --forward-to localhost:3000/api/webhook
    ```
    *(Nota el `.\` al principio)*

## Opción 2: Instalación Global (Para usarlo siempre)

Si tienes `scoop` instalado (un gestor de paquetes), es más rápido:
```powershell
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

---

## 🚀 Después de instalar

1.  Ejecuta el login (una sola vez):
    ```powershell
    .\stripe.exe login
    ```
    (Presiona Enter y se abrirá el navegador para autorizar).

2.  Inicia la escucha de eventos:
    ```powershell
    .\stripe.exe listen --forward-to localhost:3000/api/webhook
    ```
    *(Mantén esta ventana abierta)*

3.  Copia el **Webhook Signing Secret** (`whsec_...`) que te dará la terminal.

4.  Pégalo en tu archivo `.env`:
    `STRIPE_WEBHOOK_SECRET=whsec_...`
