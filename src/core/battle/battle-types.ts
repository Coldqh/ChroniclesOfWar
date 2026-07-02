import type { BattleId, BattleStageId, CampaignId, CommanderId, ContentId, SideId, TerrainId, UnitId, UnitTypeId } from "../../types/ids";
import type { Rarity } from "../../types/rarity";
import type { HexCoord, HexMapData } from "../hex/hex-types";

export type BattleSide = {
  id: SideId;
  name: string;
  shortName: string;
  color: string;
  objective: string;
};

export type TerrainData = {
  id: TerrainId;
  name: string;
  moveCost: number;
  defenseBonus: number;
  blocksMovement?: boolean;
};

export type UnitRole = "infantry" | "archer" | "crossbow" | "cavalry" | "guard" | "commander";

export type UnitType = {
  id: UnitTypeId;
  name: string;
  role: UnitRole;
  rarity: Rarity;
  maxCount: number;
  hpPerSoldier: number;
  attack: number;
  range: number;
  speed: number;
  morale: number;
  icon: string;
  notes?: string;
};

export type CommanderData = {
  id: CommanderId;
  name: string;
  sideId: SideId;
  rarity: Rarity;
  passiveLabel: string;
  moraleAura: number;
  attackAura: number;
  range: number;
  attachedUnitId?: UnitId;
};

export type UnitDeployment = {
  id: UnitId;
  sideId: SideId;
  unitTypeId: UnitTypeId;
  position: HexCoord;
  commanderId?: CommanderId;
};

export type VictoryCondition =
  | { type: "eliminate_side"; sideId: SideId }
  | { type: "survive_turns"; sideId: SideId; turns: number };

export type BattleStage = {
  id: BattleStageId;
  title: string;
  summary: string;
  startsAtTurn: number;
  activeArea: {
    qMin: number;
    qMax: number;
    rMin: number;
    rMax: number;
  };
};

export type BattleScenario = {
  id: BattleId;
  campaignId: CampaignId;
  title: string;
  year: number;
  locationName: string;
  description: string;
  sides: BattleSide[];
  map: HexMapData;
  terrain: TerrainData[];
  unitTypes: UnitType[];
  commanders: CommanderData[];
  deployments: UnitDeployment[];
  stages: BattleStage[];
  victory: VictoryCondition[];
  introContentId?: ContentId;
  aftermathContentId?: ContentId;
};

export type UnitStatus = "ready" | "shaken" | "skipping" | "routed" | "destroyed";

export type Unit = {
  id: UnitId;
  sideId: SideId;
  type: UnitType;
  position: HexCoord;
  commander?: CommanderData;
  currentHp: number;
  currentCount: number;
  morale: number;
  status: UnitStatus;
  hasMoved: boolean;
  hasAttacked: boolean;
};

export type BattlePhase = "player_turn" | "enemy_turn" | "finished";

export type BattleLogEntry = {
  id: string;
  turn: number;
  text: string;
  tone: "info" | "success" | "danger" | "history";
};

export type BattleResult = {
  winnerSideId: SideId;
  playerSideId: SideId;
  rank: "S" | "A" | "B" | "C" | "D";
  chronicle: string[];
};

export type BattleState = {
  scenarioId: BattleId;
  playerSideId: SideId;
  activeSideId: SideId;
  turn: number;
  phase: BattlePhase;
  currentStageId: BattleStageId;
  selectedUnitId: UnitId | null;
  units: Record<UnitId, Unit>;
  log: BattleLogEntry[];
  result: BattleResult | null;
};
