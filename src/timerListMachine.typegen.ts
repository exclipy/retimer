// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "done.invoke.acquireLockActor": {
      type: "done.invoke.acquireLockActor";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.acquireLockActor": {
      type: "error.platform.acquireLockActor";
      data: unknown;
    };
    "xstate.after(ADJUSTED_ONE_SECOND)#timerList.InPhase.Running.Waiting1Sec": {
      type: "xstate.after(ADJUSTED_ONE_SECOND)#timerList.InPhase.Running.Waiting1Sec";
    };
    "xstate.init": { type: "xstate.init" };
    "xstate.stop": { type: "xstate.stop" };
  };
  invokeSrcNameMap: {
    acquireLockActor: "done.invoke.acquireLockActor";
  };
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
      | "acquiredLock"
      | "done.invoke.acquireLockActor"
      | "resume"
      | "start"
      | "xstate.after(ADJUSTED_ONE_SECOND)#timerList.InPhase.Running.Waiting1Sec";
    recordWallTime:
      | ""
      | "acquiredLock"
      | "done.invoke.acquireLockActor"
      | "resume"
      | "start";
    releaseLock:
      | ""
      | "acquiredLock"
      | "done.invoke.acquireLockActor"
      | "pause"
      | "xstate.stop";
    resetPhase: "reset";
    saveLock: "acquiredLock";
    setTime: "" | "reset" | "start";
  };
  eventsCausingDelays: {
    ADJUSTED_ONE_SECOND:
      | ""
      | "acquiredLock"
      | "done.invoke.acquireLockActor"
      | "resume"
      | "start"
      | "xstate.after(ADJUSTED_ONE_SECOND)#timerList.InPhase.Running.Waiting1Sec";
  };
  eventsCausingGuards: {
    hasNextPhase: "";
    isZero: "";
  };
  eventsCausingServices: {
    acquireLockActor:
      | ""
      | "acquiredLock"
      | "done.invoke.acquireLockActor"
      | "resume"
      | "start";
  };
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
