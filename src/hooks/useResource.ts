import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '@/services/api';
import Resource, { ResourceStatus } from '@/types/resource';

type ResourceState<T> = {
  data: T | null;
  status: ResourceStatus;
  error: string | null
};

function useResource<T>(fetcher: () => Promise<T>): Resource<T> {
  const [state, setState] = useState<ResourceState<T>>({ data: null, status: 'loading', error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, status: 'success', error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState((previous) => ({ data: previous.data, status: 'error', error: getErrorMessage(error) }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher, attempt]);

  const reload = useCallback(() => {
    setState((previous) => ({ ...previous, status: 'loading', error: null }));
    setAttempt((value) => value + 1);
  }, []);

  return { ...state, reload };
}

export default useResource;