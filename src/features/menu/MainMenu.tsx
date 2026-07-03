type MainMenuProps = {
  onStart: () => void;
};

const lockedSections = [
  "Командиры",
  "Архив войск",
  "Энциклопедия",
  "Песочница",
];

export function MainMenu({ onStart }: MainMenuProps) {
  return (
    <main className="screen menu-screen strategy-menu">
      <header className="menu-topbar">
        <div>
          <strong>Хроники войны</strong>
          <span>v0.1</span>
        </div>
        <span className="menu-build-tag">Историческая тактика</span>
      </header>

      <section className="war-room">
        <aside className="campaign-panel">
          <span className="eyebrow">Кампания</span>
          <h1>Столетняя война</h1>
          <p>Англия и Франция. Рыцари, лучники, грязь, мораль и цена плохого приказа.</p>

          <div className="campaign-progress">
            <span className="campaign-year active">1346</span>
            <span className="campaign-line" />
            <span className="campaign-year locked">1356</span>
            <span className="campaign-line" />
            <span className="campaign-year locked">1415</span>
            <span className="campaign-line" />
            <span className="campaign-year locked">1453</span>
          </div>
        </aside>

        <section className="current-battle-panel">
          <div className="battle-stamp">Доступная битва</div>
          <h2>Креси, 1346</h2>
          <p>
            Английская армия занимает высоту. Французская конница идёт в атаку.
            Первое демо проверяет гексы, движение, атаку, мораль и выбор стороны.
          </p>

          <div className="battle-facts">
            <span>Пошаговый бой</span>
            <span>2 стороны</span>
            <span>Гексы</span>
            <span>Мораль</span>
          </div>

          <button className="primary-button menu-play-button" onClick={onStart}>
            Играть
          </button>
        </section>

        <nav className="mode-panel" aria-label="Разделы игры">
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
    </main>
  );
}
