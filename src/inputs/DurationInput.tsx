import { HStack, Text } from "@chakra-ui/react";
import { UNIT_W } from "../utils/const";
import NumberInputControl from "./ChakraNumberInput";
import { usePracticeDispatch } from "../utils/PracticeContext";

interface Props {
  type: "update" | "update-alt";
  setIndex: number;
  workoutIndex: number;
  duration?: number;
  isAlt: boolean;
}

export default function DurationInput({
  type,
  setIndex,
  workoutIndex,
  duration = 5,
  isAlt,
}: Props) {
  const dispatch = usePracticeDispatch();

  return (
    <HStack flexShrink={0} mr={2}>
      <NumberInputControl
        width={UNIT_W}
        max={20}
        min={isAlt ? 0 : 1}
        value={duration}
        onChange={(value) =>
          dispatch({
            level: "item",
            setIndex,
            workoutIndex,
            type,
            updates: {
              key: "duration",
              value: parseInt(value),
            },
          })
        }
      />
      <Text fontSize="sm" fontWeight={700}>
        min
      </Text>
    </HStack>
  );
}
