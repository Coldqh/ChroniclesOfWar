export type HexCoord = {
  q: number;
  r: number;
};

export type HexKey = string;

export type HexTile = {
  coord: HexCoord;
  terrainId: string;
  label?: string;
};

export type HexMapData = {
  width: number;
  height: number;
  tiles: HexTile[];
};
