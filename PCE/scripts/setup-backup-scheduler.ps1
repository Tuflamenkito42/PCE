# Script para configurar tareas programadas de backup automático
# Este script debe ejecutarse como Administrador

param(
    [string]$TaskName = "PCE-Database-Backup",
    [string]$TaskDescription = "Backup automático de la base de datos PCE cada hora",
    [int]$IntervalHours = 1
)

# Verificar si se ejecuta como administrador
$IsAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $IsAdmin) {
    Write-Host "Este script debe ejecutarse como Administrador"
    Write-Host "Ejecutando como administrador..."
    Start-Process PowerShell -Verb RunAs -ArgumentList "-File `"$PSCommandPath`""
    exit
}

$ScriptPath = Join-Path (Split-Path -Parent $PSScriptRoot) "scripts\backup-db.ps1"

if (-not (Test-Path $ScriptPath)) {
    Write-Host "Error: No se encontró el script de backup en $ScriptPath"
    exit 1
}

# Crear trigger (cada hora)
$Trigger = New-ScheduledTaskTrigger -RepetitionInterval (New-TimeSpan -Hours $IntervalHours) -At 00:00 -Daily

# Crear acción
$Argument = "-NoProfile -WindowStyle Hidden -File `"$ScriptPath`""
$Action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $Argument

# Configuración
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# Eliminar tarea anterior si existe
$ExistingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($ExistingTask) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "Tarea anterior eliminada"
}

# Crear nueva tarea
Register-ScheduledTask -TaskName $TaskName -Trigger $Trigger -Action $Action -Settings $Settings -Description $TaskDescription -RunLevel Highest -Force | Out-Null

Write-Host "Tarea programada creada: $TaskName"
Write-Host "Intervalo: Cada $IntervalHours hora(s)"
Write-Host "Script: $ScriptPath"

# Ejecutar inmediatamente para verificar
Write-Host ""
Write-Host "Ejecutando backup de prueba..."
& $ScriptPath
