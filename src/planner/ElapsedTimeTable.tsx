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
import { GROUP_BREAK_SEC, INTERVAL_BASE, LANE_NAMES } from "../utils/const";
import {
  getHumanReadableFromSeconds,
  getTotalSecondsFromIntervalPerGroup,
} from "../utils/converter";
import { usePractice } from "../utils/PracticeContext";

export default function ElapsedTimeTable() {
  const practice = usePractice();

  const elapsedTimeByLane = INTERVAL_BASE.map((base) => {
    const allGroupsTime = practice
      .map(
        (group) =>
          getTotalSecondsFromIntervalPerGroup(base, group.workoutList) *
          (base >= 120
            ? group.roundsAlt ?? group.rounds
            : base > 90
            ? group.roundsAltM ?? group.rounds
            : group.rounds)
      )
      .reduce((acc, curr) => acc + curr, 0);
    const groupBreaks = (practice.length - 1) * GROUP_BREAK_SEC;
    return getHumanReadableFromSeconds(allGroupsTime + groupBreaks);
  });

  return (
    <Box>
      <Heading size="h3" mb={4}>
        ⏳ Estimated elapsed time
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
