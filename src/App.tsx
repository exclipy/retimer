import { useActor, useMachine } from "@xstate/solid";
import { Component, createSignal, Show } from "solid-js";
import { TimerMachine } from "../machine";
import { timerListMachine } from "../timerlistMachine";
import styles from "./App.module.css";

const App: Component = () => {
  const [state, send] = useMachine(timerListMachine);
  return (
    <div class={styles.App}>
      <div class={styles.content}>
        <Show when={state.can("start")}>
          <button
            onClick={() => {
              send({ type: "start" });
            }}
          >
            Start
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
        <Show when={state.can("finish")}>
          <button
            onClick={() => {
              send({ type: "finish" });
            }}
          >
            Finish
          </button>
        </Show>
        <Show when={state.context.currentTimer}>
          <Timer actorRef={state.context.currentTimer!}></Timer>
        </Show>
      </div>
    </div>
  );
};

type TimerProps = { actorRef: TimerMachine };
const Timer: Component<TimerProps> = ({ actorRef }: TimerProps) => {
  const [state, send] = useActor(actorRef);
  return (
    <div>
      <div>{state().context.timeRemainingMs}</div>
      <div>{state().value.toString()}</div>
      <Show when={state().can("start")}>
        <button
          onClick={() => {
            send({ type: "start" });
          }}
        >
          Start
        </button>
      </Show>
      <Show when={state().can("stop")}>
        <button
          onClick={() => {
            send({ type: "stop" });
          }}
        >
          Stop
        </button>
      </Show>
      <Show when={state().can("reset")}>
        <button
          onClick={() => {
            send({ type: "reset" });
          }}
        >
          Reset
        </button>
      </Show>
    </div>
  );
};

export default App;
