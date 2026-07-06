import type { BattleScenario, BattleState, Unit } from "../../core/battle/battle-types";
import { getCombatPreview } from "../../core/combat/combat-preview";
import { formatSignedPercent } from "../../core/combat/terrain-combat";

type CombatPreviewPanelProps = { selectedUnit: Unit | null; targets: Unit[]; scenario: BattleScenario; state: BattleState; };
function clampPercent(value: number) { return Math.max(0, Math.min(100, Math.round(value))); }

export function CombatPreviewPanel({ selectedUnit, targets, scenario, state }: CombatPreviewPanelProps) {
  if (!selectedUnit) return null;
  return (
    <section className="card-panel combat-preview-panel">
      <h3>Прогноз атаки</h3>
      {selectedUnit.hasAttacked && <p>Этот отряд уже атаковал в текущем ходу.</p>}
      {targets.length === 0 && <p>Целей в дальности нет.</p>}
      {targets.map((target) => {
        const preview = getCombatPreview(scenario, state, selectedUnit, target);
        const maxHp = target.type.maxCount * target.type.hpPerSoldier;
        const afterPercent = clampPercent((preview.targetHpAfter / maxHp) * 100);
        const losses = Math.max(0, target.currentCount - preview.targetCountAfter);
        return (
          <div key={target.id} className="preview-row detailed-preview-row">
            <div className="preview-target-line"><span>{target.type.icon} {target.type.name}</span><strong>дальн. {preview.distance}</strong></div>
            <div className="bar danger"><span style={{ width: `${afterPercent}%` }} /></div>
            <div className="preview-stat-grid">
              <span>Урон</span><strong>{preview.expectedDamage}</strong>
              <span>Потери</span><strong>{losses}</strong>
              <span>Мораль</span><strong>-{preview.moraleDamage}</strong>
              <span>HP после</span><strong>{preview.targetHpAfter}</strong>
              <span>Местность</span><strong>{preview.terrainName}</strong>
              <span>Защита</span><strong>{formatSignedPercent(preview.terrainDefenseModifier)}</strong>
              <span>Роль</span><strong>{formatSignedPercent(preview.roleAttackModifier)}</strong>
            </div>
          </div>
        );
      })}
    </section>
  );
}
