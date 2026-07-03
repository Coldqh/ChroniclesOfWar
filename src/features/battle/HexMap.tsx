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
};

const HEX_W = 72;
const HEX_H = 82;
const HEX_X_STEP = HEX_W;
const HEX_Y_STEP = HEX_H * 0.75;
const MAP_PADDING_X = 28;
const MAP_PADDING_Y = 24;

export function HexMap({
  scenario,
  state,
  activeStage,
  movementRange,
  targetsInRange,
  onSelectUnit,
  onMove,
  onAttack,
}: HexMapProps) {
  const selectedUnit = state.selectedUnitId ? state.units[state.selectedUnitId] : null;
  const targetIds = new Set(targetsInRange.map((unit) => unit.id));
  const movementKeys = new Set(movementRange.map(hexKey));
  const unitsByHex = new Map(Object.values(state.units).map((unit) => [hexKey(unit.position), unit]));
  const terrainById = new Map(scenario.terrain.map((terrain) => [terrain.id, terrain]));

  function handleTileClick(coord: HexCoord) {
    const unit = unitsByHex.get(hexKey(coord));

    if (unit && selectedUnit && unit.sideId !== selectedUnit.sideId && targetIds.has(unit.id)) {
      onAttack(selectedUnit.id, unit.id);
      return;
    }

    if (unit && unit.status !== "destroyed" && unit.status !== "routed") {
      onSelectUnit(unit.id);
      return;
    }

    if (selectedUnit && movementKeys.has(hexKey(coord))) {
      onMove(selectedUnit.id, coord);
    }
  }

  const width = scenario.map.width * HEX_X_STEP + HEX_W + MAP_PADDING_X * 2;
  const height = scenario.map.height * HEX_Y_STEP + HEX_H + MAP_PADDING_Y * 2;

  return (
    <section className="map-frame">
      <div className="stage-summary">
        <strong>{activeStage.title}</strong>
        <span>{activeStage.summary}</span>
      </div>
      <div className="hex-map" style={{ width, height }}>
        {scenario.map.tiles.map((tile) => {
          const key = hexKey(tile.coord);
          const unit = unitsByHex.get(key);
          const terrain = terrainById.get(tile.terrainId);
          const x = tile.coord.q * HEX_X_STEP + (tile.coord.r % 2) * (HEX_W / 2) + MAP_PADDING_X;
          const y = tile.coord.r * HEX_Y_STEP + MAP_PADDING_Y;
          const isSelected = selectedUnit && sameHex(selectedUnit.position, tile.coord);
          const canMove = movementKeys.has(key);
          const canTarget = unit ? targetIds.has(unit.id) : false;
          const inStage =
            tile.coord.q >= activeStage.activeArea.qMin &&
            tile.coord.q <= activeStage.activeArea.qMax &&
            tile.coord.r >= activeStage.activeArea.rMin &&
            tile.coord.r <= activeStage.activeArea.rMax;

          return (
            <button
              key={key}
              className={`hex-tile terrain-${tile.terrainId} ${isSelected ? "selected" : ""} ${canMove ? "can-move" : ""} ${canTarget ? "can-target" : ""} ${!inStage ? "out-stage" : ""}`}
              style={{ transform: `translate(${x}px, ${y}px)` }}
              onClick={() => handleTileClick(tile.coord)}
              title={`${terrain?.name ?? tile.terrainId} ${tile.coord.q}:${tile.coord.r}`}
            >
              <span className="hex-label">{tile.label}</span>
              {unit && unit.status !== "destroyed" && unit.status !== "routed" && (
                <span className={`unit-token side-${unit.sideId} status-${unit.status}`}>
                  <span className="unit-icon">{unit.type.icon}</span>
                  <span className="unit-count">{unit.currentCount}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
