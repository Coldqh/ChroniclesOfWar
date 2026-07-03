import type { BattleScenario, BattleStage, BattleState, Unit } from "../../core/battle/battle-types";
import type { HexCoord } from "../../core/hex/hex-types";
import { hexKey, sameHex } from "../../core/hex/hex-utils";

type HexMapProps = {
  scenario: BattleScenario;
  state: BattleState;
  activeStage: BattleStage;
  movementRange: HexCoord[];
  targetsInRange: Unit[];
  onSelectUnit: (unitId: string | null) => void;
  onMove: (unitId: string, to: HexCoord) => void;
  onAttack: (attackerId: string, targetId: string) => void;
  onBattleMessage: (message: string) => void;
  onInspectTile: (coord: HexCoord) => void;
};

const HEX_W = 72;
const HEX_H = 82;
const HEX_X_STEP = HEX_W;
const HEX_Y_STEP = HEX_H * 0.75;
const MAP_PADDING_X = 28;
const MAP_PADDING_Y = 24;

function isActiveUnit(unit: Unit | undefined): unit is Unit {
  return Boolean(unit && unit.status !== "destroyed" && unit.status !== "routed");
}

function toClassToken(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

export function HexMap({
  scenario,
  state,
  activeStage,
  movementRange,
  targetsInRange,
  onSelectUnit,
  onMove,
  onAttack,
  onBattleMessage,
  onInspectTile,
}: HexMapProps) {
  const selectedUnit = state.selectedUnitId ? state.units[state.selectedUnitId] : null;
  const targetIds = new Set(targetsInRange.map((unit) => unit.id));
  const movementKeys = new Set(movementRange.map(hexKey));
  const unitsByHex = new Map(Object.values(state.units).map((unit) => [hexKey(unit.position), unit]));
  const terrainById = new Map(scenario.terrain.map((terrain) => [terrain.id, terrain]));
  const isPlayerTurn = state.activeSideId === state.playerSideId;
  const hasStageMap = scenario.id === "crecy-1346" && activeStage.id === "advance";

  function handleTileClick(coord: HexCoord) {
    onInspectTile(coord);

    if (!isPlayerTurn) {
      onBattleMessage("Противник принимает решение.");
      return;
    }

    const key = hexKey(coord);
    const unit = unitsByHex.get(key);

    if (isActiveUnit(unit)) {
      const isOwnActiveUnit = unit.sideId === state.activeSideId;

      if (isOwnActiveUnit) {
        onSelectUnit(unit.id);

        if (unit.hasMoved && unit.hasAttacked) {
          onBattleMessage("Этот отряд уже действовал.");
          return;
        }

        onBattleMessage("Отряд выбран.");
        return;
      }

      if (!selectedUnit) {
        onBattleMessage("Выберите свой отряд.");
        return;
      }

      if (targetIds.has(unit.id)) {
        onAttack(selectedUnit.id, unit.id);
        onBattleMessage("Атака выполнена.");
        return;
      }

      onBattleMessage("Цель вне дальности.");
      return;
    }

    if (unit && !isActiveUnit(unit)) {
      onBattleMessage("Этот отряд выведен из боя.");
      return;
    }

    if (!selectedUnit) {
      onBattleMessage("Выберите свой отряд.");
      return;
    }

    if (movementKeys.has(key)) {
      onMove(selectedUnit.id, coord);
      onBattleMessage("Отряд меняет позицию.");
      return;
    }

    if (selectedUnit.hasMoved) {
      onBattleMessage("Этот отряд уже двигался.");
      return;
    }

    onBattleMessage("Клетка недоступна.");
  }

  const width = scenario.map.width * HEX_X_STEP + HEX_W + MAP_PADDING_X * 2;
  const height = scenario.map.height * HEX_Y_STEP + HEX_H + MAP_PADDING_Y * 2;

  return (
    <section className={`map-frame ${hasStageMap ? "has-stage-map-frame" : ""}`}>
      <div className="stage-summary">
        <strong>{activeStage.title}</strong>
        <span>{activeStage.summary}</span>
      </div>

      <div
        className={`hex-map battle-${toClassToken(scenario.id)} stage-${toClassToken(activeStage.id)} ${hasStageMap ? "has-stage-map" : ""}`}
        style={{ width, height }}
      >
        {scenario.map.tiles.map((tile) => {
          const key = hexKey(tile.coord);
          const unit = unitsByHex.get(key);
          const terrain = terrainById.get(tile.terrainId);
          const x = tile.coord.q * HEX_X_STEP + (tile.coord.r % 2) * (HEX_W / 2) + MAP_PADDING_X;
          const y = tile.coord.r * HEX_Y_STEP + MAP_PADDING_Y;
          const activeUnit = isActiveUnit(unit) ? unit : null;
          const isSelected = selectedUnit && sameHex(selectedUnit.position, tile.coord);
          const canMove = movementKeys.has(key);
          const canTarget = activeUnit ? targetIds.has(activeUnit.id) : false;
          const isOccupied = Boolean(activeUnit);
          const isFriendly = Boolean(activeUnit && activeUnit.sideId === state.playerSideId);
          const isEnemy = Boolean(activeUnit && activeUnit.sideId !== state.playerSideId);
          const isSpent = Boolean(activeUnit && activeUnit.hasMoved && activeUnit.hasAttacked);
          const inStage =
            tile.coord.q >= activeStage.activeArea.qMin &&
            tile.coord.q <= activeStage.activeArea.qMax &&
            tile.coord.r >= activeStage.activeArea.rMin &&
            tile.coord.r <= activeStage.activeArea.rMax;

          return (
            <button
              key={key}
              className={`hex-tile terrain-${tile.terrainId} ${isSelected ? "selected" : ""} ${canMove ? "can-move" : ""} ${canTarget ? "can-target" : ""} ${isOccupied ? "occupied" : ""} ${isFriendly ? "friendly" : ""} ${isEnemy ? "enemy" : ""} ${isSpent ? "spent" : ""} ${!inStage ? "out-stage" : ""}`}
              style={{ transform: `translate(${x}px, ${y}px)` }}
              onClick={() => handleTileClick(tile.coord)}
              onMouseEnter={() => onInspectTile(tile.coord)}
              onFocus={() => onInspectTile(tile.coord)}
              title={`${terrain?.name ?? tile.terrainId} · ход ${terrain?.moveCost ?? "?"} · защита ${terrain?.defenseBonus ?? 0}`}
            >
              <span className="hex-label">{tile.label}</span>
              {activeUnit && (
                <span className={`unit-token side-${activeUnit.sideId} status-${activeUnit.status}`}>
                  <span className="unit-icon">{activeUnit.type.icon}</span>
                  <span className="unit-count">{activeUnit.currentCount}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
