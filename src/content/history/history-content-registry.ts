import type { HistoryContentBlock } from "./history-content-types";

export const historyContentRegistry: HistoryContentBlock[] = [
  {
    id: "crecy-1346-intro",
    title: "Креси, 1346",
    body: "Прототип исторического вступления. В будущем здесь будет короткий контекст без учебниковой духоты.",
  },
  {
    id: "crecy-1346-aftermath",
    title: "Итог битвы",
    body: "Прототип хроники последствий. Полная версия будет зависеть от результата игрока.",
  },
];

export function getHistoryContent(id: string | undefined): HistoryContentBlock | undefined {
  if (!id) return undefined;
  return historyContentRegistry.find((item) => item.id === id);
}
