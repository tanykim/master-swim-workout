import { HStack, Input, Text } from "@chakra-ui/react";
import { UNIT_W } from "../utils/const";
import NumberInputControl from "./ChakraNumberInput";
import { usePracticeDispatch } from "../utils/PracticeContext";

interface Props {
  setIndex: number;
  name: string;
  rounds: number;
  isAlt?: boolean;
  isAltM?: boolean;
}
export default function WorkoutSetInput({
  setIndex,
  name,
  rounds,
  isAlt = false,
  isAltM = false,
}: Props) {
  const dispatch = usePracticeDispatch();

  return (
    <HStack>
      <Input
        value={name}
        variant="filled"
        size="sm"
        onChange={(event) =>
          dispatch({
            level: "set",
            type: "update",
            setIndex: setIndex,
            updates: { key: "name", value: event.target.value },
          })
        }
        width={UNIT_W * 10}
        autoFocus
        disabled={isAlt || isAltM}
      />
      <Text fontSize="sm" fontWeight={700}>
        X
      </Text>
      <NumberInputControl
        width={UNIT_W}
        max={10}
        min={isAlt || isAltM ? 0 : 1}
        value={rounds}
        variant="filled"
        onChange={(value) =>
          dispatch({
            level: "set",
            type: "update",
            setIndex: setIndex,
            updates: {
              key: isAlt ? "roundsAlt" : isAltM ? "roundsAltM" : "rounds",
              value: parseInt(value),
            },
          })
        }
      />
      <Text fontSize="sm" fontWeight={700}>
        round{rounds === 1 ? "" : "s"}
      </Text>
    </HStack>
  );
}
