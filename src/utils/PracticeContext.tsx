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
  level: "practice" | "set" | "list" | "item";
  type:
    | "add-slow-lanes"
    | "remove-slow-lanes"
    | "add-medium-lanes"
    | "remove-medium-lanes"
    | "add"
    | "remove"
    | "remove-alt"
    | "remove-altM"
    | "update"
    | "move-up"
    | "move-down"
    | "update-alt"
    | "update-altM";

  setIndex?: number;
  workoutIndex?: number;
  updates?: { key: string; value: string | number };
  workout?: SingleDistanceWorkout | SingleTimedWorkout;
}

function practiceReducer(practice: SingleWorkoutSet[], action: Action) {
  const prevPractice = [...practice];
  if (action.level === "practice") {
    switch (action.type) {
      case "add-slow-lanes": {
        return prevPractice.map((workoutSet) => {
          const workoutList = workoutSet.workoutList.map((workout) => {
            return workout.alt != null ? workout : { ...workout, alt: workout };
          });
          return {
            ...workoutSet,
            roundsAlt: workoutSet.rounds,
            workoutList,
          } as SingleWorkoutSet;
        });
      }
      case "remove-slow-lanes": {
        return prevPractice.map((workoutSet) => {
          const workoutList = workoutSet.workoutList.map((workout) => {
            return { ...workout, alt: null };
          });
          return {
            name: workoutSet.name,
            rounds: workoutSet.rounds,
            workoutList,
          } as SingleWorkoutSet;
        });
      }
      case "add-medium-lanes": {
        return prevPractice.map((workoutSet) => {
          const workoutList = workoutSet.workoutList.map((workout) => {
            return workout.altM != null
              ? workout
              : { ...workout, altM: workout };
          });
          return {
            ...workoutSet,
            roundsAltM: workoutSet.rounds,
            workoutList,
          } as SingleWorkoutSet;
        });
      }
      case "remove-medium-lanes": {
        return prevPractice.map((workoutSet) => {
          const workoutList = workoutSet.workoutList.map((workout) => {
            return { ...workout, altM: null };
          });
          return {
            name: workoutSet.name,
            rounds: workoutSet.rounds,
            workoutList,
          } as SingleWorkoutSet;
        });
      }
    }
  }

  // Selected workout set
  const setIndex = action.setIndex ?? 0;
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
        // @ts-ignore
        prevWorkoutList[workoutIndex] = {
          ...workout,
          [action.updates.key]: action.updates.value,
        };
        if (workout.alt != null) {
          prevWorkoutList[workoutIndex].alt = {
            ...(workout.alt ?? workout),
            [action.updates.key]: action.updates.value,
          };
        }
        if (workout.altM != null) {
          prevWorkoutList[workoutIndex].altM = {
            ...(workout.altM ?? workout),
            [action.updates.key]: action.updates.value,
          };
        }
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
            ...(workout.alt ?? workout),
            [action.updates.key]: action.updates.value,
          },
        };
        break;
      }
      case "update-altM": {
        if (action.updates == null) {
          return prevPractice;
        }
        // @ts-ignore
        prevWorkoutList[workoutIndex] = {
          ...workout,
          altM: {
            ...(workout.altM ?? workout),
            [action.updates.key]: action.updates.value,
          },
        };
        break;
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
