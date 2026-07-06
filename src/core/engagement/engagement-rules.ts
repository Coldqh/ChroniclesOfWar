import type { BattleScenario, BattleState, Unit } from "../battle/battle-types";
import type { HexCoord } from "../hex/hex-types";
import { getNeighbors, hexKey, sameHex } from "../hex/hex-utils";

export function isActiveUnit(unit: Unit | undefined): unit is Unit {
  return Boolean(unit && unit.status !== "destroyed" && unit.status !== "routed");
}

export function getActiveUnits(state: BattleState): Unit[] {
  return Object.values(state.units).filter(isActiveUnit);
}

export function getAdjacentEnemyUnits(scenario: BattleScenario, state: BattleState, unit: Unit): Unit[] {
  if (!isActiveUnit(unit)) return [];

  const neighborKeys = new Set(
    getNeighbors(unit.position, scenario.map.width, scenario.map.height).map(hexKey),
  );

  return getActiveUnits(state).filter(
    (candidate) => candidate.sideId !== unit.sideId && neighborKeys.has(hexKey(candidate.position)),
  );
}

export function isUnitEngaged(scenario: BattleScenario, state: BattleState, unit: Unit): boolean {
  return getAdjacentEnemyUnits(scenario, state, unit).length > 0;
}

export function getControlledHexesForSide(scenario: BattleScenario, state: BattleState, sideId: string): HexCoord[] {
  const controlled = new Map<string, HexCoord>();

  for (const unit of getActiveUnits(state)) {
    if (unit.sideId !== sideId) continue;

    for (const coord of getNeighbors(unit.position, scenario.map.width, scenario.map.height)) {
      controlled.set(hexKey(coord), coord);
    }
  }

  return Array.from(controlled.values());
}

export function isHexControlledByEnemy(scenario: BattleScenario, state: BattleState, sideId: string, coord: HexCoord): boolean {
  return getActiveUnits(state).some((unit) => {
    if (unit.sideId === sideId) return false;
    return getNeighbors(unit.position, scenario.map.width, scenario.map.height).some((neighbor) => sameHex(neighbor, coord));
  });
}

export function getUnitAtCoord(state: BattleState, coord: HexCoord): Unit | undefined {
  return getActiveUnits(state).find((unit) => sameHex(unit.position, coord));
}
