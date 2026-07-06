import type { BattleResult, BattleScenario, BattleState } from "../battle/battle-types";

export function getAliveUnitsBySide(state: BattleState, sideId: string) {
  return Object.values(state.units).filter(
    (unit) => unit.sideId === sideId && unit.status !== "destroyed" && unit.status !== "routed",
  );
}

export function checkVictory(scenario: BattleScenario, state: BattleState): BattleResult | null {
  const aliveBySide = scenario.sides.map((side) => ({ side, alive: getAliveUnitsBySide(state, side.id).length }));
  const defeatedSide = aliveBySide.find((entry) => entry.alive === 0);

  if (!defeatedSide) return null;

  const winnerSideId = scenario.sides.find((side) => side.id !== defeatedSide.side.id)?.id ?? state.playerSideId;
  const outcome = defeatedSide.side.id === state.playerSideId
    ? "Ваша армия сломлена."
    : "Армия противника сломлена.";

  return buildResult(scenario, state, winnerSideId, outcome);
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

function buildChronicle(scenario: BattleScenario, state: BattleState, winnerSideId: string, rank: BattleResult["rank"], outcome: string): string[] {
  const winner = scenario.sides.find((side) => side.id === winnerSideId)?.name ?? "Неизвестная сторона";
  const defeated = scenario.sides.filter((side) => side.id !== winnerSideId).map((side) => side.name).join(", ");

  return [
    outcome,
    `${winner} получает решающее преимущество.`,
    `${defeated} теряет боеспособность и отходит.`,
    `Битва завершена на ${state.turn} ходу.`,
    `Итоговый ранг: ${rank}.`,
  ];
}
