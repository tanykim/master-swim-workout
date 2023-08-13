import { NumberFormat } from "../Intervals";
import {
  BASE_DISTANCE,
  BASE_LENGTH,
  DISTANCE_UNIT,
  INTERVAL_BASE,
  REPEAT_BREAK_SEC,
  WORKOUT_BREAK_SEC,
} from "./const";
import {
  SingleDistanceWorkout,
  SingleTimedWorkout,
  SingleWorkout,
  SingleWorkoutGroup,
  WorkoutList,
} from "./types";

export function getHumanReadableFromSeconds(seconds: number): string {
  const hour = Math.floor(seconds / 3600);
  const min = Math.floor((seconds - hour * 60 * 60) / 60);
  const sec = seconds % 60;

  return `${hour > 0 ? `${hour}:` : ""}${
    hour > 0 && min < 10 ? "0" : ""
  }${min}:${sec < 10 ? `0${sec}` : sec}`;
}

export function getTotalSecondsFromInterval(
  base: number,
  length: number,
  format: NumberFormat = "ceiling",
  offset: number = 0
): number {
  let totalSec = Math.round(base * (length / BASE_LENGTH)) + offset;
  if (format === "round") {
    totalSec = Math.round(totalSec / 5) * 5;
  } else if (format === "ceiling") {
    totalSec = Math.ceil(totalSec / 5) * 5;
  } else if (format === "floor") {
    totalSec = Math.floor(totalSec / 5) * 5;
  }

  return totalSec;
}

export function getTimeFromInterval(
  base: number,
  length: number,
  format: NumberFormat = "ceiling",
  offset: number = 0
): string {
  const totalSec = getTotalSecondsFromInterval(base, length, format, offset);
  return getHumanReadableFromSeconds(totalSec);
}

export function getTotalLapsPerGroup(workoutList: WorkoutList, useAlt = false) {
  return workoutList.reduce((acc: number, curr: SingleWorkout) => {
    if (Object.keys(curr).includes("repeats")) {
      const { repeats, length, alt } = curr as SingleDistanceWorkout;
      return (
        acc +
        (alt != null && useAlt ? alt?.length * alt?.repeats : length * repeats)
      );
    } else {
      return acc;
    }
  }, 0);
}

export function getTotalSecondsFromIntervalPerDistanceWorkout(
  base: number,
  workout: SingleDistanceWorkout
) {
  const { repeats, alt, length, intervalOffset, restSeconds } = workout;

  // Check slow lane alternative;
  const totalLen =
    base >= 120 && alt != null ? alt.repeats * alt.length : repeats * length;
  return getTotalSecondsFromInterval(
    base,
    totalLen,
    "ceiling",
    repeats *
      (alt?.restSeconds ?? restSeconds ?? intervalOffset ?? REPEAT_BREAK_SEC)
  );
}

export function getTotalSecondsFromIntervalPerGroup(
  base: number,
  workoutList: WorkoutList
) {
  return workoutList.reduce((acc: number, curr: SingleWorkout) => {
    let totalSec = 0;
    if (Object.keys(curr).includes("repeats")) {
      totalSec = getTotalSecondsFromIntervalPerDistanceWorkout(
        base,
        curr as SingleDistanceWorkout
      );
    } else {
      const { duration } = curr as SingleTimedWorkout;
      totalSec = duration * 60;
    }
    return acc + totalSec + WORKOUT_BREAK_SEC;
  }, 0);
}

export function getDistanceFromLaps(laps: number): string {
  const distance =
    Math.round(((laps * BASE_DISTANCE) / BASE_LENGTH) * 100) / 100;
  return `${distance}${DISTANCE_UNIT}`;
}

export function getHtmlString(
  workoutGroups: SingleWorkoutGroup[],
  totalLaps: number,
  totalLapsSlowLane: number
): string {
  const groups = workoutGroups.reduce((groupAcc, group, i) => {
    const { name, rounds, workoutList } = group;
    groupAcc += `<h1>${name}${rounds > 1 ? ` x ${rounds} rounds` : ""}</h1>`;

    const list = workoutList.reduce((workoutAcc, workout, j) => {
      const { description } = workout;
      let listItem = "";
      if (Object.keys(workout).includes("repeats")) {
        const { repeats, length, rest, intervalOffset, restSeconds, alt } =
          workout as SingleDistanceWorkout;
        const isAltRest = alt?.restSeconds != null && alt?.restSeconds > 0;
        const intervalBase = isAltRest
          ? INTERVAL_BASE.filter((base) => base < 120)
          : INTERVAL_BASE;

        listItem = `<li><b>${
          repeats > 1
            ? `${repeats}${
                alt != null && alt.repeats !== repeats ? `(${alt.repeats})` : ""
              } x `
            : ""
        }
        ${length}L
        ${alt != null && alt.length !== length ? `(${alt.length}L)` : ""}</b>
        ${description || "Swim"}
        <i>
        ${
          rest === "interval"
            ? `@ ${intervalBase
                .map((base, i) =>
                  getTimeFromInterval(base, length, "ceiling", intervalOffset)
                )
                .join(" / ")}`
            : ""
        }
        ${isAltRest ? `(${alt.restSeconds}s rest)` : ""}
        ${rest === "seconds" ? `${restSeconds}s` : ""}
        ${rest === "3rd_person" ? "3rd person in" : ""}
        </i>
        </li>`;
      } else {
        const { duration } = workout as SingleTimedWorkout;
        listItem = `<li>${duration} min ${description || "Swim"}`;
      }
      workoutAcc += listItem;
      return workoutAcc;
    }, "");

    // Calculate total length per group
    const totalLaps = getTotalLapsPerGroup(workoutList) * rounds;
    const totalLapsSlowLane = getTotalLapsPerGroup(workoutList, true) * rounds;

    return `${groupAcc}<ul>${list}</ul><p style="text-align: right"><b>${totalLaps}</b>${
      totalLapsSlowLane !== totalLaps ? `(${totalLapsSlowLane})` : ""
    } laps</p>`;
  }, "");

  const total = `${totalLaps} laps, ${getDistanceFromLaps(totalLaps)} ${
    totalLapsSlowLane !== totalLaps
      ? `(${totalLapsSlowLane} laps,  ${getDistanceFromLaps(
          totalLapsSlowLane
        )})`
      : ""
  }`;

  return `${groups}<h2>${total}</h2>`;
}
