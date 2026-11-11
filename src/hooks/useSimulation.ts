import { useContext } from 'react';

import { SimulationContext } from '@/contexts/SimulationContext';

function useSimulation() {
  return useContext(SimulationContext);
}

export default useSimulation;