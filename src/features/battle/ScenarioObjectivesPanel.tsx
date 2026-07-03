import type { BattleScenario, BattleState } from "../../core/battle/battle-types";
import { getObjectiveStatuses } from "../../core/scenario/scenario-objectives";

type ScenarioObjectivesPanelProps = {
  scenario: BattleScenario;
  state: BattleState;
};

const statusLabels = {
  active: "активно",
  completed: "готово",
  failed: "провал",
} as const;

export function ScenarioObjectivesPanel({ scenario, state }: ScenarioObjectivesPanelProps) {
  const side = scenario.sides.find((item) => item.id === state.playerSideId);
  const objectives = getObjectiveStatuses(scenario, state, state.playerSideId);
  const activeStage = scenario.stages.find((stage) => stage.id === state.currentStageId);

  return (
    <section className="card-panel objectives-panel">
      <span className="eyebrow">Сценарий</span>
      <h3>Цели: {side?.name ?? "сторона"}</h3>

      {activeStage?.objective && (
        <div className="stage-objective">
          <span>Этап</span>
          <strong>{activeStage.objective}</strong>
        </div>
      )}

      <div className="objective-list">
        {objectives.map((objective) => (
          <div className={`objective-row objective-${objective.status}`} key={objective.id}>
            <div>
              <strong>{objective.shortLabel}</strong>
              <span>{objective.title}</span>
            </div>
            <em>{statusLabels[objective.status]}</em>
          </div>
        ))}
      </div>
    </section>
  );
}
