import { createMachine, assign, ActorRefFrom, spawn, actions } from "xstate";

export type Phase = "BREATHE_UP" | "HOLD";
export type ScheduleEntry = { readonly phase: Phase; readonly timeMs: number };
export type Schedule = readonly ScheduleEntry[];

export type TimerListContextType = {
  schedule: Schedule;
  currentPhase: number;
  timeRemainingMs: number;
  initialWallTimeMs: number;
  wakeLock: WakeLockSentinel | undefined;
};

type TimerListEventType =
  | { type: "start" }
  | { type: "resume" }
  | { type: "pause" }
  | { type: "cancel" }
  | { type: "reset" }
  | { type: "acquiredLock"; sentinel: WakeLockSentinel };

export const timerListMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBcCWBbMAnAMq2yAdAHID2yAysgIZbKQDEBtyA2gAwC6ioADqbFRpSAOx4gAHogC0ARgBs8wgHZl7AKwBOdfIAcAZkXaANCACeiWVYAshdvP3rl1-ZoPWPAX0+m0mXPhEAJIiAAoAFtSwYIQASgCuIiKoIlAMEKIxKQBupADWMdQAxgCO8ahYYDikRXkAgkXIpFgc3Egg-ILCYu1SCOrs+oTaGvoATPqO8hqKphYIsjqydrrqi-JjumOyBvLevhjYeASEIRFRMQlJKWm81PHRreKdQqii4n2GmoTWmvrWY3kank1lU7GUc0s60IOmU-2m4PUulk1n2ID8R0CpzCkWicUSyVShAA6tRXqlZBQwEUGE92i9uh9EPp2MtHAMxi5ZJprFprPJIQt9MpluokbpfvzNCLlGiMQETmdcZcCTcSWS0BSqTSJMx6IRqAAzehYAAUdQAIgApACqFAAKgBRC0AfQA8sRHS6KI6AMIei0ASgY8uOwRxF3x1yJpPJUEp1LpfAEr3evUQoOGA3U40mOhmAvMljGYsIqwBAPBmlkyhBcsOCvD5zxADEUvhwpBm2BaVxninGemENYUWWeR4c3C9I5BSixt9NJtNPZNttdvX-GHsd3CG3krBOxBu7TZG1k103j1QH0XOwVPIrKppcp5zXZ+oAT92Jp5E5FvpVhLDdMUVCM8VCe5oggBgimoEQijAAAbJMOgHS8mQQDZlGGdhNhFacUTfIshQmYYDD+RQpxBMZgMbbdlUICCHkYSpYHiTAUIZdChwGZYHGURda0MIErFnWR50IQExnYXRdE0H9dCBfRaK3PcOxYuAwDYPt6TQtNr0QTlsMMecJisQFWTFWcgTGGEdlBX5HF5FSsSVSMrkJNJijKCpIGqWpOL0q9JEsXDCBsJwtFzWs1nfUif1+RYxmUXQNDFbwfBAERSAgOBxFDQJ+wvfSQoQaROW+TYPFS38tDnXRBTk2wnLGTlAWBfkXJOMhKBoOhICK1Ngr6crWUkiVrBqsVqwBBriPE1RCEmGTZHsKtfy6ptlUGwcDLKya7ElIFFBcHl-kFNxlnLVq9DcBwgMygrQJ3Dybh27i9ukO92CO2sQVcFwARRWd7G+Fr5xzXD2B+zb6Pc1UYw1G4EyKd6Sr6JwYVXACkUmxcNFnKZCEUbZpKRQF5DcWG3NbdsDy7bbdOK4aM0MSTxl5eSVtW-RCcpySXAE3MnAU6mwJiJioLRlnMMBHDpMXSntGmMYxM-RxxMGIERyBWVHobVS6cPaWMOqgWEScOTKdrWc1F0YZ8Ok1qDA-DLPCAA */
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
      wakeLock: undefined,
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

              acquiredLock: {
                target: "Running",
                internal: true,
                actions: "saveLock",
              },
            },

            entry: ["recordWallTime"],

            invoke: {
              src: "acquireLockActor",
              id: "acquireLockActor",

              onDone: {
                target: "Running",
                internal: true,
              },
            },

            exit: "releaseLock",
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
    services: {
      acquireLockActor: (context, event) => (sendBack) => {
        if (navigator.wakeLock) {
          navigator.wakeLock
            .request("screen")
            .then((sentinel) => sendBack({ type: "acquiredLock", sentinel }));
        }
      },
    },
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
      saveLock: assign({ wakeLock: (context, event) => event.sentinel }),
      releaseLock: assign({
        wakeLock: (context) => {
          if (context.wakeLock) context.wakeLock.release();
          return undefined;
        },
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
