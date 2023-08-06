import {
  Table,
  TableContainer,
  Th,
  Thead,
  Tr,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { SingleWorkoutGroup } from "./utils/types";
import { GROUP_BREAK_SEC, INTERVAL_BASE, LANE_NAMES } from "./utils/const";
import {
  getHumanReadableFromSeconds,
  getTotalSecondsFromIntervalPerGroup,
} from "./utils/converter";

interface Props {
  workoutGroups: SingleWorkoutGroup[];
}

export default function ElapsedTimeTable({ workoutGroups }: Props) {
  const elapsedTimeByGroup = INTERVAL_BASE.map((base) => {
    const allWorkouts = workoutGroups.flatMap(
      (group: SingleWorkoutGroup) => group.workoutList
    );
    const elapsedTime = getTotalSecondsFromIntervalPerGroup(base, allWorkouts);
    const groupBreaks = (workoutGroups.length - 1) * GROUP_BREAK_SEC;
    return getHumanReadableFromSeconds(elapsedTime + groupBreaks);
  });

  return (
    <TableContainer mt={8}>
      <Table>
        <Thead>
          <Tr>
            {LANE_NAMES.map((lane, i) => (
              <Th key={i} textAlign="center">
                {lane}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            {elapsedTimeByGroup.map((time, i) => (
              <Td key={i} textAlign="center">
                {time}
              </Td>
            ))}
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}
