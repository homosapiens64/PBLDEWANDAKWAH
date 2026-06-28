$ErrorActionPreference = "Stop"

function Resolve-Executable {
  param(
    [string]$Name,
    [string[]]$Fallbacks
  )

  $fromPath = Get-Command $Name -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($fromPath) {
    return $fromPath.Source
  }

  foreach ($fallback in $Fallbacks) {
    if (Test-Path -LiteralPath $fallback) {
      return $fallback
    }
  }

  return $null
}

$mysqlExecutable = Resolve-Executable "mysqld.exe" @(
  "C:\xampp\mysql\bin\mysqld.exe",
  "D:\xampp\mysql\bin\mysqld.exe"
)
$mysqlAdmin = Resolve-Executable "mysqladmin.exe" @(
  "C:\xampp\mysql\bin\mysqladmin.exe",
  "D:\xampp\mysql\bin\mysqladmin.exe"
)
$mysqlBin = if ($mysqlExecutable) { Split-Path -Parent $mysqlExecutable } else { $null }
$mysqlConfig = if ($mysqlBin) { Join-Path $mysqlBin "my.ini" } else { $null }

function Test-MySqlReady {
  if (-not (Test-Path -LiteralPath $mysqlAdmin)) {
    return $false
  }

  $previousErrorActionPreference = $ErrorActionPreference
  try {
    $ErrorActionPreference = "Continue"
    & $mysqlAdmin --protocol=tcp --host=localhost --port=3306 --user=root --connect-timeout=2 ping *> $null
    $exitCode = $LASTEXITCODE
    $ErrorActionPreference = $previousErrorActionPreference
    return $exitCode -eq 0
  } catch {
    $ErrorActionPreference = $previousErrorActionPreference
    return $false
  }
}

if (Test-MySqlReady) {
  exit 0
}

if (-not $mysqlExecutable -or -not (Test-Path -LiteralPath $mysqlExecutable)) {
  Write-Warning "MySQL XAMPP tidak ditemukan. Jalankan MySQL secara manual sebelum memakai fitur penyimpanan."
  exit 0
}

Start-Process `
  -FilePath $mysqlExecutable `
  -ArgumentList "--defaults-file=$mysqlConfig", "--standalone" `
  -WorkingDirectory $mysqlBin `
  -WindowStyle Hidden

for ($attempt = 0; $attempt -lt 20; $attempt++) {
  Start-Sleep -Milliseconds 500
  if (Test-MySqlReady) {
    Write-Host "MySQL XAMPP aktif di port 3306."
    exit 0
  }
}

Write-Warning "MySQL XAMPP belum siap menerima koneksi. Periksa C:\xampp\mysql\data\mysql_error.log."
