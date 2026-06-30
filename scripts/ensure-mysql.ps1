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

function Get-XamppMySqlPath {
  $xamppHomes = @(
    $env:XAMPP_HOME,
    "D:\xampp",
    "C:\xampp"
  ) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }

  foreach ($xamppHome in $xamppHomes) {
    $mysqlBin = Join-Path $xamppHome "mysql\bin"
    $mysqlExecutable = Join-Path $mysqlBin "mysqld.exe"
    $mysqlAdmin = Join-Path $mysqlBin "mysqladmin.exe"
    $mysqlConfig = Join-Path $mysqlBin "my.ini"

    if ((Test-Path -LiteralPath $mysqlExecutable) -and (Test-Path -LiteralPath $mysqlAdmin)) {
      return @{
        Executable = $mysqlExecutable
        Admin = $mysqlAdmin
        Config = $mysqlConfig
        Bin = $mysqlBin
        Home = $xamppHome
      }
    }
  }

  $mysqlExecutable = Resolve-Executable "mysqld.exe" @(
    "C:\xampp\mysql\bin\mysqld.exe",
    "D:\xampp\mysql\bin\mysqld.exe"
  )
  $mysqlAdmin = Resolve-Executable "mysqladmin.exe" @(
    "C:\xampp\mysql\bin\mysqladmin.exe",
    "D:\xampp\mysql\bin\mysqladmin.exe"
  )

  if ($mysqlExecutable -and $mysqlAdmin) {
    $mysqlBin = Split-Path -Parent $mysqlExecutable
    $mysqlConfig = Join-Path $mysqlBin "my.ini"

    return @{
      Executable = $mysqlExecutable
      Admin = $mysqlAdmin
      Config = $mysqlConfig
      Bin = $mysqlBin
      Home = Split-Path -Parent (Split-Path -Parent $mysqlBin)
    }
  }

  return $null
}

$mysql = Get-XamppMySqlPath

function Test-MySqlReady {
  if ($null -eq $mysql) {
    return $false
  }

  $previousErrorActionPreference = $ErrorActionPreference
  try {
    $ErrorActionPreference = "Continue"
    & $mysql.Admin --protocol=tcp --host=localhost --port=3306 --user=root --connect-timeout=2 ping *> $null
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

if ($null -eq $mysql) {
  Write-Warning "MySQL XAMPP tidak ditemukan. Jalankan MySQL secara manual sebelum memakai fitur penyimpanan, atau set XAMPP_HOME ke folder XAMPP."
  exit 0
}

Start-Process `
  -FilePath $mysql.Executable `
  -ArgumentList "--defaults-file=$($mysql.Config)", "--standalone" `
  -WorkingDirectory $mysql.Bin `
  -WindowStyle Hidden

for ($attempt = 0; $attempt -lt 20; $attempt++) {
  Start-Sleep -Milliseconds 500
  if (Test-MySqlReady) {
    Write-Host "MySQL XAMPP aktif di port 3306 dari $($mysql.Home)."
    exit 0
  }
}

Write-Warning "MySQL XAMPP belum siap menerima koneksi. Periksa $($mysql.Home)\mysql\data\mysql_error.log."
