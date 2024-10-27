import classNames, { ArgumentArray } from "classnames";
import { twMerge } from "tailwind-merge";
import { DateTime } from "luxon";

export function cn(...args: ArgumentArray) {
  return twMerge(classNames(...args));
}

export function formatDate(
  date: string | Date | undefined,
  format = "dd LLLL yyyy"
) {
  if (!date) return "-";
  const newDate = DateTime.fromISO(new Date(date).toISOString());
  return newDate.toFormat(format);
}

export function dataFromMillis(
  date: number | undefined,
  format = "dd LLLL yyyy"
) {
  if (!date) return "-";
  return DateTime.fromMillis(date).toFormat(format);
}
