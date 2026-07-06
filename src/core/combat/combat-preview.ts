import type { BattleScenario, BattleState, Unit } from "../battle/battle-types";
import type { CombatPreview } from "./combat-types";
import { hexDistance } from "../hex/hex-utils";
import {
  clampTerrainDefense,
  getRoleAttackModifier,
  getTerrainAtCoord,
  getTerrainAttackMultiplier,
} from "./terrain-combat";

function getNearbyCommanderBonus(state: BattleState, unit: Unit): number {
  const commanders = Object.values(state.units).filter(
    (candidate) => candidate.sideId === unit.sideId && candidate.commander && candidate.status !== "destroyed" && candidate.status !== "routed",
  );

  return commanders.some((candidate) => hexDistance(candidate.position, unit.position) <= (candidate.commander?.range ?? 0)) ? 1.1 : 1;
}

export function getCombatPreview(scenario: BattleScenario, state: BattleState, attacker: Unit, target: Unit): CombatPreview {
  const distance = hexDistance(attacker.position, target.position);
  const targetTerrain = getTerrainAtCoord(scenario, target.position);
  const terrainDefense = clampTerrainDefense(targetTerrain?.defenseBonus ?? 0);
  const roleAttackModifier = getRoleAttackModifier(targetTerrain, attacker.type.role);
  const roleAttackMultiplier = getTerrainAttackMultiplier(targetTerrain, attacker.type.role);
  const terrainName = targetTerrain?.name ?? "Неизвестно";

  if (attacker.sideId === target.sideId) {
    return blocked(attacker.id, target.id, target.currentHp, target.currentCount, distance, terrainName, terrainDefense, roleAttackModifier, roleAttackMultiplier, "Нельзя атаковать союзника.");
  }

  if (attacker.hasAttacked) {
    return blocked(attacker.id, target.id, target.currentHp, target.currentCount, distance, terrainName, terrainDefense, roleAttackModifier, roleAttackMultiplier, "Этот отряд уже атаковал.");
  }

  if (attacker.status === "destroyed" || attacker.status === "routed" || attacker.status === "skipping") {
    return blocked(attacker.id, target.id, target.currentHp, target.currentCount, distance, terrainName, terrainDefense, roleAttackModifier, roleAttackMultiplier, "Отряд не может атаковать.");
  }

  if (target.status === "destroyed" || target.status === "routed") {
    return blocked(attacker.id, target.id, target.currentHp, target.currentCount, distance, terrainName, terrainDefense, roleAttackModifier, roleAttackMultiplier, "Цель уже выведена из боя.");
  }

  if (distance > attacker.type.range) {
    return blocked(attacker.id, target.id, target.currentHp, target.currentCount, distance, terrainName, terrainDefense, roleAttackModifier, roleAttackMultiplier, "Цель вне дальности.");
  }

  const strengthRatio = Math.max(0.25, attacker.currentCount / attacker.type.maxCount);
  const moraleRatio = Math.max(0.45, attacker.morale / attacker.type.morale);
  const commanderBonus = getNearbyCommanderBonus(state, attacker);
  const baseDamage = attacker.type.attack * strengthRatio * moraleRatio * commanderBonus * roleAttackMultiplier;
  const mitigatedDamage = Math.max(1, Math.round(baseDamage * (1 - terrainDefense)));
  const expectedKills = Math.min(target.currentCount, Math.floor(mitigatedDamage / target.type.hpPerSoldier));
  const moraleDamage = Math.max(4, Math.round(expectedKills * 0.8 + attacker.type.attack * 0.12));
  const targetHpAfter = Math.max(0, target.currentHp - mitigatedDamage);
  const targetCountAfter = Math.max(0, Math.ceil(targetHpAfter / target.type.hpPerSoldier));

  return {
    attackerId: attacker.id,
    targetId: target.id,
    expectedDamage: mitigatedDamage,
    expectedKills,
    moraleDamage,
    targetHpAfter,
    targetCountAfter,
    canAttack: true,
    distance,
    terrainName,
    terrainDefenseModifier: terrainDefense,
    roleAttackModifier,
    roleAttackMultiplier,
  };
}

function blocked(
  attackerId: string,
  targetId: string,
  targetHp: number,
  targetCount: number,
  distance: number,
  terrainName: string,
  terrainDefenseModifier: number,
  roleAttackModifier: number,
  roleAttackMultiplier: number,
  reason: string,
): CombatPreview {
  return {
    attackerId,
    targetId,
    expectedDamage: 0,
    expectedKills: 0,
    moraleDamage: 0,
    targetHpAfter: targetHp,
    targetCountAfter: targetCount,
    canAttack: false,
    distance,
    terrainName,
    terrainDefenseModifier,
    roleAttackModifier,
    roleAttackMultiplier,
    reason,
  };
}
