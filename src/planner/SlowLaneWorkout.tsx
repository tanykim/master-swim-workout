import { Box, Text, Flex, Tooltip, IconButton } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { usePracticeDispatch } from "../utils/PracticeContext";

interface Props {
  setIndex: number;
  workoutIndex?: number;
  children: React.ReactNode;
}

export default function SlowLaneWorkout({
  setIndex,
  workoutIndex,
  children,
}: Props) {
  const dispatch = usePracticeDispatch();
  return (
    <Box
      px={3}
      py={2}
      backgroundColor="gray.50"
      borderWidth={1}
      borderRadius={2}
      borderColor="gray.200"
    >
      <Flex mb={2} justify="space-between" align="center">
        <Text fontSize="sm" fontWeight={700}>
          Slow lanes
        </Text>
        {workoutIndex != null && (
          <Tooltip
            label="Remove this variation for slow lanes"
            aria-label="remove slow lane"
            hasArrow
          >
            <IconButton
              aria-label="Remove this set"
              icon={<MdDelete />}
              variant="outline"
              size="sm"
              onClick={() =>
                dispatch({
                  level: "item",
                  setIndex,
                  workoutIndex,
                  type: "remove-alt",
                })
              }
            />
          </Tooltip>
        )}
      </Flex>
      {children}
    </Box>
  );
}
