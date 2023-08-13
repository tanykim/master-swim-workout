import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import {
  MdAdd,
  MdArrowDownward,
  MdArrowUpward,
  MdDelete,
  MdSubdirectoryArrowRight,
} from "react-icons/md";
import DistanceWorkout from "./DistanceWorkout";
import {
  SingleDistanceWorkout,
  SingleTimedWorkout,
  SingleWorkoutGroup,
  UpdateInput,
  WorkoutList,
} from "./utils/types";
import { BASE_LENGTH, UNIT_W } from "./utils/const";
import NumberInputControl from "./NumberInputControl";
import TimedWorkout from "./TimedWorkout";
import { getTotalLapsPerGroup } from "./utils/converter";
import { TotalLapsText } from "./TotalLapsText";

interface Props extends SingleWorkoutGroup {
  index: number;
  onChangeGroup: UpdateInput;
  onChangeWorkoutList: (idx: number, workoutList: WorkoutList) => void;
}

export default function WorkoutGroup({
  index,
  name,
  rounds,
  workoutList,
  onChangeGroup,
  onChangeWorkoutList,
}: Props) {
  // const [workoutList, setWorkoutList] = useState<WorkoutList>([]);

  const setWorkoutList = (workoutList: WorkoutList) => {
    onChangeWorkoutList(index, workoutList);
  };

  // Add new workout
  const addDistanceWorkout = () => {
    setWorkoutList(
      workoutList.concat([
        {
          repeats: 1,
          length: BASE_LENGTH,
          description: "",
          rest: null,
        } as SingleDistanceWorkout,
      ])
    );
  };

  const addTimedWorkout = () => {
    setWorkoutList(
      workoutList.concat([
        {
          duration: 5,
          description: "",
        } as SingleTimedWorkout,
      ])
    );
  };

  // Move workout up/down
  const moveWorkoutUp = (idx: number) => {
    const selected = workoutList[idx];
    const swapped = workoutList[idx - 1];
    const prevList = [...workoutList];
    prevList.splice(idx - 1, 2, selected, swapped);
    setWorkoutList(prevList);
  };

  const moveWorkoutDown = (idx: number) => {
    const selected = workoutList[idx];
    const swapped = workoutList[idx + 1];
    const prevList = [...workoutList];
    prevList.splice(idx, 2, swapped, selected);
    setWorkoutList(prevList);
  };

  // Remove workout
  const removeWorkout = (idx: number) => {
    setWorkoutList(workoutList.filter((_, i) => idx !== i));
  };

  // When each workout is updated, update the workoutList
  const updateWorkout = (idx: number, key: string, value: number | string) => {
    const prevList = [...workoutList];
    prevList[idx] = { ...prevList[idx], [key]: value, alt: null };
    setWorkoutList(prevList);
  };

  // Add alternate workout for slow lanes
  const addSlowLaneWorkout = (idx: number) => {
    const selected = workoutList[idx];
    const prevList = [...workoutList];
    prevList.splice(idx, 1, {
      ...selected,
      alt: selected,
    } as SingleDistanceWorkout);
    setWorkoutList(prevList);
  };
  const setSlowLane = (idx: number, key: string, value: number | string) => {
    const selected = workoutList[idx] as SingleDistanceWorkout;
    const prevList = [...workoutList];
    prevList.splice(idx, 1, {
      ...selected,
      alt: { ...selected.alt, [key]: value },
    } as SingleDistanceWorkout);
    setWorkoutList(prevList);
  };
  const removeSlowLane = (idx: number) => {
    const selected = workoutList[idx] as SingleDistanceWorkout;
    delete selected.alt;
    const prevList = [...workoutList];
    prevList.splice(idx, 1, {
      ...selected,
    } as SingleDistanceWorkout);
    setWorkoutList(prevList);
  };

  // Calculate total length per group
  const totalLaps = getTotalLapsPerGroup(workoutList) * rounds;
  const totalLapsSlowLane = getTotalLapsPerGroup(workoutList, true) * rounds;

  return (
    <Box>
      <HStack mb={6}>
        <Input
          value={name}
          variant="filled"
          size="sm"
          onChange={(event) => onChangeGroup(index, "name", event.target.value)}
          width={UNIT_W * 10}
          autoFocus
        />
        <Text fontSize="sm">X</Text>
        <NumberInputControl
          width={UNIT_W}
          max={10}
          min={1}
          defaultValue={rounds}
          variant="filled"
          onChange={(value) => onChangeGroup(index, "rounds", parseInt(value))}
        />
        <Text fontSize="sm">round(s)</Text>
      </HStack>
      {workoutList.length > 0 && (
        <VStack align="left" gap={6} mb={6}>
          {workoutList.map((workout, i) => (
            <HStack key={i} align="flex-start" wrap="wrap">
              {Object.keys(workout).includes("repeats") ? (
                <DistanceWorkout
                  index={i}
                  {...(workout as SingleDistanceWorkout)}
                  onChangeWorkout={updateWorkout}
                  onChangeSlowLane={setSlowLane}
                  onRemoveSlowLane={removeSlowLane}
                />
              ) : (
                <TimedWorkout
                  index={i}
                  {...(workout as SingleTimedWorkout)}
                  onChangeWorkout={updateWorkout}
                />
              )}
              <Tooltip
                label="Add a modified version for slower lanes"
                aria-label="Alternative for slow lanes"
                hasArrow
              >
                <IconButton
                  ml={2}
                  mr={4}
                  aria-label="Alternative for slow lanes"
                  icon={<MdSubdirectoryArrowRight />}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    addSlowLaneWorkout(i);
                  }}
                />
              </Tooltip>
              <Tooltip label="Move down" aria-label="Move down" hasArrow>
                <IconButton
                  aria-label="Move down"
                  icon={<MdArrowDownward />}
                  size="sm"
                  variant="outline"
                  isDisabled={i === workoutList.length - 1}
                  onClick={() => {
                    moveWorkoutDown(i);
                  }}
                />
              </Tooltip>
              <Tooltip label="Move up" aria-label="Move up" hasArrow>
                <IconButton
                  aria-label="Move up"
                  icon={<MdArrowUpward />}
                  size="sm"
                  variant="outline"
                  isDisabled={i === 0}
                  onClick={() => {
                    moveWorkoutUp(i);
                  }}
                />
              </Tooltip>
              <Tooltip
                label="Delete this workout"
                aria-label="delete workout"
                hasArrow
              >
                <IconButton
                  ml={4}
                  aria-label="Delete this workout"
                  icon={<MdDelete />}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    removeWorkout(i);
                  }}
                />
              </Tooltip>
            </HStack>
          ))}
        </VStack>
      )}
      <HStack justify="space-between" wrap="wrap">
        <HStack spacing={4} direction="row" align="center">
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<MdAdd />}
            onClick={() => addDistanceWorkout()}
          >
            Distance workout
          </Button>
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            leftIcon={<MdAdd />}
            onClick={() => addTimedWorkout()}
          >
            Timed workout
          </Button>
        </HStack>
        <Text fontSize="sm" color="blue.600">
          <TotalLapsText
            totalLaps={totalLaps}
            totalLapsSlowLane={totalLapsSlowLane}
          />
        </Text>
      </HStack>
    </Box>
  );
}
