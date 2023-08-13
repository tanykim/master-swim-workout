import {
  Box,
  Button,
  HStack,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import WorkoutGroup from "./WorkoutGroup";
import { SingleWorkoutGroup, WorkoutList } from "./utils/types";
import { getTotalLapsPerGroup } from "./utils/converter";
import ElapsedTimeTable from "./ElapsedTimeTable";
import { TotalLapsText } from "./TotalLapsText";
import { TotalDistanceText } from "./TotalDistanceText";
import TextEditor from "./TextEditor";

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
  const totalLapsSlowLane = workoutGroups.reduce((agg, curr) => {
    agg += getTotalLapsPerGroup(curr.workoutList, true) * curr.rounds;
    return agg;
  }, 0);

  return (
    <Tabs variant="enclosed" isLazy>
      <TabList>
        <Tab>🤓 Smart planner</Tab>
        <Tab>🗒 Text editor</Tab>
      </TabList>
      <TabPanels>
        <TabPanel pt={6} pb={4} width="4xl">
          <Box mb={8}>
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
                <TotalLapsText
                  totalLaps={totalLaps}
                  totalLapsSlowLane={totalLapsSlowLane}
                />
                {` / `}
                <TotalDistanceText
                  totalLaps={totalLaps}
                  totalLapsSlowLane={totalLapsSlowLane}
                />
              </Text>
            </HStack>
          </Box>
          <ElapsedTimeTable workoutGroups={workoutGroups} />
        </TabPanel>
        <TabPanel pt={6} pb={4} width="4xl">
          <TextEditor
            workoutGroups={workoutGroups}
            totalLaps={totalLaps}
            totalLapsSlowLane={totalLapsSlowLane}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
