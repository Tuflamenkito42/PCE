# Memoria Técnica del Proyecto: Plataforma Digital PCE

## 1. Introducción y Filosofía de Desarrollo
Este documento detalla la arquitectura técnica, las decisiones de infraestructura y la integración avanzada de Inteligencia Artificial (IA) en la plataforma del Partido Civil Español (PCE). 

El desarrollo de este proyecto se ha caracterizado por un enfoque híbrido **Humano-IA**. Hemos utilizado herramientas de Inteligencia Artificial de vanguardia para acelerar el desarrollo y resolver problemas complejos (como la visión artificial), pero **hemos intervenido manualmente de forma intensiva** para asegurar la calidad, la seguridad y la personalización exacta del producto final. No nos hemos limitado a copiar código generado; hemos arquitecturado, depurado y reescrito componentes críticos para adaptarlos a las necesidades reales del proyecto.

---

## 2. Stack Tecnológico (Core)

### Frontend y Backend Unificado
*   **Framework**: **Nuxt 3**. Elegido por su capacidad "Fullstack". Nos permite tener una interfaz reactiva moderna (Vue 3) y un servidor backend potente en el mismo proyecto.
*   **Motor del Servidor**: **Nitro Engine** (sobre Node.js). Proporciona una API REST extremadamente rápida y server-side rendering (SSR) para un mejor SEO.

### Base de Datos e Infraestructura
*   **Base de Datos**: **MySQL 8.0**. Un motor relacional robusto para garantizar la integridad de los datos de afiliados y votaciones.
*   **ORM**: **Prisma**. Utilizamos Prisma para interactuar con la base de datos mediante código tipado (TypeScript), evitando errores de SQL manual y aumentando la seguridad.
*   **Contenerización**: **Docker & Docker Compose**. Todo el entorno (App, Base de Datos, Admin) está encapsulado en contenedores, garantizando que el despliegue sea idéntico en desarrollo y producción.

### Seguridad
*   **Autenticación**: Sistema propio basado en **JWT** y **Cookies seguras (httpOnly)**.
*   **Encriptación**: Uso de **Bcryptjs** para el hashing de contraseñas.
*   **Validación**: Middleware de servidor para proteger rutas administrativas y de usuario.

---

## 3. Integración de Inteligencia Artificial (IA)

El proyecto se distingue por el uso de IA no solo como herramienta de ayuda, sino como componente funcional del software:

### 3.1. OCR Cognitivo con Google Gemini (Visión Artificial)
En lugar de usar OCR tradicional (que suele fallar con fotos borrosas), integramos la API de **Google Gemini Vision**.
*   **Funcionamiento**: El sistema envía la imagen del DNI. La IA "ve" la imagen, entiende el contexto semántico y extrae los datos (Nombre, DNI, Fechas).
*   **Ventaja**: Capacidad de leer documentos inclinados o con mala iluminación mucho mejor que los algoritmos clásicos.

### 3.2. Generación de Vídeo Programática (Remotion)
Utilizamos **Remotion** para "programar" vídeos en lugar de editarlos.
*   Esto nos permite generar contenido audiovisual dinámico para redes sociales mediante código React, facilitando la actualización masiva de vídeos si cambia la imagen corporativa.

### 3.3. Ingeniería Asistida (Antigravity)
Todo el desarrollo ha sido supervisado por un agente de ingeniería avanzado (Antigravity), actuando como "Pair Programmer" para sugerir mejores prácticas, depurar errores complejos y optimizar la arquitectura.

---

## 4. Intervención Manual y Personalización (Humano vs IA)

Aunque la IA ha sido un motor clave, el **valor real del proyecto reside en las modificaciones manuales** que realizamos para convertir "código generado" en un "sistema profesional".

A continuación, detallamos ejemplos específicos donde la intervención humana fue crítica:

### Ejemplo 1: Limpieza de Datos y Expresiones Regulares (Regex)
*   **Lo que hizo la IA**: Sugirió la conexión básica con la API de Gemini para leer el DNI.
*   **Nuestra Modificación Manual**: La IA a veces devolvía texto "sucio" (ej: "Aquí tienes el JSON..."). Nosotros **programamos manualmente expresiones regulares (Regex)** complejas para interceptar la respuesta, limpiar cualquier carácter inválido y extraer quirúrgicamente el JSON puro. Sin esta lógica manual, el sistema fallaría en el 30% de los casos.

### Ejemplo 2: Seguridad en la Autenticación
*   **Lo que hizo la IA**: Proporcionó ejemplos estándar de login con usuario y contraseña.
*   **Nuestra Modificación Manual**: Reescribimos la lógica para implementar un sistema de **doble verificación (Biometría + Credenciales)** y forzamos el uso de cookies `httpOnly` manualmente para prevenir ataques XSS, algo que los ejemplos genéricos de IA solían omitir. También ajustamos los tiempos de expiración de sesión para cumplir con normativas de seguridad.

### Ejemplo 3: Lógica de Negocio en Votaciones
*   **Lo que hizo la IA**: Estructuró las tablas de base de datos básicas.
*   **Nuestra Modificación Manual**: Diseñamos y programamos a mano las restricciones de **integridad referencial** en `schema.prisma` y la lógica del backend para asegurar que un usuario solo pueda votar una vez, manejando condiciones de carrera (race conditions) que la IA no había previsto inicialmente.

### Ejemplo 4: Diseño y Experiencia de Usuario (UX)
*   **Lo que hizo la IA**: Generó estructuras HTML básicas para las páginas.
*   **Nuestra Modificación Manual**: Personalizamos manualmente cada animación CSS, las transiciones entre páginas y la respuesta "hion" (feedback táctil) en móviles para asegurar que la web se sienta "Premium" y alineada con la marca PCE, superando el aspecto genérico de las plantillas.

---

## 5. Conclusión
El proyecto PCE es un ejemplo de **Ingeniería de Software Moderna Aumentada**. No es un producto de "copiar y pegar" de ChatGPT, sino una arquitectura compleja donde la inteligencia humana ha dirigido y refinado la potencia bruta de la IA para crear un sistema robusto, seguro y escalable.
