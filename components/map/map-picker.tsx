// components\map\map-picker.tsx

"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type MapPickerProps = {
  latitude?: number;
  longitude?: number;
  onChange?: (coords: { lat: number; lng: number }) => void;
};

const DEFAULT_LOCATION = {
  lat: 52.52,
  lng: 13.405,
};

export function MapPicker({ latitude, longitude, onChange }: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const lat = latitude ?? DEFAULT_LOCATION.lat;
  const lng = longitude ?? DEFAULT_LOCATION.lng;

  // Init map (ONLY once)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [lng, lat],
      zoom: 13,
    });

    mapRef.current = map;

    // Click handler
    map.on("click", (e) => {
      const coords = {
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
      };

      if (onChange) onChange(coords);
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update marker + center when coords change
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    map.flyTo({
      center: [lng, lat],
      duration: 500,
    });

    if (!markerRef.current) {
      markerRef.current = new maplibregl.Marker()
        .setLngLat([lng, lat])
        .addTo(map);
    } else {
      markerRef.current.setLngLat([lng, lat]);
    }
  }, [lat, lng]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[300px] rounded-xl overflow-hidden"
    />
  );
}
