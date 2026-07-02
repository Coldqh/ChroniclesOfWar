import type { BattleScenario } from "../../core/battle/battle-types";

type BattleSelectScreenProps = {
  battles: BattleScenario[];
  onSelect: (battleId: string) => void;
  onBack: () => void;
};

export function BattleSelectScreen({ battles, onSelect, onBack }: BattleSelectScreenProps) {
  return (
    <main className="screen library-screen">
      <header className="screen-header">
        <button className="ghost-button" onClick={onBack}>← Назад</button>
        <div>
          <span className="eyebrow">Выбор битвы</span>
          <h2>Кампания: Столетняя война</h2>
        </div>
      </header>

      <section className="battle-list">
        {battles.map((battle) => (
          <button key={battle.id} className="battle-card" onClick={() => onSelect(battle.id)}>
            <div>
              <span className="eyebrow">{battle.year} · {battle.locationName}</span>
              <h3>{battle.title}</h3>
              <p>{battle.description}</p>
            </div>
            <div className="battle-meta">
              <span>{battle.sides.map((side) => side.shortName).join(" vs ")}</span>
              <span>{battle.map.width}×{battle.map.height} гексов</span>
              <span>{battle.stages.length} этапа</span>
            </div>
          </button>
        ))}
      </section>
    </main>
  );
}
