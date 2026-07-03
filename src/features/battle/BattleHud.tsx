import { APP_VERSION } from "../../app/version";
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
  const isPlayerTurn = state.activeSideId === state.playerSideId;

  return (
    <header className="battle-hud">
      <button className="ghost-button" onClick={onExit}>Меню</button>

      <div className="battle-hud-main">
        <span className="eyebrow">{scenario.title}</span>
        <h2>{activeStage.title}</h2>
        <p>{activeStage.summary}</p>
        {activeStage.objective && <p className="stage-objective-line">Цель этапа: {activeStage.objective}</p>}
      </div>

      <div className="hud-stats">
        <span>{APP_VERSION}</span>
        <span>Ход {state.turn}</span>
        <span>Активно: {activeSide?.name}</span>
        <span>Вы: {playerSide?.name}</span>
        <span className={`turn-badge ${isPlayerTurn ? "player" : "ai"}`}>
          {isPlayerTurn ? "Игрок" : "AI"}
        </span>
      </div>
    </header>
  );
}
