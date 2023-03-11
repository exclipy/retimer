import { createMachine, assign, ActorRefFrom, spawn, actions } from "xstate";
import { TimerMachine, timerMachine } from "./machine";
const { stop } = actions;

type TimerListContextType = {
  schedule: { phase: "BREATHE_UP" | "HOLD"; timeMs: number }[];
  currentPhase: number;
  currentTimer: TimerMachine | undefined;
};

type TimerListEventType =
  | { type: "start" }
  | { type: "finish" }
  | { type: "reset" };

export const timerListMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBcCWBbMAnAMq2yAdAHID2yAysgIZbKQDEBtyA2gAwC6ioADqbFRpSAOx4gAHogCMADgBshAMwBWaSoBMGpQBYAnBvW6ANCACeMnSsIb9evQHYl7JfJXyAvh9NpMufEQAkiIACgAW1LBgDABmqCL4YRzcSCD8gsJiqVIIrtLKOtIOetIaDux67A46phYIGip6hLJaSg7qtoayVl4+GNh4BITB4ZHRcQmwSdIpfAJCqKLiOXkFKiqystU6Os5btYiu1u7y8gYa7Brdem29IL4DAYQAYvGJjFhwYGxc4ukLS2yiB2zQuVxu3R0Fwc8gOuVUhHc7GkekKVy2DgcKi83hAIlIEDg4ge-gIf3mmWWiAAtEpCEVHNJ2PJ1Cpito9HC1IRqvYDKcnHJpNI7iTBkQyJQaHRIOSMossqAcjpZHDpDtRf1SUFQhEonKAYrJIdmco1JptPpDColGqlE1bHynC43J5cWKnq9JmFZal-pSgQgVXCVRpQdolC1bJddDiPEA */
    id: "timerList",
    predictableActionArguments: true,
    tsTypes: {} as import("./timerlistMachine.typegen").Typegen0,
    schema: {
      context: {} as TimerListContextType,
      events: {} as TimerListEventType,
    },
    context: {
      schedule: [{ phase: "BREATHE_UP", timeMs: 5000 }],
      currentPhase: 0,
      currentTimer: undefined,
    },
    initial: "NotStarted",
    states: {
      NotStarted: { on: { start: "InPhase" } },
      InPhase: {
        on: {
          finish: [
            {
              target: "InPhase",
              cond: "hasNextPhase",
              actions: "incrementPhase",
            },
            "Finished",
          ],
        },

        entry: "spawnTimer",
        exit: "stopTimer",
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
      spawnTimer: assign({
        currentTimer: spawn(timerMachine),
      }),
      stopTimer: stop((context) => context.currentTimer as TimerMachine),
    },
    guards: {
      hasNextPhase: (context) => {
        return context.schedule.length > context.currentPhase + 1;
      },
    },
  }
);
