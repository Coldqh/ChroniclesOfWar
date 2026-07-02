import type { VictoryCondition } from "../../../core/battle/battle-types";

export const crecy1346Victory: VictoryCondition[] = [
  { type: "eliminate_side", sideId: "england" },
  { type: "eliminate_side", sideId: "france" },
  { type: "survive_turns", sideId: "england", turns: 12 },
];
