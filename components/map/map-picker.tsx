"use client";

import * as React from "react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  useMap,
} from "@/components/ui/map";
import { cn } from "@/lib/utils";

type MapPickerProps = {
  latitude?: number;
  longitude?: number;
  onChange?: (coords: { lat: number; lng: number }) => void;
  disabled?: boolean;
  showControls?: boolean;
  className?: string;
};

const DEFAULT_LOCATION = {
  // Kottbusser Tor, Berlin, germany
  lat: 52.49905,
  lng: 13.418327,
};

const MAP_STYLES = {
  openstreetmap_dark: "https://tiles.openfreemap.org/styles/dark",
  openstreetmap_bright: "https://tiles.openfreemap.org/styles/bright",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

function MapClickHandler({
  disabled,
  onChange,
}: {
  disabled: boolean;
  onChange?: (coords: { lat: number; lng: number }) => void;
}) {
  const { map, isLoaded } = useMap();

  React.useEffect(() => {
    if (!map || !isLoaded || disabled) return;

    const handleClick = (event: { lngLat: { lat: number; lng: number } }) => {
      onChange?.({
        lat: event.lngLat.lat,
        lng: event.lngLat.lng,
      });
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [map, isLoaded, disabled, onChange]);

  return null;
}

function MapViewportSync({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const { map, isLoaded } = useMap();
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (!map || !isLoaded) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      map.jumpTo({
        center: [longitude, latitude],
        zoom: 13,
      });
      return;
    }

    map.flyTo({
      center: [longitude, latitude],
      duration: 800,
      essential: true,
    });
  }, [map, isLoaded, latitude, longitude]);

  return null;
}

export function MapPicker({
  latitude,
  longitude,
  onChange,
  disabled = false,
  showControls = true,
  className,
}: MapPickerProps) {
  const lat = latitude ?? DEFAULT_LOCATION.lat;
  const lng = longitude ?? DEFAULT_LOCATION.lng;

  return (
    <div className={cn("h-75 overflow-hidden rounded-xl border", className)}>
      <Map
        className="h-full w-full"
        viewport={{
          center: [lng, lat],
          zoom: 13,
        }}
        styles={MAP_STYLES}
      >
        {showControls ? (
          <MapControls
            position="bottom-right"
            showZoom
            showCompass={false}
            showLocate={true}
            showFullscreen={false}
          />
        ) : null}

        <MapClickHandler disabled={disabled} onChange={onChange} />
        <MapViewportSync latitude={lat} longitude={lng} />

        <MapMarker longitude={lng} latitude={lat}>
          <MarkerContent>
            <div className="relative flex items-center justify-center">
              <div className="pointer-events-none absolute h-18 w-18 rounded-full bg-orange-500/15" />
              <div className="pointer-events-none absolute h-12 w-12 rounded-full bg-orange-500/35 animate-ping animation-duration-[2s]" />
              <div className="relative h-4 w-4 rounded-full bg-pink-500 shadow-lg shadow-pink-500/50" />
            </div>
          </MarkerContent>
        </MapMarker>
      </Map>
    </div>
  );
}
