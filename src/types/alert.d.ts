import Address from './address';
import Coordinates from './coordinates';
import RiskLevel from './riskLevel';

type Alert = {
  alertID: string;
  sensorID: string;
  address: Address;
  coordinates: Coordinates;
  riskLevel: RiskLevel;
  previousRiskLevel: RiskLevel | null;
  temperature: number;
  recommendation: string;
  emittedAt: string;
  active: boolean
};

export default Alert;