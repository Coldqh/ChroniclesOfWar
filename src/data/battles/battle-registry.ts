import type { BattleScenario } from "../../core/battle/battle-types";
import { crecy1346Scenario } from "./crecy-1346/crecy-1346.scenario";

export const battleRegistry: BattleScenario[] = [crecy1346Scenario];

export function getBattleScenario(id: string): BattleScenario | undefined {
  return battleRegistry.find((battle) => battle.id === id);
}
