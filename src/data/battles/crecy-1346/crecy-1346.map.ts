import type { HexMapData } from "../../../core/hex/hex-types";

const crecyTerrainRows = [
  ["hill", "hill", "hill", "hill", "hill", "hill", "hill", "hill", "hill", "hill", "hill", "hill"],
  ["hill", "hill", "hill", "hill", "hill", "hill", "hill", "hill", "hill", "hill", "hill", "hill"],
  ["hill", "hill", "hill", "hill", "hill", "hill", "hill", "hill", "hill", "hill", "hill", "hill"],
  ["plain", "plain", "plain", "mud", "mud", "mud", "plain", "plain", "plain", "plain", "plain", "road"],
  ["plain", "plain", "plain", "mud", "mud", "mud", "plain", "plain", "plain", "plain", "road", "plain"],
  ["plain", "plain", "plain", "mud", "mud", "mud", "plain", "plain", "plain", "road", "plain", "plain"],
  ["plain", "plain", "plain", "mud", "mud", "mud", "plain", "plain", "road", "plain", "plain", "plain"],
  ["plain", "plain", "plain", "mud", "mud", "mud", "plain", "road", "plain", "plain", "plain", "plain"],
  ["plain", "plain", "plain", "mud", "mud", "plain", "plain", "road", "plain", "plain", "plain", "plain"],
] as const;

export const crecy1346Map: HexMapData = {
  width: 12,
  height: 9,
  tiles: crecyTerrainRows.flatMap((row, r) =>
    row.map((terrainId, q) => ({
      coord: { q, r },
      terrainId,
    })),
  ),
};
