import {
  SingleDistanceWorkout,
  SingleTimedWorkout,
  SingleWorkoutGroup,
} from "./utils/types";
import "./editor/editor.css";
import { Box, Button, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { MdContentCopy } from "react-icons/md";
import WorkoutIntervals from "./WorkoutIntervals";

export default function Printable({
  workoutGroups,
}: {
  workoutGroups: SingleWorkoutGroup[];
}) {
  return (
    <Box backgroundColor="blue.100" borderRadius={8} p={4} marginTop={4}>
      <Button
        colorScheme="blue"
        variant="outline"
        size="xs"
        leftIcon={<MdContentCopy />}
        onClick={() =>
          navigator.clipboard.writeText(
            document.getElementById("output")?.textContent ?? ""
          )
        }
      >
        Copy to clipboard
      </Button>
      <Box mt={4} id="output">
        {workoutGroups.map((group, i) => {
          const { name, rounds, workoutList } = group;
          return (
            <Box key={i} mt={i > 0 ? 4 : 0}>
              <Text>
                {name}
                {rounds > 1 ? ` x ${rounds} rounds` : ""}
              </Text>
              <UnorderedList>
                {workoutList.map((workout, j) => {
                  const { description } = workout;
                  if (Object.keys(workout).includes("repeats")) {
                    const {
                      repeats,
                      length,
                      rest,
                      intervalOffset,
                      restSeconds,
                      alt,
                    } = workout as SingleDistanceWorkout;
                    const isAltRest =
                      alt?.restSeconds != null && alt?.restSeconds > 0;

                    return (
                      <ListItem key={j}>
                        {repeats > 1
                          ? `${repeats}${
                              alt != null && alt.repeats !== repeats
                                ? `(${alt.repeats})`
                                : ""
                            } x `
                          : ""}
                        {length}
                        {alt != null && alt.length !== length
                          ? `(${alt.length})`
                          : ""}
                        L{` `}
                        {description || "Swim"}
                        {` `}
                        {rest === "interval" && (
                          <WorkoutIntervals
                            repeats={repeats}
                            length={length}
                            intervalOffset={intervalOffset ?? 0}
                            hideSlowLanes={isAltRest}
                          />
                        )}
                        {isAltRest && <> ({alt.restSeconds}s rest)</>}
                        {rest === "seconds" && <>+{restSeconds}s</>}
                        {rest === "3rd_person" ? "3rd person in" : ""}
                      </ListItem>
                    );
                  } else {
                    const { duration } = workout as SingleTimedWorkout;
                    return (
                      <ListItem key={j}>
                        {duration} min {description || "Swim"}
                      </ListItem>
                    );
                  }
                })}
              </UnorderedList>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
