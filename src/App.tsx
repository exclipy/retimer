import { useMachine } from "@xstate/solid";
import { Component, Show } from "solid-js";
import { timerListMachine } from "../timerlistMachine";
import styles from "./App.module.css";

const App: Component = () => {
  const [state, send] = useMachine(timerListMachine);
  return (
    <div class={styles.App}>
      <div class={styles.content}>
        <div>{state.context.timeRemainingMs}</div>
        <div>{state.value.toString()}</div>
        <Show when={state.can("start")}>
          <button
            onClick={() => {
              send({ type: "start" });
            }}
          >
            Start
          </button>
        </Show>
        <Show when={state.can("stop")}>
          <button
            onClick={() => {
              send({ type: "stop" });
            }}
          >
            Stop
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
