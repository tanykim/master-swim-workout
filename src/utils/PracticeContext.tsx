import { createContext, useContext, useReducer } from "react";
import {
  SingleDistanceWorkout,
  SingleTimedWorkout,
  SingleWorkoutSet,
} from "./types";

const initialPractice: SingleWorkoutSet[] = [
  {
    name: "Warm-up set",
    rounds: 1,
    workoutList: [],
  },
];

interface Action {
  level: "set" | "list" | "item";
  type:
    | "add"
    | "remove"
    | "update"
    | "add-slow-lanes"
    | "move-up"
    | "move-down"
    | "update-alt"
    | "remove-alt";
  setIndex?: number;
  workoutIndex?: number;
  updates?: { key: string; value: string | number };
  workout?: SingleDistanceWorkout | SingleTimedWorkout;
}

function practiceReducer(practice: SingleWorkoutSet[], action: Action) {
  // Selected workout set
  const setIndex = action.setIndex ?? 0;
  const prevPractice = [...practice];
  const workoutSet = prevPractice[setIndex];

  if (action.level === "set") {
    switch (action.type) {
      case "add": {
        const name =
          practice.length === 0 ? "Warm-up set" : `Main set ${practice.length}`;
        return [...practice, { name, rounds: 1, workoutList: [] }];
      }
      case "update": {
        if (action.updates == null) {
          return practice;
        }
        prevPractice[setIndex] = {
          ...workoutSet,
          [action.updates.key]: action.updates.value,
        };
        return prevPractice;
      }
      case "remove": {
        return practice.filter((_, i) => i !== action.setIndex);
      }
      case "add-slow-lanes": {
        const workoutList = workoutSet.workoutList.map((workout) => {
          return workout.alt != null ? workout : { ...workout, alt: workout };
        });
        // @ts-ignore
        prevPractice[setIndex] = { ...workoutSet, workoutList };
        return prevPractice;
      }
    }
  }

  // Selected workout list
  const prevWorkoutList = [...workoutSet.workoutList];
  const workoutIndex = action.workoutIndex ?? 1;

  if (action.level === "list") {
    switch (action.type) {
      case "add": {
        if (action.workout == null) {
          return practice;
        }
        prevPractice[setIndex] = {
          ...workoutSet,
          workoutList: [...workoutSet.workoutList, action.workout],
        };
        return prevPractice;
      }
      case "remove": {
        prevPractice[setIndex] = {
          ...workoutSet,
          workoutList: workoutSet.workoutList.filter(
            (_, i) => i !== workoutIndex
          ),
        };
        return prevPractice;
      }
    }
  }

  // Selected workout
  const workout = workoutSet.workoutList[workoutIndex];

  if (action.level === "item") {
    switch (action.type) {
      case "move-up": {
        const swapped = workoutSet.workoutList[workoutIndex - 1];
        prevWorkoutList.splice(workoutIndex - 1, 2, workout, swapped);
        break;
      }
      case "move-down": {
        const swapped = workoutSet.workoutList[workoutIndex + 1];
        prevWorkoutList.splice(workoutIndex, 2, swapped, workout);
        break;
      }
      case "update": {
        if (action.updates == null) {
          return prevPractice;
        }
        prevWorkoutList[workoutIndex] = {
          ...workout,
          [action.updates.key]: action.updates.value,
        };
        break;
      }
      case "update-alt": {
        if (action.updates == null) {
          return prevPractice;
        }
        // @ts-ignore
        prevWorkoutList[workoutIndex] = {
          ...workout,
          alt: {
            ...workout,
            [action.updates.key]: action.updates.value,
          },
        };
        break;
      }
      case "remove-alt": {
        prevWorkoutList[workoutIndex] = {
          ...workout,
          alt: null,
        };
      }
    }
    prevPractice[setIndex] = {
      ...workoutSet,
      workoutList: prevWorkoutList,
    };
    return prevPractice;
  }

  return practice;
}

const PracticeContext = createContext<SingleWorkoutSet[]>([]);
const PracticeDispatchContext = createContext<React.Dispatch<Action>>(() => {});

export function PracticeProvider({ children }: { children: React.ReactNode }) {
  const [practice, dispatch] = useReducer(practiceReducer, initialPractice);

  return (
    <PracticeContext.Provider value={practice}>
      <PracticeDispatchContext.Provider value={dispatch}>
        {children}
      </PracticeDispatchContext.Provider>
    </PracticeContext.Provider>
  );
}

export function usePractice() {
  return useContext(PracticeContext);
}

export function usePracticeDispatch() {
  return useContext(PracticeDispatchContext);
}
