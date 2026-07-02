import type { BattleCommand } from "./battle-commands";
import type { BattleScenario, BattleState, Unit } from "./battle-types";
import { sameHex, hexDistance } from "../hex/hex-utils";
import { canMoveTo, getMovementRange } from "../movement/movement-rules";
import { resolveCombat } from "../combat/combat-resolver";
import { getMoraleStatus, recoverMorale } from "../morale/morale-rules";
import { checkVictory } from "../victory/victory-rules";

export function applyBattleCommand(scenario: BattleScenario, state: BattleState, command: BattleCommand): BattleState {
  if (state.phase === "finished") return state;

  switch (command.type) {
    case "SELECT_UNIT": {
      if (!command.unitId) return { ...state, selectedUnitId: null };
      const unit = state.units[command.unitId];
      if (!unit || unit.sideId !== state.activeSideId) return state;
      return { ...state, selectedUnitId: command.unitId };
    }

    case "MOVE_UNIT": {
      const unit = state.units[command.unitId];
      if (!unit || unit.sideId !== state.activeSideId) return state;
      if (!canMoveTo(scenario, state, unit, command.to)) {
        return addLog(state, "Приказ невозможен: клетка недоступна.", "danger");
      }

      const nextState: BattleState = {
        ...state,
        units: {
          ...state.units,
          [unit.id]: {
            ...unit,
            position: command.to,
            hasMoved: true,
          },
        },
      };

      return addLog(nextState, `${unit.type.name} меняют позицию.`, "info");
    }

    case "ATTACK_UNIT": {
      const attacker = state.units[command.attackerId];
      const target = state.units[command.targetId];
      if (!attacker || !target || attacker.sideId !== state.activeSideId) return state;

      const result = resolveCombat(scenario, state, attacker, target);
      if (!result.canAttack) {
        return addLog(state, result.reason ?? "Атака невозможна.", "danger");
      }

      const updatedTarget: Unit = {
        ...target,
        currentHp: result.targetHpAfter,
        currentCount: result.targetCountAfter,
        morale: Math.max(0, target.morale - result.moraleDamage),
      };
      updatedTarget.status = result.targetDestroyed ? "destroyed" : result.targetRouted ? "routed" : getMoraleStatus(updatedTarget);

      const updatedAttacker: Unit = {
        ...attacker,
        hasAttacked: true,
      };

      let nextState: BattleState = {
        ...state,
        units: {
          ...state.units,
          [attacker.id]: updatedAttacker,
          [target.id]: updatedTarget,
        },
      };

      nextState = addLog(nextState, result.logText, result.targetDestroyed || result.targetRouted ? "success" : "info");
      if (result.targetDestroyed) nextState = addLog(nextState, `${target.type.name} уничтожены.`, "danger");
      if (result.targetRouted) nextState = addLog(nextState, `${target.type.name} бегут с поля.`, "danger");

      return finishIfNeeded(scenario, nextState);
    }

    case "END_TURN": {
      return endTurn(scenario, state);
    }
  }
}

export function endTurn(scenario: BattleScenario, state: BattleState): BattleState {
  const sides = scenario.sides;
  const currentIndex = sides.findIndex((side) => side.id === state.activeSideId);
  const nextSide = sides[(currentIndex + 1) % sides.length];
  const wrapped = nextSide.id === sides[0].id;
  const nextTurn = wrapped ? state.turn + 1 : state.turn;
  const currentStage = getCurrentStageId(scenario, nextTurn);

  const units = Object.fromEntries(
    Object.values(state.units).map((unit) => {
      const recoveredMorale = unit.sideId === nextSide.id ? recoverMorale(unit) : unit.morale;
      const status = getMoraleStatus({ ...unit, morale: recoveredMorale });
      return [
        unit.id,
        {
          ...unit,
          morale: recoveredMorale,
          status: status === "skipping" ? "shaken" : status,
          hasMoved: false,
          hasAttacked: false,
        },
      ];
    }),
  );

  return addLog(
    {
      ...state,
      turn: nextTurn,
      activeSideId: nextSide.id,
      currentStageId: currentStage,
      selectedUnitId: null,
      units,
    },
    `Ход переходит к стороне: ${nextSide.name}.`,
    "history",
  );
}

export function runBasicAiTurn(scenario: BattleScenario, state: BattleState): BattleState {
  let nextState = state;
  const aiUnits = Object.values(nextState.units).filter(
    (unit) => unit.sideId === nextState.activeSideId && unit.status !== "destroyed" && unit.status !== "routed",
  );

  for (const unit of aiUnits) {
    const freshUnit = nextState.units[unit.id];
    if (!freshUnit || freshUnit.status === "destroyed" || freshUnit.status === "routed") continue;

    const enemies = Object.values(nextState.units).filter(
      (target) => target.sideId !== freshUnit.sideId && target.status !== "destroyed" && target.status !== "routed",
    );
    if (enemies.length === 0) break;

    const targetInRange = enemies
      .filter((target) => hexDistance(freshUnit.position, target.position) <= freshUnit.type.range)
      .sort((a, b) => a.currentHp - b.currentHp)[0];

    if (targetInRange) {
      nextState = applyBattleCommand(scenario, nextState, {
        type: "ATTACK_UNIT",
        attackerId: freshUnit.id,
        targetId: targetInRange.id,
      });
      continue;
    }

    const nearestEnemy = enemies.sort(
      (a, b) => hexDistance(freshUnit.position, a.position) - hexDistance(freshUnit.position, b.position),
    )[0];
    const range = getMovementRange(scenario, nextState, freshUnit);
    const bestMove = range.sort(
      (a, b) => hexDistance(a, nearestEnemy.position) - hexDistance(b, nearestEnemy.position),
    )[0];

    if (bestMove) {
      nextState = applyBattleCommand(scenario, nextState, {
        type: "MOVE_UNIT",
        unitId: freshUnit.id,
        to: bestMove,
      });
    }
  }

  return endTurn(scenario, nextState);
}

function finishIfNeeded(scenario: BattleScenario, state: BattleState): BattleState {
  const result = checkVictory(scenario, state);
  if (!result) return state;
  return {
    ...state,
    phase: "finished",
    result,
    selectedUnitId: null,
  };
}

function getCurrentStageId(scenario: BattleScenario, turn: number): string {
  return [...scenario.stages]
    .sort((a, b) => b.startsAtTurn - a.startsAtTurn)
    .find((stage) => turn >= stage.startsAtTurn)?.id ?? scenario.stages[0]?.id ?? "main";
}

function addLog(state: BattleState, text: string, tone: "info" | "success" | "danger" | "history"): BattleState {
  return {
    ...state,
    log: [
      {
        id: `${state.turn}-${state.log.length}-${Math.random().toString(16).slice(2)}`,
        turn: state.turn,
        text,
        tone,
      },
      ...state.log,
    ].slice(0, 12),
  };
}
