import { Input } from "@chakra-ui/react";
import { usePracticeDispatch } from "../utils/PracticeContext";

interface Props {
  type: "update" | "update-alt";
  setIndex: number;
  workoutIndex: number;
  description?: string;
}

export default function DescriptionInput({
  type,
  setIndex,
  workoutIndex,
  description = "",
}: Props) {
  const dispatch = usePracticeDispatch();

  return (
    <Input
      size="sm"
      autoFocus
      placeholder="Describe workout"
      value={description}
      backgroundColor="white"
      onChange={(event) =>
        dispatch({
          level: "item",
          setIndex,
          workoutIndex,
          type,
          updates: {
            key: "description",
            value: event.target.value,
          },
        })
      }
    />
  );
}
