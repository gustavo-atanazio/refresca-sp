import { createContext, ReactNode, useEffect, useMemo, useReducer, useRef } from 'react';

import useData from '@/hooks/useData';
import { drawTick, simulationReducer } from '@/simulation/engine';
import Alert from '@/types/alert';
import Sensor from '@/types/sensor';

const UPDATE_INTERVAL_MS = 5000;

type SimulationContextValue = {
  sensors: Sensor[];
  alerts: Alert[];
  ready: boolean
};

const SimulationContext = createContext<SimulationContextValue>({ sensors: [], alerts: [], ready: false });

type SimulationProviderProps = {
  children: ReactNode
};

function SimulationProvider({ children }: SimulationProviderProps) {
  const { sensors: sensorSeeds } = useData();
  const seeds = sensorSeeds.data;
  const [state, dispatch] = useReducer(simulationReducer, null);
  const sensorsRef = useRef<Sensor[]>([]);

  useEffect(() => {
    sensorsRef.current = state?.sensors ?? [];
  }, [state?.sensors]);

  useEffect(() => {
    if (!seeds) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    dispatch({ type: 'reset', seeds, now: new Date().toISOString() });

    seeds.forEach((seed, index) => {
      const runCycle = () => {
        const sensor = sensorsRef.current.find((item) => item.sensorID === seed.sensorID);

        if (sensor) dispatch({ type: 'tick', tick: drawTick(sensor, new Date().toISOString()) });
      };
      const offset = index * (UPDATE_INTERVAL_MS / seeds.length);

      timeouts.push(
        setTimeout(() => {
          runCycle();
          intervals.push(setInterval(runCycle, UPDATE_INTERVAL_MS));
        }, offset)
      );
    });

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [seeds]);

  const value = useMemo(
    () => ({ sensors: state?.sensors ?? [], alerts: state?.alerts ?? [], ready: state !== null }),
    [state]
  );

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export { SimulationContext };

export default SimulationProvider;