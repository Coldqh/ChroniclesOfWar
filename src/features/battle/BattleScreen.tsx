import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import { applyBattleCommand, runBasicAiTurn } from "../../core/battle/battle-engine";
import type { BattleCommand } from "../../core/battle/battle-commands";
import type { BattleScenario, BattleState, UnitRole } from "../../core/battle/battle-types";
import type { HexCoord } from "../../core/hex/hex-types";
import { getCombatPreview } from "../../core/combat/combat-preview";
import { formatSignedPercent } from "../../core/combat/terrain-combat";
import { getMovementRange } from "../../core/movement/movement-rules";
import { BattleHud } from "./BattleHud";
import { CombatPreviewPanel } from "./CombatPreviewPanel";
import { HexMap } from "./HexMap";
import { UnitPanel } from "./UnitPanel";
import "./BattleReadability.css";

type BattleScreenProps = {
  scenario: BattleScenario;
  state: BattleState;
  setState: Dispatch<SetStateAction<BattleState | null>>;
  onExit: () => void;
  onRestart: () => void;
};

const roleLabels: Record<UnitRole, string> = {
  infantry: "Пехота",
  archer: "Лучники",
  crossbow: "Арбалеты",
  cavalry: "Конница",
  guard: "Гвардия",
  commander: "Командиры",
};

export function BattleScreen({ scenario, state, setState, onExit, onRestart }: BattleScreenProps) {
  const selectedUnit = state.selectedUnitId ? state.units[state.selectedUnitId] : null;
  const activeStage = scenario.stages.find((stage) => stage.id === state.currentStageId) ?? scenario.stages[0];
  const movementRange = selectedUnit ? getMovementRange(scenario, state, selectedUnit) : [];
  const isPlayerTurn = state.activeSideId === state.playerSideId;
  const [battleMessage, setBattleMessage] = useState("Выберите свой отряд.");
  const [inspectedCoord, setInspectedCoord] = useState<HexCoord | null>(null);

  const targetsInRange = useMemo(() => {
    if (!selectedUnit) return [];
    return Object.values(state.units).filter((unit) => {
      if (unit.sideId === selectedUnit.sideId || unit.status === "destroyed" || unit.status === "routed") return false;
      return getCombatPreview(scenario, state, selectedUnit, unit).canAttack;
    });
  }, [scenario, selectedUnit, state]);

  const inspectedTile = inspectedCoord
    ? scenario.map.tiles.find((tile) => tile.coord.q === inspectedCoord.q && tile.coord.r === inspectedCoord.r)
    : null;
  const inspectedTerrain = inspectedTile
    ? scenario.terrain.find((terrain) => terrain.id === inspectedTile.terrainId)
    : null;
  const terrainEffects = inspectedTerrain?.roleAttackModifiers
    ? Object.entries(inspectedTerrain.roleAttackModifiers) as Array<[UnitRole, number]>
    : [];

  useEffect(() => {
    if (state.phase !== "finished" && state.activeSideId !== state.playerSideId) {
      setBattleMessage("Противник принимает решение...");
      const timer = window.setTimeout(() => {
        setState((current) => (current ? runBasicAiTurn(scenario, current) : current));
      }, 450);
      return () => window.clearTimeout(timer);
    }

    if (state.phase !== "finished") {
      setBattleMessage("Ваш ход. Выберите отряд.");
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
          onBattleMessage={setBattleMessage}
          onInspectTile={setInspectedCoord}
        />

        <aside className="battle-side-panel right-panel">
          <section className={`battle-message ${isPlayerTurn ? "player" : "ai"}`}>
            {battleMessage}
          </section>

          <button
            className="primary-button full-width end-turn-button"
            disabled={!isPlayerTurn}
            onClick={() => dispatch({ type: "END_TURN" })}
          >
            Завершить ход
          </button>

          <section className="card-panel tile-info-panel">
            <h3>Клетка</h3>
            {inspectedTerrain ? (
              <>
                <strong>{inspectedTerrain.name}</strong>
                <div className="tile-info-grid">
                  <span>Ход</span>
                  <strong>{inspectedTerrain.moveCost}</strong>
                  <span>Защита</span>
                  <strong>{formatSignedPercent(inspectedTerrain.defenseBonus)}</strong>
                </div>

                {terrainEffects.length > 0 && (
                  <div className="terrain-effects-list">
                    {terrainEffects.map(([role, modifier]) => (
                      <div className="terrain-effect-row" key={role}>
                        <span>{roleLabels[role]}</span>
                        <strong className={modifier >= 0 ? "positive" : "negative"}>
                          {formatSignedPercent(modifier)}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p>Наведи или нажми на гекс.</p>
            )}
          </section>

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
