import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ItineraryItem, UserLocation } from '../types/itinerary';
import { formatDistance } from '../utils/geoUtils';
import { Navigation, Compass } from 'lucide-react';

interface MapViewProps {
  items: ItineraryItem[];
  userLocation: UserLocation | null;
  nextStopId: string | null;
  onOpenGuide: (item: ItineraryItem) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  items,
  userLocation,
  nextStopId,
  onOpenGuide,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not yet done
    if (!mapInstanceRef.current) {
      const initialLat = userLocation?.lat ?? items[0]?.lat ?? 35.7148;
      const initialLng = userLocation?.lng ?? items[0]?.lng ?? 139.7967;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      markersRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const layerGroup = markersRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();
    const boundsPoints: L.LatLngExpression[] = [];

    // 1. Add User Location Marker
    if (userLocation) {
      const userLatLng: L.LatLngExpression = [userLocation.lat, userLocation.lng];
      boundsPoints.push(userLatLng);

      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8">
            <span class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></span>
            <div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-[10px] text-white font-bold">
              📍
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const userMarker = L.marker(userLatLng, { icon: userIcon });
      userMarker.bindPopup(`
        <div class="p-1 font-sans text-xs">
          <strong class="text-blue-600 font-bold block mb-0.5">📌 目前所在位置</strong>
          <span>${userLocation.cityName || '手機即時 GPS'}</span>
          <br/><span class="text-slate-400 font-mono">(${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})</span>
        </div>
      `);
      layerGroup.addLayer(userMarker);
    }

    // 2. Add Itinerary Stop Markers
    const routeCoordinates: L.LatLngExpression[] = [];

    items.forEach((item, index) => {
      const isNext = item.id === nextStopId;
      const isCompleted = !!item.completed;
      const latLng: L.LatLngExpression = [item.lat, item.lng];
      boundsPoints.push(latLng);
      routeCoordinates.push(latLng);

      const markerColor = isCompleted
        ? 'bg-slate-500 text-white'
        : isNext
        ? 'bg-orange-500 text-white ring-4 ring-orange-300 animate-pulse'
        : 'bg-amber-600 text-white';

      const customIcon = L.divIcon({
        className: 'itinerary-stop-marker',
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-2xl ${markerColor} font-black text-xs shadow-md border-2 border-white">
            ${index + 1}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(latLng, { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1.5 font-sans';
      popupContent.innerHTML = `
        <div class="text-xs">
          <div class="flex items-center gap-1 mb-1">
            <span class="font-bold text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">
              第 ${index + 1} 站 · 預計 ${item.estimatedArrivalTime || '--'} 抵達
            </span>
            ${isNext ? '<span class="font-extrabold text-[10px] text-orange-600">下個目的地</span>' : ''}
          </div>
          <h4 class="font-black text-sm text-slate-900 mb-0.5">${item.title}</h4>
          <p class="text-slate-500 text-[11px] mb-1.5 line-clamp-1">${item.location}</p>
          <div class="text-[11px] font-semibold text-slate-700 bg-slate-50 p-1.5 rounded-lg border border-slate-200 mb-2">
            🚗 行車約 ${item.estimatedDriveMinutes ?? 1} 分鐘 · 距離：${formatDistance(item.distanceMeters)}
          </div>
        </div>
      `;

      const guideBtn = document.createElement('button');
      guideBtn.innerText = '📖 查看景點介紹';
      guideBtn.className =
        'w-full py-1.5 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors';
      guideBtn.onclick = () => onOpenGuide(item);
      popupContent.appendChild(guideBtn);

      marker.bindPopup(popupContent);
      layerGroup.addLayer(marker);
    });

    // 3. Draw Connecting Route Polyline between stops
    if (routeCoordinates.length > 1) {
      const polyline = L.polyline(routeCoordinates, {
        color: '#f97316',
        weight: 4,
        opacity: 0.75,
        dashArray: '8, 8',
      });
      layerGroup.addLayer(polyline);
    }

    // Connect user location to next stop
    if (userLocation && nextStopId) {
      const nextItem = items.find((i) => i.id === nextStopId);
      if (nextItem) {
        const nextPolyline = L.polyline(
          [
            [userLocation.lat, userLocation.lng],
            [nextItem.lat, nextItem.lng],
          ],
          {
            color: '#3b82f6',
            weight: 3,
            opacity: 0.8,
          }
        );
        layerGroup.addLayer(nextPolyline);
      }
    }

    // Fit map bounds to show all markers
    if (boundsPoints.length > 0) {
      try {
        const bounds = L.latLngBounds(boundsPoints);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      } catch (e) {
        console.warn('Map fit bounds warning:', e);
      }
    }
  }, [items, userLocation, nextStopId]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (userLocation) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 15);
    } else if (items[0]) {
      mapInstanceRef.current.flyTo([items[0].lat, items[0].lng], 15);
    }
  };

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-md">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          className="flex items-center gap-1.5 bg-white/95 hover:bg-white text-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl shadow-md border border-slate-200 backdrop-blur-md transition-all cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>回到我的位置</span>
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-md text-[11px] text-slate-700 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span>我的位置</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span>下一站</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
          <span>後續景點</span>
        </div>
      </div>
    </div>
  );
};
