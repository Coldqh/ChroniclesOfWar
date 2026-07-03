import type { BattleCommand } from "./battle-commands";
import type { BattleScenario, BattleState, Unit } from "./battle-types";
import { hexDistance } from "../hex/hex-utils";
import { canMoveTo, getMovementRange, getUnitAt } from "../movement/movement-rules";
import { resolveCombat } from "../combat/combat-resolver";
import { getCombatPreview } from "../combat/combat-preview";
import { getMoraleStatus, recoverMorale } from "../morale/morale-rules";
import { checkVictory } from "../victory/victory-rules";

type LogTone = "info" | "success" | "danger" | "history";

function canUnitReceiveOrders(unit: Unit): boolean {
  return unit.status !== "destroyed" && unit.status !== "routed" && unit.status !== "skipping";
}

export function applyBattleCommand(scenario: BattleScenario, state: BattleState, command: BattleCommand): BattleState {
  if (state.phase === "finished") return state;

  switch (command.type) {
    case "SELECT_UNIT": {
      if (!command.unitId) return { ...state, selectedUnitId: null };

      const unit = state.units[command.unitId];
      if (!unit) return addLog(state, "Отряд не найден.", "danger");
      if (unit.sideId !== state.activeSideId) return addLog(state, "Нельзя выбрать отряд другой стороны.", "danger");
      if (!canUnitReceiveOrders(unit)) return addLog(state, "Этот отряд не может получать приказы.", "danger");

      return { ...state, selectedUnitId: command.unitId };
    }

    case "MOVE_UNIT": {
      const unit = state.units[command.unitId];
      if (!unit) return addLog(state, "Отряд не найден.", "danger");
      if (unit.sideId !== state.activeSideId) return addLog(state, "Сейчас ходит другая сторона.", "danger");
      if (!canUnitReceiveOrders(unit)) return addLog(state, "Этот отряд не может двигаться.", "danger");
      if (unit.hasMoved) return addLog(state, "Этот отряд уже двигался.", "danger");

      const occupied = getUnitAt(state, command.to);
      if (occupied && occupied.id !== unit.id) {
        return addLog(state, "Клетка занята.", "danger");
      }

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

      if (!attacker) return addLog(state, "Атакующий отряд не найден.", "danger");
      if (!target) return addLog(state, "Цель не найдена.", "danger");
      if (attacker.sideId !== state.activeSideId) return addLog(state, "Сейчас ходит другая сторона.", "danger");
      if (!canUnitReceiveOrders(attacker)) return addLog(state, "Этот отряд не может атаковать.", "danger");
      if (attacker.hasAttacked) return addLog(state, "Этот отряд уже атаковал.", "danger");
      if (attacker.sideId === target.sideId) return addLog(state, "Нельзя атаковать союзника.", "danger");
      if (target.status === "destroyed" || target.status === "routed") {
        return addLog(state, "Цель уже выведена из боя.", "danger");
      }

      const preview = getCombatPreview(scenario, state, attacker, target);
      if (!preview.canAttack) {
        return addLog(state, preview.reason ?? "Атака невозможна.", "danger");
      }

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
        selectedUnitId: updatedAttacker.status === "destroyed" || updatedAttacker.status === "routed" ? null : state.selectedUnitId,
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
      return finishIfNeeded(scenario, endTurn(scenario, state));
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
      if (unit.status === "destroyed" || unit.status === "routed") {
        return [
          unit.id,
          {
            ...unit,
            hasMoved: false,
            hasAttacked: false,
          },
        ];
      }

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
    (unit) => unit.sideId === nextState.activeSideId && canUnitReceiveOrders(unit),
  );

  for (const unit of aiUnits) {
    const freshUnit = nextState.units[unit.id];
    if (!freshUnit || !canUnitReceiveOrders(freshUnit)) continue;

    const enemies = Object.values(nextState.units).filter(
      (target) => target.sideId !== freshUnit.sideId && target.status !== "destroyed" && target.status !== "routed",
    );

    if (enemies.length === 0) break;

    if (!freshUnit.hasAttacked) {
      const targetInRange = enemies
        .filter((target) => getCombatPreview(scenario, nextState, freshUnit, target).canAttack)
        .sort((a, b) => a.currentHp - b.currentHp)[0];

      if (targetInRange) {
        nextState = applyBattleCommand(scenario, nextState, {
          type: "ATTACK_UNIT",
          attackerId: freshUnit.id,
          targetId: targetInRange.id,
        });
        continue;
      }
    }

    const refreshedAfterAttack = nextState.units[freshUnit.id];
    if (!refreshedAfterAttack || refreshedAfterAttack.hasMoved || !canUnitReceiveOrders(refreshedAfterAttack)) continue;

    const nearestEnemy = enemies.sort(
      (a, b) => hexDistance(refreshedAfterAttack.position, a.position) - hexDistance(refreshedAfterAttack.position, b.position),
    )[0];

    const range = getMovementRange(scenario, nextState, refreshedAfterAttack);
    const bestMove = range.sort(
      (a, b) => hexDistance(a, nearestEnemy.position) - hexDistance(b, nearestEnemy.position),
    )[0];

    if (bestMove) {
      nextState = applyBattleCommand(scenario, nextState, {
        type: "MOVE_UNIT",
        unitId: refreshedAfterAttack.id,
        to: bestMove,
      });
    }
  }

  return finishIfNeeded(scenario, endTurn(scenario, nextState));
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

function addLog(state: BattleState, text: string, tone: LogTone): BattleState {
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
