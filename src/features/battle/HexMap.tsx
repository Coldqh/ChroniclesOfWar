import type { BattleScenario, BattleStage, BattleState, Unit } from "../../core/battle/battle-types";
import type { HexCoord } from "../../core/hex/hex-types";
import { hexKey, sameHex } from "../../core/hex/hex-utils";
import { getBattleMapLayout } from "../../data/maps/battle-map-layouts";

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
  const layout = getBattleMapLayout(scenario.id, activeStage.id);
  const metrics = layout.metrics;
  const hasImageUnderlay = layout.mode === "image-underlay" && Boolean(layout.backgroundClassName);

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

  const width = scenario.map.width * metrics.xStep + metrics.width + metrics.paddingX * 2;
  const height = scenario.map.height * metrics.yStep + metrics.height + metrics.paddingY * 2;

  return (
    <section className={`map-frame ${hasImageUnderlay ? "has-stage-map-frame" : ""}`}>
      <div className="stage-summary">
        <strong>{activeStage.title}</strong>
        <span>{activeStage.summary}</span>
      </div>

      <div
        className={`hex-map battle-${toClassToken(scenario.id)} stage-${toClassToken(activeStage.id)} layout-${toClassToken(layout.id)} ${hasImageUnderlay ? "has-stage-map" : ""} ${layout.showTerrainFill ? "show-terrain-fill" : "hide-terrain-fill"} ${layout.showHexLabels ? "show-hex-labels" : "hide-hex-labels"}`}
        style={{ width, height }}
      >
        {hasImageUnderlay ? (
          <div
            className={`hex-map-background-layer ${layout.backgroundClassName}`}
            aria-hidden="true"
          />
        ) : null}

        {scenario.map.tiles.map((tile) => {
          const key = hexKey(tile.coord);
          const unit = unitsByHex.get(key);
          const terrain = terrainById.get(tile.terrainId);
          const x = tile.coord.q * metrics.xStep + (tile.coord.r % 2) * (metrics.width / 2) + metrics.paddingX;
          const y = tile.coord.r * metrics.yStep + metrics.paddingY;
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
              style={{
                width: metrics.width,
                height: metrics.height,
                transform: `translate(${x}px, ${y}px)`,
              }}
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
