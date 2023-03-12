import { Component } from "solid-js";

const audioFiles = {
  T10S_LEFT: "10s-left.ogg",
  T1M30S: "1m30s.ogg",
  T2M: "2m.ogg",
  T2M30S: "2m30s.ogg",
  T30S_REMAINING: "30s-remaining.ogg",
  T3M: "3m.ogg",
  T3M15S: "3m15s.ogg",
  T3M30S: "3m30s.ogg",
  T3M45S: "3m45s.ogg",
  T4M: "4m.ogg",
  ALREADY_60S: "already-60s.ogg",
  BREATHE: "breathe.ogg",
  HOLD_YOUR_BREATH_STARTING_NOW: "hold-your-breath-starting-now.ogg",
  THATS_IT_WELL_DONE: "thats-it-well-done.ogg",
};
export type AudioKey = keyof typeof audioFiles;

const audioMap = new Map<AudioKey, HTMLAudioElement>();

export const AudioElements: Component = () => {
  for (const key of Object.keys(audioFiles) as AudioKey[]) {
    audioMap.set(
      key,
      (
        <audio src={`./voice/${audioFiles[key]}`} preload="auto" />
      ) as HTMLAudioElement
    );
  }

  return [...audioMap.values()];
};

export function playAudio(key: AudioKey) {
  audioMap.get(key)!.play();
}

export function stopAudio(key: AudioKey) {
  audioMap.get(key)!.pause();
  audioMap.get(key)!.currentTime = 0;
}
