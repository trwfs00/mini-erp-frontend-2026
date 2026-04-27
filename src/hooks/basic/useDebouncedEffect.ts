import { useEffect, useRef } from "react";

/**
 * useDebouncedEffect
 * ------------------
 * @param callback – your side-effect; may optionally return its own cleanup.
 * @param deps     – dependency array, just like React’s useEffect deps.
 * @param period   – debounce delay in milliseconds.
 */
export function useDebouncedEffect(
  callback: (isFirstRender: boolean) => void | (() => void),
  deps: React.DependencyList,
  period: number,
  skipFirstRender: boolean = true
): void {
  const isFirstRender = useRef(true);
  const cleanupRef = useRef<() => void>(() => {});

  useEffect(() => {
    // Don't run the effect on the initial render, if set skip
    if (isFirstRender.current && skipFirstRender) {
      isFirstRender.current = false;
      return;
    }

    //must take value now, because it may change when callback runs
    const isFirstRenderNow = isFirstRender.current;

    const handler = setTimeout(() => {
      cleanupRef.current = callback(isFirstRenderNow) || (() => {});
    }, period);

    if (isFirstRender.current) {
      isFirstRender.current = false;
    }

    // This is the cleanup function for the effect.
    // It runs when deps change or the component unmounts.
    return () => {
      clearTimeout(handler);
      // If the timeout was cleared before it fired,
      // and a cleanup function from a previous successful run exists,
      // run that cleanup.
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [...deps, period, skipFirstRender]);
}
