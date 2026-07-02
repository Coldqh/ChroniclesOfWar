import type { Unit, UnitStatus } from "../battle/battle-types";

export function getMoraleStatus(unit: Unit): UnitStatus {
  if (unit.currentCount <= 0 || unit.currentHp <= 0) return "destroyed";
  if (unit.morale <= 0) return "routed";
  if (unit.morale < 18) return "skipping";
  if (unit.morale < 35) return "shaken";
  return "ready";
}

export function recoverMorale(unit: Unit): number {
  if (unit.status === "destroyed" || unit.status === "routed") return unit.morale;
  const commanderBoost = unit.commander ? 6 : 3;
  return Math.min(unit.type.morale, unit.morale + commanderBoost);
}
