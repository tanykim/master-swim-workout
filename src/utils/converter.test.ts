import {
  getTotalSecondsFromInterval,
  getTimeFromInterval,
  getTotalLapsPerGroup,
  getTotalSecondsFromIntervalPerDistanceWorkout,
  getTotalSecondsFromIntervalPerGroup,
  getHumanReadableFromSeconds,
} from "./converter";
import { SingleDistanceWorkout, WorkoutList } from "./types";

test("Total seconds for each workout", () => {
  expect(getTotalSecondsFromInterval(120, 3)).toBe(120);
  expect(getTotalSecondsFromInterval(110, 2)).toBe(75);
  expect(getTotalSecondsFromInterval(110, 2, "ceiling", -15)).toBe(60);
  expect(getTotalSecondsFromInterval(110, 2, "floor", 5)).toBe(75);
  expect(getTotalSecondsFromInterval(110, 2, "original", 5)).toBe(78);
  expect(getTotalSecondsFromInterval(110, 6, "original")).toBe(220);
});

test("Human readable time from interval", () => {
  expect(getTimeFromInterval(120, 3)).toBe("2:00");
  expect(getTimeFromInterval(110, 2)).toBe("1:15");
  expect(getTimeFromInterval(110, 2, "ceiling", -15)).toBe("1:00");
  expect(getTimeFromInterval(110, 4, "ceiling")).toBe("2:30");
  expect(getTimeFromInterval(110, 6, "original")).toBe("3:40");
});

const sampleSet1: WorkoutList = [
  { repeats: 1, length: 2, description: "", rest: "no_timing" },
  { duration: 6, description: "", rest: "no_timing" },
];

const sampleSet2: WorkoutList = [
  {
    repeats: 2,
    length: 3,
    description: "",
    rest: "interval",
    intervalOffset: 5,
  },
  {
    repeats: 4,
    length: 4,
    description: "",
    rest: "seconds",
    restSeconds: 15,
  },
  { duration: 6, description: "", rest: "no_timing" },
];

test("Total laps from a workout set", () => {
  expect(getTotalLapsPerGroup(sampleSet1)).toBe(2);
  expect(getTotalLapsPerGroup(sampleSet2)).toBe(22);
});

test("Total seconds from a distance workout", () => {
  expect(
    getTotalSecondsFromIntervalPerDistanceWorkout(
      120,
      sampleSet1[0] as SingleDistanceWorkout
    )
  ).toBe(90);
  expect(
    getTotalSecondsFromIntervalPerDistanceWorkout(
      90,
      sampleSet2[0] as SingleDistanceWorkout
    )
  ).toBe(190);
  expect(
    getTotalSecondsFromIntervalPerDistanceWorkout(
      90,
      sampleSet2[1] as SingleDistanceWorkout
    )
  ).toBe(540);
});

test("Total seconds from a workout set", () => {
  expect(getTotalSecondsFromIntervalPerGroup(120, sampleSet1)).toBe(510);
  expect(getTotalSecondsFromIntervalPerGroup(90, sampleSet2)).toBe(1180);
});

test("Human readable time from seconds", () => {
  expect(getHumanReadableFromSeconds(120)).toBe("2:00");
  expect(getHumanReadableFromSeconds(1180)).toBe("19:40");
});
