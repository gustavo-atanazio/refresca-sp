import Address from './address';
import Coordinates from './coordinates';

type RefugeType =
  | 'AGUA_E_SOMBRA'
  | 'BEBEDOURO'
  | 'TENDA_PREFEITURA'
  | 'PRACA_ARBORIZADA'
  | 'CENTRO_CLIMATIZADO';

type Refuge = {
  refugeID: string;
  name: string;
  type: RefugeType;
  address: Address;
  coordinates: Coordinates;
  isOpen: boolean;
  openingHours: string;
  amenities: string[];
  description: string
};

export default Refuge;