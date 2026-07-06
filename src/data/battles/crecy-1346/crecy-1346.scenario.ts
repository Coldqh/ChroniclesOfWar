import type { BattleScenario } from "../../../core/battle/battle-types";
import { hundredYearsWarCommanders } from "../../commanders/commander-registry";
import { medievalTerrain } from "../../terrain/terrain-registry";
import { hundredYearsWarUnitTypes } from "../../units/unit-registry";
import { crecy1346Deployments } from "./crecy-1346.deployments";
import { crecy1346Map } from "./crecy-1346.map";
import { crecy1346Victory } from "./crecy-1346.victory";

export const crecy1346Scenario: BattleScenario = {
  id: "crecy-1346",
  campaignId: "hundred-years-war",
  title: "Креси, 1346",
  year: 1346,
  locationName: "Северная Франция",
  description: "Прототип крупной битвы Столетней войны: английская позиция на высоте против французского натиска.",
  sides: [
    {
      id: "england",
      name: "Англия",
      shortName: "ENG",
      color: "#d7b56d",
      objective: "Разбить все боеспособные французские отряды.",
    },
    {
      id: "france",
      name: "Франция",
      shortName: "FRA",
      color: "#7ea3ff",
      objective: "Разбить все боеспособные английские отряды.",
    },
  ],
  map: crecy1346Map,
  terrain: medievalTerrain,
  unitTypes: hundredYearsWarUnitTypes,
  commanders: hundredYearsWarCommanders,
  deployments: crecy1346Deployments,
  stages: [
    {
      id: "advance",
      title: "Передовая перестрелка",
      summary: "Арбалетчики и лучники начинают бой. Проверяется дальность, позиция и мораль.",
      startsAtTurn: 1,
      activeArea: { qMin: 0, qMax: 11, rMin: 0, rMax: 8 },
    },
    {
      id: "charge",
      title: "Рыцарский натиск",
      summary: "Французская конница пытается подняться по склону под обстрелом.",
      startsAtTurn: 5,
      activeArea: { qMin: 0, qMax: 11, rMin: 0, rMax: 8 },
    },
    {
      id: "last-stand",
      title: "Решающий участок",
      summary: "Оставшиеся силы давят на центр. Потери и мораль решают исход.",
      startsAtTurn: 9,
      activeArea: { qMin: 0, qMax: 11, rMin: 0, rMax: 8 },
    },
  ],
  victory: crecy1346Victory,
  introContentId: "crecy-1346-intro",
  aftermathContentId: "crecy-1346-aftermath",
};
