import { useMachine } from "@xstate/solid";
import { Component, Show, Index, ParentComponent } from "solid-js";
import { formatPhase, formatTime, nicelyFormatTime } from "./formatTime";
import {
  Phase,
  ScheduleEntry,
  TimerListContextType,
  timerListMachine,
} from "./timerlistMachine";
import styles from "./App.module.css";
import { AudioElements, playAudio } from "./AudioElements";
import { buildAudioPlan } from "./buildAudioPlan";

const schedule = [
  { phase: "BREATHE_UP", timeMs: 105000 },
  { phase: "HOLD", timeMs: 105000 },
  { phase: "HOLD", timeMs: 120000 },
  { phase: "HOLD", timeMs: 150000 },
] as const;
const audioPlan = buildAudioPlan(schedule);

const App: Component = () => {
  const [state, send] = useMachine(timerListMachine, {
    context: {
      schedule,
    },
    actions: {
      maybePlayAudio: (context: TimerListContextType) => {
        const phaseIndex = context.currentPhase;
        const timeMs = schedule[phaseIndex].timeMs - context.timeRemainingMs;

        const key = audioPlan.lookup(phaseIndex, timeMs);
        if (key) playAudio(key);
      },
    },
    delays: {},
    guards: {},
    services: {},
  });
  return (
    <div class={styles.App}>
      <AudioElements />
      <div class={styles.controls}>
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
      <div class={styles.side}>
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
      </div>
      <div class={styles.content}>
        <RemainingTime>
          {formatTime(state.context.timeRemainingMs)}
        </RemainingTime>
      </div>
    </div>
  );
};

type PhaseProps = { phaseSpec: ScheduleEntry; isCurrent: boolean };
const PhaseRow: Component<PhaseProps> = (props: PhaseProps) => {
  const text = () =>
    `${formatPhase(props.phaseSpec.phase)} ${nicelyFormatTime(
      props.phaseSpec.timeMs
    )}`;
  return <li classList={{ [styles.isCurrent]: props.isCurrent }}>{text}</li>;
};

const RemainingTime: ParentComponent = (props) => {
  return (
    <div>
      <label class={styles.timeLabel}>Remaining:</label>
      <div class={styles.bigTime}>{props.children}</div>
    </div>
  );
};

export default App;
