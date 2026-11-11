'use dom';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

import Coordinates from '@/types/coordinates';

const HOME_ICON_PATH = 'M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z';
const ALERT_ICON_PATH = 'M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z';

const MINI_MAP_STYLES = `
  .mini-pin {
    width: 34px; height: 34px; border-radius: 50%; border: 3px solid #fff;
    display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,.4);
  }
  .mini-user {
    width: 16px; height: 16px; border-radius: 50%; background: #1D4ED8; border: 3px solid #fff;
    box-shadow: 0 0 0 6px rgba(29,78,216,.25);
  }
`;

type MiniMapProps = {
  targetCoordinates: Coordinates;
  userCoordinates: Coordinates;
  variant?: 'refuge' | 'alert';
  targetColor?: string;
  dom?: import('expo/dom').DOMProps
};

function MiniMap({ targetCoordinates, userCoordinates, variant = 'refuge', targetColor }: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinColor = targetColor ?? (variant === 'refuge' ? '#15803D' : '#DC2626');
  const iconPath = variant === 'refuge' ? HOME_ICON_PATH : ALERT_ICON_PATH;

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const target: L.LatLngExpression = [targetCoordinates.latitude, targetCoordinates.longitude];
    const user: L.LatLngExpression = [userCoordinates.latitude, userCoordinates.longitude];
    const map = L.map(container, { zoomControl: false, attributionControl: false });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    L.marker(target, {
      icon: L.divIcon({
        className: '',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        html: `<div class="mini-pin" style="background:${pinColor}"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="${iconPath}"/></svg></div>`
      })
    }).addTo(map);
    L.marker(user, {
      icon: L.divIcon({
        className: '',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        html: '<div class="mini-user"></div>'
      })
    }).addTo(map);
    map.fitBounds(L.latLngBounds([target, user]), { padding: [40, 40], maxZoom: 17 });

    return () => {
      map.remove();
    };
  }, [targetCoordinates, userCoordinates, pinColor, iconPath]);

  return (
    <>
      <style>{MINI_MAP_STYLES}</style>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}/>
    </>
  );
}

export default MiniMap;