// components\map\artworks-map.tsx

"use client";

import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from "@/components/ui/map";
import { cn } from "@/lib/utils";
import type { Artwork } from "@/types/artwork";

type ArtworksMapProps = {
  artworks: Artwork[];
  showControls?: boolean;
  className?: string;
};

const DEFAULT_LOCATION = {
  lat: 52.52,
  lng: 13.405,
};

const MAP_STYLES = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

export function ArtworksMap({
  artworks,
  showControls = true,
  className,
}: ArtworksMapProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border", className)}>
      <Map
        className="h-100 w-full"
        viewport={{
          center: [DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat],
          zoom: 11,
        }}
        styles={MAP_STYLES}
      >
        {showControls ? (
          <MapControls
            position="bottom-right"
            showZoom
            showCompass={false}
            showLocate={false}
            showFullscreen={false}
          />
        ) : null}
        {artworks.map((artwork) => (
          <MapMarker
            key={artwork._id}
            longitude={artwork.longitude}
            latitude={artwork.latitude}
          >
            <MarkerContent />
            <MarkerPopup>
              <div className="w-56 space-y-3">
                <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                  TEST
                </div>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}
