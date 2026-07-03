PATCH MODE — Map Persistence + Overlay Fix + Theme-Matched Bottom Nav v0.1.7

Changed files:
- src/assets/maps/crecy-1346-stage-advance.png
- src/features/battle/HexMap.tsx
- src/app/ThemeModes.css
- src/app/version.ts

What changed:
- Replaced the Crécy map with the new hex-lined image.
- Map now stays visible for the whole Crécy battle instead of disappearing after the first stage.
- Added a dedicated background layer so move/attack/selection overlays render above the map.
- Updated the bottom navigation strip to match light and dark theme colors.
- Version bumped to v0.1.7 (Map Layer Fix).

Verify:
cd C:\ChroniclesOfWar
npm run build
npm run docs:build
