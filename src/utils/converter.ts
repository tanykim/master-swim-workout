import { NumberFormat } from "../intervals/Intervals";
import {
  BASE_DISTANCE,
  BASE_LENGTH,
  DISTANCE_UNIT,
  INTERVAL_BASE,
  LANE_NAMES,
  REPEAT_BREAK_SEC,
  WORKOUT_BREAK_SEC,
} from "./const";
import {
  SingleDistanceWorkout,
  SingleTimedWorkout,
  SingleWorkout,
  SingleWorkoutSet,
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
  practice: SingleWorkoutSet[],
  totalLaps: number,
  intervalBase = INTERVAL_BASE,
  lanes: "major" | "slow" | "both" = "both",
  totalLapsAlt: number = totalLaps
): string {
  const groups = practice.reduce((groupAcc, group, i) => {
    const { name, rounds, roundsAlt, workoutList } = group;
    groupAcc += `<p/><h2>${name}${
      rounds > 1
        ? ` x ${rounds}${
            lanes === "both" && rounds !== roundsAlt ? ` (${roundsAlt})` : ""
          } rounds`
        : ""
    }</h2>`;

    const list = workoutList.reduce((workoutAcc, workout, j) => {
      const { description } = workout;
      let listItem = "";
      if (Object.keys(workout).includes("repeats")) {
        const { repeats, length, rest, intervalOffset, restSeconds, alt } =
          workout as SingleDistanceWorkout;
        const isAltRest =
          (rest === "interval" && restSeconds != null && restSeconds > 0) ||
          lanes === "major";
        const intervalBaseFiltered = isAltRest
          ? intervalBase.filter((base) => base < 120)
          : intervalBase;

        listItem = `<li><b>${
          repeats > 1
            ? `${repeats}${
                lanes === "both" && alt != null && alt.repeats !== repeats
                  ? `(${alt.repeats})`
                  : ""
              } x `
            : ""
        }
        ${length}L
        ${
          lanes === "both" && alt != null && alt.length !== length
            ? `(${alt.length}L)`
            : ""
        }</b>
        ${description || "Swim"}
        <i>
        ${
          rest === "interval"
            ? `@ ${intervalBaseFiltered
                .map((base, i) =>
                  getTimeFromInterval(base, length, "ceiling", intervalOffset)
                )
                .join(" / ")}`
            : ""
        }
        ${lanes === "both" && isAltRest ? `(${restSeconds}s rest)` : ""}
        ${rest === "seconds" ? `${restSeconds}s rest` : ""}
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
    const totalLapsAlt =
      getTotalLapsPerGroup(workoutList, true) * (roundsAlt ?? rounds);

    return `${groupAcc}<ul>${list}</ul><p style="text-align: right"><b>${totalLaps}${
      lanes === "both" && totalLapsAlt !== totalLaps ? ` (${totalLapsAlt})` : ""
    }</b> laps</p>`;
  }, "");

  const total = `<b>${totalLaps}${
    totalLapsAlt !== totalLaps ? ` (${totalLapsAlt})` : ""
  }</b> laps / ${getDistanceFromLaps(totalLaps)} ${
    totalLapsAlt !== totalLaps ? `(${getDistanceFromLaps(totalLapsAlt)})` : ""
  }`;

  return `${groups}<p/><p style="text-align: right">Total ${total}</p>`;
}

export function getSeparateHtmlString(
  practice: SingleWorkoutSet[],
  totalLaps: number,
  totalLapsAlt: number
): string {
  const majorLanes = getHtmlString(practice, totalLaps, INTERVAL_BASE, "major");

  const hasAlt = practice
    .map((group) => {
      return (
        group.workoutList.filter((workout) => workout.alt != null).length > 0
      );
    })
    .includes(true);

  if (!hasAlt) {
    return majorLanes;
  }

  const majorLanesTitle = LANE_NAMES.filter(
    (lane, i) => INTERVAL_BASE[i] < 120
  ).join(", ");

  const slowLanePractice = practice.map((group) => {
    const { workoutList } = group;
    return {
      ...group,
      rounds: group.roundsAlt ?? group.rounds,
      workoutList: workoutList.map((workout) => {
        if (Object.keys(workout).includes("repeats")) {
          const { alt, rest, restSeconds } = workout as SingleDistanceWorkout;
          return alt != null
            ? {
                ...alt,
                rest:
                  rest === "interval" && restSeconds != null && restSeconds > 0
                    ? "seconds"
                    : rest,
                restSeconds: restSeconds ?? alt.restSeconds,
              }
            : workout;
        } else {
          return workout;
        }
      }),
    };
  });

  const slowLanesTitle = LANE_NAMES.filter(
    (lane, i) => INTERVAL_BASE[i] >= 120
  ).join(", ");

  const slowLanes = getHtmlString(
    slowLanePractice,
    totalLapsAlt,
    INTERVAL_BASE.filter((base) => base >= 120),
    "slow"
  );

  return `<h1>${majorLanesTitle}</h1>${majorLanes}<p/><h1>${slowLanesTitle}</h1>${slowLanes}`;
}
