import { createMachine, assign, ActorRefFrom, spawn, actions } from "xstate";

export type Phase = "BREATHE_UP" | "HOLD";
export type ScheduleEntry = { readonly phase: Phase; readonly timeMs: number };
export type Schedule = readonly ScheduleEntry[];

export type TimerListContextType = {
  schedule: Schedule;
  currentPhase: number;
  timeRemainingMs: number;
  initialWallTimeMs: number;
};

type TimerListEventType =
  | { type: "start" }
  | { type: "resume" }
  | { type: "pause" }
  | { type: "cancel" }
  | { type: "reset" };

export const timerListMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBcCWBbMAnAMq2yAdAHID2yAysgIZbKQDEBtyA2gAwC6ioADqbFRpSAOx4gAHogC0ARgBs8wgHZl7AKwBOdfIAcAZkXaANCACeiWVYAshdvP3rl1-ZoPWPAX0+m0mXPhEAJIiAAoAFtSwYIQASgCuIiKoIlAMvNTx0RzcSCD8gsJieVIIhpqE1pr61gBM8mry1qrsyqYWCFY6hDrKNfLsreq6stbevhjYeASEIRFRMQlJKVCEAOrUQiuyFGAAxgw54gVbouKl+uyyhI7q7LUusprWWtby7Zb6ytfqw7pVb0032U4xAfimgVmYUi0TiiWSqXWmzQqR2+wYEmY9EI1AAZvQsAAKACCABEAFIAVQoABUAKKkgD6AHliHTGRQ6QBhVmkgCUDHBARmcxhi3hKyRW1Ruz2RzyJyK50QzUI2g0+lq+kcAx073Mllqv0IunUdTqrU0smUTVBQumwWhC0IADEUvhwpB5tFDlxjgJTsVQKVrKMTc8POovoYDOoPp06hVNLVdJp7CnarIDPI7ZNhY7vTE3clYJ6IIXDrJcnwA0qSirLip5FZVEDlLUrW0DZ0zbVKuxNPInLIo6ajbn-A6oYXCKFMtEIAw9tQRHswAAbeU1wqoM71hDyWrKNX3XTfPT6UbW+OyTX6NUGaqKPqKOoTiEip2wudZRhYODxJgW75LWu5BpIiB3NcDjKMmNqGA0Vg3rIHaEPUtTsLoqaDroDT6O++auu6pZ-nAYBsH6CqgXuwaIPUx4KNYsaDoo9xmjeTjHs8lxHqGoa-N4PggCIpAQHA4j2oE-o7jREEININTXI0WiyIMTHJlq8bPEojh1KMyhnl8BkEVOZCUDQdCQNJgbKvJHb3spVpqamtSad2KGXnYKYvIORpuJhJmQqKCzWXWtHyUxdgAg0r6uC41g3uw2omr2RqwQoWr4UJkmfjOSwIlAoVgbZ0jsFF2k2k0cU1JmCXuSh1y6a5TR9ECtSBblYpwssiIbNKUBonsRWyaUTg9Bm+imv8LkaDeOqEIomYYcM9TyG4HUFl1xYel6YrDeBIaGGhmo+WmIyqfoc1rWhLiwXeTg4Rt05dT+C77bZh5KGmGHJmt2gDLUyF1Dc6goUlDShg0ILZXmU7bSREDvfuPmEAomhWk0TzaCO+odAoVw9AYIyuVmVqyIJnhAA */
    id: "timerList",
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import("./timerListMachine.typegen").Typegen0,
    schema: {
      context: {} as TimerListContextType,
      events: {} as TimerListEventType,
    },
    context: {
      schedule: [],
      currentPhase: 0,
      timeRemainingMs: 0,
      initialWallTimeMs: 0,
    },
    initial: "NotStarted",
    states: {
      NotStarted: {
        on: {
          start: {
            target: "InPhase.Running",
            actions: "setTime",
          },
        },
      },
      InPhase: {
        states: {
          Running: {
            states: {
              Waiting1Sec: {
                always: {
                  target: "#timerList.InPhase.FinishedPhase",
                  cond: "isZero",
                },
                entry: "maybePlayAudio",
                after: {
                  ADJUSTED_ONE_SECOND: {
                    target: "#timerList.InPhase.Running.Waiting1Sec",
                    actions: "decrement1Sec",
                  },
                },
              },
            },

            initial: "Waiting1Sec",

            on: {
              pause: "#timerList.InPhase.Paused",
            },

            entry: ["recordWallTime"],
          },

          FinishedPhase: {
            always: [
              {
                target: "Running",
                cond: "hasNextPhase",
                actions: ["incrementPhase", "setTime"],
              },
              "#timerList.Finished",
            ],
          },

          Paused: {
            on: {
              cancel: "#timerList.Finished",
              resume: "#timerList.InPhase.Running",
            },
          },
        },

        initial: "Running",
      },
      Finished: {
        on: {
          reset: { target: "NotStarted", actions: ["resetPhase", "setTime"] },
        },
      },
    },
  },
  {
    actions: {
      incrementPhase: assign({
        currentPhase: (context) => context.currentPhase + 1,
      }),
      resetPhase: assign({ currentPhase: 0 }),
      setTime: assign({
        timeRemainingMs: (context) =>
          context.schedule[context.currentPhase].timeMs,
      }),
      decrement1Sec: assign({
        timeRemainingMs: (context) => context.timeRemainingMs - 1000,
      }),
      recordWallTime: assign({
        initialWallTimeMs: (context) =>
          new Date().getTime() - supposedlyElapsedMs(context),
      }),
    },
    guards: {
      hasNextPhase: (context) =>
        context.schedule.length > context.currentPhase + 1,
      isZero: (context) => context.timeRemainingMs <= 0,
    },
    delays: {
      ADJUSTED_ONE_SECOND: (context) => {
        const actuallyElapsedMs =
          new Date().getTime() - context.initialWallTimeMs;
        const lateByMs = actuallyElapsedMs - supposedlyElapsedMs(context);
        console.log(
          "late by",
          lateByMs,
          actuallyElapsedMs,
          supposedlyElapsedMs
        );
        return 1000 - lateByMs;
      },
    },
  }
);

function supposedlyElapsedMs(context: TimerListContextType): number {
  return (
    context.schedule[context.currentPhase].timeMs - context.timeRemainingMs
  );
}
