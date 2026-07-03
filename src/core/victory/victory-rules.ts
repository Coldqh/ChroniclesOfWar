import type { BattleScenario, BattleState, BattleResult, VictoryCondition } from "../battle/battle-types";
import {
  areUnitsInactive,
  getActiveUnitsBySide,
  hasEnemyUnitInZone,
  hasSideUnitInZone,
} from "../scenario/scenario-utils";

export function getAliveUnitsBySide(state: BattleState, sideId: string) {
  return getActiveUnitsBySide(state, sideId);
}

export function checkVictory(scenario: BattleScenario, state: BattleState): BattleResult | null {
  const aliveBySide = scenario.sides.map((side) => ({ side, alive: getAliveUnitsBySide(state, side.id).length }));
  const defeatedSide = aliveBySide.find((entry) => entry.alive === 0);

  if (defeatedSide) {
    const winnerSideId = scenario.sides.find((side) => side.id !== defeatedSide.side.id)?.id ?? state.playerSideId;
    return buildResult(scenario, state, winnerSideId, `Армия ${defeatedSide.side.name} теряет боеспособность.`);
  }

  for (const condition of scenario.victory) {
    const winnerSideId = getWinnerFromCondition(scenario, state, condition);
    if (winnerSideId) {
      return buildResult(scenario, state, winnerSideId, describeVictoryCondition(scenario, condition));
    }
  }

  return null;
}

function getWinnerFromCondition(scenario: BattleScenario, state: BattleState, condition: VictoryCondition): string | null {
  switch (condition.type) {
    case "eliminate_side":
      return null;

    case "survive_turns":
      return state.turn >= condition.turns ? condition.sideId : null;

    case "hold_zone_until_turn": {
      const held = state.turn >= condition.turn && !hasEnemyUnitInZone(scenario, state, condition.sideId, condition.zoneId);
      return held ? condition.sideId : null;
    }

    case "occupy_zone":
      return hasSideUnitInZone(scenario, state, condition.sideId, condition.zoneId) ? condition.sideId : null;

    case "rout_units":
      return areUnitsInactive(state, condition.unitIds) ? condition.winnerSideId : null;
  }
}

function buildResult(scenario: BattleScenario, state: BattleState, winnerSideId: string, outcome: string): BattleResult {
  const playerAlive = getAliveUnitsBySide(state, state.playerSideId).length;
  const totalPlayer = Object.values(state.units).filter((unit) => unit.sideId === state.playerSideId).length;
  const survivalRate = totalPlayer === 0 ? 0 : playerAlive / totalPlayer;
  const rank = survivalRate > 0.8 ? "S" : survivalRate > 0.6 ? "A" : survivalRate > 0.4 ? "B" : survivalRate > 0.2 ? "C" : "D";

  return {
    winnerSideId,
    playerSideId: state.playerSideId,
    rank,
    outcome,
    chronicle: buildChronicle(scenario, state, winnerSideId, rank, outcome),
  };
}

function describeVictoryCondition(scenario: BattleScenario, condition: VictoryCondition): string {
  switch (condition.type) {
    case "eliminate_side": {
      const side = scenario.sides.find((item) => item.id === condition.sideId)?.name;
      return `${side ?? "Сторона"} разбита.`;
    }

    case "survive_turns": {
      const side = scenario.sides.find((item) => item.id === condition.sideId)?.name;
      return `${side ?? "Сторона"} выдерживает бой до ${condition.turns} хода.`;
    }

    case "hold_zone_until_turn": {
      const side = scenario.sides.find((item) => item.id === condition.sideId)?.name;
      const zone = scenario.zones?.find((item) => item.id === condition.zoneId);
      return `${side ?? "Сторона"} удерживает ${zone?.name ?? "ключевую зону"} до ${condition.turn} хода.`;
    }

    case "occupy_zone": {
      const side = scenario.sides.find((item) => item.id === condition.sideId)?.name;
      const zone = scenario.zones?.find((item) => item.id === condition.zoneId);
      return `${side ?? "Сторона"} занимает ${zone?.name ?? "ключевую зону"}.`;
    }

    case "rout_units": {
      const winner = scenario.sides.find((item) => item.id === condition.winnerSideId)?.name;
      return `${winner ?? "Победитель"} выводит ключевые отряды противника из боя.`;
    }
  }
}

function buildChronicle(scenario: BattleScenario, state: BattleState, winnerSideId: string, rank: BattleResult["rank"], outcome: string): string[] {
  const winner = scenario.sides.find((side) => side.id === winnerSideId)?.name ?? "Неизвестная сторона";
  const defeated = scenario.sides.filter((side) => side.id !== winnerSideId).map((side) => side.name).join(", ");
  return [
    outcome,
    `${winner} получает решающее преимущество.`,
    `${defeated} теряет строй и отходит.`,
    `Битва завершена на ${state.turn} ходу.`,
    `Итоговый ранг: ${rank}.`,
  ];
}
