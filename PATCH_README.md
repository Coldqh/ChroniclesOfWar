# PATCH MODE — Exact Game Grid Map v0.1.9

Главная правка:
- больше не используем AI-карту с запечённой гекс-сеткой;
- карта — нижний слой без гексов;
- гексы рисует сама игра по тем же координатам, по которым работают клики, юниты, движение и атака.

Changed files:
- package.json
- src/app/version.ts
- src/core/map/map-layout-types.ts
- src/data/maps/battle-map-layouts.ts
- src/data/maps/MAP_LAYOUT_GUIDE.md
- src/features/battle/HexMap.tsx
- src/app/ThemeModes.css
- src/assets/maps/crecy-1346-stage-advance.png

Verify:
```powershell
cd C:\ChroniclesOfWar
npm run build
npm run docs:build
```

Commit:
```powershell
cd C:\ChroniclesOfWar
git add -A
git commit -m "Use exact game grid map v0.1.9"
git push origin main
```
