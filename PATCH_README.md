# PATCH MODE — No Actions Static Docs Deploy

Причина красного креста:
- `.github/workflows/build-docs.yml` запускает GitHub Actions.
- Workflow пересобирает `docs` и пушит обратно в `main`.
- Это создаёт лишние красные статусы, конфликты и diverged branch.

Рабочие проекты у пользователя устроены проще:
- `main`
- `index.html`
- относительные пути
- без Vite Pages artifact
- без auto-commit workflow

Для ChroniclesOfWar оставляем:
- Vite build локально
- `npm run docs:build`
- GitHub Pages: `main / docs`
- никаких Actions

Как применить:

```powershell
cd C:\ChroniclesOfWar
.\fix-static-docs-deploy.ps1
```

Если PowerShell блокирует запуск:

```powershell
powershell -ExecutionPolicy Bypass -File .\fix-static-docs-deploy.ps1
```

После этого:
- Settings -> Pages -> Deploy from branch -> main -> /docs
- Actions можно игнорировать: новых запусков быть не должно.
