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
    id: "crecy-1346-hex-art-map",
    scenarioId: "crecy-1346",
    mode: "image-underlay",
    backgroundClassName: "map-bg-crecy-1346",
    showTerrainFill: false,
    showHexLabels: false,
    metrics: {
      ...DEFAULT_HEX_METRICS,
      paddingX: 28,
      paddingY: 24,
    },
    notes: "Hex-lined generated map. Keep hitboxes transparent; map art owns the visible grid.",
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
      metrics: DEFAULT_HEX_METRICS,
    }
  );
}
