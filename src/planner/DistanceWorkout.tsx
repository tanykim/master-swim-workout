import { HStack, VStack, Text, Select, Checkbox } from "@chakra-ui/react";
import NumberInputControl from "../inputs/ChakraNumberInput";
import WorkoutIntervals from "./WorkoutIntervals";
import { INTERVAL_BASE, UNIT_W } from "../utils/const";
import {
  TimingType,
  WorkoutProps,
  SingleDistanceWorkout,
} from "../utils/types";
import { usePracticeDispatch } from "../utils/PracticeContext";
import DistanceInput from "../inputs/DistanceInput";
import DescriptionInput from "../inputs/DescriptionInput";

const restList: { value: TimingType; label: string }[] = [
  {
    value: "interval",
    label: "Interval +",
  },
  { value: "seconds", label: "Rest" },
  { value: "3rd_person", label: "3rd person" },
  { value: "no_timing", label: "No timing" },
];

export default function DistanceWorkout({
  setIndex,
  workoutIndex,
  isAlt,
  isAltM,
  repeats,
  length,
  description,
  rest,
  intervalOffset,
  restSeconds,
}: WorkoutProps & SingleDistanceWorkout) {
  const dispatch = usePracticeDispatch();

  const type = isAlt ? "update-alt" : isAltM ? "update-altM" : "update";

  return (
    <HStack flexGrow={1} gap={2} align="start" wrap="wrap">
      <DistanceInput
        type={type}
        setIndex={setIndex}
        workoutIndex={workoutIndex}
        repeats={repeats}
        length={length}
        isAlt={isAlt || isAltM}
      />
      <VStack gap={2} align="left" flexGrow={1}>
        <DescriptionInput
          type={type}
          setIndex={setIndex}
          workoutIndex={workoutIndex}
          description={description}
        />
        {!(isAlt || isAltM) && (
          <>
            <HStack gap={2}>
              <Select
                size="sm"
                width={UNIT_W * 9}
                value={rest ?? "no_timing"}
                onChange={(event) =>
                  dispatch({
                    level: "item",
                    setIndex,
                    workoutIndex,
                    type,
                    updates: {
                      key: "rest",
                      value: event.target.value,
                    },
                  })
                }
                backgroundColor="white"
              >
                {restList.map((rest) => (
                  <option key={rest.value} value={rest.value}>
                    {rest.label}
                  </option>
                ))}
              </Select>
              {rest === "interval" && (
                <NumberInputControl
                  width={UNIT_W * 1.25}
                  min={-20}
                  max={40}
                  step={5}
                  value={intervalOffset ?? 0}
                  onChange={(value) =>
                    dispatch({
                      level: "item",
                      setIndex,
                      workoutIndex,
                      type,
                      updates: {
                        key: "intervalOffset",
                        value: parseInt(value),
                      },
                    })
                  }
                />
              )}
              {rest === "seconds" && (
                <NumberInputControl
                  width={UNIT_W}
                  max={60}
                  min={0}
                  step={5}
                  value={restSeconds ?? 0}
                  onChange={(value) =>
                    dispatch({
                      level: "item",
                      setIndex,
                      workoutIndex,
                      type,
                      updates: {
                        key: "restSeconds",
                        value,
                      },
                    })
                  }
                />
              )}
              {(rest === "seconds" || rest === "interval") && (
                <Text fontSize="sm">sec</Text>
              )}
            </HStack>
            {rest === "interval" && (
              <WorkoutIntervals
                repeats={repeats}
                length={length}
                intervalOffset={intervalOffset ?? 0}
                intervalBase={INTERVAL_BASE}
              />
            )}
          </>
        )}
        {isAlt && rest === "interval" && (
          <Checkbox
            size="sm"
            isChecked={
              rest === "interval" && restSeconds != null && restSeconds > 0
            }
            onChange={() => {
              dispatch({
                level: "item",
                setIndex,
                workoutIndex,
                type,
                updates: {
                  key: "restSeconds",
                  value:
                    rest === "interval" &&
                    restSeconds != null &&
                    restSeconds > 0
                      ? 0
                      : intervalOffset ?? 0 + 5,
                },
              });
            }}
          >
            Use rest instead of interval
          </Checkbox>
        )}
      </VStack>
    </HStack>
  );
}
