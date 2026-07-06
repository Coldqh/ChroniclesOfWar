# PATCH MODE — Engagement + Zone of Control v0.1.14

Changed files:
- package.json
- src/app/version.ts
- src/core/engagement/engagement-rules.ts
- src/core/movement/movement-rules.ts
- src/core/battle/battle-engine.ts
- src/features/battle/HexMap.tsx
- src/features/battle/BattleTerrainDebug.css

What changed:
- Version bumped to v0.1.14.
- Added core engagement module.
- Active units control adjacent hexes.
- Destroyed/routed units do not engage or control hexes.
- Engaged units can only make a short disengage move.
- Normal movement can enter enemy control as an endpoint but cannot path through it.
- Movement block messages now distinguish engagement and enemy control.
- Terrain Debug highlights enemy-controlled hexes.
- Engaged units get a subtle token outline.
- Basic AI attacks adjacent enemies when engaged and does not try to walk away.

What was not changed:
- No deployment changes.
- No Pages / Actions / vite changes.
- No objectives.
- No cavalry charge.
- No combat damage formula changes.
- No new battles or images.

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
git commit -m "Add engagement and zone of control v0.1.14"
git push origin main
```
