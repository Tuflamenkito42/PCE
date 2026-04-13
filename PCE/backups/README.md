# Sistema de Backups Automáticos - PCE

## Estado Actual

✅ **El sistema de backups está configurado**

### Ubicación de backups
```
c:\Users\juehr\OneDrive\Documentos\GitHub\PCE\PCE\backups\
```

### Características
- **Automático cada hora** - Con tarea programada de Windows
- **Retención**: Últimos 7 días
- **Nombre**: `backup-YYYYMMDD-HHMMSS.sql`

## Uso Manual

### Hacer un backup manual
```powershell
& 'c:\Users\juehr\OneDrive\Documentos\GitHub\PCE\PCE\scripts\backup-db.ps1'
```

### Restaurar un backup específico
```bash
# En la carpeta del proyecto:
cd c:\Users\juehr\OneDrive\Documentos\GitHub\PCE\PCE

# Restaurar (reemplaza YYYYMMDD-HHMMSS con el timestamp del backup)
cat backups/backup-YYYYMMDD-HHMMSS.sql | docker compose exec -T db mysql -u root -proot
```

### Ver últimos backups
```powershell
ls c:\Users\juehr\OneDrive\Documentos\GitHub\PCE\PCE\backups | Sort-Object LastWriteTime -Descending | Select-Object Name, Length, LastWriteTime
```

## Configurar Tarea Programada (si se necesita reconfigurar)

Ejecuta como **Administrador**:
```powershell
powershell -Command "Start-Process powershell -Verb RunAs -ArgumentList \"-File 'c:\Users\juehr\OneDrive\Documentos\GitHub\PCE\PCE\scripts\setup-backup-scheduler.ps1'\""
```

## Verificar si la tarea está activa
```powershell
Get-ScheduledTask -TaskName "PCE-Database-Backup" | Select-Object TaskName, State
```

## Restauraciones Futuras

Si algo va mal con la BD:

1. **Parar la aplicación**
   ```bash
   docker compose stop
   ```

2. **Restaurar backup**
   ```bash
   cat backups/backup-YYYYMMDD-HHMMSS.sql | docker compose exec -T db mysql -u root -proot
   ```

3. **Reiniciar**
   ```bash
   docker compose up -d
   ```
