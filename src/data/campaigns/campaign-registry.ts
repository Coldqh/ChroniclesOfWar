import type { CampaignData } from "./campaign-types";

export const campaignRegistry: CampaignData[] = [
  {
    id: "hundred-years-war",
    title: "Столетняя война",
    era: "Средневековье",
    description: "Хронологическая кампания-прототип. Пока доступна одна битва.",
    battleOrder: ["crecy-1346"],
  },
];
