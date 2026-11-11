type ResourceStatus = 'loading' | 'success' | 'error';

type Resource<T> = {
  data: T | null;
  status: ResourceStatus;
  error: string | null;
  reload: () => void
};

export type { ResourceStatus };

export default Resource;