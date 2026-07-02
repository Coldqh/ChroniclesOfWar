import type { BattleScenario, Unit } from "../../core/battle/battle-types";
import { rarityLabels } from "../../types/rarity";

type UnitPanelProps = {
  unit: Unit | null;
  scenario: BattleScenario;
};

export function UnitPanel({ unit, scenario }: UnitPanelProps) {
  if (!unit) {
    return (
      <section className="card-panel">
        <h3>Отряд не выбран</h3>
        <p>Нажми на свой отряд. Подсветятся доступные клетки и цели.</p>
      </section>
    );
  }

  const side = scenario.sides.find((item) => item.id === unit.sideId);
  const maxHp = unit.type.maxCount * unit.type.hpPerSoldier;
  const hpPercent = Math.round((unit.currentHp / maxHp) * 100);
  const moralePercent = Math.round((unit.morale / unit.type.morale) * 100);

  return (
    <section className="card-panel unit-panel">
      <span className="eyebrow">{side?.name} · {rarityLabels[unit.type.rarity]}</span>
      <h3>{unit.type.icon} {unit.type.name}</h3>
      {unit.commander && <p className="commander-line">Командир: {unit.commander.name}</p>}
      <div className="stat-row"><span>Люди</span><strong>{unit.currentCount}/{unit.type.maxCount}</strong></div>
      <div className="bar"><span style={{ width: `${hpPercent}%` }} /></div>
      <div className="stat-row"><span>Мораль</span><strong>{unit.morale}/{unit.type.morale}</strong></div>
      <div className="bar morale"><span style={{ width: `${moralePercent}%` }} /></div>
      <div className="unit-stats-grid">
        <span>АТК {unit.type.attack}</span>
        <span>ДАЛЬ {unit.type.range}</span>
        <span>ХОД {unit.type.speed}</span>
        <span>{unit.status.toUpperCase()}</span>
      </div>
    </section>
  );
}
