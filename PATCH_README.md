# PATCH MODE — Battle Readability + Control UX

Replace files in `C:\ChroniclesOfWar` with files from this archive.

Changed:
- src/features/battle/BattleScreen.tsx
- src/features/battle/HexMap.tsx
- src/features/battle/BattleHud.tsx
- src/features/battle/UnitPanel.tsx
- src/features/battle/CombatPreviewPanel.tsx
- src/features/battle/BattleReadability.css

After replacing:
```powershell
cd C:\ChroniclesOfWar
npm run build
npm run docs:build

git add .
git commit -m "Improve battle readability and control UX"
git push origin main
```

Do not change Pages settings.
