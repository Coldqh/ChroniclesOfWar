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
      objective: "Удержать высоту и сломать французский натиск.",
    },
    {
      id: "france",
      name: "Франция",
      shortName: "FRA",
      color: "#7ea3ff",
      objective: "Прорвать английскую позицию и уничтожить ключевые отряды.",
    },
  ],
  map: crecy1346Map,
  terrain: medievalTerrain,
  unitTypes: hundredYearsWarUnitTypes,
  commanders: hundredYearsWarCommanders,
  deployments: crecy1346Deployments,
  zones: [
    { id: "english-high-ground", name: "Английская высота", area: { qMin: 2, qMax: 9, rMin: 0, rMax: 2 }, label: "Удержать" },
    { id: "french-approach", name: "Французский подход", area: { qMin: 3, qMax: 9, rMin: 6, rMax: 8 }, label: "Подход" },
    { id: "muddy-field", name: "Грязное поле", area: { qMin: 4, qMax: 5, rMin: 3, rMax: 6 }, label: "Грязь" },
    { id: "center-line", name: "Центральная линия", area: { qMin: 4, qMax: 7, rMin: 2, rMax: 4 }, label: "Центр" },
    { id: "breakthrough-zone", name: "Зона прорыва", area: { qMin: 4, qMax: 7, rMin: 0, rMax: 1 }, label: "Прорыв" },
  ],
  objectives: [
    { id: "eng-hold-high-ground", sideId: "england", title: "Удержать высоту", shortLabel: "Высота", condition: { type: "hold_zone_until_turn", zoneId: "english-high-ground", turn: 10 } },
    { id: "eng-keep-longbows", sideId: "england", title: "Сохранить лучников", shortLabel: "Лучники", condition: { type: "keep_units_active", unitIds: ["eng-longbow-1", "eng-longbow-2"], minimum: 1 } },
    { id: "eng-break-charge", sideId: "england", title: "Сломать рыцарский натиск", shortLabel: "Натиск", condition: { type: "rout_units", unitIds: ["fra-knights-1", "fra-knights-2"] } },
    { id: "fra-breakthrough", sideId: "france", title: "Прорвать центр", shortLabel: "Прорыв", condition: { type: "occupy_zone", zoneId: "breakthrough-zone" } },
    { id: "fra-rout-longbows", sideId: "france", title: "Вывести лучников из боя", shortLabel: "Лучники", condition: { type: "rout_units", unitIds: ["eng-longbow-1", "eng-longbow-2"] } },
    { id: "fra-keep-cavalry", sideId: "france", title: "Сохранить конницу", shortLabel: "Конница", condition: { type: "keep_units_active", unitIds: ["fra-knights-1", "fra-knights-2"], minimum: 1 } },
  ],
  events: [
    { id: "crecy-early-skirmish", turn: 2, title: "Перестрелка", text: "Арбалетчики и длиннолучники втягивают передовые отряды в бой.", tone: "history" },
    { id: "crecy-french-charge", turn: 5, title: "Рыцарский натиск", text: "Французская конница давит вверх по склону. Грязь и высота становятся важны.", tone: "danger" },
    { id: "crecy-center-pressure", turn: 7, title: "Давление на центр", text: "Центральная линия становится главным участком боя.", tone: "history" },
    { id: "crecy-final-push", turn: 9, title: "Последний нажим", text: "Исход решат мораль, потери и контроль высоты.", tone: "danger" },
  ],
  stages: [
    {
      id: "advance",
      title: "Передовая перестрелка",
      summary: "Арбалетчики и лучники начинают бой. Проверяется дальность и мораль.",
      objective: "Измотать передовые отряды и занять удобную позицию.",
      startsAtTurn: 1,
      activeArea: { qMin: 2, qMax: 9, rMin: 1, rMax: 7 },
    },
    {
      id: "charge",
      title: "Рыцарский натиск",
      summary: "Французская конница пытается подняться по склону под обстрелом.",
      objective: "Англии нужно удержать высоту. Франции — продавить центр.",
      startsAtTurn: 5,
      activeArea: { qMin: 1, qMax: 10, rMin: 1, rMax: 8 },
    },
    {
      id: "last-stand",
      title: "Решающий участок",
      summary: "Оставшиеся силы давят на центр. Потери и мораль решают исход.",
      objective: "Франции нужен прорыв. Англии нужно дотянуть линию до конца боя.",
      startsAtTurn: 9,
      activeArea: { qMin: 0, qMax: 11, rMin: 0, rMax: 8 },
    },
  ],
  victory: crecy1346Victory,
  introContentId: "crecy-1346-intro",
  aftermathContentId: "crecy-1346-aftermath",
};
