import Address from '@/types/address';
import Coordinates from '@/types/coordinates';
import Place from '@/types/place';
import Refuge from '@/types/refuge';
import SensorSeed from '@/types/sensorSeed';
import UserLocation from '@/types/userLocation';

const TRENDS = ['HEATING', 'STABLE', 'COOLING'];
const REFUGE_TYPES = ['AGUA_E_SOMBRA', 'BEBEDOURO', 'TENDA_PREFEITURA', 'PRACA_ARBORIZADA', 'CENTRO_CLIMATIZADO'];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isCoordinates(value: unknown): value is Coordinates {
  return isObject(value) && isNumber(value.latitude) && isNumber(value.longitude);
}

function isAddress(value: unknown): value is Address {
  return isObject(value)
    && isString(value.cep)
    && isString(value.streetName)
    && isNumber(value.number)
    && isString(value.neighborhood);
}

function isSensorSeed(value: unknown): value is SensorSeed {
  return isObject(value)
    && isString(value.sensorID)
    && isString(value.name)
    && isAddress(value.address)
    && isCoordinates(value.coordinates)
    && isNumber(value.temperature)
    && TRENDS.includes(value.trend as string);
}

function isRefuge(value: unknown): value is Refuge {
  return isObject(value)
    && isString(value.refugeID)
    && isString(value.name)
    && REFUGE_TYPES.includes(value.type as string)
    && isAddress(value.address)
    && isCoordinates(value.coordinates)
    && typeof value.isOpen === 'boolean'
    && isString(value.openingHours)
    && Array.isArray(value.amenities)
    && value.amenities.every(isString)
    && typeof value.description === 'string';
}

function isPlace(value: unknown): value is Place {
  return isObject(value)
    && isString(value.placeID)
    && isString(value.name)
    && typeof value.description === 'string'
    && isCoordinates(value.coordinates);
}

function listOf<T>(guard: (value: unknown) => value is T) {
  return (value: unknown): value is T[] => Array.isArray(value) && value.every(guard);
}

const isSensorSeedList = listOf(isSensorSeed);
const isRefugeList = listOf(isRefuge);
const isPlaceList = listOf(isPlace);

function isUserLocation(value: unknown): value is UserLocation {
  return isObject(value)
    && isCoordinates(value.coordinates)
    && isAddress(value.address)
    && isNumber(value.affectedRadiusMeters)
    && value.affectedRadiusMeters > 0;
}

export { isSensorSeedList, isRefugeList, isPlaceList, isUserLocation };