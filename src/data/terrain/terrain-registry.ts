import type { TerrainData } from "../../core/battle/battle-types";

export const medievalTerrain: TerrainData[] = [
  {
    id: "plain",
    name: "Поле",
    moveCost: 1,
    defenseBonus: 0,
  },
  {
    id: "hill",
    name: "Склон",
    moveCost: 2,
    defenseBonus: 0.15,
    roleAttackModifiers: {
      cavalry: -0.1,
    },
  },
  {
    id: "mud",
    name: "Грязь",
    moveCost: 2,
    defenseBonus: 0.05,
    roleAttackModifiers: {
      cavalry: -0.25,
      infantry: -0.05,
    },
  },
  {
    id: "forest",
    name: "Лес",
    moveCost: 2,
    defenseBonus: 0.18,
    roleAttackModifiers: {
      cavalry: -0.25,
      archer: -0.05,
      crossbow: -0.05,
    },
  },
  {
    id: "road",
    name: "Дорога",
    moveCost: 1,
    defenseBonus: -0.05,
    roleAttackModifiers: {
      cavalry: 0.05,
      infantry: 0.05,
    },
  },
];
