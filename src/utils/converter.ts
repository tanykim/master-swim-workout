import { NumberFormat } from "../Intervals";
import { BASE_LENGTH, REPEAT_BREAK_SEC, WORKOUT_BREAK_SEC } from "./const";
import {
  SingleDistanceWorkout,
  SingleTimedWorkout,
  SingleWorkout,
  WorkoutList,
} from "./types";

export function getHumanReadableFromSeconds(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return `${min}:${sec < 10 ? `0${sec}` : sec}`;
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

export function getTotalLapsPerGroup(workoutList: WorkoutList) {
  return workoutList.reduce((acc: number, curr: SingleWorkout) => {
    if (Object.keys(curr).includes("repeats")) {
      const { repeats, length } = curr as SingleDistanceWorkout;
      return acc + length * repeats;
    } else {
      return acc;
    }
  }, 0);
}

export function getTotalSecondsFromIntervalPerDistanceWorkout(
  base: number,
  workout: SingleDistanceWorkout
) {
  const { repeats, length, intervalOffset, restSeconds } = workout;
  return getTotalSecondsFromInterval(
    base,
    repeats * length,
    "ceiling",
    repeats * (restSeconds ?? intervalOffset ?? REPEAT_BREAK_SEC)
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