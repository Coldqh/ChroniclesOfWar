# Map Layout Guide

Новая карта добавляется через `src/data/maps/battle-map-layouts.ts`.

Минимальный объект:

```ts
{
  id: "my-battle-map",
  scenarioId: "my-battle",
  mode: "image-underlay",
  backgroundClassName: "map-bg-my-battle",
  showTerrainFill: false,
  showHexLabels: false,
  metrics: {
    width: 72,
    height: 82,
    xStep: 72,
    yStep: 61.5,
    paddingX: 28,
    paddingY: 24,
  },
}
```

CSS:

```css
.hex-map-background-layer.map-bg-my-battle {
  background-image: url("../assets/maps/my-battle.png");
}
```

Правило:
- если карта уже содержит нарисованные гексы — `mode: "image-underlay"`, `showTerrainFill: false`;
- если карты нет — `mode: "terrain-tiles"`, `showTerrainFill: true`;
- подгонка новой карты делается только через `metrics`, не через `HexMap.tsx`.

Калибровка:
- `width / height` — размер hitbox-гекса;
- `xStep / yStep` — шаг между гексами;
- `paddingX / paddingY` — сдвиг всей логической сетки поверх изображения.
