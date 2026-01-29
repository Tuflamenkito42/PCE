# Guía de Inicio Rápido (Docker) 🚀

Para que tú y tus compañeros trabajéis sin errores de base de datos, he unificado todo en Docker. Ahora solo necesitáis una orden para que todo funcione.

### Pasos para arrancar:

1.  **Abre una terminal** en la carpeta del proyecto.
2.  **Apaga lo que tengas abierto** (especialmente si tienes Nuxt o MySQL corriendo fuera de Docker para evitar conflictos de puertos).
3.  Ejecuta este comando:
    ```bash
    docker-compose up --build
    ```
    *(La primera vez tardará un poco porque tiene que instalar las dependencias dentro del contenedor).*

### ¿Qué incluye este entorno?
- **App (Nuxt):** Disponible en `http://localhost:3000`
- **Base de Datos:** MySQL corriendo internamente (puerto 3306).
- **PHPMyAdmin:** Disponible en `http://localhost:8080` (para ver las tablas visualmente).

### Muy importante (Primera vez):
Una vez que el comando termine y veas que la web funciona, entra en:
`http://localhost:3000/api/setup`
Esto creará automáticamente todas las tablas para ti y para cualquier compañero que use este sistema.

---
**Nota para compañeros:** Solo tienen que clonar el repo y hacer `docker-compose up`. No necesitan instalar Node ni MySQL en sus ordenadores.
