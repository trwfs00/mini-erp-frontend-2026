/**
 * Generic comparator for client-side sorting.
 * Nulls sort first; numbers compared numerically; everything else via localeCompare.
 */
export const compareValues = (a: unknown, b: unknown): number => {
  if (a === b) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
};
