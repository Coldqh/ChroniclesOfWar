import type { BattleMapLayout, HexVisualMetrics } from "../../core/map/map-layout-types";

export const DEFAULT_HEX_METRICS: HexVisualMetrics = {
  width: 72,
  height: 82,
  xStep: 72,
  yStep: 82 * 0.75,
  paddingX: 28,
  paddingY: 24,
};

export const battleMapLayouts: BattleMapLayout[] = [
  {
    id: "crecy-1346-game-grid-map",
    scenarioId: "crecy-1346",
    mode: "image-underlay",
    backgroundClassName: "map-bg-crecy-1346",
    showTerrainFill: false,
    showHexLabels: false,
    showGridLines: true,
    metrics: DEFAULT_HEX_METRICS,
    notes: "No baked AI grid. The game renders the exact clickable hex grid over the art.",
  },
];

export function getBattleMapLayout(scenarioId: string, stageId: string): BattleMapLayout {
  return (
    battleMapLayouts.find((layout) => {
      if (layout.scenarioId !== scenarioId) return false;
      return !layout.stageIds || layout.stageIds.includes(stageId);
    }) ?? {
      id: "default-terrain-tiles",
      scenarioId,
      mode: "terrain-tiles",
      showTerrainFill: true,
      showHexLabels: true,
      showGridLines: true,
      metrics: DEFAULT_HEX_METRICS,
    }
  );
}
