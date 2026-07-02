import type { HexCoord } from "../hex/hex-types";
import type { UnitId } from "../../types/ids";

export type BattleCommand =
  | { type: "SELECT_UNIT"; unitId: UnitId | null }
  | { type: "MOVE_UNIT"; unitId: UnitId; to: HexCoord }
  | { type: "ATTACK_UNIT"; attackerId: UnitId; targetId: UnitId }
  | { type: "END_TURN" };
