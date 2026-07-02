import type { BattleScenario } from "../../core/battle/battle-types";
import { getHistoryContent } from "../../content/history/history-content-registry";

type SideSelectScreenProps = {
  battle: BattleScenario;
  onStart: (sideId: string) => void;
  onBack: () => void;
};

export function SideSelectScreen({ battle, onStart, onBack }: SideSelectScreenProps) {
  const intro = getHistoryContent(battle.introContentId);

  return (
    <main className="screen side-screen">
      <header className="screen-header">
        <button className="ghost-button" onClick={onBack}>← Назад</button>
        <div>
          <span className="eyebrow">{battle.title}</span>
          <h2>Выбери сторону</h2>
        </div>
      </header>

      <section className="intro-panel">
        <h3>{intro?.title ?? "Вступление"}</h3>
        <p>{intro?.body ?? battle.description}</p>
      </section>

      <section className="side-grid">
        {battle.sides.map((side) => (
          <button key={side.id} className="side-card" onClick={() => onStart(side.id)}>
            <span className="side-mark" style={{ background: side.color }} />
            <h3>{side.name}</h3>
            <p>{side.objective}</p>
            <strong>Играть за {side.shortName}</strong>
          </button>
        ))}
      </section>
    </main>
  );
}
