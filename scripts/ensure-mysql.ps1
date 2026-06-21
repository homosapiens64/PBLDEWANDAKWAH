$ErrorActionPreference = "Stop"

$mysqlExecutable = "C:\xampp\mysql\bin\mysqld.exe"
$mysqlAdmin = "C:\xampp\mysql\bin\mysqladmin.exe"
$mysqlConfig = "C:\xampp\mysql\bin\my.ini"

function Test-MySqlReady {
  if (-not (Test-Path -LiteralPath $mysqlAdmin)) {
    return $false
  }

  & $mysqlAdmin --protocol=tcp --host=localhost --port=3306 --user=root --connect-timeout=2 ping *> $null
  return $LASTEXITCODE -eq 0
}

if (Test-MySqlReady) {
  exit 0
}

if (-not (Test-Path -LiteralPath $mysqlExecutable)) {
  Write-Warning "MySQL XAMPP tidak ditemukan. Jalankan MySQL secara manual sebelum memakai fitur penyimpanan."
  exit 0
}

Start-Process `
  -FilePath $mysqlExecutable `
  -ArgumentList "--defaults-file=$mysqlConfig", "--standalone" `
  -WorkingDirectory (Split-Path -Parent $mysqlExecutable) `
  -WindowStyle Hidden

for ($attempt = 0; $attempt -lt 20; $attempt++) {
  Start-Sleep -Milliseconds 500
  if (Test-MySqlReady) {
    Write-Host "MySQL XAMPP aktif di port 3306."
    exit 0
  }
}

Write-Warning "MySQL XAMPP belum siap menerima koneksi. Periksa C:\xampp\mysql\data\mysql_error.log."
