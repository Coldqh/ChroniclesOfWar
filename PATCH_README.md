# PATCH MODE — Map Layout System v0.1.8

Goal:
Make map fitting reusable for future maps.

Changed files:
- package.json
- src/app/version.ts
- src/core/map/map-layout-types.ts
- src/data/maps/battle-map-layouts.ts
- src/data/maps/MAP_LAYOUT_GUIDE.md
- src/data/battles/crecy-1346/crecy-1346.map.ts
- src/features/battle/HexMap.tsx
- src/app/ThemeModes.css
- src/assets/maps/crecy-1346-stage-advance.png

What changed:
- Added map layout registry.
- HexMap no longer hardcodes all visual hex metrics.
- Each battle can define its own map metrics and background class.
- Crécy map no longer disappears after stage change.
- When using an image-underlay map, visible terrain fills and old grid lines are hidden.
- Movement / attack / selection overlays stay above the map.
- Crécy terrain data is synced to the intended 12x9 terrain matrix.
- Bottom nav follows light/dark theme.

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
git commit -m "Add reusable map layout system v0.1.8"
git push origin main
```
