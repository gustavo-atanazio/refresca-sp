'use dom';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

import { ALERT_LEVELS, NORMAL_COLOR, getLevelColor } from '@/constants/alertLevels';
import Alert from '@/types/alert';
import Coordinates from '@/types/coordinates';
import MapCommand from '@/types/mapCommand';
import Sensor from '@/types/sensor';

const SAO_PAULO_ZOOM = 13;
const REGION_RADIUS_METERS = 700;

const HOME_ICON_PATH = 'M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z';
const THERMOMETER_ICON_PATH =
  'M15,13V5A3,3 0 0,0 9,5V13A5,5 0 1,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z';

const MAP_STYLES = `
  .heat-marker { display: flex; align-items: center; justify-content: center; }
  .heat-pill {
    display: flex; align-items: center; gap: 2px; padding: 4px 8px; border-radius: 999px;
    color: #fff; font: 700 14px/1 system-ui, sans-serif; border: 2px solid #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,.35); white-space: nowrap;
  }
  .heat-pill.pulse { animation: heat-pulse 1.6s ease-out infinite; }
  @keyframes heat-pulse {
    0% { box-shadow: 0 0 0 0 var(--pulse-color); }
    100% { box-shadow: 0 0 0 16px rgba(0,0,0,0); }
  }
  .user-dot {
    width: 18px; height: 18px; border-radius: 50%; background: #1D4ED8; border: 3px solid #fff;
    box-shadow: 0 0 0 8px rgba(29,78,216,.25);
  }
  .search-pin {
    width: 22px; height: 22px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
    background: #0F172A; border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,.4);
  }
  .alert-popup { font: 15px/1.4 system-ui, sans-serif; color: #0F172A; min-width: 210px; }
  .alert-popup h3 { margin: 0 0 6px; font-size: 17px; }
  .alert-popup .badge {
    display: inline-block; padding: 2px 10px; border-radius: 999px; color: #fff; font-weight: 700;
    font-size: 13px; margin-top: 4px;
  }
  .alert-popup .row { margin: 2px 0; }
  .alert-popup button {
    margin-top: 8px; width: 100%; padding: 10px; border: 0; border-radius: 8px; background: #1D4ED8;
    color: #fff; font: 700 15px system-ui, sans-serif; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .alert-popup button.secondary {
    background: #F1F5F9; color: #0F172A; border: 1px solid #CBD5E1;
  }
  .leaflet-container { font-family: system-ui, sans-serif; }
`;

type HeatMapProps = {
  sensors: Sensor[];
  alerts: Alert[];
  userCoordinates: Coordinates;
  affectedRadiusMeters: number;
  command: MapCommand | null;
  onFindShelter: (alertID: string) => Promise<void>;
  onOpenAlert: (alertID: string) => Promise<void>;
  dom?: import('expo/dom').DOMProps
};

type SensorLayers = {
  circle: L.Circle;
  marker: L.Marker
};

function formatTemperature(temperature: number): string {
  return `${temperature.toFixed(1).replace('.', ',')}°`;
}

function toLatLng(coordinates: Coordinates): L.LatLngExpression {
  return [coordinates.latitude, coordinates.longitude];
}

function buildMarkerIcon(sensor: Sensor): L.DivIcon {
  const color = getLevelColor(sensor.riskLevel);
  const pulse = sensor.riskLevel ? ' pulse' : '';

  return L.divIcon({
    className: 'heat-marker',
    iconSize: [70, 30],
    iconAnchor: [35, 42],
    html: `<div class="heat-pill${pulse}" style="background:${color};--pulse-color:${color}99">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="${THERMOMETER_ICON_PATH}"/></svg>
      ${formatTemperature(sensor.temperature)}
    </div>`
  });
}

function buildPopupContent(
  sensor: Sensor,
  alert: Alert | undefined,
  userCoordinates: Coordinates,
  affectedRadiusMeters: number
): string {
  const base = `<h3>${sensor.name}</h3>
    <div class="row"><strong>Temperatura:</strong> ${formatTemperature(sensor.temperature)}</div>`;

  if (!sensor.riskLevel || !alert) {
    return `<div class="alert-popup">${base}
      <div class="row"><strong>Nível:</strong> <span class="badge" style="background:${NORMAL_COLOR}">NORMAL</span></div></div>`;
  }

  const level = ALERT_LEVELS[sensor.riskLevel];
  const distance = L.latLng(toLatLng(sensor.coordinates)).distanceTo(L.latLng(toLatLng(userCoordinates)));
  const affectsUser = alert.active && distance <= affectedRadiusMeters;
  const shelterButton = affectsUser
    ? `<button data-find-shelter="${alert.alertID}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="${HOME_ICON_PATH}"/></svg>
        Buscar abrigo
      </button>`
    : '';

  return `<div class="alert-popup">${base}
    <div class="row"><strong>Nível:</strong> <span class="badge" style="background:${level.color}">${level.label.toUpperCase()}</span></div>
    <button class="secondary" data-alert-details="${alert.alertID}">Ver detalhes</button>
    ${shelterButton}</div>`;
}

