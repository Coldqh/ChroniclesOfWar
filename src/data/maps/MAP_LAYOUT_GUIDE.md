# Map Layout Guide

Правильная схема для будущих карт:

## Лучший вариант

1. Генерируй карту **без гексов**.
2. Вставляй её как `image-underlay`.
3. Игровая сетка рисуется поверх картой `HexMap`.
4. Поэтому:
   - линии гексов совпадают с кликом;
   - подсветка движения совпадает с клеткой;
   - атака совпадает с клеткой;
   - юниты стоят в центре клеток.

## Почему не надо запекать гексы в AI-картинку

AI не рисует гексы точно по нашим координатам.
Даже если картинка выглядит красиво, её сетка почти всегда будет иметь:
- другой шаг;
- другой offset;
- перспективные искажения;
- лишние/обрезанные гексы.

Итог: клики и юниты не совпадают с нарисованной сеткой.

## Как добавить новую карту

Файл:

```ts
src/data/maps/battle-map-layouts.ts
```

Пример:

```ts
{
  id: "my-battle-game-grid-map",
  scenarioId: "my-battle",
  mode: "image-underlay",
  backgroundClassName: "map-bg-my-battle",
  showTerrainFill: false,
  showHexLabels: false,
  showGridLines: true,
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

## Что крутить при подгонке

- юниты левее/правее центра — `paddingX`;
- юниты выше/ниже центра — `paddingY`;
- сетка сжимается/растягивается по ширине — `xStep`;
- сетка сжимается/растягивается по высоте — `yStep`;
- форма гекса не подходит — `width / height`.

Главное: гексы рисует игра, а не картинка.
