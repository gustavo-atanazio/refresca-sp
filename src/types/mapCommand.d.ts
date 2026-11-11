import Coordinates from './coordinates';

type MapCommand = {
  nonce: number;
  type: 'zoomIn' | 'zoomOut' | 'recenter' | 'flyTo' | 'focusSensor';
  coordinates?: Coordinates;
  sensorID?: string
};

export default MapCommand;