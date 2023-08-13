import {
  Box,
  Heading,
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
    <Box>
      <Heading size="h3" mb={4}>
        Estimated elapsed time
      </Heading>
      <TableContainer
        width="4xl"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius={8}
      >
        <Table variant="simple">
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
                <Td key={i} textAlign="center" borderBottomWidth={0}>
                  {time}
                </Td>
              ))}
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
