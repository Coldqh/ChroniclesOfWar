import type { HexMapData } from "../../../core/hex/hex-types";

export const crecy1346Map: HexMapData = {
  width: 12,
  height: 9,
  tiles: Array.from({ length: 12 * 9 }, (_, index) => {
    const q = index % 12;
    const r = Math.floor(index / 12);
    let terrainId = "plain";

    if (r <= 2 && q >= 2 && q <= 9) terrainId = "hill";
    if ((q === 4 || q === 5) && r >= 3 && r <= 6) terrainId = "mud";
    if (q <= 1 || q >= 10) terrainId = "forest";
    if (q === r + 2 || q === r + 3) terrainId = "road";

    return {
      coord: { q, r },
      terrainId,
      label: q === 6 && r === 1 ? "Высота" : undefined,
    };
  }),
};
