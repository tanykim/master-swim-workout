import { Box, HStack, Button, Text } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { usePractice, usePracticeDispatch } from "../utils/PracticeContext";
import WorkoutGroup from "./WorkoutGroup";
import { getDistanceFromLaps, getTotalLapsPerGroup } from "../utils/converter";

export default function Practice() {
  const practice = usePractice();
  const dispatch = usePracticeDispatch();

  const totalLaps = practice.reduce((acc, group) => {
    acc += getTotalLapsPerGroup(group.workoutList) * group.rounds;
    return acc;
  }, 0);

  const totalLapsAlt = practice.reduce((acc, group) => {
    acc +=
      getTotalLapsPerGroup(group.workoutList, true) *
      (group.roundsAlt ?? group.rounds);
    return acc;
  }, 0);

  return (
    <Box mb={12}>
      {practice.map((group, i) => (
        <WorkoutGroup key={i} setIndex={i} {...group} />
      ))}
      <HStack justify="space-between">
        <Button
          leftIcon={<MdAdd />}
          onClick={() => dispatch({ level: "set", type: "add" })}
        >
          Workout set
        </Button>
        <Text>
          Total{` `}
          <b>
            {totalLaps}
            {totalLaps !== totalLapsAlt ? ` (${totalLapsAlt}) ` : ` `}
          </b>
          laps / {getDistanceFromLaps(totalLaps)}
          {totalLaps !== totalLapsAlt
            ? ` (${getDistanceFromLaps(totalLapsAlt)}) `
            : ` `}
        </Text>
      </HStack>
    </Box>
  );
}
