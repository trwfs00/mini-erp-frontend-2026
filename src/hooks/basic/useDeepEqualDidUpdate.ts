/* eslint-disable react-hooks/refs */

import { isEqual } from "lodash";
import {
  type DependencyList,
  type EffectCallback,
  useEffect,
  useRef,
} from "react";

export const useDeepEqualDidUpdate = (
  effect: EffectCallback,
  deps: DependencyList,
) => {
  const isFirstRender = useRef(true);
  const depsRef = useRef(deps);

  if (!isEqual(deps, depsRef.current)) {
    depsRef.current = deps;
  }

  useEffect(() => {
    // Skip the effect on the first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Run the effect on subsequent renders
    return effect();
  }, depsRef.current);
};
