import Alert from '@/types/alert';
import Coordinates from '@/types/coordinates';
import { getDistanceMeters } from '@/utils/geo';

function affectsUser(alert: Alert, userCoordinates: Coordinates, affectedRadiusMeters: number): boolean {
  return alert.active && getDistanceMeters(alert.coordinates, userCoordinates) <= affectedRadiusMeters;
}

export { affectsUser };