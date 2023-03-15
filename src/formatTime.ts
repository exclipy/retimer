import { Phase } from "./timerListMachine";

export function formatTime(ms: number): string {
  const s = Math.ceil(ms / 1000);
  const sec = s % 60;
  const min = Math.floor(s / 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

export function nicelyFormatTime(ms: number): string {
  const s = Math.ceil(ms / 1000);
  const sec = s % 60;
  const min = Math.floor(s / 60);
  const minS = `${min} min`;
  const secS = `${sec} sec`;
  if (min === 0) {
    return secS;
  }
  if (sec === 0) {
    return minS;
  }
  return `${minS} ${secS}`;
}

export function formatPhase(phase: Phase) {
  switch (phase) {
    case "BREATHE_UP":
      return "Breathe up";
    case "HOLD":
      return "Hold";
    default:
      const x: never = phase;
  }
}
