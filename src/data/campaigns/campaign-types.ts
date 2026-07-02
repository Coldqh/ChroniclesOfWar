import type { BattleId, CampaignId } from "../../types/ids";

export type CampaignData = {
  id: CampaignId;
  title: string;
  era: string;
  description: string;
  battleOrder: BattleId[];
};
