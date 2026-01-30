# 🤝 Guía de Colaboración para el Equipo

Esta guía explica cómo configurar el proyecto para que todos los compañeros trabajéis con la misma configuración y sin errores de base de datos.

## 1. Preparación (Lo que haces tú)
Como ya tienes el proyecto funcionando, asegúrate de subir los cambios a GitHub pero **NUNCA** subas el archivo `.env`.

1. Revisa que el archivo `.env.example` esté actualizado (yo ya lo he hecho por ti).
2. Haz el `git push` de tus cambios en `schema.prisma` y otros archivos.

---

## 2. Configuración para el Compañero (Lo que hacen tus amigos)

Si un compañero quiere empezar, debe seguir estos pasos:

### Paso A: Clonar e Instalar
1. Clonar el repositorio de GitHub.
2. Abrir una terminal en la carpeta del proyecto.
3. Ejecutar: `npm install` (Esto instala Prisma y las herramientas de Nuxt).

### Paso B: El archivo .env (Vital)
El archivo `.env` no se descarga de GitHub por seguridad. Cada compañero debe crearlo:
1. Copiar el archivo `.env.example` y cambiarle el nombre a `.env`.
2. Asegurarse de que la línea `DATABASE_URL` sea:
   `DATABASE_URL="mysql://pce_user:pce_password@localhost:3306/pce_db"`

### Paso C: Arrancar con Docker
1. Asegurarse de tener **Docker Desktop** abierto.
2. Ejecutar: `docker-compose up --build -d`
3. Esperar a que termine. La web estará en `http://localhost:3000`.

### Paso D: Sincronizar Base de Datos
La primera vez, el compañero debe crear las tablas en su ordenador ejecutando:
```powershell
npm run db:push
```

---

## 💡 Consejos para trabajar juntos
* **Ramas (Branches)**: Es mejor que cada uno trabaje en una rama diferente (ej: `git checkout -b feature-perfil`) para no pisaros el código.
* **Pull frecuente**: Antes de empezar a programar, haced siempre un `git pull` para tener lo último que hayan subido los demás.
* **Docker es la clave**: Si a alguien le falla la base de datos, que haga `docker-compose down -v` y luego `docker-compose up` para resetearla.
