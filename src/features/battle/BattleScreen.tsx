import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo } from "react";
import { applyBattleCommand, runBasicAiTurn } from "../../core/battle/battle-engine";
import type { BattleCommand } from "../../core/battle/battle-commands";
import type { BattleScenario, BattleState } from "../../core/battle/battle-types";
import { getCombatPreview } from "../../core/combat/combat-preview";
import { getMovementRange } from "../../core/movement/movement-rules";
import { BattleHud } from "./BattleHud";
import { CombatPreviewPanel } from "./CombatPreviewPanel";
import { HexMap } from "./HexMap";
import { UnitPanel } from "./UnitPanel";

type BattleScreenProps = {
  scenario: BattleScenario;
  state: BattleState;
  setState: Dispatch<SetStateAction<BattleState | null>>;
  onExit: () => void;
  onRestart: () => void;
};

export function BattleScreen({ scenario, state, setState, onExit, onRestart }: BattleScreenProps) {
  const selectedUnit = state.selectedUnitId ? state.units[state.selectedUnitId] : null;
  const activeStage = scenario.stages.find((stage) => stage.id === state.currentStageId) ?? scenario.stages[0];
  const movementRange = selectedUnit ? getMovementRange(scenario, state, selectedUnit) : [];

  const targetsInRange = useMemo(() => {
    if (!selectedUnit) return [];
    return Object.values(state.units).filter((unit) => {
      if (unit.sideId === selectedUnit.sideId || unit.status === "destroyed" || unit.status === "routed") return false;
      return getCombatPreview(scenario, state, selectedUnit, unit).canAttack;
    });
  }, [scenario, selectedUnit, state]);

  useEffect(() => {
    if (state.phase !== "finished" && state.activeSideId !== state.playerSideId) {
      const timer = window.setTimeout(() => {
        setState((current) => (current ? runBasicAiTurn(scenario, current) : current));
      }, 450);
      return () => window.clearTimeout(timer);
    }
  }, [scenario, setState, state.activeSideId, state.phase, state.playerSideId]);

  function dispatch(command: BattleCommand) {
    setState((current) => (current ? applyBattleCommand(scenario, current, command) : current));
  }

  const playerWon = state.result?.winnerSideId === state.playerSideId;

  if (state.phase === "finished" && state.result) {
    return (
      <main className="screen result-screen">
        <section className="result-panel">
          <span className="eyebrow">Битва завершена</span>
          <h1>{playerWon ? "Победа" : "Поражение"}</h1>
          <div className="rank-badge">Ранг {state.result.rank}</div>
          <div className="chronicle">
            {state.result.chronicle.map((line) => <p key={line}>{line}</p>)}
          </div>
          <div className="hero-actions">
            <button className="primary-button" onClick={onRestart}>Сыграть другой стороной</button>
            <button className="ghost-button" onClick={onExit}>В меню</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="battle-shell">
      <BattleHud scenario={scenario} state={state} activeStage={activeStage} onExit={onExit} />

      <section className="battle-layout">
        <aside className="battle-side-panel left-panel">
          <UnitPanel unit={selectedUnit} scenario={scenario} />
          <CombatPreviewPanel selectedUnit={selectedUnit} targets={targetsInRange} scenario={scenario} state={state} />
        </aside>

        <HexMap
          scenario={scenario}
          state={state}
          activeStage={activeStage}
          movementRange={movementRange}
          targetsInRange={targetsInRange}
          onSelectUnit={(unitId) => dispatch({ type: "SELECT_UNIT", unitId })}
          onMove={(unitId, to) => dispatch({ type: "MOVE_UNIT", unitId, to })}
          onAttack={(attackerId, targetId) => dispatch({ type: "ATTACK_UNIT", attackerId, targetId })}
        />

        <aside className="battle-side-panel right-panel">
          <button className="primary-button full-width" onClick={() => dispatch({ type: "END_TURN" })}>
            Завершить ход
          </button>
          <div className="log-panel">
            <h3>Журнал</h3>
            {state.log.map((entry) => (
              <p key={entry.id} className={`log-entry ${entry.tone}`}>
                <span>Ход {entry.turn}</span>
                {entry.text}
              </p>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
