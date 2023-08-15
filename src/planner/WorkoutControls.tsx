import { HStack, Tooltip, IconButton } from "@chakra-ui/react";
import { MdArrowDownward, MdArrowUpward, MdDelete } from "react-icons/md";
import { WorkoutProps } from "../utils/types";
import { usePracticeDispatch } from "../utils/PracticeContext";

export default function WorkoutControls({
  setIndex,
  workoutIndex,
  isLast,
}: WorkoutProps & { isLast: boolean }) {
  const dispatch = usePracticeDispatch();

  return (
    <HStack justify="flex-end" flexGrow={1}>
      <Tooltip label="Move down" aria-label="Move down" hasArrow>
        <IconButton
          aria-label="Move down"
          icon={<MdArrowDownward />}
          size="sm"
          variant="outline"
          isDisabled={isLast}
          onClick={() => {
            dispatch({
              level: "item",
              setIndex,
              workoutIndex,
              type: "move-down",
            });
          }}
        />
      </Tooltip>
      <Tooltip label="Move up" aria-label="Move up" hasArrow>
        <IconButton
          aria-label="Move up"
          icon={<MdArrowUpward />}
          size="sm"
          variant="outline"
          isDisabled={workoutIndex === 0}
          onClick={() => {
            dispatch({
              level: "item",
              setIndex,
              workoutIndex,
              type: "move-up",
            });
          }}
        />
      </Tooltip>
      <Tooltip label="Delete this workout" aria-label="delete workout" hasArrow>
        <IconButton
          ml={2}
          aria-label="Delete this workout"
          icon={<MdDelete />}
          size="sm"
          variant="outline"
          onClick={() =>
            dispatch({ level: "list", setIndex, workoutIndex, type: "remove" })
          }
        />
      </Tooltip>
    </HStack>
  );
}
