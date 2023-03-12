import { createMachine, assign, ActorRefFrom, spawn, actions } from "xstate";

export type Phase = "BREATHE_UP" | "HOLD";

type TimerListContextType = {
  schedule: { phase: Phase; timeMs: number }[];
  currentPhase: number;
  timeRemainingMs: number;
};

type TimerListEventType =
  | { type: "start" }
  | { type: "resume" }
  | { type: "pause" }
  | { type: "cancel" }
  | { type: "reset" };

export const timerListMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBcCWBbMAnAMq2yAdAHID2yAysgIZbKQDEBtyA2gAwC6ioADqbFRpSAOx4gAHogDMAJmmEAbAE4A7AA5105YoCsARnWrZAGhABPRABZF6wrM27F0-cv37F7fQF9vZtJi4+EQAkiIACgAW1LBghABKYNQQ5gwc3Egg-ILCYplSCKpqhF6q0uxW+rJWsuyyimaWCLrsyvZaHsrKBtrsZb7+GNh4BIRhUTFx8QCuIiKoIlAMvNTTseni2UKoouIF+nUKKvpW7BWKVi7KjYjqJ4Ta8p6aVVZqAyABw8FjEdGxCVm80WhAA6tRtot9BQwABjNJcTYCba7fKIIrsQiuWTKBzKdgqcrqG4IZx2RR41y6ZTSKzqRQ+PyfIZBUbjf5TIELKBgiFoKEw+ESZj0QjUABm9CwAAoDmcAJQML6s0J-SaAubc3mQqDQuEbTJbXJ7RAHByEKy6VQEy76aS6HENCyIZxtDwM1SqN6tGqMwaBEaqiYAgBiC3wkUgwbACIyfGRxrRCFObVOimt1tsXgpTqaDMUhFUuitRnkVjK+lUH2Vgd+0cIYfmsEjEGjaX0cayCZ2eVABXqsiUXVk+l0mhpylOuhJFyshFxk487g0y+rLNr7PV4VWsQgDFh1BEsLAABsDfGcj2Tcny4QrTZ1E4vSc6ST1OwFNILpXai5XOorDXAMfk3AFtzWRgsDgaZMHPLtL1RPsXUuO9LlUQx3zKYtc3RZwLTcHR2AdaR30nIDvlGRsI0guAwDYRFDW7RDJFNWRBz0NwzmHR8SP0EkHUHB103Uep0JpaQqw+ERSAgOBxBrYIkQQ3sWMKOcOLlbjdF4klylUec7nKHRPE9PpFHIlUSHIKgWEgJSURU-ZZF0QgtCMcdK2kOQixJGo2nfEcRxsVx8XUCyNzVWJ7MTJCEC-fQLQJDMCXfDx6l07oLUMg4DF9YtwpAyKpiSFJoqvJNPEHKorVkdDdDebFfMfB56StLyWj6BxJP9Cigw5DVgSgMrmIKULCy9DRHxaFQrCsJrB2UQzalqdQ1FcAq2SKgatXBHU9VhYbHMQboC09ctHGmyc5udZprSyu0qjY9wiI2vr1So5sow5Q7r2cKqDncGwDEe6QZwkrKyyI2xJyLV66368Ddx+ir7XnbSjFpMcDC0N97keL92Beap3iZBTKPDT6IGR2K7Rc5yHFmwmWmLUwbopVNHEMGxcT0QDfG8IA */
    id: "timerList",
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import("./timerListMachine.typegen").Typegen0,
    schema: {
      context: {} as TimerListContextType,
      events: {} as TimerListEventType,
    },
    context: {
      schedule: [
        { phase: "BREATHE_UP", timeMs: 5000 },
        { phase: "HOLD", timeMs: 6000 },
        { phase: "HOLD", timeMs: 7000 },
      ],
      currentPhase: 0,
      timeRemainingMs: 3000,
    },
    initial: "NotStarted",
    states: {
      NotStarted: {
        on: {
          start: {
            target: "InPhase.Ready",
            actions: "playStartAudio",
          },
        },
      },
      InPhase: {
        states: {
          Ready: {
            entry: "setTime",
            always: {
              target: "#timerList.InPhase.Running",
            },
          },
          Running: {
            states: {
              Waiting1Sec: {
                after: {
                  "1000": {
                    target: "#timerList.InPhase.Running.Waiting1Sec",
                    actions: "decrement1Sec",
                  },
                },
                always: {
                  target: "#timerList.InPhase.FinishedPhase",
                  cond: "isZero",
                },
              },
            },
            initial: "Waiting1Sec",
            on: {
              pause: "#timerList.InPhase.Paused",
            },
          },
          FinishedPhase: {
            always: [
              {
                target: "Ready",
                cond: "hasNextPhase",
                actions: "incrementPhase",
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

        initial: "Ready",
      },
      Finished: {
        on: { reset: { target: "NotStarted", actions: "resetPhase" } },
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
    },
    guards: {
      hasNextPhase: (context) =>
        context.schedule.length > context.currentPhase + 1,
      isZero: (context) => context.timeRemainingMs <= 0,
    },
  }
);
