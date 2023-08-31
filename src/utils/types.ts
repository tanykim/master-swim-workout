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
  alt?: SingleDistanceWorkout | null;
  altM?: SingleDistanceWorkout | null;
}

export interface SingleTimedWorkout extends SingleWorkout {
  duration: number;
  alt?: SingleTimedWorkout | null;
  altM?: SingleTimedWorkout | null;
}

export type WorkoutList = (SingleDistanceWorkout | SingleTimedWorkout)[];

export interface SingleWorkoutSet {
  name: string;
  rounds: number;
  workoutList: WorkoutList;
  roundsAlt?: number | null;
  roundsAltM?: number | null;
}

export type UpdateInput = (
  idx: number,
  key: string,
  value: number | string
) => void;

export type WorkoutProps = {
  setIndex: number;
  workoutIndex: number;
  isAlt: boolean;
  isAltM: boolean;
};
