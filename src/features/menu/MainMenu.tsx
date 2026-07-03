import { APP_BUILD_LABEL, APP_VERSION } from "../../app/version";

type MainMenuProps = {
  onStart: () => void;
};

const lockedSections = [
  "Армия",
  "Кодекс",
  "Командиры",
  "Ещё",
];

const missionCards = [
  { title: "Позиция на высоте", icon: "▲", status: "Учебная миссия" },
  { title: "Лучники", icon: "⌁", status: "Тактика" },
  { title: "Французский натиск", icon: "✚", status: "Сценарий" },
];

export function MainMenu({ onStart }: MainMenuProps) {
  return (
    <main className="screen menu-screen strategy-menu manuscript-screen">
      <header className="menu-topbar manuscript-topbar">
        <div className="campaign-title-block">
          <span className="eyebrow">Кампания</span>
          <strong>Хроники войны</strong>
          <span className="version-chip">{APP_VERSION}</span>
        </div>

        <div className="campaign-emblem" aria-label="Герб кампании">
          <span className="emblem-cross" />
        </div>

        <span className="menu-build-tag">{APP_BUILD_LABEL}</span>
      </header>

      <section className="war-room manuscript-war-room">
        <aside className="campaign-panel manuscript-panel">
          <span className="eyebrow">Военная хроника</span>
          <h1>Столетняя война</h1>
          <p>Англия и Франция. Высота, грязь, лучники, рыцарский натиск и цена плохого приказа.</p>

          <div className="heraldic-divider" />

          <div className="campaign-progress manuscript-progress">
            <span className="campaign-year active">1346</span>
            <span className="campaign-line" />
            <span className="campaign-year locked">1356</span>
            <span className="campaign-line" />
            <span className="campaign-year locked">1415</span>
            <span className="campaign-line" />
            <span className="campaign-year locked">1453</span>
          </div>
        </aside>

        <section className="current-battle-panel manuscript-panel featured-campaign-panel">
          <div className="battle-stamp">Доступная битва</div>
          <h2>Креси, 1346</h2>
          <p>
            Английская армия занимает высоту. Французская конница идёт в атаку.
            Местность, мораль и построение решают исход боя.
          </p>

          <div className="mission-card-row">
            {missionCards.map((mission) => (
              <div className="mission-card-placeholder" key={mission.title}>
                <span>{mission.icon}</span>
                <strong>{mission.title}</strong>
                <small>{mission.status}</small>
              </div>
            ))}
          </div>

          <button className="primary-button menu-play-button" onClick={onStart}>
            Играть
          </button>
        </section>

        <nav className="mode-panel manuscript-panel" aria-label="Разделы игры">
          <button className="mode-button active" onClick={onStart}>
            <strong>Битвы</strong>
            <span>Выбор сценария</span>
          </button>

          {lockedSections.map((section) => (
            <button className="mode-button locked" key={section} disabled>
              <strong>{section}</strong>
              <span>Позже</span>
            </button>
          ))}
        </nav>
      </section>

      <nav className="bottom-nav" aria-label="Нижняя навигация">
        <button className="active" onClick={onStart}>Кампания</button>
        <button disabled>Армия</button>
        <button disabled>Кодекс</button>
        <button onClick={onStart}>Битвы</button>
        <button disabled>Ещё</button>
      </nav>
    </main>
  );
}
