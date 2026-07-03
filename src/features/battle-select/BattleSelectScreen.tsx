import type { BattleScenario } from "../../core/battle/battle-types";

type BattleSelectScreenProps = {
  battles: BattleScenario[];
  onSelect: (battleId: string) => void;
  onBack: () => void;
};

const atlasStops = [
  { year: "1346", label: "Креси", active: true },
  { year: "1356", label: "Пуатье", active: false },
  { year: "1415", label: "Азенкур", active: false },
  { year: "1453", label: "Кастийон", active: false },
];

export function BattleSelectScreen({ battles, onSelect, onBack }: BattleSelectScreenProps) {
  return (
    <main className="screen library-screen manuscript-screen">
      <header className="screen-header manuscript-header">
        <button className="ghost-button" onClick={onBack}>← Назад</button>
        <div>
          <span className="eyebrow">Кампанийный атлас</span>
          <h2>Столетняя война</h2>
        </div>
      </header>

      <section className="atlas-layout">
        <aside className="atlas-map-placeholder manuscript-panel">
          <div className="atlas-compass">✥</div>
          <div className="atlas-route">
            {atlasStops.map((stop) => (
              <div className={`atlas-stop ${stop.active ? "active" : "locked"}`} key={stop.label}>
                <span>{stop.year}</span>
                <strong>{stop.label}</strong>
              </div>
            ))}
          </div>
        </aside>

        <section className="battle-list manuscript-battle-list">
          {battles.map((battle) => (
            <button key={battle.id} className="battle-card manuscript-panel" onClick={() => onSelect(battle.id)}>
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

          <div className="battle-card manuscript-panel locked-scenario-card">
            <div>
              <span className="eyebrow">1356 · Франция</span>
              <h3>Пуатье</h3>
              <p>Будущий сценарий кампании. Пока закрыто.</p>
            </div>
            <div className="battle-meta">
              <span>LOCKED</span>
              <span>позже</span>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
