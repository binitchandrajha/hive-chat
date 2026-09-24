import { useCallback, useEffect, useState } from 'react';

export interface Countdown {
  /** Seconds left. */
  left: number;
  /** "0:24" */
  label: string;
  done: boolean;
  restart: () => void;
}

/** Ticking countdown, e.g. the OTP "Resend code in 0:24" timer. */
export function useCountdown(seconds: number): Countdown {
  const [left, setLeft] = useState<number>(seconds);

  useEffect(() => {
    if (left <= 0) return undefined;
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const restart = useCallback(() => setLeft(seconds), [seconds]);
  const label = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
  return { left, label, done: left <= 0, restart };
}
