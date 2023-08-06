import React from "react";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { INTERVAL_BASE, LANE_NAMES } from "./utils/const";
import { getTimeFromInterval } from "./utils/converter";
import { NumberFormat } from "./Intervals";

interface Props {
  length: number;
  format: NumberFormat;
}

const OFFSETS = [5, 10, 15, 20];

export default function IntervalsTable({ length, format }: Props) {
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="blue">
        <Thead>
          <Tr>
            <Th>Lane</Th>
            {OFFSETS.slice()
              .reverse()
              .map((offset, i) => (
                <Th key={i}>-{offset}s</Th>
              ))}
            <Th>Base</Th>
            {OFFSETS.map((offset, i) => (
              <Th key={i}>+{offset}s</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {LANE_NAMES.map((lane, i) => {
            const tdColor = i < LANE_NAMES.length - 2 ? "primary" : "secondary";
            return (
              <Tr key={i}>
                <Td fontWeight={700}>{lane}</Td>
                {OFFSETS.slice()
                  .reverse()
                  .map((offset, j) => (
                    <Td key={j} color={tdColor}>
                      {getTimeFromInterval(
                        INTERVAL_BASE[i],
                        length,
                        format,
                        offset * -1
                      )}
                    </Td>
                  ))}
                <Td fontWeight={700} color={tdColor}>
                  {getTimeFromInterval(INTERVAL_BASE[i], length, format)}
                </Td>
                {OFFSETS.map((offset, j) => (
                  <Td key={j} color={tdColor}>
                    {getTimeFromInterval(
                      INTERVAL_BASE[i],
                      length,
                      format,
                      offset
                    )}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
