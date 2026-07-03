import type { BattleScenario, BattleState, Unit } from "./battle-types";

export function createInitialBattleState(scenario: BattleScenario, playerSideId: string): BattleState {
  const units: Record<string, Unit> = {};

  for (const deployment of scenario.deployments) {
    const type = scenario.unitTypes.find((unitType) => unitType.id === deployment.unitTypeId);
    if (!type) {
      throw new Error(`Missing unit type: ${deployment.unitTypeId}`);
    }

    const commander = deployment.commanderId
      ? scenario.commanders.find((item) => item.id === deployment.commanderId)
      : undefined;

    units[deployment.id] = {
      id: deployment.id,
      sideId: deployment.sideId,
      type,
      position: deployment.position,
      commander,
      currentHp: type.maxCount * type.hpPerSoldier,
      currentCount: type.maxCount,
      morale: type.morale,
      status: "ready",
      hasMoved: false,
      hasAttacked: false,
    };
  }

  return {
    scenarioId: scenario.id,
    playerSideId,
    activeSideId: playerSideId,
    turn: 1,
    phase: "player_turn",
    currentStageId: scenario.stages[0]?.id ?? "main",
    selectedUnitId: null,
    units,
    firedEventIds: [],
    log: [
      {
        id: "start",
        turn: 1,
        text: "Битва началась. Выберите отряд и отдайте первый приказ.",
        tone: "history",
      },
    ],
    result: null,
  };
}
