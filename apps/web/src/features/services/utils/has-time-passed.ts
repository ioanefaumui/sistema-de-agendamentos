import { format } from "date-fns";

export function hasTimePassed(date: Date | string, start: string): boolean {
  const formattedDate = format(date || "", "yyyy-MM-dd");
  const dateTimeString = `${formattedDate}T${start}Z`;
  return new Date(dateTimeString).getTime() < Date.now();
}
