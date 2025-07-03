import * as React from "react";

type UseTimerProps = {
  startTimestamp: number;
  stopTimestamp: number;
  onExpire?: () => void;
};

export function useTimer({ startTimestamp, stopTimestamp, onExpire }: UseTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState<number>(() => {
    const now = Date.now();
    const effectiveStart = Math.max(now, startTimestamp);
    return Math.max(Math.floor((stopTimestamp - effectiveStart) / 1000), 0);
  });

  const isExpired = timeLeft === 0;

  React.useEffect(() => {
    if (isExpired && onExpire) {
      onExpire();
    }
  }, [isExpired, onExpire]);

  React.useEffect(() => {
    if (isExpired) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= stopTimestamp) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        const effectiveStart = Math.max(now, startTimestamp);
        setTimeLeft(Math.max(Math.floor((stopTimestamp - effectiveStart) / 1000), 0));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTimestamp, stopTimestamp, isExpired]);

  return { timeLeft, isExpired };
}
