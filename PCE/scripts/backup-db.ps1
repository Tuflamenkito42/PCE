# Script de backup automático de la base de datos PCE
# Se ejecuta cada hora y mantiene los últimos 7 días de backups

param(
    [string]$BackupDir = "$(Split-Path -Parent $PSScriptRoot)\backups",
    [int]$RetentionDays = 7
)

# Crear directorio de backups si no existe
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Directorio de backups creado: $BackupDir"
}

# Timestamp para el archivo
$BackupTimestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupFile = Join-Path $BackupDir "backup-$BackupTimestamp.sql"

# Ejecutar mysqldump
try {
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Iniciando backup de pce_db..."
    
    # Cambiar al directorio del proyecto
    $ProjectRoot = Split-Path -Parent $PSScriptRoot
    Push-Location $ProjectRoot
    
    # Ejecutar dump
    docker compose exec -T db mysqldump -u root -proot --databases pce_db | Out-File $BackupFile -Encoding UTF8
    
    if ($LASTEXITCODE -eq 0) {
        $FileSize = (Get-Item $BackupFile).Length / 1MB
        Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] ✓ Backup completado: $BackupFile ($([Math]::Round($FileSize, 2)) MB)"
    } else {
        Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] ✗ Error en mysqldump"
        exit 1
    }
    
    Pop-Location
} catch {
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] ✗ Error: $_"
    exit 1
}

# Limpiar backups antiguos
try {
    $OldDate = (Get-Date).AddDays(-$RetentionDays)
    $OldFiles = Get-ChildItem $BackupDir -Filter "backup-*.sql" | Where-Object { $_.LastWriteTime -lt $OldDate }
    
    if ($OldFiles) {
        foreach ($File in $OldFiles) {
            Remove-Item $File.FullName -Force
            Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Eliminado backup antiguo: $($File.Name)"
        }
    }
    
    # Mostrar backups disponibles
    $AllBackups = Get-ChildItem $BackupDir -Filter "backup-*.sql" | Sort-Object LastWriteTime -Descending
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Backups disponibles: $($AllBackups.Count)"
} catch {
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Advertencia al limpiar backups antiguos: $_"
}

Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Proceso completado."
