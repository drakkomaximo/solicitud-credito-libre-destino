$ErrorActionPreference = "Stop"
$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

Write-Host "== Levantando entorno de desarrollo =="

Set-Location $projectRoot
docker compose up -d postgres

Write-Host "Esperando que PostgreSQL esté saludable..."
$retries = 0
$healthy = $false
do {
    Start-Sleep -Seconds 2
    $retries++
    try {
        $status = docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}starting{{end}}' credi-digital-postgres 2>$null
        if ($status -eq 'healthy') {
            $healthy = $true
        } else {
            Write-Host "  estado: $status"
        }
    } catch {}
} while (-not $healthy -and $retries -lt 30)

if (-not $healthy) {
    throw "PostgreSQL no se levantó a tiempo"
}
Write-Host "PostgreSQL listo."

Write-Host "Aplicando migraciones y generando cliente Prisma..."
Set-Location (Join-Path $projectRoot 'backend')
bunx prisma migrate deploy
bunx prisma generate

Write-Host "Iniciando backend..."
$parentPid = (Get-CimInstance Win32_Process -Filter "ProcessId=$PID" | Select-Object -ExpandProperty ParentProcessId)
$pidFile = Join-Path $projectRoot '.start-dev.pid'
@($PID, $parentPid) | Out-File $pidFile -Encoding utf8
bun run start:dev
