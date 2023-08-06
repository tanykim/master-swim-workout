import React, { useState } from "react";
import { SingleDistanceWorkout, TimingType, UpdateInput } from "./utils/types";
import {
  Box,
  Checkbox,
  HStack,
  IconButton,
  Input,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import NumberInputControl from "./NumberInputControl";
import { REPEAT_BREAK_SEC, UNIT_W } from "./utils/const";
import { MdDelete, MdSubdirectoryArrowRight } from "react-icons/md";

interface Props extends SingleDistanceWorkout {
  index: number;
  onChangeWorkout: UpdateInput;
  onChangeSlowLane: UpdateInput;
  onRemoveSlowLane: (idx: number) => void;
}
const restList: { value: TimingType; label: string }[] = [
  {
    value: "interval",
    label: "Interval",
  },
  { value: "seconds", label: "Rest" },
  { value: "3rd_person", label: "3rd person" },
  { value: "no_timing", label: "No timing" },
];

export default function DistanceWorkout({
  index,
  repeats,
  length,
  description,
  rest,
  alt,
  onChangeWorkout,
  onChangeSlowLane,
  onRemoveSlowLane,
}: Props) {
  const [timing, setTiming] = useState<TimingType | null>(rest ?? null);

  return (
    <Box>
      <HStack wrap="wrap" align="flex-start">
        <HStack>
          <NumberInputControl
            width={UNIT_W}
            max={10}
            min={1}
            defaultValue={repeats ?? 1}
            onChange={(value) =>
              onChangeWorkout(index, "repeats", parseInt(value))
            }
          />
          <Text fontSize="sm" fontWeight={700}>
            X
          </Text>
          <NumberInputControl
            width={UNIT_W}
            max={64}
            min={1}
            defaultValue={length ?? 3}
            onChange={(value) =>
              onChangeWorkout(index, "length", parseInt(value))
            }
          />
          <Text fontSize="sm" fontWeight={700}>
            L
          </Text>
        </HStack>
        <VStack align="left" ml={4}>
          <Input
            width={UNIT_W * 28}
            size="sm"
            autoFocus
            placeholder="Describe workout"
            value={description}
            onChange={(event) =>
              onChangeWorkout(index, "description", event.target.value)
            }
          />
          <HStack>
            <Select
              size="sm"
              width={UNIT_W * 9}
              placeholder="Select timing"
              onChange={(event) => {
                onChangeWorkout(index, "rest", event.target.value);
                setTiming(event.target.value as TimingType);
              }}
            >
              {restList.map((rest) => (
                <option key={rest.value} value={rest.value}>
                  {rest.label}
                </option>
              ))}
            </Select>
            {timing === "interval" && (
              <>
                <NumberInputControl
                  width={UNIT_W * 1.25}
                  min={-20}
                  max={20}
                  step={5}
                  defaultValue={0}
                  onChange={(value) =>
                    onChangeWorkout(index, "intervalOffset", parseInt(value))
                  }
                />
                <Text fontSize="sm">sec</Text>
              </>
            )}
            {timing === "seconds" && (
              <>
                <NumberInputControl
                  width={UNIT_W}
                  max={60}
                  min={0}
                  step={5}
                  defaultValue={0}
                  onChange={(value) =>
                    onChangeWorkout(index, "restSeconds", parseInt(value))
                  }
                />
                <Text fontSize="sm">sec</Text>
              </>
            )}
          </HStack>
        </VStack>
      </HStack>
      {alt != null && (
        <HStack mt={4}>
          <MdSubdirectoryArrowRight />
          <Text fontSize="sm">Slow lanes</Text>
          <HStack>
            <NumberInputControl
              width={UNIT_W}
              max={10}
              min={1}
              defaultValue={repeats ?? 1}
              onChange={(value) =>
                onChangeSlowLane(index, "repeats", parseInt(value))
              }
            />
            <Text fontSize="xs" fontWeight={700}>
              X
            </Text>
            <NumberInputControl
              width={UNIT_W}
              max={64}
              min={1}
              defaultValue={length ?? 3}
              onChange={(value) =>
                onChangeSlowLane(index, "length", parseInt(value))
              }
            />
            <Text fontSize="xs" fontWeight={700}>
              L
            </Text>
            {timing === "interval" && (
              <Checkbox
                size="sm"
                defaultChecked
                onChange={(e) =>
                  onChangeSlowLane(
                    index,
                    "restSeconds",
                    alt?.intervalOffset ?? REPEAT_BREAK_SEC + 5
                  )
                }
                ml={4}
              >
                Use rest instead
              </Checkbox>
            )}
            <IconButton
              aria-label="Delete slow lane"
              ml={4}
              icon={<MdDelete />}
              size="sm"
              variant="outline"
              onClick={() => onRemoveSlowLane(index)}
            />
          </HStack>
        </HStack>
      )}
    </Box>
  );
}