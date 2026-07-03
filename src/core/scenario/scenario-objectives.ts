import type { BattleObjective, BattleScenario, BattleState } from "../battle/battle-types";
import {
  areUnitsInactive,
  countActiveUnitsByIds,
  getActiveUnitsBySide,
  hasEnemyUnitInZone,
  hasSideUnitInZone,
} from "./scenario-utils";

export type ObjectiveStatus = "active" | "completed" | "failed";

export type EvaluatedObjective = BattleObjective & {
  status: ObjectiveStatus;
};

export function getObjectiveStatuses(scenario: BattleScenario, state: BattleState, sideId: string): EvaluatedObjective[] {
  return (scenario.objectives ?? [])
    .filter((objective) => objective.sideId === sideId)
    .map((objective) => ({
      ...objective,
      status: evaluateObjective(scenario, state, objective),
    }));
}

function evaluateObjective(scenario: BattleScenario, state: BattleState, objective: BattleObjective): ObjectiveStatus {
  const condition = objective.condition;

  switch (condition.type) {
    case "hold_zone_until_turn": {
      if (hasEnemyUnitInZone(scenario, state, objective.sideId, condition.zoneId)) return "failed";
      return state.turn >= condition.turn ? "completed" : "active";
    }

    case "occupy_zone":
      return hasSideUnitInZone(scenario, state, objective.sideId, condition.zoneId) ? "completed" : "active";

    case "rout_units":
      return areUnitsInactive(state, condition.unitIds) ? "completed" : "active";

    case "keep_units_active":
      return countActiveUnitsByIds(state, condition.unitIds) >= condition.minimum ? "active" : "failed";

    case "keep_role_active": {
      const activeByRole = getActiveUnitsBySide(state, objective.sideId).filter((unit) => unit.type.role === condition.role);
      return activeByRole.length >= condition.minimum ? "active" : "failed";
    }
  }
}
