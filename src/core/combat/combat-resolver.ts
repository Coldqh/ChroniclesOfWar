import type { BattleScenario, BattleState, Unit } from "../battle/battle-types";
import type { CombatResult } from "./combat-types";
import { getCombatPreview } from "./combat-preview";

export function resolveCombat(scenario: BattleScenario, state: BattleState, attacker: Unit, target: Unit): CombatResult {
  const preview = getCombatPreview(scenario, state, attacker, target);
  if (!preview.canAttack) {
    return {
      ...preview,
      actualDamage: 0,
      actualKills: 0,
      targetRouted: false,
      targetDestroyed: false,
      logText: preview.reason ?? "Атака невозможна.",
    };
  }

  const variance = 0.9 + Math.random() * 0.2;
  const actualDamage = Math.max(1, Math.round(preview.expectedDamage * variance));
  const targetHpAfter = Math.max(0, target.currentHp - actualDamage);
  const countAfter = Math.max(0, Math.ceil(targetHpAfter / target.type.hpPerSoldier));
  const actualKills = Math.max(0, target.currentCount - countAfter);
  const moraleDamage = Math.max(preview.moraleDamage, Math.round(actualKills * 0.9));
  const moraleAfter = Math.max(0, target.morale - moraleDamage);
  const targetDestroyed = countAfter <= 0 || targetHpAfter <= 0;
  const targetRouted = !targetDestroyed && moraleAfter <= 0;
  const statusText = targetDestroyed ? " Отряд уничтожен." : targetRouted ? " Отряд бежит." : "";

  return {
    ...preview,
    expectedDamage: preview.expectedDamage,
    expectedKills: preview.expectedKills,
    targetHpAfter,
    targetCountAfter: countAfter,
    actualDamage,
    actualKills,
    moraleDamage,
    targetRouted,
    targetDestroyed,
    logText: `${attacker.type.name} атакуют ${target.type.name}: урон ${actualDamage}, потери ${actualKills}, мораль -${moraleDamage}.${statusText}`,
  };
}
