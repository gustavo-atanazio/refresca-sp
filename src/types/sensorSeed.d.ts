import Address from './address';
import Coordinates from './coordinates';
import Trend from './trend';

type SensorSeed = {
  sensorID: string;
  name: string;
  address: Address;
  coordinates: Coordinates;
  temperature: number;
  trend: Trend
};

export default SensorSeed;