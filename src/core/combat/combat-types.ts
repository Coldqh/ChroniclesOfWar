import type { UnitId } from "../../types/ids";

export type CombatPreview = {
  attackerId: UnitId;
  targetId: UnitId;
  expectedDamage: number;
  expectedKills: number;
  moraleDamage: number;
  targetHpAfter: number;
  targetCountAfter: number;
  canAttack: boolean;
  reason?: string;
};

export type CombatResult = CombatPreview & {
  actualDamage: number;
  actualKills: number;
  targetRouted: boolean;
  targetDestroyed: boolean;
  logText: string;
};
