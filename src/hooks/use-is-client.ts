import { useSyncExternalStore } from "react";

/** True in the browser, false during SSR — avoids useEffect-only “mounted” flags. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
