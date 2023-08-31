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

export function getTotalLapsPerGroup(
  workoutList: WorkoutList,
  speed: "slow" | "medium" | "fast" = "fast"
) {
  return workoutList.reduce((acc: number, curr: SingleWorkout) => {
    if (Object.keys(curr).includes("repeats")) {
      const { repeats, length, alt, altM } = curr as SingleDistanceWorkout;
      return (
        acc +
        (alt != null && speed === "slow"
          ? alt.length * alt.repeats
          : altM != null && speed === "medium"
          ? altM.length * altM.repeats
          : length * repeats)
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
  const { repeats, alt, altM, length, intervalOffset, restSeconds } = workout;

  // Check slow lane alternative;
  let totalLen = repeats * length;
  if (base >= 120 && alt != null) {
    totalLen = alt.repeats * alt.length;
  } else if (base > 90 && base < 120 && altM != null) {
    totalLen = altM.repeats * altM.length;
  }

  return getTotalSecondsFromInterval(
    base,
    totalLen,
    "ceiling",
    repeats *
      (alt?.restSeconds ??
        altM?.restSeconds ??
        restSeconds ??
        intervalOffset ??
        REPEAT_BREAK_SEC)
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

export function getDistanceFromLaps(laps: number | null): string | null {
  if (laps == null) {
    return null;
  }
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
  altValM: number | string | null | undefined,
  altVal: number | string | null | undefined
): string {
  const hasAltM = altValM != null;
  const hasAlt = altVal != null;

  if (val === altValM && val === altVal) {
    return `${val}`;
  }
  return `${val}${
    hasAltM && hasAlt && (val !== altValM || val !== altVal)
      ? `(${altValM ?? val}/${altVal ?? val})`
      : hasAltM && !hasAlt && val !== altValM
      ? `(${altValM ?? val})`
      : !hasAltM && hasAlt && val !== altVal
      ? `(${altVal ?? val})`
      : ""
  }`;
}

function getXText(
  val: number,
  altValM?: number | null,
  altVal?: number | null,
  tail?: string
): string {
  if (val * (altValM ?? 1) * (altVal ?? 1) === 1) {
    return "";
  }
  const xText = getAltText(val, altValM, altVal);

  return tail != null
    ? `x ${xText}${tail}${val === 1 ? "" : "s"}`
    : `${xText} x `;
}

function getIntervalText(
  length: number,
  offset: number | undefined,
  laneSpeed: "slow" | "medium" | "fast" | "all",
  hasMedium: boolean,
  hasSlow: boolean,
  alt?: SingleDistanceWorkout
): string {
  let bases = INTERVAL_BASE;
  const isSlowRestSec =
    hasSlow && alt?.restSeconds != null && alt?.restSeconds > 0;

  if (isSlowRestSec || (laneSpeed === "fast" && !hasMedium)) {
    bases = bases.filter((base) => base < 120);
  } else if (laneSpeed === "slow") {
    bases = bases.filter((base) => base >= 120);
  } else if (laneSpeed === "medium") {
    bases = bases.filter((base) => base > 90 && base < 120);
  } else if (laneSpeed === "fast" && hasMedium) {
    bases = bases.filter((base) => base <= 90);
  }

  const intervalText = `@ ${bases
    .map((base, i) => getTimeFromInterval(base, length, "ceiling", offset))
    .join(" / ")}`;

  return `${intervalText}${
    isSlowRestSec ? ` (${alt?.restSeconds}s rest)` : ""
  }`;
}

export function getLaneNames(
  type: "slow" | "medium" | "fast",
  hasMedium = true,
  hasSlow = true
): string {
  let lanes = LANE_NAMES;
  if (type === "slow" && hasSlow) {
    lanes = lanes.filter((name, i) => INTERVAL_BASE[i] >= 120);
  } else if (type === "medium" && hasMedium) {
    lanes = lanes.filter(
      (name, i) => INTERVAL_BASE[i] > 90 && INTERVAL_BASE[i] < 120
    );
  } else if (type === "fast" && hasMedium && hasSlow) {
    lanes = lanes.filter((name, i) => INTERVAL_BASE[i] <= 90);
  } else if (type === "fast" && !hasMedium && hasSlow) {
    lanes = lanes.filter((name, i) => INTERVAL_BASE[i] < 120);
  }
  return lanes.join(", ");
}

export function getAllLaneNames(hasMedium = true, hasSlow = true): string {
  const fastLanes = LANE_NAMES.filter(
    (name, i) => INTERVAL_BASE[i] < 120 && INTERVAL_BASE[i] <= 90
  );
  const mediumLanes = LANE_NAMES.filter(
    (name, i) => INTERVAL_BASE[i] > 90 && INTERVAL_BASE[i] < 120
  );
  const slowLanes = LANE_NAMES.filter((name, i) => INTERVAL_BASE[i] >= 120);

  if (hasMedium) {
    return `${fastLanes.join(", ")} (${mediumLanes.join(
      ", "
    )} / ${slowLanes.join(", ")})`;
  } else if (hasSlow) {
    return `${[...fastLanes, ...mediumLanes].join(", ")} (${slowLanes.join(
      ", "
    )})`;
  }
  return [...fastLanes, ...mediumLanes, ...slowLanes].join(", ");
}

export function getCombinedHtmlString(
  practice: SingleWorkoutSet[],
  laneSpeed: "slow" | "medium" | "fast" | "all",
  hasMedium: boolean = false,
  hasSlow: boolean = false
): string {
  const practiceText = practice.flatMap((set) => {
    const { name, rounds, roundsAltM, roundsAlt, workoutList } = set;
    if (rounds === 0) {
      return [];
    }
    const mediumRounds = hasMedium ? roundsAltM ?? rounds : null;
    const slowRounds = hasSlow ? roundsAlt ?? rounds : null;
    const setTitle = getHtmlBlock(
      `${name} ${getXText(rounds, mediumRounds, slowRounds, " round")}`,
      "h2"
    );
    const workoutListText = workoutList.flatMap((workout) => {
      const description = workout.description || "Swim";
      if (Object.keys(workout).includes("repeats")) {
        const {
          repeats,
          length,
          rest,
          intervalOffset,
          restSeconds,
          alt,
          altM,
        } = workout as SingleDistanceWorkout;
        if (repeats === 0) {
          return [];
        }
        const mediumRepeats = hasMedium ? altM?.repeats ?? repeats : null;
        const slowRepeats = hasSlow ? alt?.repeats ?? repeats : null;
        const mediumLength = hasMedium ? altM?.length ?? length : null;
        const slowLength = hasSlow ? alt?.length ?? length : null;

        const distanceText = getHtmlBlock(
          `${getXText(repeats, mediumRepeats, slowRepeats)}
          ${getAltText(length, mediumLength, slowLength)}L`,
          "b"
        );
        const restText = getHtmlBlock(
          `${
            rest === "interval" && (restSeconds == null || restSeconds === 0)
              ? getIntervalText(
                  length,
                  intervalOffset,
                  laneSpeed,
                  hasMedium,
                  hasSlow,
                  alt as SingleDistanceWorkout
                )
              : ""
          }
          ${
            rest === "seconds" || (restSeconds != null && restSeconds > 0)
              ? `${restSeconds}s rest`
              : ""
          }
          ${rest === "3rd_person" ? "3rd person in" : ""}`,
          "i"
        );
        return getHtmlBlock(`${distanceText} ${description} ${restText}`, "li");
      } else {
        const { duration, alt, altM } = workout as SingleTimedWorkout;
        if (duration === 0) {
          return [];
        }
        const mediumDuration = hasMedium ? altM?.duration ?? duration : null;
        const slowDuration = hasSlow ? alt?.duration ?? duration : null;
        const durationHtml = getHtmlBlock(
          getAltText(duration, mediumDuration, slowDuration),
          "b"
        );
        return getHtmlBlock(`${durationHtml} min ${description}`, "li");
      }
    });
    const laps = getTotalLapsPerGroup(workoutList) * rounds;
    const lapsAltM = hasMedium
      ? getTotalLapsPerGroup(workoutList, "medium") * (roundsAltM ?? rounds)
      : null;
    const lapsAlt = hasSlow
      ? getTotalLapsPerGroup(workoutList, "slow") * (roundsAlt ?? rounds)
      : null;

    return `${setTitle}
    ${getHtmlBlock(workoutListText.join(""), "ul")}
    ${getHtmlBlock(
      `${getHtmlBlock(getAltText(laps, lapsAltM, lapsAlt), "b")} laps`,
      "p",
      true
    )}`;
  });

  const totalLaps = practice.reduce((acc, group) => {
    acc += getTotalLapsPerGroup(group.workoutList) * group.rounds;
    return acc;
  }, 0);

  const totalLapsAltM = hasMedium
    ? practice.reduce((acc, group) => {
        acc +=
          getTotalLapsPerGroup(group.workoutList, "medium") *
          (group.roundsAltM ?? group.rounds);
        return acc;
      }, 0)
    : null;

  const totalLapsAlt = hasSlow
    ? practice.reduce((acc, group) => {
        acc +=
          getTotalLapsPerGroup(group.workoutList, "slow") *
          (group.roundsAlt ?? group.rounds);
        return acc;
      }, 0)
    : null;

  const totalLapsText = `Total 
  ${getHtmlBlock(getAltText(totalLaps, totalLapsAltM, totalLapsAlt), "b")} 
  laps / ${getAltText(
    getDistanceFromLaps(totalLaps) as string,
    getDistanceFromLaps(totalLapsAltM),
    getDistanceFromLaps(totalLapsAlt)
  )}`;

  return `${
    laneSpeed === "all"
      ? getHtmlBlock(getAllLaneNames(hasMedium, hasSlow), "h1")
      : ""
  }<p/>${practiceText.join("<p/>")}<p/>
  ${getHtmlBlock(totalLapsText, "p", true)}`;
}

export function getGroupedHtmlString(
  practice: SingleWorkoutSet[],
  hasMedium = true,
  hasSlow = true
): string {
  const fastLanePractice = practice.map((workout) => {
    const { name, rounds, workoutList } = workout;
    return {
      name,
      rounds,
      workoutList: workoutList.map((workout) => {
        return { ...workout, alt: null, altM: null };
      }) as WorkoutList,
    };
  });
  const mediumLanePractice = hasMedium
    ? practice.map((workout) => {
        const { name, roundsAltM, rounds, workoutList } = workout;
        return {
          name,
          rounds: roundsAltM ?? rounds,
          workoutList: workoutList.map((workout) => {
            if (workout.altM != null) {
              return { ...workout.altM, altM: null, alt: null };
            } else {
              return { ...workout };
            }
          }) as WorkoutList,
        };
      })
    : null;
  const slowLanePractice = hasSlow
    ? practice.map((workout) => {
        const { name, roundsAlt, rounds, workoutList } = workout;
        return {
          name,
          rounds: roundsAlt ?? rounds,
          workoutList: workoutList.map((workout) => {
            if (workout.alt != null) {
              return { ...workout.alt, altM: null };
            } else {
              return { ...workout };
            }
          }) as WorkoutList,
        };
      })
    : null;

  const fastLanes = getCombinedHtmlString(fastLanePractice, "fast");
  const mediumLanes =
    mediumLanePractice != null
      ? getCombinedHtmlString(mediumLanePractice, "medium")
      : null;
  const slowLanes =
    slowLanePractice != null
      ? getCombinedHtmlString(slowLanePractice, "slow")
      : null;

  return `${getHtmlBlock(
    getLaneNames("fast", hasMedium, hasSlow),
    "h1"
  )}${fastLanes}
  <p/>${
    mediumLanes != null
      ? `${getHtmlBlock(
          getLaneNames("medium", hasMedium, true),
          "h1"
        )}${mediumLanes}`
      : ""
  }<p/>
  ${
    slowLanes != null
      ? `${getHtmlBlock(getLaneNames("slow", true, hasSlow), "h1")}${slowLanes}`
      : ""
  }`;
}
