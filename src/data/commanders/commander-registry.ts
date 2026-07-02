import type { CommanderData } from "../../core/battle/battle-types";

export const hundredYearsWarCommanders: CommanderData[] = [
  {
    id: "edward-iii",
    name: "Эдуард III",
    sideId: "england",
    rarity: "legendary",
    passiveLabel: "Королевское знамя: союзники рядом держат мораль.",
    moraleAura: 8,
    attackAura: 4,
    range: 3,
    attachedUnitId: "eng-men-at-arms-1",
  },
  {
    id: "black-prince",
    name: "Чёрный принц",
    sideId: "england",
    rarity: "legendary",
    passiveLabel: "Юный командир: элитный отряд бьётся стабильнее.",
    moraleAura: 6,
    attackAura: 6,
    range: 2,
    attachedUnitId: "eng-men-at-arms-2",
  },
  {
    id: "philip-vi",
    name: "Филипп VI",
    sideId: "france",
    rarity: "legendary",
    passiveLabel: "Королевский натиск: рыцари рядом атакуют сильнее.",
    moraleAura: 5,
    attackAura: 8,
    range: 3,
    attachedUnitId: "fra-knights-1",
  },
];
