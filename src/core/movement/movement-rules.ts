import type { BattleScenario, BattleState, TerrainData, Unit } from "../battle/battle-types";
import type { HexCoord } from "../hex/hex-types";
import { getNeighbors, hexKey, sameHex } from "../hex/hex-utils";

function getTerrainAt(scenario: BattleScenario, coord: HexCoord): TerrainData | undefined {
  const tile = scenario.map.tiles.find((item) => sameHex(item.coord, coord));
  return scenario.terrain.find((terrain) => terrain.id === tile?.terrainId);
}

export function getUnitAt(state: BattleState, coord: HexCoord): Unit | undefined {
  return Object.values(state.units).find(
    (unit) => sameHex(unit.position, coord) && unit.status !== "destroyed" && unit.status !== "routed",
  );
}

export function getMovementRange(scenario: BattleScenario, state: BattleState, unit: Unit): HexCoord[] {
  if (unit.hasMoved || unit.status === "destroyed" || unit.status === "routed" || unit.status === "skipping") {
    return [];
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
        queue.push({ coord: neighbor, cost: nextCost });
      }
    }
  }

  return Array.from(visited.keys())
    .map((key) => {
      const [q, r] = key.split(",").map(Number);
      return { q, r };
    })
    .filter((coord) => !sameHex(coord, unit.position));
}

export function canMoveTo(scenario: BattleScenario, state: BattleState, unit: Unit, to: HexCoord): boolean {
  return getMovementRange(scenario, state, unit).some((coord) => sameHex(coord, to));
}
