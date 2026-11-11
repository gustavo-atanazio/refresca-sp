import Alert from './alert';
import Sensor from './sensor';
import SensorSeed from './sensorSeed';
import Trend from './trend';

type SimulationState = {
  sensors: Sensor[];
  alerts: Alert[];
  alertCounter: number
};

type SensorTick = {
  sensorID: string;
  delta: number;
  trend: Trend;
  now: string
};

type SimulationAction =
  | { type: 'reset'; seeds: SensorSeed[]; now: string }
  | { type: 'tick'; tick: SensorTick };

export type { SensorTick, SimulationAction };

export default SimulationState;