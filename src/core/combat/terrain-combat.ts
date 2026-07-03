import type { BattleScenario, TerrainData, UnitRole } from "../battle/battle-types";
import type { HexCoord } from "../hex/hex-types";

export function getTerrainAtCoord(scenario: BattleScenario, coord: HexCoord): TerrainData | undefined {
  const terrainTile = scenario.map.tiles.find((tile) => tile.coord.q === coord.q && tile.coord.r === coord.r);
  return scenario.terrain.find((terrain) => terrain.id === terrainTile?.terrainId);
}

export function clampTerrainDefense(value: number): number {
  return Math.max(-0.5, Math.min(0.75, value));
}

export function clampRoleAttackModifier(value: number): number {
  return Math.max(-0.5, Math.min(0.5, value));
}

export function getRoleAttackModifier(terrain: TerrainData | undefined, role: UnitRole): number {
  return clampRoleAttackModifier(terrain?.roleAttackModifiers?.[role] ?? 0);
}

export function getTerrainAttackMultiplier(terrain: TerrainData | undefined, role: UnitRole): number {
  return Math.max(0.25, 1 + getRoleAttackModifier(terrain, role));
}

export function formatSignedPercent(value: number): string {
  const rounded = Math.round(value * 100);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}
