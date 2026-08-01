$ErrorActionPreference = "Stop"
$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

Write-Host "== Deteniendo entorno de desarrollo =="
$pidFile = Join-Path $projectRoot '.start-dev.pid'
if (Test-Path $pidFile) {
    $pids = Get-Content $pidFile | ForEach-Object { $_.Trim() } | Where-Object { $_ }
    foreach ($p in $pids) {
        try {
            taskkill /PID $p /T /F 2>$null
            Write-Host "Proceso $p finalizado."
        } catch {}
    }
    Remove-Item $pidFile
} else {
    Write-Host "No se encontró archivo de PID; si la ventana sigue abierta, ciérrala manualmente."
}

Set-Location $projectRoot
docker compose down
Write-Host "Contenedores detenidos."
