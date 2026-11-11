import { useEffect, useState } from 'react';

function useNow(intervalMs: number): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}

export default useNow;