import { usePractice } from "../utils/PracticeContext";
import { Alert, AlertIcon, Box, Heading } from "@chakra-ui/react";
import WorkoutGroup from "./WorkoutGroup";
import TotalDistance from "./TotalDistance";
import { getLaneNames } from "../utils/converter";

interface Props {
  speed?: "slow" | "medium";
}

export default function AltPractice({ speed = "slow" }: Props) {
  const practice = usePractice();

  const altPractice = practice.map((group, i) => {
    const {
      name,
      rounds: originalRounds,
      roundsAlt,
      roundsAltM,
      workoutList: originalList,
    } = group;
    const rounds =
      (speed === "slow" ? roundsAlt : roundsAltM) ?? originalRounds;
    const workoutList = originalList.map(
      (workout) => (speed === "slow" ? workout.alt : workout.altM) ?? workout
    );
    return speed === "slow"
      ? { isAlt: true, name, rounds, workoutList }
      : { isAltM: true, name, rounds, workoutList };
  });

  return (
    <>
      <Alert status="info" mb={4}>
        <AlertIcon />
        Tip: set round to 0 to remove a set, and set repeat to 0 to remove a
        workout
      </Alert>
      <Box
        minW={[null, "xl"]}
        borderColor="gray.200"
        borderWidth={1}
        borderRadius={4}
        p={4}
        backgroundColor="gray.50"
      >
        <Heading size="md" mb={4}>
          {getLaneNames(speed)}
        </Heading>
        {altPractice.map((group, i) => (
          <WorkoutGroup key={i} setIndex={i} {...group} />
        ))}
        <Box textAlign="end">
          <TotalDistance practice={altPractice} />
        </Box>
      </Box>
    </>
  );
}
