# PATCH MODE — Stable Docs Deploy

Этот патч чинит нормальную схему деплоя.

Что меняется:
- `vite.config.ts` теперь использует `base: "./"` — assets грузятся относительным путём, без риска сломаться на `/ChroniclesOfWar/`.
- Добавлен `scripts/build-docs.mjs` — пересобирает `docs` из `dist`.
- В `package.json` добавлен `npm run docs:build`.
- Добавлен GitHub Actions workflow `.github/workflows/build-docs.yml`.
- Workflow не деплоит через проблемный Pages artifact, а просто пересобирает папку `docs` в `main`.

Как применить:

```powershell
cd C:\ChroniclesOfWar
```

Распакуй архив в эту папку с заменой файлов.

Потом локально:

```powershell
npm install --no-audit --no-fund
npm run docs:build
git add .
git commit -m "Add stable docs deploy"
git push origin main
```

GitHub Pages должен быть:
- Source: Deploy from a branch
- Branch: main
- Folder: /docs

Если GitHub Actions красный из-за прав:
Repo -> Settings -> Actions -> General -> Workflow permissions -> Read and write permissions.
