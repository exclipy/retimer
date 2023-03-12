import { useMachine } from "@xstate/solid";
import { Component, Show, Index } from "solid-js";
import { formatPhase, formatTime, nicelyFormatTime } from "./formatTime";
import {
  Phase,
  ScheduleEntry,
  TimerListContextType,
  timerListMachine,
} from "../timerlistMachine";
import styles from "./App.module.css";
import { AudioElements, playAudio } from "./AudioElements";
import { buildAudioPlan } from "./buildAudioPlan";

const schedule = [
  { phase: "BREATHE_UP", timeMs: 45000 },
  { phase: "HOLD", timeMs: 120000 },
  { phase: "HOLD", timeMs: 120000 },
  { phase: "HOLD", timeMs: 180000 },
  { phase: "HOLD", timeMs: 180000 },
  { phase: "HOLD", timeMs: 240000 },
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
  });
  return (
    <div class={styles.App}>
      <div class={styles.content}>
        <AudioElements />
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

type PhaseProps = { phaseSpec: ScheduleEntry; isCurrent: boolean };
const PhaseRow: Component<PhaseProps> = (props: PhaseProps) => {
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
