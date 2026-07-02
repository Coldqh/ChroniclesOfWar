import type { BattleScenario, BattleStage, BattleState } from "../../core/battle/battle-types";

type BattleHudProps = {
  scenario: BattleScenario;
  state: BattleState;
  activeStage: BattleStage;
  onExit: () => void;
};

export function BattleHud({ scenario, state, activeStage, onExit }: BattleHudProps) {
  const activeSide = scenario.sides.find((side) => side.id === state.activeSideId);
  const playerSide = scenario.sides.find((side) => side.id === state.playerSideId);

  return (
    <header className="battle-hud">
      <button className="ghost-button" onClick={onExit}>Меню</button>
      <div>
        <span className="eyebrow">{scenario.title}</span>
        <h2>{activeStage.title}</h2>
      </div>
      <div className="hud-stats">
        <span>Ход {state.turn}</span>
        <span>Активно: {activeSide?.name}</span>
        <span>Вы: {playerSide?.name}</span>
      </div>
    </header>
  );
}
