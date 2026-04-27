export const FETCH_ALL_LIMIT = 9999;

export const FETCH_ALL_ARGS = {
  criteria: {},
  sort_bys: [] as Array<{ field: string; direction: "asc" | "desc" }>,
  page: 1,
  limit: FETCH_ALL_LIMIT,
};
