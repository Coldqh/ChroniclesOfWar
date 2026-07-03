import type { BattleScenario, BattleState, Unit } from "../battle/battle-types";
import type { CombatPreview } from "./combat-types";
import { hexDistance } from "../hex/hex-utils";

function getNearbyCommanderBonus(state: BattleState, unit: Unit): number {
  const commanders = Object.values(state.units).filter(
    (candidate) => candidate.sideId === unit.sideId && candidate.commander && candidate.status !== "destroyed" && candidate.status !== "routed",
  );

  return commanders.some((candidate) => hexDistance(candidate.position, unit.position) <= (candidate.commander?.range ?? 0)) ? 1.1 : 1;
}

function clampTerrainDefense(value: number): number {
  return Math.max(-0.5, Math.min(0.75, value));
}

export function getCombatPreview(scenario: BattleScenario, state: BattleState, attacker: Unit, target: Unit): CombatPreview {
  if (attacker.sideId === target.sideId) {
    return blocked(attacker.id, target.id, attacker.currentHp, target.currentCount, "Нельзя атаковать союзника.");
  }

  if (attacker.hasAttacked) {
    return blocked(attacker.id, target.id, target.currentHp, target.currentCount, "Отряд уже атаковал.");
  }

  if (attacker.status === "destroyed" || attacker.status === "routed" || attacker.status === "skipping") {
    return blocked(attacker.id, target.id, target.currentHp, target.currentCount, "Отряд не может атаковать.");
  }

  if (target.status === "destroyed" || target.status === "routed") {
    return blocked(attacker.id, target.id, target.currentHp, target.currentCount, "Цель уже выведена из боя.");
  }

  const distance = hexDistance(attacker.position, target.position);
  if (distance > attacker.type.range) {
    return blocked(attacker.id, target.id, target.currentHp, target.currentCount, "Цель вне дальности.");
  }

  const terrainTile = scenario.map.tiles.find((tile) => tile.coord.q === target.position.q && tile.coord.r === target.position.r);
  const terrain = scenario.terrain.find((item) => item.id === terrainTile?.terrainId);
  const terrainDefense = clampTerrainDefense(terrain?.defenseBonus ?? 0);

  const strengthRatio = Math.max(0.25, attacker.currentCount / attacker.type.maxCount);
  const moraleRatio = Math.max(0.45, attacker.morale / attacker.type.morale);
  const commanderBonus = getNearbyCommanderBonus(state, attacker);
  const baseDamage = attacker.type.attack * strengthRatio * moraleRatio * commanderBonus;
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
  };
}

function blocked(attackerId: string, targetId: string, targetHp: number, targetCount: number, reason: string): CombatPreview {
  return {
    attackerId,
    targetId,
    expectedDamage: 0,
    expectedKills: 0,
    moraleDamage: 0,
    targetHpAfter: targetHp,
    targetCountAfter: targetCount,
    canAttack: false,
    reason,
  };
}
