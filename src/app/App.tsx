import { useEffect, useMemo, useState } from "react";
import { createInitialBattleState } from "../core/battle/battle-state";
import type { BattleScenario, BattleState } from "../core/battle/battle-types";
import { battleRegistry, getBattleScenario } from "../data/battles/battle-registry";
import type { AppScreen } from "../state/battle-store-types";
import { BattleScreen } from "../features/battle/BattleScreen";
import { BattleSelectScreen } from "../features/battle-select/BattleSelectScreen";
import { MainMenu } from "../features/menu/MainMenu";
import { SideSelectScreen } from "../features/side-select/SideSelectScreen";

export type ThemeMode = "manuscript" | "dark";

export function App() {
  const [screen, setScreen] = useState<AppScreen>("menu");
  const [selectedBattleId, setSelectedBattleId] = useState<string | null>(null);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [theme, setTheme] = useState<ThemeMode>("manuscript");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const selectedBattle = useMemo(
    () => (selectedBattleId ? getBattleScenario(selectedBattleId) ?? null : null),
    [selectedBattleId],
  );

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "manuscript" : "dark"));
  }

  function startBattle(scenario: BattleScenario, sideId: string) {
    setBattleState(createInitialBattleState(scenario, sideId));
    setScreen("battle");
  }

  if (screen === "menu") {
    return <MainMenu onStart={() => setScreen("battle-select")} theme={theme} onToggleTheme={toggleTheme} />;
  }

  if (screen === "battle-select") {
    return (
      <BattleSelectScreen
        battles={battleRegistry}
        onBack={() => setScreen("menu")}
        onSelect={(battleId) => {
          setSelectedBattleId(battleId);
          setScreen("side-select");
        }}
      />
    );
  }

  if (screen === "side-select" && selectedBattle) {
    return (
      <SideSelectScreen
        battle={selectedBattle}
        onBack={() => setScreen("battle-select")}
        onStart={(sideId) => startBattle(selectedBattle, sideId)}
      />
    );
  }

  if (screen === "battle" && selectedBattle && battleState) {
    return (
      <BattleScreen
        scenario={selectedBattle}
        state={battleState}
        setState={setBattleState}
        theme={theme}
        onToggleTheme={toggleTheme}
        onExit={() => {
          setBattleState(null);
          setScreen("menu");
        }}
        onRestart={() => setScreen("side-select")}
      />
    );
  }

  return <MainMenu onStart={() => setScreen("battle-select")} theme={theme} onToggleTheme={toggleTheme} />;
}
