import { Phase, Schedule, ScheduleEntry } from "../timerListMachine";
import { AudioKey } from "./AudioElements";

class Plan {
  private map = new Map<number, Map<number, AudioKey>>();

  add(phaseIndex: number, timeMs: number, key: AudioKey) {
    let script = this.map.get(phaseIndex);
    if (!script) {
      script = new Map<number, AudioKey>();
      this.map.set(phaseIndex, script);
    }
    script.set(timeMs, key);
  }

  lookup(phaseIndex: number, timeMs: number): AudioKey | undefined {
    return this.map.get(phaseIndex)?.get(timeMs);
  }
}

export function buildAudioPlan(schedule: Schedule): Plan {
  const plan = new Plan();
  for (let i = 0; i < schedule.length; i++) {
    const entry = schedule[i];
    const nextEntryType = getNextEntryType(schedule[i + 1]);

    function addToPlan(timeMs: number, key: AudioKey) {
      const leeway = nextEntryType === "END" ? 10000 : 45000;
      if (entry.timeMs >= timeMs + leeway) {
        plan.add(i, timeMs, key);
      }
    }

    if (entry.phase === "BREATHE_UP") {
      plan.add(i, 0, "BREATHE");
    } else if (entry.phase === "HOLD") {
      plan.add(i, 0, "HOLD");
      addToPlan(60000, "ALREADY_60S");
      addToPlan(90000, "T1M30S");
      addToPlan(120000, "T2M");
      addToPlan(150000, "T2M30S");
      addToPlan(180000, "T3M");
      addToPlan(210000, "T3M30S");
      addToPlan(240000, "T4M");
    }

    if (nextEntryType !== "END") {
      if (entry.timeMs >= 45000) {
        plan.add(i, entry.timeMs - 30000, "T30S_REMAINING");
      }
      if (entry.timeMs >= 20000) {
        plan.add(i, entry.timeMs - 10000, "T10S_LEFT");
      }
    }
    if (nextEntryType === "END") {
      plan.add(i, entry.timeMs, "THATS_IT_WELL_DONE");
    }
  }
  return plan;
}

function getNextEntryType(entry: ScheduleEntry): "END" | Phase {
  if (!entry) return "END";
  return entry.phase;
}

// const audioPlan = buildAudioPlan([
//   { phase: "BREATHE_UP", timeMs: 120000 },
//   { phase: "HOLD", timeMs: 120000 },
//   { phase: "HOLD", timeMs: 180000 },
//   { phase: "HOLD", timeMs: 180000 },
//   { phase: "HOLD", timeMs: 300000 },
// ]);
// audioPlan;
