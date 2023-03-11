import { useMachine } from "@xstate/solid";
import { Component, Show } from "solid-js";
import { timerListMachine } from "../timerlistMachine";
import styles from "./App.module.css";

const App: Component = () => {
  const [state, send] = useMachine(timerListMachine);
  const currentPhase = () => state.context.schedule[state.context.currentPhase];
  return (
    <div class={styles.App}>
      <div class={styles.content}>
        <div>
          {state.context.timeRemainingMs}/{currentPhase().timeMs}
        </div>
        <div>{currentPhase().phase}</div>
        <div>{state.context.currentPhase}</div>
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

export default App;
