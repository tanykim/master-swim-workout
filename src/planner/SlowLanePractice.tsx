import { usePractice, usePracticeDispatch } from "../utils/PracticeContext";
import { Box, Flex, Heading, IconButton, Tooltip } from "@chakra-ui/react";
import WorkoutGroup from "./WorkoutGroup";
import TotalDistance from "./TotalDistance";
import { MdDelete } from "react-icons/md";
import { getLaneNames } from "../utils/converter";

export default function SlowLanePractice() {
  const practice = usePractice();
  const dispatch = usePracticeDispatch();

  const slowLanePractice = practice.map((group, i) => {
    const {
      name,
      rounds: originalRounds,
      roundsAlt,
      workoutList: originalList,
    } = group;
    const rounds = roundsAlt ?? originalRounds;
    const workoutList = originalList.map((workout) => workout.alt ?? workout);
    return { isAlt: true, name, rounds, workoutList };
  });

  return (
    <Box
      minW={[null, "xl"]}
      borderColor="gray.200"
      borderWidth={1}
      borderRadius={4}
      p={4}
      backgroundColor="gray.50"
    >
      <Flex justify="space-between" mb={4}>
        <Heading size="md">{getLaneNames()}</Heading>
        <Tooltip
          label="Delete slow lane variation"
          aria-label="delete slow lane variation"
          hasArrow
        >
          <IconButton
            ml={2}
            aria-label="Delete slow lane variation"
            icon={<MdDelete />}
            size="sm"
            variant="outline"
            onClick={() =>
              dispatch({
                level: "practice",
                type: "remove-slow-lanes",
              })
            }
            backgroundColor="white"
          />
        </Tooltip>
      </Flex>
      {slowLanePractice.map((group, i) => (
        <WorkoutGroup key={i} setIndex={i} {...group} />
      ))}
      <Box textAlign="end">
        <TotalDistance practice={slowLanePractice} />
      </Box>
    </Box>
  );
}
