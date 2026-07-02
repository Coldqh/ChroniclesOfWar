import type { HexCoord, HexKey } from "./hex-types";

export const axialDirections: HexCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

export function hexKey(coord: HexCoord): HexKey {
  return `${coord.q},${coord.r}`;
}

export function sameHex(a: HexCoord, b: HexCoord): boolean {
  return a.q === b.q && a.r === b.r;
}

export function addHex(a: HexCoord, b: HexCoord): HexCoord {
  return { q: a.q + b.q, r: a.r + b.r };
}

export function hexDistance(a: HexCoord, b: HexCoord): number {
  const aq = a.q;
  const ar = a.r;
  const as = -aq - ar;
  const bq = b.q;
  const br = b.r;
  const bs = -bq - br;
  return Math.max(Math.abs(aq - bq), Math.abs(ar - br), Math.abs(as - bs));
}

export function isInsideRectMap(coord: HexCoord, width: number, height: number): boolean {
  return coord.q >= 0 && coord.r >= 0 && coord.q < width && coord.r < height;
}

export function getNeighbors(coord: HexCoord, width: number, height: number): HexCoord[] {
  return axialDirections
    .map((direction) => addHex(coord, direction))
    .filter((next) => isInsideRectMap(next, width, height));
}
