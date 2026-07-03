import type { BattleScenario, BattleState, BattleZone, Unit } from "../battle/battle-types";
import type { HexCoord } from "../hex/hex-types";
import { sameHex } from "../hex/hex-utils";

export function getScenarioZone(scenario: BattleScenario, zoneId: string): BattleZone | undefined {
  return scenario.zones?.find((zone) => zone.id === zoneId);
}

export function isCoordInZone(zone: BattleZone | undefined, coord: HexCoord): boolean {
  if (!zone) return false;

  const inArea = zone.area
    ? coord.q >= zone.area.qMin &&
      coord.q <= zone.area.qMax &&
      coord.r >= zone.area.rMin &&
      coord.r <= zone.area.rMax
    : false;

  const inCoords = zone.coords?.some((zoneCoord) => sameHex(zoneCoord, coord)) ?? false;

  return inArea || inCoords;
}

export function getActiveUnits(state: BattleState): Unit[] {
  return Object.values(state.units).filter((unit) => unit.status !== "destroyed" && unit.status !== "routed");
}

export function getActiveUnitsBySide(state: BattleState, sideId: string): Unit[] {
  return getActiveUnits(state).filter((unit) => unit.sideId === sideId);
}

export function getActiveUnitsInZone(scenario: BattleScenario, state: BattleState, zoneId: string, sideId?: string): Unit[] {
  const zone = getScenarioZone(scenario, zoneId);

  return getActiveUnits(state).filter((unit) => {
    if (sideId && unit.sideId !== sideId) return false;
    return isCoordInZone(zone, unit.position);
  });
}

export function hasSideUnitInZone(scenario: BattleScenario, state: BattleState, sideId: string, zoneId: string): boolean {
  return getActiveUnitsInZone(scenario, state, zoneId, sideId).length > 0;
}

export function hasEnemyUnitInZone(scenario: BattleScenario, state: BattleState, sideId: string, zoneId: string): boolean {
  return getActiveUnitsInZone(scenario, state, zoneId).some((unit) => unit.sideId !== sideId);
}

export function areUnitsInactive(state: BattleState, unitIds: string[]): boolean {
  return unitIds.every((unitId) => {
    const unit = state.units[unitId];
    return !unit || unit.status === "destroyed" || unit.status === "routed";
  });
}

export function countActiveUnitsByIds(state: BattleState, unitIds: string[]): number {
  return unitIds.filter((unitId) => {
    const unit = state.units[unitId];
    return unit && unit.status !== "destroyed" && unit.status !== "routed";
  }).length;
}
