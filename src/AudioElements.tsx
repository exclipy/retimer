import { Component } from "solid-js";

import t10s_left from "../voice/10s-left.ogg";
import t1m30s from "../voice/1m30s.ogg";
import t2m from "../voice/2m.ogg";
import t2m30s from "../voice/2m30s.ogg";
import t30s_remaining from "../voice/30s-remaining.ogg";
import t3m from "../voice/3m.ogg";
import t3m15s from "../voice/3m15s.ogg";
import t3m30s from "../voice/3m30s.ogg";
import t3m45s from "../voice/3m45s.ogg";
import t4m from "../voice/4m.ogg";
import already60s from "../voice/already-60s.ogg";
import breathe from "../voice/breathe.ogg";
import hold from "../voice/hold.ogg";
import wellDone from "../voice/thats-it-well-done.ogg";

const audioFiles = {
  T10S_LEFT: t10s_left,
  T1M30S: t1m30s,
  T2M: t2m,
  T2M30S: t2m30s,
  T30S_REMAINING: t30s_remaining,
  T3M: t3m,
  T3M15S: t3m15s,
  T3M30S: t3m30s,
  T3M45S: t3m45s,
  T4M: t4m,
  ALREADY_60S: already60s,
  BREATHE: breathe,
  HOLD: hold,
  THATS_IT_WELL_DONE: wellDone,
};
export type AudioKey = keyof typeof audioFiles;

const audioMap = new Map<AudioKey, HTMLAudioElement>();

export const AudioElements: Component = () => {
  for (const key of Object.keys(audioFiles) as AudioKey[]) {
    audioMap.set(
      key,
      (<audio src={audioFiles[key]} preload="auto" />) as HTMLAudioElement
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
