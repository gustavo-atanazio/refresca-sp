import { createContext, ReactNode, useMemo } from 'react';

import useResource from '@/hooks/useResource';
import { fetchPlaces, fetchRefuges, fetchSensors, fetchUserLocation } from '@/services/api';
import Place from '@/types/place';
import Refuge from '@/types/refuge';
import Resource from '@/types/resource';
import SensorSeed from '@/types/sensorSeed';
import UserLocation from '@/types/userLocation';

type DataContextValue = {
  sensors: Resource<SensorSeed[]>;
  refuges: Resource<Refuge[]>;
  places: Resource<Place[]>;
  userLocation: Resource<UserLocation>
};

function createLoadingResource<T>(): Resource<T> {
  return { data: null, status: 'loading', error: null, reload: () => {} };
}

const DataContext = createContext<DataContextValue>({
  sensors: createLoadingResource(),
  refuges: createLoadingResource(),
  places: createLoadingResource(),
  userLocation: createLoadingResource()
});

type DataProviderProps = {
  children: ReactNode
};

function DataProvider({ children }: DataProviderProps) {
  const sensors = useResource(fetchSensors);
  const refuges = useResource(fetchRefuges);
  const places = useResource(fetchPlaces);
  const userLocation = useResource(fetchUserLocation);

  const value = useMemo(
    () => ({ sensors, refuges, places, userLocation }),
    [sensors, refuges, places, userLocation]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export { DataContext };

export default DataProvider;