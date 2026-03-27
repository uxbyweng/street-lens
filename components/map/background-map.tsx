"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type LoginBackgroundMapProps = {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  className?: string;
};

function createArtworkStyleMarker() {
  const wrapper = document.createElement("div");
  wrapper.className = "relative flex items-center justify-center";

  const outer = document.createElement("div");
  outer.className =
    "pointer-events-none absolute h-[72px] w-[72px] rounded-full bg-orange-500/15";

  const pulse = document.createElement("div");
  pulse.className =
    "pointer-events-none absolute h-12 w-12 rounded-full bg-orange-500/35 animate-ping [animation-duration:3s]";

  const dot = document.createElement("div");
  dot.className =
    "relative h-4 w-4 rounded-full bg-pink-500 shadow-lg shadow-pink-500/50";

  wrapper.appendChild(outer);
  wrapper.appendChild(pulse);
  wrapper.appendChild(dot);

  return wrapper;
}

export function BackgroundMap({
  latitude = 52.516273,
  longitude = 13.377627,
  zoom = 15,
  className = "",
}: LoginBackgroundMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [longitude, latitude],
      zoom,
      interactive: false,
      attributionControl: false,
      pitch: 60,
      bearing: 0,
    });

    mapRef.current = map;

    const markerElement = createArtworkStyleMarker();

    new maplibregl.Marker({
      element: markerElement,
      anchor: "center",
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