function HeatMap({
  sensors,
  alerts,
  userCoordinates,
  affectedRadiusMeters,
  command,
  onFindShelter,
  onOpenAlert
}: HeatMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<Map<string, SensorLayers>>(new Map());
  const searchMarkerRef = useRef<L.Marker | null>(null);
  const lastNonceRef = useRef<number | null>(null);
  const onFindShelterRef = useRef(onFindShelter);
  const onOpenAlertRef = useRef(onOpenAlert);

  useEffect(() => {
    onFindShelterRef.current = onFindShelter;
  }, [onFindShelter]);

  useEffect(() => {
    onOpenAlertRef.current = onOpenAlert;
  }, [onOpenAlert]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || mapRef.current) return;

    const map = L.map(container, {
      center: toLatLng(userCoordinates),
      zoom: SAO_PAULO_ZOOM,
      minZoom: 10,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    L.marker(toLatLng(userCoordinates), {
      icon: L.divIcon({
        className: 'heat-marker',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        html: '<div class="user-dot"></div>'
      }),
      zIndexOffset: 1000,
      interactive: false
    }).addTo(map);

    const handleClick = (event: MouseEvent) => {
      const shelterTarget = (event.target as HTMLElement).closest('[data-find-shelter]');

      if (shelterTarget) {
        void onFindShelterRef.current(shelterTarget.getAttribute('data-find-shelter') ?? '');
        return;
      }

      const detailsTarget = (event.target as HTMLElement).closest('[data-alert-details]');

      if (detailsTarget) void onOpenAlertRef.current(detailsTarget.getAttribute('data-alert-details') ?? '');
    };

    container.addEventListener('click', handleClick);
    mapRef.current = map;
    const layers = layersRef.current;

    return () => {
      container.removeEventListener('click', handleClick);
      map.remove();
      mapRef.current = null;
      layers.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    sensors.forEach((sensor) => {
      const color = getLevelColor(sensor.riskLevel);
      const alert = alerts.find((item) => item.alertID === sensor.activeAlertID)
        ?? alerts.find((item) => item.sensorID === sensor.sensorID);
      const content = buildPopupContent(sensor, alert, userCoordinates, affectedRadiusMeters);
      const existing = layersRef.current.get(sensor.sensorID);

      if (existing) {
        existing.circle.setStyle({ color, fillColor: color });
        existing.marker.setIcon(buildMarkerIcon(sensor));
        existing.marker.setPopupContent(content);
        return;
      }

      const circle = L.circle(toLatLng(sensor.coordinates), {
        radius: REGION_RADIUS_METERS,
        color,
        fillColor: color,
        fillOpacity: 0.25,
        weight: 2,
        interactive: false
      }).addTo(map);
      const marker = L.marker(toLatLng(sensor.coordinates), { icon: buildMarkerIcon(sensor) })
        .addTo(map)
        .bindPopup(content, { autoPanPadding: [20, 120] });

      layersRef.current.set(sensor.sensorID, { circle, marker });
    });
  }, [sensors, alerts, userCoordinates, affectedRadiusMeters]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !command || lastNonceRef.current === command.nonce) return;

    lastNonceRef.current = command.nonce;

    if (command.type === 'zoomIn') map.zoomIn();
    else if (command.type === 'zoomOut') map.zoomOut();
    else if (command.type === 'recenter') map.flyTo(toLatLng(userCoordinates), 15);
    else if (command.type === 'flyTo' && command.coordinates) {
      map.flyTo(toLatLng(command.coordinates), 16);
      searchMarkerRef.current?.remove();
      searchMarkerRef.current = L.marker(toLatLng(command.coordinates), {
        icon: L.divIcon({
          className: 'heat-marker',
          iconSize: [22, 22],
          iconAnchor: [11, 22],
          html: '<div class="search-pin"></div>'
        })
      }).addTo(map);
    } else if (command.type === 'focusSensor' && command.sensorID) {
      const layers = layersRef.current.get(command.sensorID);

      if (layers) {
        map.flyTo(layers.marker.getLatLng(), 15);
        map.once('moveend', () => layers.marker.openPopup());
      }
    }
  }, [command, userCoordinates]);

  return (
    <>
      <style>{MAP_STYLES}</style>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}/>
    </>
  );
}

export default HeatMap;