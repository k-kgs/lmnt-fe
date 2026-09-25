import { useCallback, useEffect, useRef } from 'react';

export const ADVANCE_DELAY_MS = 600;

// Lets the respondent see their pick before the screen changes. Further picks
// are ignored while the advance is pending so a double-tap can't skip a screen.
export function useAutoAdvance(onNext: () => void) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return useCallback(
    (apply: () => void) => {
      if (timer.current) return;
      apply();
      timer.current = setTimeout(onNext, ADVANCE_DELAY_MS);
    },
    [onNext],
  );
}
