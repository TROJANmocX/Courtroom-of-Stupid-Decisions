#!/usr/bin/env pwsh
# Start both backend and frontend dev servers

Write-Host "⚖️  Starting Courtroom of Stupid Decisions..." -ForegroundColor Yellow

# Start backend
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; uvicorn main:app --reload" -WindowStyle Normal

# Give backend a moment to start
Start-Sleep -Seconds 2

# Start frontend
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Backend:  http://localhost:8000" -ForegroundColor Green
Write-Host "✅ Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "✅ API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Don't forget to set your GEMINI_API_KEY in backend/.env" -ForegroundColor DarkYellow
