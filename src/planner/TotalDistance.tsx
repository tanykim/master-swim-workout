import { getDistanceFromLaps, getTotalLapsPerGroup } from "../utils/converter";
import { SingleWorkoutSet } from "../utils/types";
import { Text } from "@chakra-ui/react";

interface Props {
  practice: SingleWorkoutSet[];
}

export default function TotalDistance({ practice }: Props) {
  const totalLaps = practice.reduce((acc, group) => {
    acc += getTotalLapsPerGroup(group.workoutList) * group.rounds;
    return acc;
  }, 0);

  return (
    <Text>
      Total{` `}
      <b>{totalLaps}</b>
      {` `}
      laps / {getDistanceFromLaps(totalLaps)}
    </Text>
  );
}
