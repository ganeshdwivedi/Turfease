import React, { useEffect, useRef } from "react";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet marker icon resolution in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export interface LeafletMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  draggable?: boolean;
  onMarkerDragEnd?: (lat: number, lng: number) => void;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string;
  className?: string;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  lat,
  lng,
  zoom = 15,
  draggable = true,
  onMarkerDragEnd,
  onMapClick,
  height = "400px",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Keep callback refs fresh
  const onMarkerDragEndRef = useRef(onMarkerDragEnd);
  onMarkerDragEndRef.current = onMarkerDragEnd;

  const onMapClickRef = useRef(onMapClick);
  onMapClickRef.current = onMapClick;

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom,
      attributionControl: true,
    });
    mapInstanceRef.current = map;

    // OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Initial marker
    const marker = L.marker([lat, lng], { draggable }).addTo(map);
    markerRef.current = marker;

    // Marker drag end event
    marker.on("dragend", () => {
      const position = marker.getLatLng();
      if (onMarkerDragEndRef.current) {
        onMarkerDragEndRef.current(position.lat, position.lng);
      }
    });

    // Map click event
    map.on("click", (e: L.LeafletMouseEvent) => {
      if (onMapClickRef.current) {
        onMapClickRef.current(e.latlng.lat, e.latlng.lng);
      }
    });

    // Handle container resize when opened in modals or dynamic tabs
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update map view and marker when lat/lng change
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;

    const currentLatLng = markerRef.current.getLatLng();
    if (
      Math.abs(currentLatLng.lat - lat) > 0.00001 ||
      Math.abs(currentLatLng.lng - lng) > 0.00001
    ) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom(), {
        animate: true,
      });
    }
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height }}
      className={`rounded-lg overflow-hidden border border-gray-200 z-0 ${className}`}
    />
  );
};

export default LeafletMap;
