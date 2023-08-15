import React from "react";
import {
  Box,
  Flex,
  HStack,
  Button,
  Text,
  Input,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { MdAdd, MdDelete } from "react-icons/md";
import { BASE_LENGTH, UNIT_W } from "../utils/const";
import {
  SingleWorkoutSet,
  SingleDistanceWorkout,
  SingleTimedWorkout,
} from "../utils/types";
import TimedWorkout from "./TimedWorkout";
import DistanceWorkout from "./DistanceWorkout";
import { usePracticeDispatch } from "../utils/PracticeContext";
import ControlWorkout from "./WorkoutControls";
import NumberInputControl from "../inputs/ChakraNumberInput";
import { getTotalLapsPerGroup } from "../utils/converter";

interface Props extends SingleWorkoutSet {
  setIndex: number;
}

export default function WorkoutGroup({
  setIndex,
  name,
  rounds,
  roundsAlt,
  workoutList,
}: Props) {
  const dispatch = usePracticeDispatch();

  const hideSlowLaneButton =
    workoutList.filter((workout) => workout.alt == null).length === 0;

  const showSlowLaneRounds =
    workoutList.filter((workout) => workout.alt != null).length > 0 ||
    roundsAlt !== rounds;

  const totalLaps = getTotalLapsPerGroup(workoutList) * rounds;
  const totalLapsAlt =
    getTotalLapsPerGroup(workoutList, true) * (roundsAlt ?? rounds);

  return (
    <Box mb={6} borderBottom="1px" borderColor="gray.200" pb={6}>
      <Flex justify="space-between" mb={6}>
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
          />
          <Text fontSize="sm" fontWeight={700}>
            X
          </Text>
          <NumberInputControl
            width={UNIT_W}
            max={10}
            min={1}
            value={rounds}
            variant="filled"
            onChange={(value) =>
              dispatch({
                level: "set",
                type: "update",
                setIndex: setIndex,
                updates: { key: "rounds", value: parseInt(value) },
              })
            }
          />
          <Text fontSize="sm" fontWeight={700}>
            round{rounds === 1 ? "" : "s"}
            {showSlowLaneRounds ? ` / slow lanes:` : ""}
          </Text>
          {showSlowLaneRounds && (
            <NumberInputControl
              width={UNIT_W}
              max={10}
              min={1}
              value={roundsAlt ?? rounds}
              variant="filled"
              onChange={(value) =>
                dispatch({
                  level: "set",
                  type: "update",
                  setIndex: setIndex,
                  updates: { key: "roundsAlt", value: parseInt(value) },
                })
              }
            />
          )}
        </HStack>
        <HStack>
          {!hideSlowLaneButton && (
            <Tooltip
              label="Add alternative workouts for slower lanes"
              aria-label="add alternative"
              hasArrow
            >
              <Button
                leftIcon={<MdAdd />}
                size="sm"
                onClick={() =>
                  dispatch({
                    level: "set",
                    type: "add-slow-lanes",
                    setIndex: setIndex,
                  })
                }
              >
                Slow lanes
              </Button>
            </Tooltip>
          )}
          <Tooltip label="Remove this set" aria-label="remove set" hasArrow>
            <IconButton
              aria-label="Remove this set"
              icon={<MdDelete />}
              size="sm"
              onClick={() =>
                dispatch({
                  level: "set",
                  type: "remove",
                  setIndex: setIndex,
                })
              }
            />
          </Tooltip>
        </HStack>
      </Flex>
      {workoutList.map((workout, i) => (
        <Flex key={i} justify="space-between" align="flex-start" mb={6} gap={6}>
          {Object.keys(workout).includes("repeats") ? (
            <DistanceWorkout setIndex={setIndex} workoutIndex={i} />
          ) : (
            <TimedWorkout setIndex={setIndex} workoutIndex={i} />
          )}
          <ControlWorkout
            setIndex={setIndex}
            workoutIndex={i}
            isLast={i === workoutList.length - 1}
          />
        </Flex>
      ))}
      <Flex align="center" justify="space-between">
        <HStack gap={4}>
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<MdAdd />}
            onClick={() =>
              dispatch({
                level: "list",
                type: "add",
                setIndex: setIndex,
                workout: {
                  repeats: 1,
                  length: BASE_LENGTH,
                  description: "",
                  rest: null,
                } as SingleDistanceWorkout,
              })
            }
          >
            Distance workout
          </Button>
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            leftIcon={<MdAdd />}
            onClick={() =>
              dispatch({
                level: "list",
                type: "add",
                setIndex: setIndex,
                workout: {
                  duration: 5,
                  description: "",
                } as SingleTimedWorkout,
              })
            }
          >
            Timed workout
          </Button>
        </HStack>
        <Text color="blue.600">
          <b>
            {totalLaps}
            {showSlowLaneRounds ? ` (${totalLapsAlt}) ` : ` `}
          </b>
          laps
        </Text>
      </Flex>
    </Box>
  );
}
