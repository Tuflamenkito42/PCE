# 🐳 Guía de Uso: Base de Datos Docker

Para solucionar los problemas de acceso y facilitar el trabajo en equipo, hemos creado un entorno de base de datos con Docker.

## 1. Requisitos Previos
*   Tener **Docker Desktop** instalado y abierto.

## 2. Iniciar la Base de Datos
Abre una terminal en la carpeta del proyecto y ejecuta:

```powershell
docker-compose up -d
```

*   Esto descargará MySQL, lo configurará y creará la base de datos automáticamente.
*   El parámetro `-d` lo deja corriendo en segundo plano ("detached").

## 3. Credenciales (Ya configuradas en `.env`)
*   **Host**: `localhost` (puerto 3306)
*   **Usuario**: `pce_web`
*   **Contraseña**: `pce_password`
*   **Base de datos**: `pce_db`

## 4. Comandos Útiles

**Ver si está corriendo:**
```powershell
docker ps
```

**Parar la base de datos:**
```powershell
docker-compose down
```

**Ver los logs (si algo falla):**
```powershell
docker-compose logs -f
```

## 5. Compartir Datos con el Equipo (Dump SQL)

Si quieres pasarle tus datos a un compañero o viceversa:

### Exportar Datos (El que tiene la info):
Ejecuta este comando en la terminal:
```powershell
docker exec pce_db /usr/bin/mysqldump -u root --password=root pce_db > dump.sql
```
O usa **phpMyAdmin** (`http://localhost:8080`), ve a **Exportar** y descarga el archivo.

### Importar Datos (El que la recibe):
Pon el archivo `dump.sql` en la carpeta raíz y ejecuta:
```powershell
docker exec -i pce_db /usr/bin/mysql -u root --password=root pce_db < dump.sql
```
O usa **phpMyAdmin** (`http://localhost:8080`), ve a **Importar** y sube el archivo.

---
**Nota para el equipo**: Con esto todos tendremos exactamente la misma base de datos, usuario y contraseña, sin importar si usamos Windows, Mac o Linux. 🚀
