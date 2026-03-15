import React, { useEffect, useRef } from 'react';
import { useStops } from '../context/StopsContext';

const CATEGORY_COLORS = {
  beach: '#06b6d4', food: '#f59e0b', culture: '#8b5cf6',
  adventure: '#ef4444', nightlife: '#ec4899', nature: '#22c55e',
  shopping: '#f97316', other: '#94a3b8'
};

const CATEGORY_ICONS = {
  beach:'🏖️', food:'🍽️', culture:'🏛️', adventure:'🪂',
  nightlife:'🍹', nature:'🌿', shopping:'🛍️', other:'📍'
};

// Goa default coords for stops without coordinates
const GOA_STOPS_COORDS = {
  'Baga Beach': [15.5556, 73.7517],
  'Calangute': [15.5438, 73.7553],
  'Anjuna': [15.5735, 73.7404],
  'Panjim': [15.4989, 73.8278],
  'Old Goa': [15.5007, 73.9114],
  'Dudhsagar Falls': [15.3144, 74.3144],
  'Vagator': [15.5996, 73.7404],
  'Colva Beach': [15.2793, 73.9221],
  'Arambol': [15.6837, 73.7043],
  'Margao': [15.2832, 73.9862],
};

export default function MapView({ onEditStop }) {
  const { stops } = useStops();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  useEffect(() => {
    // Dynamically load Leaflet
    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) updateMarkers();
    // eslint-disable-next-line
  }, [stops]);

  const initMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const L = window.L;

    const map = L.map(mapRef.current, {
      center: [15.4989, 73.8278], // Goa center
      zoom: 11,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    updateMarkers();
  };

  const updateMarkers = () => {
    const L = window.L;
    if (!L || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    if (polylineRef.current) { polylineRef.current.remove(); polylineRef.current = null; }

    const coords = [];

    stops.forEach((stop, index) => {
      // Try to get coords from stop.coordinates, or guess from location name, or default to Goa area
      let lat, lng;
      if (stop.coordinates?.lat && stop.coordinates?.lng) {
        lat = stop.coordinates.lat;
        lng = stop.coordinates.lng;
      } else {
        // Look for a rough match in known Goa places
        const match = Object.keys(GOA_STOPS_COORDS).find(k =>
          stop.title?.toLowerCase().includes(k.toLowerCase()) ||
          stop.location?.toLowerCase().includes(k.toLowerCase())
        );
        if (match) {
          [lat, lng] = GOA_STOPS_COORDS[match];
        } else {
          // Spread unknown stops around Goa
          lat = 15.35 + Math.random() * 0.5;
          lng = 73.75 + Math.random() * 0.4;
        }
      }

      coords.push([lat, lng]);

      const color = stop.status === 'visited' ? '#22c55e' : stop.status === 'skipped' ? '#6b7280' : CATEGORY_COLORS[stop.category] || '#f97316';

      const icon = L.divIcon({
        html: `
          <div style="
            background:${color};
            width:36px;height:36px;border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-size:1.1rem;border:3px solid white;
            box-shadow:0 2px 12px rgba(0,0,0,0.4);
            cursor:pointer;
          ">
            ${CATEGORY_ICONS[stop.category] || '📍'}
          </div>
          <div style="
            position:absolute;top:-6px;right:-6px;
            background:#1e293b;color:white;
            font-size:0.65rem;font-weight:700;
            width:18px;height:18px;border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            border:1px solid ${color};
          ">${index + 1}</div>
        `,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:180px;">
            <strong style="font-size:1rem;">${stop.title}</strong>
            <div style="color:#94a3b8;font-size:0.8rem;margin:4px 0;">📍 ${stop.location}</div>
            ${stop.images[0] ? `<img src="${stop.images[0].url}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin:6px 0;" />` : ''}
            ${stop.description ? `<div style="font-size:0.82rem;color:#cbd5e1;">${stop.description.slice(0, 100)}${stop.description.length > 100 ? '…' : ''}</div>` : ''}
            <div style="margin-top:8px;">
              <span style="background:${color}22;color:${color};padding:3px 8px;border-radius:20px;font-size:0.72rem;border:1px solid ${color}44;">
                ${stop.status === 'visited' ? '✅ Visited' : stop.status === 'skipped' ? '⏭️ Skipped' : '📍 Planned'}
              </span>
            </div>
          </div>
        `, { maxWidth: 220 });

      markersRef.current.push(marker);
    });

    // Draw route polyline through planned/visited stops
    const routeCoords = coords.filter((_, i) => stops[i].status !== 'skipped');
    if (routeCoords.length > 1) {
      polylineRef.current = L.polyline(routeCoords, {
        color: '#f97316',
        weight: 2.5,
        opacity: 0.6,
        dashArray: '8 6',
      }).addTo(map);
    }

    // Fit map to markers
    if (coords.length > 0) {
      map.fitBounds(coords, { padding: [40, 40] });
    }
  };

  return (
    <div className="map-wrapper">
      <div className="map-legend">
        <span className="legend-item"><span style={{background:'#22c55e'}} className="legend-dot" />Visited</span>
        <span className="legend-item"><span style={{background:'#f97316'}} className="legend-dot" />Planned</span>
        <span className="legend-item"><span style={{background:'#6b7280'}} className="legend-dot" />Skipped</span>
        <span className="legend-item legend-route"><span className="legend-line" />Route</span>
      </div>
      <div ref={mapRef} className="map-container" />
      {stops.length === 0 && (
        <div className="map-empty">
          <span>🗺️</span>
          <p>Add stops to see them on the map</p>
        </div>
      )}
    </div>
  );
}
