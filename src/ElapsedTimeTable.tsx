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
  const elapsedTimeByLane = INTERVAL_BASE.map((base) => {
    const allGroupsTime = workoutGroups
      .map(
        (group) =>
          getTotalSecondsFromIntervalPerGroup(base, group.workoutList) *
          group.rounds
      )
      .reduce((acc, curr) => acc + curr, 0);
    const groupBreaks = (workoutGroups.length - 1) * GROUP_BREAK_SEC;
    return getHumanReadableFromSeconds(allGroupsTime + groupBreaks);
  });

  return (
    <TableContainer mt={8} width="4xl" borderWidth="1px" borderRadius={8}>
      <Table variant="stripe">
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
            {elapsedTimeByLane.map((time, i) => (
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
