import { Text } from "@chakra-ui/react";
import { getDistanceFromLaps } from "./utils/converter";

export function TotalDistanceText({
  totalLaps,
  totalLapsSlowLane,
}: {
  totalLaps: number;
  totalLapsSlowLane: number;
}) {
  return (
    <>
      <Text as="span">{getDistanceFromLaps(totalLaps)}</Text>
      <Text as="span">
        {totalLapsSlowLane !== totalLaps && (
          <Text as="span"> ({getDistanceFromLaps(totalLapsSlowLane)})</Text>
        )}
      </Text>
    </>
  );
}
