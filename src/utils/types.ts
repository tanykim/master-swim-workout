export interface SingleWorkout {
  description: string;
}

export type TimingType = "interval" | "seconds" | "3rd_person" | "no_timing";

export interface SingleDistanceWorkout extends SingleWorkout {
  repeats: number;
  length: number;
  rest: TimingType | null;
  intervalOffset?: number;
  restSeconds?: number;
  alt?: SingleDistanceWorkout;
}

export interface SingleTimedWorkout extends SingleWorkout {
  duration: number;
}

export type WorkoutList = (SingleDistanceWorkout | SingleTimedWorkout)[];

export interface SingleWorkoutGroup {
  name: string;
  rounds: number;
  workoutList: WorkoutList;
}

export type UpdateInput = (
  idx: number,
  key: string,
  value: number | string
) => void;
