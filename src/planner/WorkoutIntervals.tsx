import { getTimeFromInterval } from "../utils/converter";

interface Props {
  repeats: number;
  length: number;
  intervalOffset: number;
  intervalBase: number[];
}

export default function WorkoutIntervals({
  repeats = 1,
  length = 3,
  intervalOffset,
  intervalBase,
}: Props) {
  return (
    <span>
      @{` `}
      {intervalBase.map((base, i) => (
        <span key={i}>
          {i > 0 && " / "}
          {getTimeFromInterval(base, length, "ceiling", intervalOffset)}
        </span>
      ))}
    </span>
  );
}
