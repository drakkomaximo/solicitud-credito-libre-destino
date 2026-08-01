$ErrorActionPreference = "Stop"
$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

Write-Host "== Levantando entorno de desarrollo =="

function Test-DockerRunning {
    $null = docker info 2>&1
    return $LASTEXITCODE -eq 0
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker no está en el PATH. Instalá Docker Desktop para continuar."
}

if (-not (Test-DockerRunning)) {
    Write-Host "Docker Desktop no está corriendo. Intentando abrirlo..."

    $dockerPaths = @(
        "C:\Program Files\Docker\Docker\Docker Desktop.exe",
        "C:\Program Files\Docker\Docker\DockerDesktop.exe",
        "$env:LOCALAPPDATA\Docker\Docker\Docker Desktop.exe",
        "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
    )

    $started = $false
    foreach ($path in $dockerPaths) {
        if (Test-Path $path) {
            Start-Process $path
            $started = $true
            break
        }
    }

    if (-not $started) {
        throw "No se encontró Docker Desktop. Abrilo manualmente y volvé a ejecutar el script."
    }

    $retries = 0
    while ((-not (Test-DockerRunning)) -and $retries -lt 45) {
        Start-Sleep -Seconds 2
        $retries++
        Write-Host "  esperando que Docker Desktop esté listo... ($retries)"
    }

    if (-not (Test-DockerRunning)) {
        throw "Docker Desktop no inició a tiempo. Abrilo manualmente y volvé a ejecutar el script."
    }

    Write-Host "Docker Desktop listo."
}

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
