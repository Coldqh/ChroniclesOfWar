import type { BattleScenario, BattleState, TerrainData, Unit } from "../battle/battle-types";
import type { HexCoord } from "../hex/hex-types";
import { getNeighbors, hexKey, sameHex } from "../hex/hex-utils";
import {
  getAdjacentEnemyUnits,
  getUnitAtCoord,
  isHexControlledByEnemy,
  isUnitEngaged,
} from "../engagement/engagement-rules";

export type MovementBlockReason = "unit_inactive" | "occupied" | "engaged" | "enemy_control" | "unreachable" | "already_moved";

function getTerrainAt(scenario: BattleScenario, coord: HexCoord): TerrainData | undefined {
  const tile = scenario.map.tiles.find((item) => sameHex(item.coord, coord));
  return scenario.terrain.find((terrain) => terrain.id === tile?.terrainId);
}

export function getUnitAt(state: BattleState, coord: HexCoord): Unit | undefined {
  return getUnitAtCoord(state, coord);
}

function canReceiveMovementOrder(unit: Unit): boolean {
  return unit.status !== "destroyed" && unit.status !== "routed" && unit.status !== "skipping";
}

function getEngagedMovementRange(scenario: BattleScenario, state: BattleState, unit: Unit): HexCoord[] {
  const adjacentEmpty = getNeighbors(unit.position, scenario.map.width, scenario.map.height).filter((coord) => {
    const terrain = getTerrainAt(scenario, coord);
    if (!terrain || terrain.blocksMovement) return false;
    return !getUnitAt(state, coord);
  });

  const cleanDisengage = adjacentEmpty.filter((coord) => !isHexControlledByEnemy(scenario, state, unit.sideId, coord));

  return cleanDisengage.length > 0 ? cleanDisengage : adjacentEmpty;
}

export function getMovementRange(scenario: BattleScenario, state: BattleState, unit: Unit): HexCoord[] {
  if (unit.hasMoved || !canReceiveMovementOrder(unit)) {
    return [];
  }

  if (isUnitEngaged(scenario, state, unit)) {
    return getEngagedMovementRange(scenario, state, unit);
  }

  const visited = new Map<string, number>();
  const queue: Array<{ coord: HexCoord; cost: number }> = [{ coord: unit.position, cost: 0 }];
  visited.set(hexKey(unit.position), 0);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;

    for (const neighbor of getNeighbors(current.coord, scenario.map.width, scenario.map.height)) {
      const terrain = getTerrainAt(scenario, neighbor);
      if (!terrain || terrain.blocksMovement) continue;

      const occupied = getUnitAt(state, neighbor);
      if (occupied && occupied.id !== unit.id) continue;

      const nextCost = current.cost + terrain.moveCost;
      const key = hexKey(neighbor);
      const previousCost = visited.get(key);

      if (nextCost <= unit.type.speed && (previousCost === undefined || nextCost < previousCost)) {
        visited.set(key, nextCost);

        const controlledByEnemy = isHexControlledByEnemy(scenario, state, unit.sideId, neighbor);
        if (!controlledByEnemy) {
          queue.push({ coord: neighbor, cost: nextCost });
        }
      }
    }
  }

  return Array.from(visited.keys())
    .map((key) => {
      const [q, r] = key.split(",").map(Number);
      return { q, r };
    })
    .filter((coord) => !sameHex(coord, unit.position) && !getUnitAt(state, coord));
}

export function canMoveTo(scenario: BattleScenario, state: BattleState, unit: Unit, to: HexCoord): boolean {
  if (unit.hasMoved || !canReceiveMovementOrder(unit)) {
    return false;
  }

  const occupied = getUnitAt(state, to);
  if (occupied && occupied.id !== unit.id) return false;

  return getMovementRange(scenario, state, unit).some((coord) => sameHex(coord, to));
}

export function getMovementBlockReason(scenario: BattleScenario, state: BattleState, unit: Unit, to: HexCoord): MovementBlockReason | null {
  if (unit.hasMoved) return "already_moved";
  if (!canReceiveMovementOrder(unit)) return "unit_inactive";

  const occupied = getUnitAt(state, to);
  if (occupied && occupied.id !== unit.id) return "occupied";

  if (canMoveTo(scenario, state, unit, to)) return null;

  if (isUnitEngaged(scenario, state, unit)) {
    return "engaged";
  }

  if (isHexControlledByEnemy(scenario, state, unit.sideId, to)) {
    return "enemy_control";
  }

  return "unreachable";
}

export function getMovementBlockMessage(reason: MovementBlockReason | null): string {
  switch (reason) {
    case "already_moved":
      return "Этот отряд уже двигался.";
    case "unit_inactive":
      return "Этот отряд не может двигаться.";
    case "occupied":
      return "Клетка занята.";
    case "engaged":
      return "Отряд связан боем.";
    case "enemy_control":
      return "Зона контроля врага.";
    case "unreachable":
    default:
      return "Клетка недоступна.";
  }
}
