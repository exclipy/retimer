import { createMachine, assign, ActorRefFrom, spawn, actions } from "xstate";

type TimerListContextType = {
  schedule: { phase: "BREATHE_UP" | "HOLD"; timeMs: number }[];
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
    /** @xstate-layout N4IgpgJg5mDOIC5QBcCWBbMAnAMq2yAdAHID2yAysgIZbKQDEBtyA2gAwC6ioADqbFRpSAOx4gAHogBMANnaFZADgCsK9tIDM7NQHZNKgDQgAnogAs0gJyElGgIzT752fatX2qgL5fjaTLj4RACSIgAKABbUsGCEAEpg1BAmDBzcSCD8gsJiGVIIula6hOz2+uzmjpYassZmCOo20kqa9rLuKvaaHvo+fhjYeASEoZHRsXEAriIiqCJQDLzUkzFp4llCqKLi+fYamopWzuwVsuatVnWISs6E3VrySjfS5kV9IP6DQSPhUTHx01m80IAHVqJt5vYKGAAMapLjrASbbZ5RCFBRuazNDztbRKK4IWSaJSKbFuFRWTTmJSud6fQLDUZ-CaAuZQUHgtCQ6FwiTMeiEagAM3oWAAFHsTgBKBj0oYhX7jAEzNkciFQKGwtYZDY5HaIPbNQjmFS6dhnVoGay1UyIIk2NquXS6V7sKyWex0gYMhVjf4AMTm+AikD9YHh6T4SL1qIQ5jdxvNZrNylKsjkBNcskIuj0Sl0WnM+jKXoC8p+YcIYWWMQgDCwcEmmG1UeyW1yoHyFsIKnOunsT3Y+jUNvquiJxqOVnkKi0dndpa+jMV-2rK0YMOoIhhYAANi3MtH2-q40Wey7lCpZC7nNSCXYDpozmVpOxWm4lOZFz7CIHZrAQzrBsYjYBEdSPFFOwNaRpEUClJXcZoVGJewCVnWDZ2vJQ5H7SlNF0b9yyZJU-2DUNmVSexI0PNtIMkGR00OKwnBUJ5KXdHRM3McxCGY902nsMobhLd4RFICA4HEOUgkRWiO3ogoeNkeCTkQ1QUIJbRiisZ4+JeTRtE0QjvjISgaDoSBZOReTdmkFRbGJXQ2LKAzpFzAlLBsOwnCcFw3A8JRjOXMMrJjKCECfexE2vIdzTsNoM1tCKrHs6lHEpZ1Ms6ILfWZeJEmSULj1jeRYMcU03PsXsp2kDzVDuGlTQM9Qh2aAjfA+b0iJXFkVXmIq6PyAKcxdJzVHUdpuLq2CdK6N8izs1oixyis8qmPr2TBdVNRhAabMQFLs2dIsnjUc13XMNCzWNG5Whgpw9hUFbiIDIMAPI8Y9pPIkyr2QSXE6RwtEzfCbsLHRlHdXNnp6qsa0s8C5O+gxeOQ-MqVYzoWnvW57ifTxnledr+jLb5SPeiAvtjLp7Ls5puM8dQ1FqpL0xsalVAHFxmOUr8fC8IA */
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
      NotStarted: { on: { start: "InPhase.Ready" } },
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
