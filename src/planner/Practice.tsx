import {
  Box,
  HStack,
  Button,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Radio,
  RadioGroup,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { usePractice, usePracticeDispatch } from "../utils/PracticeContext";
import WorkoutGroup from "./WorkoutGroup";
import AltPractice from "./AltPractice";
import TotalDistance from "./TotalDistance";

export default function Practice() {
  const practice = usePractice();
  const dispatch = usePracticeDispatch();

  const hasAlt =
    practice.filter((workout) => {
      const { rounds, roundsAlt, workoutList } = workout;
      return (
        (roundsAlt != null && roundsAlt !== rounds) ||
        workoutList.filter((workout) => workout.alt != null).length > 0
      );
    }).length > 0;

  const hasAltM =
    practice.filter((workout) => {
      const { rounds, roundsAltM, workoutList } = workout;
      return (
        (roundsAltM != null && roundsAltM !== rounds) ||
        workoutList.filter((workout) => workout.altM != null).length > 0
      );
    }).length > 0;

  const hasWorkout =
    practice.filter((set) => set.workoutList.length > 0).length > 0;

  const Warning = (
    <Alert status="warning">
      <AlertIcon />
      Create a base practice first
    </Alert>
  );

  const Options = (hasVariation: boolean, speed: "slow" | "medium") => (
    <RadioGroup
      onChange={() => {
        dispatch({
          level: "practice",
          type: hasVariation ? `remove-${speed}-lanes` : `add-${speed}-lanes`,
        });
      }}
      value={hasVariation ? "2" : "1"}
      mb={4}
    >
      <HStack gap={2} wrap="wrap">
        <Radio value="1" mr={2}>
          Use the same base practice
        </Radio>
        <Radio value="2">Modify the base practice</Radio>
      </HStack>
    </RadioGroup>
  );

  return (
    <Box mb={4}>
      <Tabs variant="soft-rounded" size="sm">
        <TabList>
          <Tab>Base practice</Tab>
          <Tab>Medium lane variation</Tab>
          <Tab>Slow lane variation</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {practice.map((group, i) => (
              <WorkoutGroup key={i} setIndex={i} {...group} />
            ))}
            <HStack justify="space-between" wrap="wrap" gap={2}>
              <Button
                leftIcon={<MdAdd />}
                onClick={() => dispatch({ level: "set", type: "add" })}
              >
                Workout set
              </Button>
              <TotalDistance practice={practice} />
            </HStack>
          </TabPanel>
          <TabPanel>
            {hasWorkout ? Options(hasAltM, "medium") : Warning}
            {hasAltM && <AltPractice speed="medium" />}
          </TabPanel>
          <TabPanel>
            {hasWorkout ? Options(hasAlt, "slow") : Warning}
            {hasAlt && <AltPractice />}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
