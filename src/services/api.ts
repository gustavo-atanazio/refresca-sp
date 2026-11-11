import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { isPlaceList, isRefugeList, isSensorSeedList, isUserLocation } from '@/services/validators';

const API_PORT = 3001;
const REQUEST_TIMEOUT_MS = 8000;

type APIErrorKind = 'network' | 'timeout' | 'http' | 'invalid';

const ERROR_MESSAGES: Record<APIErrorKind, string> = {
  network: 'Não foi possível conectar ao servidor de dados. Verifique se ele está em execução e se você está conectado à rede.',
  timeout: 'O servidor de dados demorou demais para responder.',
  http: 'O servidor de dados retornou um erro.',
  invalid: 'Os dados recebidos do servidor são inválidos.'
};

class APIError extends Error {
  kind: APIErrorKind;
  status?: number;

  constructor(kind: APIErrorKind, status?: number) {
    super(status ? `${ERROR_MESSAGES[kind]} (código ${status})` : ERROR_MESSAGES[kind]);
    this.name = 'APIError';
    this.kind = kind;
    this.status = status;
  }
}

function getAPIBaseURL(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;

  if (fromEnv) return fromEnv.replace(/\/$/, '');

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
  }

  const host = Constants.expoConfig?.hostUri?.split(':')[0];

  return `http://${host ?? 'localhost'}:${API_PORT}`;
}

async function fetchJSON<T>(path: string, validate: (data: unknown) => data is T): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;

  try {
    response = await fetch(`${getAPIBaseURL()}${path}`, { signal: controller.signal });
  } catch {
    throw new APIError(controller.signal.aborted ? 'timeout' : 'network');
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) throw new APIError('http', response.status);

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new APIError('invalid');
  }

  if (!validate(data)) throw new APIError('invalid');

  return data;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) return error.message;

  return 'Ocorreu um erro inesperado ao carregar os dados.';
}

const fetchSensors = () => fetchJSON('/sensors', isSensorSeedList);
const fetchRefuges = () => fetchJSON('/refuges', isRefugeList);
const fetchPlaces = () => fetchJSON('/places', isPlaceList);
const fetchUserLocation = () => fetchJSON('/user-location', isUserLocation);

export {
  APIError,
  getAPIBaseURL,
  getErrorMessage,
  fetchSensors,
  fetchRefuges,
  fetchPlaces,
  fetchUserLocation
};