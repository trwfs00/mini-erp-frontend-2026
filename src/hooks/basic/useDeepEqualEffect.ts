/* eslint-disable react-hooks/refs */

import { isEqual } from "lodash";
import {
  type DependencyList,
  type EffectCallback,
  useEffect,
  useRef,
} from "react";

export const useDeepEqualEffect = (
  effect: EffectCallback,
  deps: DependencyList
) => {
  const ref = useRef(deps);
  if (!isEqual(deps, ref.current)) {
    ref.current = deps;
  }
  useEffect(effect, ref.current);
};
