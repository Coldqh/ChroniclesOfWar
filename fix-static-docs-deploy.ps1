# Chronicles of War — disable broken Actions deploy and publish docs manually
# Run from PowerShell inside C:\ChroniclesOfWar

$ErrorActionPreference = "Stop"

Write-Host "== Chronicles of War static docs deploy fix =="

Set-Location "C:\ChroniclesOfWar"

Write-Host "1) Abort possible unfinished rebase..."
git rebase --abort 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "No active rebase."
}

Write-Host "2) Remove broken GitHub Actions workflow..."
Remove-Item -Recurse -Force ".github" -ErrorAction SilentlyContinue

Write-Host "3) Rebuild docs locally..."
npm run docs:build

Write-Host "4) Stage all changes..."
git add -A

Write-Host "5) Commit changes if needed..."
git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host "Nothing new to commit."
} else {
  git commit -m "Use static docs deploy without Actions"
}

Write-Host "6) Push safely, replacing remote auto-docs commit if needed..."
git push --force-with-lease origin main

Write-Host ""
Write-Host "DONE."
Write-Host "GitHub Pages settings must be:"
Write-Host "Source: Deploy from a branch"
Write-Host "Branch: main"
Write-Host "Folder: /docs"
