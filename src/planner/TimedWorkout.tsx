import { HStack, Text, Input, VStack } from "@chakra-ui/react";
import { SingleTimedWorkout, WorkoutProps } from "../utils/types";
import NumberInputControl from "../inputs/ChakraNumberInput";
import { UNIT_W } from "../utils/const";
import { usePractice, usePracticeDispatch } from "../utils/PracticeContext";
import SlowLanesWorkout from "./SlowLanesWorkout";

export default function TimedWorkout({ setIndex, workoutIndex }: WorkoutProps) {
  const practice = usePractice();
  const dispatch = usePracticeDispatch();

  const { duration, description, alt } = practice[setIndex].workoutList[
    workoutIndex
  ] as SingleTimedWorkout;

  const durationInput = (type: "update" | "update-alt") => (
    <HStack flexShrink={0} mr={2}>
      <NumberInputControl
        width={UNIT_W}
        max={20}
        min={1}
        value={type === "update" ? duration : alt?.duration ?? 5}
        onChange={(value) =>
          dispatch({
            level: "item",
            setIndex,
            workoutIndex,
            type,
            updates: {
              key: "duration",
              value: parseInt(value),
            },
          })
        }
      />
      <Text fontSize="sm" fontWeight={700}>
        min
      </Text>
    </HStack>
  );

  const descriptionInput = (type: "update" | "update-alt") => (
    <Input
      size="sm"
      placeholder="Describe workout"
      value={type === "update" ? description : alt?.description ?? ""}
      autoFocus
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
    <HStack flexGrow={1} gap={2} align="start" wrap="wrap">
      {durationInput("update")}
      <VStack gap={2} align="left" flexGrow={1}>
        {descriptionInput("update")}
        {alt != null && (
          <SlowLanesWorkout setIndex={setIndex} workoutIndex={workoutIndex}>
            <HStack gap={2} wrap="wrap">
              {durationInput("update-alt")}
              {descriptionInput("update-alt")}
            </HStack>
          </SlowLanesWorkout>
        )}
      </VStack>
    </HStack>
  );
}
