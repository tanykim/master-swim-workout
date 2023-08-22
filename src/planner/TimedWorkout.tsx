import { HStack, VStack } from "@chakra-ui/react";
import { SingleTimedWorkout, WorkoutProps } from "../utils/types";
import DurationInput from "../inputs/DurationInput";
import DescriptionInput from "../inputs/DescriptionInput";

export default function TimedWorkout({
  setIndex,
  workoutIndex,
  isAlt,
  duration,
  description,
}: WorkoutProps & SingleTimedWorkout) {
  return (
    <HStack flexGrow={1} gap={2} align="start" wrap="wrap">
      <DurationInput
        type={isAlt ? "update-alt" : "update"}
        setIndex={setIndex}
        workoutIndex={workoutIndex}
        duration={duration}
        isAlt={isAlt}
      />
      <VStack gap={2} align="left" flexGrow={1}>
        <DescriptionInput
          type={isAlt ? "update-alt" : "update"}
          setIndex={setIndex}
          workoutIndex={workoutIndex}
          description={description}
        />
      </VStack>
    </HStack>
  );
}
