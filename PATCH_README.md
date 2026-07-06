# PATCH MODE — Crecy Deployment + Terrain Debug v0.1.12

Changed files:
- package.json
- src/app/version.ts
- src/data/battles/crecy-1346/crecy-1346.deployments.ts
- src/features/battle/BattleScreen.tsx
- src/features/battle/HexMap.tsx
- src/features/battle/BattleTerrainDebug.css

What changed:
- Version bumped to v0.1.12.
- Added compact Terrain Debug ON/OFF button in the battle side panel.
- Terrain Debug shows P/H/M/R/F letters on map hexes.
- Debug labels render above map/grid and below unit tokens.
- French units moved off muddy starting tiles.
- English units remain on northern high ground.
- No objectives were re-added.
- No combat formulas were changed.
- No deployment / Pages / Actions / vite changes.

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
git commit -m "Sync Crecy deployment and add terrain debug v0.1.12"
git push origin main
```
