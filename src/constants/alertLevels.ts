import RiskLevel from '@/types/riskLevel';

type AlertLevelConfig = {
  min: number;
  label: string;
  color: string;
  recommendation: string
};

const ALERT_LEVELS: Record<RiskLevel, AlertLevelConfig> = {
  LOW: {
    min: 37,
    label: 'Baixo',
    color: '#CA8A04',
    recommendation: 'Hidrate-se com frequência e evite exposição prolongada ao sol.'
  },
  MEDIUM: {
    min: 39,
    label: 'Médio',
    color: '#EA580C',
    recommendation: 'Procure locais com sombra, beba água regularmente e reduza esforço físico.'
  },
  HIGH: {
    min: 41,
    label: 'Alto',
    color: '#DC2626',
    recommendation: 'Busque um ponto de hidratação imediatamente. Risco de insolação.'
  },
  EXTREME: {
    min: 43,
    label: 'Extremo',
    color: '#7E22CE',
    recommendation: 'Perigo extremo. Abrigue-se agora em local fresco e peça ajuda se sentir mal-estar.'
  }
};

const RISK_LEVELS_ORDER: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'EXTREME'];

const NORMAL_COLOR = '#2563EB';

const MIN_TEMPERATURE = 24;
const MAX_TEMPERATURE = 46;

function getRiskLevel(temperature: number): RiskLevel | null {
  for (let index = RISK_LEVELS_ORDER.length - 1; index >= 0; index--) {
    const level = RISK_LEVELS_ORDER[index];

    if (temperature >= ALERT_LEVELS[level].min) {
      return level;
    }
  }

  return null;
}

function getLevelColor(level: RiskLevel | null): string {
  return level ? ALERT_LEVELS[level].color : NORMAL_COLOR;
}

export {
  ALERT_LEVELS,
  RISK_LEVELS_ORDER,
  NORMAL_COLOR,
  MIN_TEMPERATURE,
  MAX_TEMPERATURE,
  getRiskLevel,
  getLevelColor
};