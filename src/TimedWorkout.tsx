import { SingleTimedWorkout, UpdateInput } from "./utils/types";
import { HStack, Input, Text } from "@chakra-ui/react";
import NumberInputControl from "./NumberInputControl";
import { UNIT_W } from "./utils/const";

interface Props extends SingleTimedWorkout {
  index: number;
  onChangeWorkout: UpdateInput;
}

export default function TimedWorkout({
  index,
  duration,
  description,
  onChangeWorkout,
}: Props) {
  return (
    <HStack>
      <NumberInputControl
        width={UNIT_W}
        max={20}
        min={1}
        defaultValue={duration}
        onChange={(value) =>
          onChangeWorkout(index, "duration", parseInt(value))
        }
      />
      <Text fontSize="sm" fontWeight={700}>
        min
      </Text>
      <Input
        width={UNIT_W * 22.25 + 2}
        size="sm"
        ml={4}
        placeholder="Describe workout"
        value={description}
        autoFocus
        onChange={(event) =>
          onChangeWorkout(index, "description", event.target.value)
        }
      />
    </HStack>
  );
}
