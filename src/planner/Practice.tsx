import { Box, HStack, Button, VStack } from "@chakra-ui/react";
import { MdAdd, MdRemove } from "react-icons/md";
import { usePractice, usePracticeDispatch } from "../utils/PracticeContext";
import WorkoutGroup from "./WorkoutGroup";
import SlowLanePractice from "./SlowLanePractice";
import TotalDistance from "./TotalDistance";

export default function Practice() {
  const practice = usePractice();
  const dispatch = usePracticeDispatch();

  const hasAlt =
    practice.filter((workout) => {
      const { rounds, roundsAlt, workoutList } = workout;
      return (
        (roundsAlt != null && roundsAlt !== rounds) ||
        workoutList.filter((workout) => workout.alt != null).length > 0
      );
    }).length > 0;

  return (
    <Box mb={12}>
      {practice.map((group, i) => (
        <WorkoutGroup key={i} setIndex={i} {...group} />
      ))}
      <HStack justify="space-between" wrap="wrap" gap={2}>
        <Button
          leftIcon={<MdAdd />}
          onClick={() => dispatch({ level: "set", type: "add" })}
        >
          Workout set
        </Button>
        <TotalDistance practice={practice} />
      </HStack>
      <VStack align="flex-end" mt={4}>
        {hasAlt ? (
          <SlowLanePractice />
        ) : (
          <Button
            leftIcon={<MdAdd />}
            size="sm"
            onClick={() => {
              dispatch({
                level: "practice",
                type: "add-slow-lanes",
              });
            }}
            width="fit-content"
          >
            Slow lane variation
          </Button>
        )}
      </VStack>
    </Box>
  );
}
