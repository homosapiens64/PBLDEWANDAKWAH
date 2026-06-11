$ErrorActionPreference = "Stop"

$mysqlExecutable = "C:\xampp\mysql\bin\mysqld.exe"
$mysqlConfig = "C:\xampp\mysql\bin\my.ini"

$listening = Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue
if ($listening) {
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
  if (Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue) {
    Write-Host "MySQL XAMPP aktif di port 3306."
    exit 0
  }
}

Write-Warning "MySQL XAMPP belum siap. Periksa C:\xampp\mysql\data\mysql_error.log."
