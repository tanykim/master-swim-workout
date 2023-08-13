import { Text } from "@chakra-ui/react";

export function TotalLapsText({
  totalLaps,
  totalLapsSlowLane,
}: {
  totalLaps: number;
  totalLapsSlowLane: number;
}) {
  return (
    <>
      <Text as="span" fontWeight={700}>
        {totalLaps}
      </Text>
      {totalLapsSlowLane !== totalLaps && (
        <Text as="span"> ({totalLapsSlowLane})</Text>
      )}
      {` `}
      laps
    </>
  );
}
