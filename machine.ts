import { createMachine, assign, sendParent, ActorRefFrom } from "xstate";
import { inspect } from "@xstate/inspect";
inspect({
  iframe: false, // open in new window
});

type ContextType = {
  timeRemainingMs: number;
};

type EventType =
  | { type: "start" }
  | { type: "stop" }
  | { type: "reset" }
  | { type: "setTime" }
  | { type: "decrement1Sec" };

const DEFAULT_TIME = 10000;

export const timerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBUCWBbMAnAsgQwGMALVAOzADoAlMPCATwGJYAXPLFgbQAYBdRUAAcA9rFQtUw0gJAAPRAFoAjACYArBRUAOFQHYAbPoDMS7gBYAnGoMAaEPURqjFbvqW6TatZd1ndSgF8AuzRMXEIScmoAV1JSMihmFmFBHn4kEBExCSkZeQQFI2cVC30VJTV9bi0irzsHBHKzCn8lKvNXJRNuNSCQjGx8YjJKKlj40igKAHU8cQSlAGUwAkY0mSz53Iz8i10KLTN9CzMtJUstfTVXesRPTRLa7gsa-TMjMz6QUMGIkZi4gkZnMJJMlitGLJWHgWJQ8AAzWFYAAUpm43AAlIwfuFhlExoDJsD5mDlgR1hlNjlpDtEHpuJpdBYKnoyiYurcEKoGSo3rySidrhVAsFvgNcZFKAAxMioWBESCMLBwMBcPgbURbGmgfIKMwVTTcXTcIzXLS6GpaLSc9zObhtCwve1VEptL44oaSigABTw0VgiuhHApQk11LyiiUBqcRje71MZkTZhtTha+i0zyMJqTKm4Knd4s9-19-sVyoDavSoeykm1ckUWY0JW0ViNbS81vsdJNLVNWYsRl5SisFiCotIwggcBkHr+5A1Ne2OsUR2KRpNZotRitnIU3l71n1xzU51NvgLYSL+NoDAXWojBRKzX1juHFRNFjzRk5qc6HntzJtJcbwXr8eKjOMCR3uGtIINYFCVFc8a6GoVhKFoFicoOaZmOo5pWImRgvKBEr-ASExTLMJJQOCBDQbWD6mBoiHeCYKFoRhNr6i0ZjVLxZTGqUA4kVe0qyvKkD0Uu9aPjoCGGE4aiHF0Rq8lhqgUHsA7ocyHgWiJc6UCWAYQFJda6rm+iMse5wGK8iack0LRRmUcaoaYppjgEQA */
    id: "TimerMachine",
    predictableActionArguments: true,
    tsTypes: {} as import("./machine.typegen").Typegen0,
    schema: { context: {} as ContextType, events: {} as EventType },
    context: { timeRemainingMs: 3000 },
    initial: "Ready",
    states: {
      Ready: { on: { start: "Running" }, entry: "setTime" },
      Running: {
        states: {
          Waiting1Sec: {
            after: {
              "1000": { target: "Waiting1Sec", actions: "decrement1Sec" },
            },
            always: { target: "#TimerMachine.Finished", cond: "isZero" },
          },
        },
        initial: "Waiting1Sec",
        on: { stop: "Paused" },
      },
      Finished: {
        on: { reset: "Ready" },
        entry: "emitFinished",
      },
      Paused: { on: { start: "Running", reset: "Ready" } },
    },
  },
  {
    actions: {
      setTime: assign({ timeRemainingMs: 3000 }),
      decrement1Sec: assign({
        timeRemainingMs: (context) => context.timeRemainingMs - 1000,
      }),
      emitFinished: sendParent({ type: "finished" }),
    },
    guards: { isZero: (context) => context.timeRemainingMs <= 0 },
  }
);

export type TimerMachine = ActorRefFrom<typeof timerMachine>;
