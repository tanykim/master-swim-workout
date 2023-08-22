import { HStack, Text } from "@chakra-ui/react";
import { UNIT_W } from "../utils/const";
import NumberInputControl from "./ChakraNumberInput";
import { usePracticeDispatch } from "../utils/PracticeContext";

interface Props {
  type: "update" | "update-alt";
  setIndex: number;
  workoutIndex: number;
  repeats?: number;
  length?: number;
  isAlt: boolean;
}

export default function DistanceInput({
  type,
  setIndex,
  workoutIndex,
  repeats = 1,
  length = 3,
  isAlt,
}: Props) {
  const dispatch = usePracticeDispatch();

  return (
    <HStack flexShrink={0} mr={2}>
      <NumberInputControl
        width={UNIT_W}
        max={16}
        min={isAlt ? 0 : 1}
        value={repeats}
        onChange={(value) =>
          dispatch({
            level: "item",
            setIndex,
            workoutIndex,
            type,
            updates: {
              key: "repeats",
              value: parseInt(value),
            },
          })
        }
      />
      <Text fontSize="sm" fontWeight={700}>
        X
      </Text>
      <NumberInputControl
        width={UNIT_W}
        max={64}
        min={1}
        value={length}
        onChange={(value) =>
          dispatch({
            level: "item",
            setIndex,
            workoutIndex,
            type,
            updates: {
              key: "length",
              value: parseInt(value),
            },
          })
        }
      />
      <Text fontSize="sm" fontWeight={700}>
        L
      </Text>
    </HStack>
  );
}
