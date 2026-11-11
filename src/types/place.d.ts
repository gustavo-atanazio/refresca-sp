import Coordinates from './coordinates';

type Place = {
  placeID: string;
  name: string;
  description: string;
  coordinates: Coordinates
};

export default Place;