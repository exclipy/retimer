// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.after(1000)#timerList.InPhase.Running.Waiting1Sec": {
      type: "xstate.after(1000)#timerList.InPhase.Running.Waiting1Sec";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "maybePlayAudio";
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    decrement1Sec: "xstate.after(1000)#timerList.InPhase.Running.Waiting1Sec";
    incrementPhase: "";
    maybePlayAudio:
      | ""
      | "resume"
      | "xstate.after(1000)#timerList.InPhase.Running.Waiting1Sec";
    resetPhase: "reset";
    setTime: "" | "start";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    hasNextPhase: "";
    isZero: "";
  };
  eventsCausingServices: {};
  matchesStates:
    | "Finished"
    | "InPhase"
    | "InPhase.FinishedPhase"
    | "InPhase.Paused"
    | "InPhase.Ready"
    | "InPhase.Running"
    | "InPhase.Running.Waiting1Sec"
    | "NotStarted"
    | {
        InPhase?:
          | "FinishedPhase"
          | "Paused"
          | "Ready"
          | "Running"
          | { Running?: "Waiting1Sec" };
      };
  tags: never;
}
