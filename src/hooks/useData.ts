import { useContext } from 'react';

import { DataContext } from '@/contexts/DataContext';
import { ResourceStatus } from '@/types/resource';

type CombinedStatus = {
  status: ResourceStatus;
  error: string | null;
  reload: () => void
};

type ResourceLike = {
  status: ResourceStatus;
  error: string | null;
  reload: () => void
};

function useData() {
  return useContext(DataContext);
}

function combineResources(...resources: ResourceLike[]): CombinedStatus {
  const failed = resources.filter((resource) => resource.status === 'error');

  if (failed.length > 0) {
    return {
      status: 'error',
      error: failed[0].error,
      reload: () => failed.forEach((resource) => resource.reload())
    };
  }

  const loading = resources.some((resource) => resource.status === 'loading');

  return { status: loading ? 'loading' : 'success', error: null, reload: () => {} };
}

export { combineResources };

export default useData;