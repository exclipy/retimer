import { useMachine } from "@xstate/solid";
import { Component, Show, Index, Match, Switch } from "solid-js";
import { formatPhase, formatTime, nicelyFormatTime } from "../formatTime";
import { Phase, timerListMachine } from "../timerlistMachine";
import styles from "./App.module.css";

const App: Component = () => {
  const [state, send] = useMachine(timerListMachine);
  return (
    <div class={styles.App}>
      <div class={styles.content}>
        <ol>
          <Index each={state.context.schedule}>
            {(item, i) => (
              <PhaseRow
                phaseSpec={item()}
                isCurrent={
                  state.matches("InPhase") && state.context.currentPhase === i
                }
              />
            )}
          </Index>
        </ol>
        <div>Remaining: {formatTime(state.context.timeRemainingMs)}</div>
        <div>{JSON.stringify(state.value)}</div>
        <Show when={state.can("start")}>
          <button
            onClick={() => {
              send({ type: "start" });
            }}
          >
            Start
          </button>
        </Show>
        <Show when={state.can("resume")}>
          <button
            onClick={() => {
              send({ type: "resume" });
            }}
          >
            Resume
          </button>
        </Show>
        <Show when={state.can("pause")}>
          <button
            onClick={() => {
              send({ type: "pause" });
            }}
          >
            Pause
          </button>
        </Show>
        <Show when={state.can("cancel")}>
          <button
            onClick={() => {
              send({ type: "cancel" });
            }}
          >
            Cancel
          </button>
        </Show>
        <Show when={state.can("reset")}>
          <button
            onClick={() => {
              send({ type: "reset" });
            }}
          >
            Reset
          </button>
        </Show>
      </div>
    </div>
  );
};

type PhaseProps = {
  phaseSpec: { phase: Phase; timeMs: number };
  isCurrent: boolean;
};
export const PhaseRow: Component<PhaseProps> = (props: PhaseProps) => {
  const text = () =>
    `${formatPhase(props.phaseSpec.phase)} ${nicelyFormatTime(
      props.phaseSpec.timeMs
    )}`;
  return (
    <Show when={props.isCurrent === true} fallback={<li>{text}</li>}>
      <li>
        <strong>{text}</strong>
      </li>
    </Show>
  );
};

export default App;
