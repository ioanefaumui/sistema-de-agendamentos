export function convertMinutesToHHMM(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function convertMinutesToDate(
  totalMinutes: number,
  baseDate = new Date()
) {
  const date = new Date(baseDate);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  date.setHours(hours, minutes, 0, 0);
  return date;
}
