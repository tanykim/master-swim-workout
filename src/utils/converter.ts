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

function getHtmlBlock(
  text: string | number,
  tag: string,
  rightAligned?: boolean
): string {
  return `<${tag}${rightAligned ? ' style="text-align: right"' : ""}>
  ${text}</${tag}>`;
}

function getAltText(
  val: number | string,
  altVal: number | string | null | undefined
): string {
  return `${val}${val !== altVal && altVal != null ? `(${altVal})` : ""}`;
}

function getXText(
  val: number,
  altVal?: number | null | undefined,
  tail?: string
): string {
  if (val <= 1 && altVal !== 0) {
    return "";
  }
  const xText = altVal != null ? getAltText(val, altVal) : val;
  return tail != null
    ? `x ${xText} ${tail}${val === 1 ? "" : "s"}`
    : `${xText} x `;
}

function getIntervalText(
  alt: SingleDistanceWorkout,
  length: number,
  offset: number | undefined
): string {
  const { rest, restSeconds, intervalOffset: altOffset } = alt;
  const bases =
    rest === "interval"
      ? INTERVAL_BASE
      : INTERVAL_BASE.filter((base) => base < 120);

  const intervalText = `@ ${bases
    .map((base, i) =>
      getTimeFromInterval(
        base,
        length,
        "ceiling",
        base < 120 ? offset : altOffset
      )
    )
    .join(" / ")}`;

  const secText = restSeconds != null ? ` (${restSeconds}s rest)` : "";
  return `${intervalText}${secText}`;
}

export function getCombinedHtmlString(
  practice: SingleWorkoutSet[],
  totalLaps: number,
  totalLapsAlt: number
): string {
  const practiceText = practice.flatMap((set) => {
    const { name, rounds, roundsAlt, workoutList } = set;
    if (rounds === 0) {
      return [];
    }
    const setTitle = getHtmlBlock(
      `${name} ${getXText(rounds, roundsAlt, "round")}`,
      "h2"
    );
    const workoutListText = workoutList.flatMap((workout) => {
      const description = workout.description || "Swim";
      if (Object.keys(workout).includes("repeats")) {
        const { repeats, length, rest, intervalOffset, restSeconds, alt } =
          workout as SingleDistanceWorkout;
        if (repeats === 0) {
          return [];
        }
        const distanceText = getHtmlBlock(
          `${getXText(repeats, alt?.repeats)}
          ${getAltText(length, alt?.length)}L`,
          "b"
        );
        const restText = getHtmlBlock(
          `${
            rest === "interval"
              ? getIntervalText(
                  alt as SingleDistanceWorkout,
                  length,
                  intervalOffset
                )
              : ""
          }
          ${rest === "seconds" ? `${restSeconds}s rest` : ""}
          ${rest === "3rd_person" ? "3rd person in" : ""}`,
          "i"
        );
        return getHtmlBlock(`${distanceText} ${description} ${restText}`, "li");
      } else {
        const { duration, alt } = workout as SingleTimedWorkout;
        if (duration === 0) {
          return [];
        }
        const durationHtml = getHtmlBlock(
          getAltText(duration, alt?.duration),
          "b"
        );
        return getHtmlBlock(`${durationHtml} min ${description}`, "li");
      }
    });
    const laps = getTotalLapsPerGroup(workoutList) * rounds;
    const lapsAlt =
      getTotalLapsPerGroup(workoutList, true) * (roundsAlt ?? rounds);

    return `${setTitle}
    ${getHtmlBlock(workoutListText.join(""), "ul")}
    ${getHtmlBlock(
      `${getHtmlBlock(getAltText(laps, lapsAlt), "b")} laps`,
      "p",
      true
    )}`;
  });

  const totalLapsText = `Total 
  ${getHtmlBlock(getAltText(totalLaps, totalLapsAlt), "b")} 
  laps / ${getAltText(
    getDistanceFromLaps(totalLaps),
    getDistanceFromLaps(totalLapsAlt)
  )}`;

  return `${practiceText.join("<p/>")}<p/>
  ${getHtmlBlock(totalLapsText, "p", true)}`;
}

export function getLaneNames(type: "slow" | "major" = "slow"): string {
  return LANE_NAMES.filter((name, i) =>
    type === "slow" ? INTERVAL_BASE[i] >= 120 : INTERVAL_BASE[i] < 120
  ).join(", ");
}

export function getGroupedHtmlString(
  practice: SingleWorkoutSet[],
  totalLaps: number,
  totalLapsAlt: number
): string {
  const majorPractice = practice.map((workout) => {
    const { name, rounds, workoutList } = workout;
    return {
      name,
      rounds,
      roundsAlt: rounds,
      workoutList: workoutList.map((workout) => {
        return { ...workout };
      }) as WorkoutList,
    };
  });
  const slowLanePractice = practice.map((workout) => {
    const { name, roundsAlt, rounds, workoutList } = workout;
    return {
      name,
      rounds: roundsAlt ?? rounds,
      roundsAlt: roundsAlt ?? rounds,
      workoutList: workoutList.map((workout) => {
        if (workout.alt != null) {
          return { ...workout.alt };
        } else {
          return { ...workout };
        }
      }) as WorkoutList,
    };
  });

  const majorLanes = getCombinedHtmlString(majorPractice, totalLaps, totalLaps);
  const slowLanes = getCombinedHtmlString(
    slowLanePractice,
    totalLapsAlt,
    totalLapsAlt
  );

  return `${getHtmlBlock(getLaneNames("major"), "h1")}<p/>${majorLanes}
  <p/>
  ${getHtmlBlock(getLaneNames(), "h1")}<p/>${slowLanes}`;
}
