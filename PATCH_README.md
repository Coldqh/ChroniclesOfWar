# PATCH MODE — Crécy Stage Map + Theme Toggle v0.1.6

Changed files:
- package.json
- src/app/version.ts
- src/main.tsx
- src/app/App.tsx
- src/app/ThemeModes.css
- src/assets/maps/crecy-1346-stage-advance.png
- src/features/menu/MainMenu.tsx
- src/features/battle/BattleScreen.tsx
- src/features/battle/BattleHud.tsx
- src/features/battle/HexMap.tsx

Notes:
- The uploaded map is cropped/resized to 992x684 to match the current 12x9 hex map layout.
- The map appears only for Crécy stage `advance`.
- Hex tiles become transparent overlay cells on that stage.
- Theme toggle switches between manuscript and dark mode.

Apply into C:\ChroniclesOfWar, then run:

```powershell
cd C:\ChroniclesOfWar
npm run build
npm run docs:build
git add -A
git commit -m "Add Crecy stage map and theme toggle v0.1.6"
git push origin main
```
