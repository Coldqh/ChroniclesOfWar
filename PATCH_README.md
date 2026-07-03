# PATCH MODE — Manuscript Campaign UI v0.1.4

Changed files:
- package.json
- src/app/version.ts
- src/main.tsx
- src/app/ManuscriptTheme.css
- src/features/menu/MainMenu.tsx
- src/features/battle-select/BattleSelectScreen.tsx
- src/features/side-select/SideSelectScreen.tsx

Note:
- `src/app/BlackTheme.css` is not imported anymore.
- You can delete it later if you want, but this patch only replaces/adds files.

Apply into C:\ChroniclesOfWar, then run:

```powershell
cd C:\ChroniclesOfWar
npm run build
npm run docs:build
git add -A
git commit -m "Add manuscript campaign UI v0.1.4"
git push origin main
```
