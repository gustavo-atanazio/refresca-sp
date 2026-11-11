import Address from './address';
import Coordinates from './coordinates';

type UserLocation = {
  coordinates: Coordinates;
  address: Address;
  affectedRadiusMeters: number
};

export default UserLocation;