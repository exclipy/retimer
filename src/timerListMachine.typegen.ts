// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.after(ADJUSTED_ONE_SECOND)#timerList.InPhase.Running.Waiting1Sec": {
      type: "xstate.after(ADJUSTED_ONE_SECOND)#timerList.InPhase.Running.Waiting1Sec";
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
    decrement1Sec: "xstate.after(ADJUSTED_ONE_SECOND)#timerList.InPhase.Running.Waiting1Sec";
    incrementPhase: "";
    maybePlayAudio:
      | ""
      | "resume"
      | "start"
      | "xstate.after(ADJUSTED_ONE_SECOND)#timerList.InPhase.Running.Waiting1Sec";
    recordWallTime: "" | "resume" | "start";
    resetPhase: "reset";
    setTime: "" | "reset" | "start";
  };
  eventsCausingDelays: {
    ADJUSTED_ONE_SECOND:
      | ""
      | "resume"
      | "start"
      | "xstate.after(ADJUSTED_ONE_SECOND)#timerList.InPhase.Running.Waiting1Sec";
  };
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
    | "InPhase.Running"
    | "InPhase.Running.Waiting1Sec"
    | "NotStarted"
    | {
        InPhase?:
          | "FinishedPhase"
          | "Paused"
          | "Running"
          | { Running?: "Waiting1Sec" };
      };
  tags: never;
}
