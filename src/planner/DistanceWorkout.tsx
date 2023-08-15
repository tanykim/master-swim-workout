import {
  HStack,
  VStack,
  Input,
  Text,
  Select,
  Checkbox,
} from "@chakra-ui/react";
import NumberInputControl from "../inputs/ChakraNumberInput";
import WorkoutIntervals from "./WorkoutIntervals";
import { UNIT_W } from "../utils/const";
import {
  TimingType,
  WorkoutProps,
  SingleDistanceWorkout,
} from "../utils/types";
import { usePractice, usePracticeDispatch } from "../utils/PracticeContext";
import SlowLanesWorkout from "./SlowLanesWorkout";

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
}: WorkoutProps) {
  const practice = usePractice();
  const dispatch = usePracticeDispatch();

  const {
    repeats,
    length,
    description,
    rest,
    intervalOffset,
    restSeconds,
    alt,
  } = practice[setIndex].workoutList[workoutIndex] as SingleDistanceWorkout;

  console.log(workoutIndex, repeats, length);

  const distanceInputs = (type: "update" | "update-alt") => (
    <HStack flexShrink={0}>
      <NumberInputControl
        width={UNIT_W}
        max={10}
        min={1}
        value={(type === "update" ? repeats : alt?.repeats) ?? 1}
        onChange={(value) =>
          dispatch({
            level: "item",
            setIndex,
            workoutIndex,
            type,
            updates: {
              key: "repeats",
              value: parseInt(value),
            },
          })
        }
      />
      <Text fontSize="sm" fontWeight={700}>
        X
      </Text>
      <NumberInputControl
        width={UNIT_W}
        max={64}
        min={1}
        value={(type === "update" ? length : alt?.length) ?? 3}
        onChange={(value) =>
          dispatch({
            level: "item",
            setIndex,
            workoutIndex,
            type,
            updates: {
              key: "length",
              value: parseInt(value),
            },
          })
        }
      />
      <Text fontSize="sm" fontWeight={700}>
        L
      </Text>
    </HStack>
  );

  const descriptionInput = (type: "update" | "update-alt") => (
    <Input
      size="sm"
      autoFocus
      placeholder="Describe workout"
      value={type === "update" ? description : alt?.description ?? ""}
      backgroundColor="white"
      onChange={(event) =>
        dispatch({
          level: "item",
          setIndex,
          workoutIndex,
          type,
          updates: {
            key: "description",
            value: event.target.value,
          },
        })
      }
    />
  );

  return (
    <HStack flexGrow={1} gap={4} align="start">
      {distanceInputs("update")}
      <VStack gap={2} align="left" flexGrow={1}>
        {descriptionInput("update")}
        <HStack gap={2}>
          <Select
            size="sm"
            width={UNIT_W * 9}
            placeholder="Select timing"
            value={rest ?? ""}
            onChange={(event) =>
              dispatch({
                level: "item",
                setIndex,
                workoutIndex,
                type: "update",
                updates: {
                  key: "rest",
                  value: event.target.value,
                },
              })
            }
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
              max={20}
              step={5}
              value={intervalOffset ?? 0}
              onChange={(value) =>
                dispatch({
                  level: "item",
                  setIndex,
                  workoutIndex,
                  type: "update",
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
                  type: "update",
                  updates: {
                    key: "restSeconds",
                    value: parseInt(value),
                  },
                })
              }
            />
          )}
          {(rest === "seconds" || rest === "interval") && (
            <Text fontSize="sm">sec</Text>
          )}
          {rest === "interval" && (
            <Checkbox
              size="sm"
              defaultChecked={restSeconds != null && restSeconds > 0}
              onChange={(e) =>
                dispatch({
                  level: "item",
                  setIndex,
                  workoutIndex,
                  type: "update",
                  updates: {
                    key: "restSeconds",
                    value: e.target.checked ? (intervalOffset ?? 0) + 5 : 0,
                  },
                })
              }
              ml={4}
            >
              Seconds rest for slow lanes
            </Checkbox>
          )}
        </HStack>
        {rest === "interval" && (
          <WorkoutIntervals
            repeats={repeats}
            length={length}
            intervalOffset={intervalOffset ?? 0}
            restSeconds={restSeconds ?? 0}
          />
        )}

        {alt != null && (
          <SlowLanesWorkout setIndex={setIndex} workoutIndex={workoutIndex}>
            <HStack gap={4}>
              {distanceInputs("update-alt")}
              {descriptionInput("update-alt")}
            </HStack>
          </SlowLanesWorkout>
        )}
      </VStack>
    </HStack>
  );
}
