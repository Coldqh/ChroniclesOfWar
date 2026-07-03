export type HexMapLayoutMode = "terrain-tiles" | "image-underlay";

export type HexVisualMetrics = {
  width: number;
  height: number;
  xStep: number;
  yStep: number;
  paddingX: number;
  paddingY: number;
};

export type BattleMapLayout = {
  id: string;
  scenarioId: string;
  stageIds?: string[];
  mode: HexMapLayoutMode;
  backgroundClassName?: string;
  showTerrainFill: boolean;
  showHexLabels: boolean;
  metrics: HexVisualMetrics;
  notes?: string;
};
