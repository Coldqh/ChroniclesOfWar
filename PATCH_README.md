# PATCH MODE — Crecy Terrain Sync + Remove Objectives v0.1.11

Changed files:
- package.json
- src/app/version.ts
- src/data/battles/crecy-1346/crecy-1346.map.ts
- src/data/battles/crecy-1346/crecy-1346.scenario.ts
- src/data/battles/crecy-1346/crecy-1346.victory.ts
- src/core/battle/battle-types.ts
- src/core/battle/battle-state.ts
- src/core/battle/battle-engine.ts
- src/core/victory/victory-rules.ts
- src/features/battle/BattleScreen.tsx
- src/features/battle/BattleHud.tsx
- cleanup_v0111.ps1

Cleanup script deletes:
- src/features/battle/ScenarioObjectivesPanel.tsx
- src/features/battle/BattleScenarioGameplay.css
- src/core/scenario/scenario-objectives.ts
- src/core/scenario/scenario-utils.ts

Apply:
```powershell
cd C:\ChroniclesOfWar
powershell -ExecutionPolicy Bypass -File .\cleanup_v0111.ps1
npm run build
npm run docs:build
```

Commit:
```powershell
cd C:\ChroniclesOfWar
git add -A
git commit -m "Sync Crecy terrain and remove objectives v0.1.11"
git push origin main
```
