import type { BattleScenario } from "../../core/battle/battle-types";
import { getHistoryContent } from "../../content/history/history-content-registry";

type SideSelectScreenProps = {
  battle: BattleScenario;
  onStart: (sideId: string) => void;
  onBack: () => void;
};

function getSideStyle(sideId: string) {
  if (sideId === "england") return "side-england-banner";
  if (sideId === "france") return "side-france-banner";
  return "side-neutral-banner";
}

function getSideIdentity(sideId: string) {
  if (sideId === "england") return "Высота · Лучники · Оборона";
  if (sideId === "france") return "Конница · Натиск · Численность";
  return "Армия · Приказ · Поле боя";
}

export function SideSelectScreen({ battle, onStart, onBack }: SideSelectScreenProps) {
  const intro = getHistoryContent(battle.introContentId);

  return (
    <main className="screen side-screen manuscript-screen">
      <header className="screen-header manuscript-header">
        <button className="ghost-button" onClick={onBack}>← Назад</button>
        <div>
          <span className="eyebrow">{battle.title}</span>
          <h2>Выбери сторону</h2>
        </div>
      </header>

      <section className="intro-panel manuscript-panel">
        <h3>{intro?.title ?? "Вступление"}</h3>
        <p>{intro?.body ?? battle.description}</p>
      </section>

      <section className="side-grid">
        {battle.sides.map((side) => (
          <button
            key={side.id}
            className={`side-card manuscript-panel faction-card ${getSideStyle(side.id)}`}
            onClick={() => onStart(side.id)}
          >
            <span className="side-mark" style={{ background: side.color }} />
            <span className="faction-banner-label">{side.shortName}</span>
            <h3>{side.name}</h3>
            <p>{side.objective}</p>
            <div className="faction-identity">{getSideIdentity(side.id)}</div>
            <strong>Играть за {side.shortName}</strong>
          </button>
        ))}
      </section>
    </main>
  );
}
