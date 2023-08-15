import { INTERVAL_BASE } from "../utils/const";
import { getTimeFromInterval } from "../utils/converter";

interface Props {
  repeats: number;
  length: number;
  intervalOffset: number;
  restSeconds: number;
}

export default function WorkoutIntervals({
  repeats = 1,
  length = 3,
  intervalOffset,
  restSeconds = 0,
}: Props) {
  const intervalBase =
    restSeconds > 0
      ? INTERVAL_BASE.filter((base) => base < 120)
      : INTERVAL_BASE;

  return (
    <span>
      @{` `}
      {intervalBase.map((base, i) => (
        <span key={i}>
          {i > 0 && " / "}
          {getTimeFromInterval(base, length, "ceiling", intervalOffset)}
        </span>
      ))}
      {restSeconds > 0 ? ` (rest ${restSeconds}s)` : ""}
    </span>
  );
}
