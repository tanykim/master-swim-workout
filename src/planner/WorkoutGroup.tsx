import {
  Box,
  Flex,
  HStack,
  Button,
  Text,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { MdAdd, MdDelete } from "react-icons/md";
import { BASE_LENGTH } from "../utils/const";
import {
  SingleWorkoutSet,
  SingleDistanceWorkout,
  SingleTimedWorkout,
} from "../utils/types";
import TimedWorkout from "./TimedWorkout";
import DistanceWorkout from "./DistanceWorkout";
import { usePracticeDispatch } from "../utils/PracticeContext";
import ControlWorkout from "./WorkoutControls";
import { getTotalLapsPerGroup } from "../utils/converter";
import WorkoutSetInput from "../inputs/WorkoutSetInput";

interface Props extends SingleWorkoutSet {
  setIndex: number;
  isAlt?: boolean;
}

const DISTANCE_WORKOUT = {
  repeats: 1,
  length: BASE_LENGTH,
  description: "",
  rest: null,
};

const TIMED_WORKOUT = {
  duration: 5,
  description: "",
};
export default function WorkoutGroup({
  setIndex,
  name,
  rounds,
  workoutList,
  isAlt = false,
}: Props) {
  const dispatch = usePracticeDispatch();

  const totalLaps = getTotalLapsPerGroup(workoutList) * rounds;

  return (
    <Box mb={6} borderBottom="1px" borderColor="gray.200" pb={6}>
      <Flex justify="space-between" mb={6} wrap="wrap" gap={2}>
        <WorkoutSetInput
          setIndex={setIndex}
          name={name}
          rounds={rounds}
          isAlt={isAlt}
        />
        {!isAlt && (
          <HStack flexGrow={1} justify="flex-end" wrap="wrap">
            <Tooltip
              label={`Remove this ${
                isAlt ? "variation for slow lanes" : "set"
              }`}
              aria-label="remove set"
              hasArrow
            >
              <IconButton
                aria-label="Remove this set"
                icon={<MdDelete />}
                size="sm"
                onClick={() =>
                  dispatch({
                    level: "set",
                    type: isAlt ? "remove-alt" : "remove",
                    setIndex: setIndex,
                  })
                }
              />
            </Tooltip>
          </HStack>
        )}
      </Flex>
      {workoutList.map((workout, i) => (
        <Flex
          key={i}
          justify="space-between"
          align="flex-start"
          mb={6}
          gap={2}
          wrap="wrap"
        >
          {Object.keys(workout).includes("repeats") ? (
            <DistanceWorkout
              setIndex={setIndex}
              workoutIndex={i}
              isAlt={isAlt}
              {...(workout as SingleDistanceWorkout)}
            />
          ) : (
            <TimedWorkout
              setIndex={setIndex}
              workoutIndex={i}
              isAlt={isAlt}
              {...(workout as SingleTimedWorkout)}
            />
          )}
          {!isAlt && (
            <ControlWorkout
              setIndex={setIndex}
              workoutIndex={i}
              isLast={i === workoutList.length - 1}
              isAlt={isAlt}
            />
          )}
        </Flex>
      ))}
      <Flex align="center" justify={isAlt ? "flex-end" : "space-between"}>
        {!isAlt && (
          <HStack gap={2} wrap="wrap">
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
                    ...DISTANCE_WORKOUT,
                    alt: DISTANCE_WORKOUT,
                  } as SingleDistanceWorkout,
                })
              }
              mr={2}
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
                    ...TIMED_WORKOUT,
                    alt: TIMED_WORKOUT,
                  } as SingleTimedWorkout,
                })
              }
            >
              Timed workout
            </Button>
          </HStack>
        )}
        <Text color="blue.600" whiteSpace="nowrap">
          <b>{totalLaps}</b>
          {` `}
          laps
        </Text>
      </Flex>
    </Box>
  );
}
