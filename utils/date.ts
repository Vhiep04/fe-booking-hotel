import dayjs from "dayjs";

export function toDateOnly(
  date: string | Date | null | undefined
): string | null {
  return date ? dayjs(date).format("YYYY-MM-DD") : null;
}
