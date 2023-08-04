import { NumberFormat } from "../Intervals";

export function getTimeFromSec(
  base: number,
  multiplyBy: number,
  format: NumberFormat = "ceiling",
  offset: number = 0
): string {
  let totalSec = Math.round(base * multiplyBy + offset);
  if (format === "round") {
    totalSec = Math.round(totalSec / 5) * 5;
  } else if (format === "ceiling") {
    totalSec = Math.ceil(totalSec / 5) * 5;
  } else if (format === "floor") {
    totalSec = Math.floor(totalSec / 5) * 5;
  }
  // const finalSec = Math.floor(totalSec / 60) * 60 + sec;
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;

  return `${min}:${sec < 10 ? `0${sec}` : sec}`;
}
