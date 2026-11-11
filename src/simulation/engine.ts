import { ALERT_LEVELS, MAX_TEMPERATURE, MIN_TEMPERATURE, getRiskLevel } from '@/constants/alertLevels';
import Sensor from '@/types/sensor';
import SensorSeed from '@/types/sensorSeed';
import SimulationState, { SensorTick, SimulationAction } from '@/types/simulation';
import Trend from '@/types/trend';

const LOCK_CYCLES = 3;
const TREND_CHANGE_PROBABILITY = 0.05;
const MAX_ALERTS = 200;
const FIRST_ALERT_NUMBER = 9001;

const TREND_PROBABILITIES: Record<Trend, { up: number; keep: number }> = {
  HEATING: { up: 0.55, keep: 0.25 },
  STABLE: { up: 0.33, keep: 0.34 },
  COOLING: { up: 0.2, keep: 0.25 }
};

const TRENDS: Trend[] = ['HEATING', 'STABLE', 'COOLING'];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function drawTick(sensor: Sensor, now: string): SensorTick {
  const probabilities = TREND_PROBABILITIES[sensor.trend];
  const direction = Math.random();
  const step = Math.random() < 0.5 ? 0.5 : 1;
  let delta = 0;

  if (direction < probabilities.up) delta = step;
  else if (direction >= probabilities.up + probabilities.keep) delta = -step;

  const trend =
    Math.random() < TREND_CHANGE_PROBABILITY
      ? TRENDS[Math.floor(Math.random() * TRENDS.length)]
      : sensor.trend;

  return { sensorID: sensor.sensorID, delta, trend, now };
}

function createInitialSensors(seeds: SensorSeed[], now: string): Sensor[] {
  return seeds.map((seed) => ({
    sensorID: seed.sensorID,
    name: seed.name,
    address: seed.address,
    coordinates: seed.coordinates,
    temperature: seed.temperature,
    riskLevel: null,
    trend: seed.trend,
    lockCycles: 0,
    lastUpdate: now,
    activeAlertID: null
  }));
}

function createInitialState(seeds: SensorSeed[], now: string): SimulationState {
  return {
    sensors: createInitialSensors(seeds, now),
    alerts: [],
    alertCounter: FIRST_ALERT_NUMBER
  };
}

function applyTick(state: SimulationState, tick: SensorTick): SimulationState {
  const sensor = state.sensors.find((item) => item.sensorID === tick.sensorID);

  if (!sensor) return state;

  const replaceSensor = (updated: Sensor, base: SimulationState): SimulationState => ({
    ...base,
    sensors: base.sensors.map((item) => (item.sensorID === updated.sensorID ? updated : item))
  });

  if (sensor.lockCycles > 0) {
    return replaceSensor(
      { ...sensor, lockCycles: sensor.lockCycles - 1, lastUpdate: tick.now },
      state
    );
  }

  const temperature = clamp(sensor.temperature + tick.delta, MIN_TEMPERATURE, MAX_TEMPERATURE);
  const riskLevel = getRiskLevel(temperature);

  if (riskLevel === sensor.riskLevel) {
    return replaceSensor(
      { ...sensor, temperature, trend: tick.trend, lastUpdate: tick.now },
      state
    );
  }

  const alertsWithoutActive = state.alerts.map((alert) =>
    alert.alertID === sensor.activeAlertID ? { ...alert, active: false } : alert
  );

  if (!riskLevel) {
    return replaceSensor(
      { ...sensor, temperature, riskLevel, trend: tick.trend, activeAlertID: null, lastUpdate: tick.now },
      { ...state, alerts: alertsWithoutActive }
    );
  }

  const alertID = `ALT-${state.alertCounter}`;
  const alert = {
    alertID,
    sensorID: sensor.sensorID,
    address: sensor.address,
    coordinates: sensor.coordinates,
    riskLevel,
    previousRiskLevel: sensor.riskLevel,
    temperature,
    recommendation: ALERT_LEVELS[riskLevel].recommendation,
    emittedAt: tick.now,
    active: true
  };

  return replaceSensor(
    {
      ...sensor,
      temperature,
      riskLevel,
      trend: tick.trend,
      lockCycles: LOCK_CYCLES,
      activeAlertID: alertID,
      lastUpdate: tick.now
    },
    {
      sensors: state.sensors,
      alerts: [alert, ...alertsWithoutActive].slice(0, MAX_ALERTS),
      alertCounter: state.alertCounter + 1
    }
  );
}

function simulationReducer(state: SimulationState | null, action: SimulationAction): SimulationState | null {
  if (action.type === 'reset') return createInitialState(action.seeds, action.now);

  return state ? applyTick(state, action.tick) : state;
}

export { LOCK_CYCLES, createInitialState, drawTick, applyTick, simulationReducer };