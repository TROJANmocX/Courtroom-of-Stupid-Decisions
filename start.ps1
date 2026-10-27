#!/usr/bin/env pwsh
# Start both backend and frontend dev servers

Write-Host "⚖️  Starting Courtroom of Stupid Decisions..." -ForegroundColor Yellow

$shell = if (Get-Command pwsh -ErrorAction SilentlyContinue) { "pwsh" } else { "powershell" }

# Start backend
Start-Process $shell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; python -m uvicorn main:app --reload" -WindowStyle Normal

# Give backend a moment to start
Start-Sleep -Seconds 2

# Start frontend
Start-Process $shell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Backend:  http://localhost:8000" -ForegroundColor Green
Write-Host "✅ Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "✅ API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Don't forget to set your GEMINI_API_KEY in backend/.env" -ForegroundColor DarkYellow
