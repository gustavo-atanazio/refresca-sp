import Address from './address';
import Coordinates from './coordinates';
import RiskLevel from './riskLevel';
import Trend from './trend';

type Sensor = {
  sensorID: string;
  name: string;
  address: Address;
  coordinates: Coordinates;
  temperature: number;
  riskLevel: RiskLevel | null;
  trend: Trend;
  lockCycles: number;
  lastUpdate: string;
  activeAlertID: string | null
};

export default Sensor;