import { useEffect } from "react";

export function useWatchLocalStorage(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key) {
        callback();
      }
    };
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("storage", handler);
    };
  }, [key, callback]);
}
