import { usePractice, usePracticeDispatch } from "../utils/PracticeContext";
import { Box, Flex, Heading, IconButton, Tooltip } from "@chakra-ui/react";
import WorkoutGroup from "./WorkoutGroup";
import TotalDistance from "./TotalDistance";
import { INTERVAL_BASE, LANE_NAMES } from "../utils/const";
import { MdDelete } from "react-icons/md";

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
        <Heading size="md">
          {LANE_NAMES.filter((name, i) => INTERVAL_BASE[i] >= 120).join(", ")}
        </Heading>
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
