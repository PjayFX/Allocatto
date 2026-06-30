/** Format a Date as a "YYYY-MM-DD" string from its UTC parts. */
export function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}
