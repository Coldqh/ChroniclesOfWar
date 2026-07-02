import type { UnitDeployment } from "../../../core/battle/battle-types";

export const crecy1346Deployments: UnitDeployment[] = [
  { id: "eng-longbow-1", sideId: "england", unitTypeId: "english-longbowmen", position: { q: 3, r: 2 } },
  { id: "eng-longbow-2", sideId: "england", unitTypeId: "english-longbowmen", position: { q: 8, r: 2 } },
  { id: "eng-men-at-arms-1", sideId: "england", unitTypeId: "english-men-at-arms", position: { q: 5, r: 1 }, commanderId: "edward-iii" },
  { id: "eng-men-at-arms-2", sideId: "england", unitTypeId: "english-men-at-arms", position: { q: 6, r: 2 }, commanderId: "black-prince" },

  { id: "fra-crossbow-1", sideId: "france", unitTypeId: "genoese-crossbowmen", position: { q: 4, r: 6 } },
  { id: "fra-crossbow-2", sideId: "france", unitTypeId: "genoese-crossbowmen", position: { q: 7, r: 6 } },
  { id: "fra-knights-1", sideId: "france", unitTypeId: "french-knights", position: { q: 5, r: 7 }, commanderId: "philip-vi" },
  { id: "fra-knights-2", sideId: "france", unitTypeId: "french-knights", position: { q: 8, r: 7 } },
  { id: "fra-footmen-1", sideId: "france", unitTypeId: "french-footmen", position: { q: 6, r: 8 } },
];
