$ErrorActionPreference = "Stop"

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

  return $null
}

$mysql = Get-XamppMySqlPath

function Test-MySqlReady {
  if ($null -eq $mysql) {
    return $false
  }

  & $mysql.Admin --protocol=tcp --host=localhost --port=3306 --user=root --connect-timeout=2 ping *> $null
  return $LASTEXITCODE -eq 0
}

if (Test-MySqlReady) {
  exit 0
}

if ($null -eq $mysql) {
  Write-Warning "MySQL XAMPP tidak ditemukan di D:\xampp atau C:\xampp. Jalankan MySQL secara manual sebelum memakai fitur penyimpanan, atau set XAMPP_HOME ke folder XAMPP."
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
