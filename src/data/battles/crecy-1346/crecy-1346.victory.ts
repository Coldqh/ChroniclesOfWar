import type { VictoryCondition } from "../../../core/battle/battle-types";

export const crecy1346Victory: VictoryCondition[] = [
  { type: "eliminate_side", sideId: "england" },
  { type: "eliminate_side", sideId: "france" },
  { type: "hold_zone_until_turn", sideId: "england", zoneId: "english-high-ground", turn: 10 },
  { type: "occupy_zone", sideId: "france", zoneId: "breakthrough-zone" },
  { type: "rout_units", winnerSideId: "france", unitIds: ["eng-longbow-1", "eng-longbow-2"] },
  { type: "rout_units", winnerSideId: "england", unitIds: ["fra-knights-1", "fra-knights-2"] },
];
