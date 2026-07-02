type MainMenuProps = {
  onStart: () => void;
};

export function MainMenu({ onStart }: MainMenuProps) {
  return (
    <main className="screen menu-screen">
      <section className="hero-panel">
        <div className="eyebrow">Хроники войны · v0.1</div>
        <h1>Исторические битвы на гексах</h1>
        <p>
          Первая техническая версия: без картинок, но с рабочим меню, выбором битвы, выбором стороны,
          движением, атакой, моралью, журналом и итогом боя.
        </p>
        <div className="hero-actions">
          <button className="primary-button" onClick={onStart}>Начать кампанию</button>
          <span className="small-note">MVP bootstrap · mobile landscape ready</span>
        </div>
      </section>
      <section className="menu-grid">
        <article>
          <strong>Тактика</strong>
          <span>Пошаговый бой, гексы, дальность, движение, мораль.</span>
        </article>
        <article>
          <strong>История</strong>
          <span>Битвы подключаются как данные. Тексты отдельно от движка.</span>
        </article>
        <article>
          <strong>Развитие</strong>
          <span>Позже сюда легко добавлять карты, генералов, юнитов и кампании.</span>
        </article>
      </section>
    </main>
  );
}
