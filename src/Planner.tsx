import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import WorkoutGroup from "./WorkoutGroup";
import { SingleWorkoutGroup, WorkoutList } from "./utils/types";
import { getTotalLapsPerGroup } from "./utils/converter";
import { BASE_DISTANCE, BASE_LENGTH, DISTANCE_UNIT } from "./utils/const";
import ElapsedTimeTable from "./ElapsedTimeTable";
import Printable from "./Printable";

export default function Planner() {
  const [workoutGroups, setWorkoutGroups] = useState<SingleWorkoutGroup[]>([
    {
      name: "Warm-up set",
      rounds: 1,
      workoutList: [],
    },
  ]);

  const addWorkoutGroup = () => {
    const name =
      workoutGroups.length === 0
        ? "Warm-up set"
        : `Main set ${workoutGroups.length}`;
    setWorkoutGroups(
      workoutGroups.concat({ name, rounds: 1, workoutList: [] })
    );
  };

  const removeWorkoutGroup = (idx: number) => {
    setWorkoutGroups(workoutGroups.filter((_, i) => i !== idx));
  };

  // Update group name, rounds, total laps
  const updateWorkoutGroup = (
    idx: number,
    key: string,
    value: string | number
  ) => {
    const prevList = [...workoutGroups];
    prevList[idx] = { ...prevList[idx], [key]: value };
    setWorkoutGroups(prevList);
  };

  const updateWorkoutList = (idx: number, workoutList: WorkoutList) => {
    const prevList = [...workoutGroups];
    prevList[idx] = { ...prevList[idx], workoutList };
    setWorkoutGroups(prevList);
  };

  const totalLaps = workoutGroups.reduce((agg, curr) => {
    agg += getTotalLapsPerGroup(curr.workoutList) * curr.rounds;
    return agg;
  }, 0);

  return (
    <>
      <Flex align="top" wrap="wrap" gap={8}>
        <Box width="4xl">
          {workoutGroups.map((group, i) => (
            <Box
              key={i}
              mb={6}
              borderBottom="1px"
              borderColor="gray.200"
              pb={6}
              position="relative"
            >
              <Tooltip label="Delete this set" aria-label="delete set">
                <IconButton
                  aria-label="Delete this set"
                  icon={<MdDelete />}
                  size="sm"
                  onClick={() => {
                    removeWorkoutGroup(i);
                  }}
                  position="absolute"
                  right="0%"
                />
              </Tooltip>
              <WorkoutGroup
                index={i}
                {...group}
                onChangeGroup={updateWorkoutGroup}
                onChangeWorkoutList={updateWorkoutList}
              />
            </Box>
          ))}
          <HStack justify="space-between">
            <Button leftIcon={<MdAdd />} onClick={() => addWorkoutGroup()}>
              Workout set
            </Button>
            <Text>
              Total{` `}
              <Text as="span" fontWeight={700}>
                {totalLaps}
              </Text>
              {` `}laps (
              <Text as="span" fontWeight={700}>
                {Math.round(((totalLaps * BASE_DISTANCE) / BASE_LENGTH) * 100) /
                  100}
              </Text>
              {DISTANCE_UNIT})
            </Text>
          </HStack>
        </Box>
        <Printable workoutGroups={workoutGroups} />
      </Flex>
      <ElapsedTimeTable workoutGroups={workoutGroups} />
    </>
  );
}
