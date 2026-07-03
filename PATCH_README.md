# PATCH MODE — Hex Grid + Human Strategy Menu

Replace these files in `C:\ChroniclesOfWar`:

- `src/features/battle/HexMap.tsx`
- `src/features/menu/MainMenu.tsx`
- `src/app/App.css`

Then run:

```powershell
cd C:\ChroniclesOfWar
npm run build

Remove-Item -Recurse -Force docs -ErrorAction SilentlyContinue
New-Item -ItemType Directory docs
Copy-Item -Recurse dist\* docs\
New-Item docs\.nojekyll -ItemType File -Force

git add .
git commit -m "Fix hex grid and redesign main menu"
git push origin main
```

GitHub Pages settings should stay:

- Source: Deploy from a branch
- Branch: main
- Folder: /docs
