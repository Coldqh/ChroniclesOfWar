# PATCH MODE — Insert New Crécy Map v0.1.10

Changed files:
- package.json
- src/app/version.ts
- src/assets/maps/crecy-1346-stage-advance.png

What changed:
- Replaced Crécy stage map underlay with the newly provided map.
- Resized/cropped map to exact game container size: 992x684.
- Kept the map without baked hex grid.
- The game should still render the clickable hex grid on top if v0.1.9 map layout system is applied.

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
git commit -m "Insert new Crecy map v0.1.10"
git push origin main
```
