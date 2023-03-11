import { createMachine, assign, ActorRefFrom, spawn, actions } from "xstate";
import { TimerMachine, timerMachine } from "./machine";
const { stop } = actions;

type TimerListContextType = {
  schedule: { phase: "BREATHE_UP" | "HOLD"; timeMs: number }[];
  currentPhase: number;
  timeRemainingMs: number;
};

type TimerListEventType =
  | { type: "start" }
  | { type: "stop" }
  | { type: "cancel" }
  | { type: "reset" };

export const timerListMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBcCWBbMAnAMq2yAdAHID2yAysgIZbKQDEBtyA2gAwC6ioADqbFRpSAOx4gAHogBMANnaFZADgCsK9tIDM7NQHZNKgDQgAnogAs0gJyElGgIzT752fatX2qgL5fjaTLj4RACSIgAKABbUsGCEAEpg1BAmDBzcSCD8gsJiGVIIula6hOz2+uzmjpYassZmCOo20kqa9rLuKvaaHvo+fhjYeASEoZHRsXEAriIiqCJQTMikvGniWUKoouL59hqailbO7BWy5q1WdYhKzoTdWvJK19LmRX0g-oNBI+FRMfHTs3mhAA6tQNvN7BQwABjVJcNYCDZbPKIQoKNzWZoedraJSXBCyTRKRRYtwqKyacxKVxvD6BYajX4TAFzKAgsFoCFQ2ESZj0QjUABm9CwAApdscAJQMOlDEI-cb-Gas9ngqCQmGrDLrHLbRC7ZqEcwqXTsU6tAzWWqmRCEmxtVy6XQvdhWSz2WkDenysZ-ABic3wEUYWr4iN1KIQ5ldRrNptNylKsjk+NcskIuj0Sl0WnM+jKnoCcu+vtiAdmsGDEFS9nSYeym1yoHy0jUGac0ek0hzSm7qlT2lsKiUVhU3Usrk0hc+DIVfzC1EmMWrzDoocy4cbeoJZ0IKjOunsj3Y+jU1vqukJRsOVnkKi0djd0+9JaZhAXS8Y0OoImhYAANuuOpbpG5h5nuzrKCosjOs4VL4nY+yaKcZTSOwrRuEo5jPsW5ZBowWBwGAbDwtqm7Is2+pdoo5ISu4zRjtc+L3tIe5yLovYwW4miaLoPi+CAIikBAcDiLKQQIg2FGSKi5g0Ycxz0aoRL2Pi2jFFY1yUrIybqKoOg4V8ZCUDQdCQJJSJNjJCCOCothEhxI5lDx3ZGDaUbWLYDgdq47ieIZs6lhZEaUQgyH2LGMEnmadhtCm7ndHZVJdISOautY2ECeJgVvgkST1PWlnbvIrG2Tmh77je0j4lSdlErIJo8eoJ7NHxWVesWjKKlMyrzMFIGhR4xJOnmjxqGabrmDVvaEJpXR2NcMH6G1-RFl8XV-D1gJsqCaoatC-XSfko7piNjnje0YHMaaRpaY4Xb2LsKgBT6b54ZW5lkVJVn5ISpW7I9LidPdmgDsUVK5joyhupmL2voqH7LodP22gYs2MfoxqqEeoPudccl3MhnhPC8K3vB1XzvVWyPbl0dmts0YGeOoajVe5yY2FS2NYe0cj7vxXhAA */
    id: "timerList",
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import("./timerListMachine.typegen").Typegen0,
    schema: {
      context: {} as TimerListContextType,
      events: {} as TimerListEventType,
    },
    context: {
      schedule: [{ phase: "BREATHE_UP", timeMs: 5000 }],
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
                  target: "#timerList.InPhase.Finished",
                  cond: "isZero",
                },
              },
            },
            initial: "Waiting1Sec",
            on: { stop: "#timerList.InPhase.Paused" },
          },
          Finished: {
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
              start: "#timerList.InPhase.Running",
              cancel: "#timerList.Finished",
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
      setTime: assign({ timeRemainingMs: 3000 }),
      decrement1Sec: assign({
        timeRemainingMs: (context) => context.timeRemainingMs - 1000,
      }),
    },
    guards: {
      hasNextPhase: (context) => {
        return context.schedule.length > context.currentPhase + 1;
      },
      isZero: (context) => context.timeRemainingMs <= 0,
    },
  }
);
