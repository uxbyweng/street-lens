"use client";

import * as React from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type LoginBackgroundMapProps = {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  className?: string;
};

export function BackgroundMap({
  latitude = 52.520008,
  longitude = 13.404954,
  zoom = 15,
  className = "",
}: LoginBackgroundMapProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);

  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [longitude, latitude],
      zoom,
      interactive: false,
      attributionControl: false,
    });

    mapRef.current = map;

    new maplibregl.Marker({
      color: "#38bdf8",
      scale: 0.9,
    })
      .setLngLat([longitude, latitude])
      .addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude, zoom]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute inset-0 bg-black/55" />
    </div>
  );
}
