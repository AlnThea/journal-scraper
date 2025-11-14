Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Journal Scraper - Complete Starter" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js Version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Node.js not found in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

# Check npx
try {
    $npxVersion = npx --version
    Write-Host "✅ npx Version: $npxVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: npx not found" -ForegroundColor Red
    Write-Host "Try: npm install -g npx" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

Write-Host ""

# Start CORS Server in NEW WINDOW
Write-Host "🚀 Starting CORS Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm start" -WindowStyle Normal

# Wait for server to start
Write-Host "⏳ Waiting for CORS server to start (5 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Web App in NEW WINDOW
Write-Host "🌐 Starting Web App..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\public'; npx http-server -p 8080" -WindowStyle Normal

Write-Host ""
Write-Host "✅ BOTH SERVERS STARTED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "📍 CORS Server: http://localhost:3000" -ForegroundColor Yellow
Write-Host "📍 Web App: http://127.0.0.1:8080" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "   1. Open browser to: http://127.0.0.1:8080" -ForegroundColor White
Write-Host "   2. Upload Excel file and start scraping!" -ForegroundColor White
Write-Host "   3. Keep both PowerShell windows open" -ForegroundColor White
Write-Host ""
Write-Host "⏹️  To stop: Close both PowerShell windows" -ForegroundColor Red
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Press any key to close this starter and open browser..." -ForegroundColor Magenta
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open browser automatically
Start-Process "http://127.0.0.1:8080"

Write-Host "Browser opened! You can close this window." -ForegroundColor Green