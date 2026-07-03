import type { BattleScenario, Unit } from "../../core/battle/battle-types";
import { rarityLabels } from "../../types/rarity";

type UnitPanelProps = {
  unit: Unit | null;
  scenario: BattleScenario;
};

const statusLabels: Record<Unit["status"], string> = {
  ready: "Боеспособен",
  shaken: "Потрясён",
  skipping: "Пропускает ход",
  routed: "Бежит",
  destroyed: "Разбит",
};

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function UnitPanel({ unit, scenario }: UnitPanelProps) {
  if (!unit) {
    return (
      <section className="card-panel">
        <h3>Отряд не выбран</h3>
        <p>Нажми на свой боеспособный отряд. После выбора подсветятся клетки движения и цели атаки.</p>
      </section>
    );
  }

  const side = scenario.sides.find((item) => item.id === unit.sideId);
  const maxHp = unit.type.maxCount * unit.type.hpPerSoldier;
  const hpPercent = clampPercent((unit.currentHp / maxHp) * 100);
  const moralePercent = clampPercent((unit.morale / unit.type.morale) * 100);
  const actionLabel =
    unit.hasMoved && unit.hasAttacked
      ? "Действия исчерпаны"
      : unit.hasMoved
        ? "Уже двигался"
        : unit.hasAttacked
          ? "Уже атаковал"
          : "Готов к приказу";

  return (
    <section className="card-panel unit-panel">
      <div className="unit-panel-header">
        <span className="eyebrow">{side?.name} · {rarityLabels[unit.type.rarity]}</span>
        <span className={`unit-status-badge status-${unit.status}`}>{statusLabels[unit.status]}</span>
      </div>

      <h3>{unit.type.icon} {unit.type.name}</h3>
      {unit.commander && <p className="commander-line">Командир: {unit.commander.name}</p>}

      <div className="stat-row"><span>Люди</span><strong>{unit.currentCount}/{unit.type.maxCount}</strong></div>
      <div className="bar"><span style={{ width: `${hpPercent}%` }} /></div>

      <div className="stat-row"><span>Мораль</span><strong>{unit.morale}/{unit.type.morale}</strong></div>
      <div className="bar morale"><span style={{ width: `${moralePercent}%` }} /></div>

      <div className="unit-action-state">{actionLabel}</div>

      <div className="unit-stats-grid">
        <span>АТК {unit.type.attack}</span>
        <span>ДАЛЬ {unit.type.range}</span>
        <span>ХОД {unit.type.speed}</span>
        <span>{unit.type.role}</span>
      </div>
    </section>
  );
}
