import type { BattleScenario, BattleState, Unit } from "../../core/battle/battle-types";
import { getCombatPreview } from "../../core/combat/combat-preview";

type CombatPreviewPanelProps = {
  selectedUnit: Unit | null;
  targets: Unit[];
  scenario: BattleScenario;
  state: BattleState;
};

export function CombatPreviewPanel({ selectedUnit, targets, scenario, state }: CombatPreviewPanelProps) {
  if (!selectedUnit) return null;

  return (
    <section className="card-panel">
      <h3>Прогноз атаки</h3>
      {targets.length === 0 && <p>Целей в дальности нет.</p>}
      {targets.map((target) => {
        const preview = getCombatPreview(scenario, state, selectedUnit, target);
        const maxHp = target.type.maxCount * target.type.hpPerSoldier;
        const afterPercent = Math.round((preview.targetHpAfter / maxHp) * 100);
        return (
          <div key={target.id} className="preview-row">
            <span>{target.type.icon} {target.type.name}</span>
            <div className="bar danger"><span style={{ width: `${afterPercent}%` }} /></div>
            <small>мораль -{preview.moraleDamage}</small>
          </div>
        );
      })}
    </section>
  );
}
