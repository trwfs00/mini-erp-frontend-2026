/* eslint-disable react-hooks/exhaustive-deps */

import { isEqual } from "lodash";
import { type DependencyList, useMemo, useRef } from "react";

export function useDeepEqualMemo<T>(
  callback: () => T,
  deps: DependencyList
): T {
  const ref = useRef(deps);
  if (!isEqual(deps, ref.current)) {
    ref.current = deps;
  }
  return useMemo(callback, ref.current);
}
