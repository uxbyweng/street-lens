"use client";

import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from "@/components/ui/map";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Artwork } from "@/types/artwork";
import { useUserLocation } from "@/lib/hooks/use-user-location";

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
  const { location } = useUserLocation();

  const initialCenter: [number, number] = location
    ? [location.lng, location.lat]
    : [DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat];

  return (
    <div className={cn("h-full overflow-hidden", className)}>
      <Map
        key={`${initialCenter[0]}-${initialCenter[1]}`}
        className="h-full w-full"
        viewport={{
          center: initialCenter,
          zoom: 14,
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
        {artworks.map((artwork) => (
          <MapMarker
            key={artwork._id}
            longitude={artwork.longitude}
            latitude={artwork.latitude}
          >
            <MarkerContent />
            <MarkerPopup closeButton={true}>
              <div className="w-56 space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-bold leading-tight">
                    {artwork.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {artwork.artist || "Unknown artist"}
                  </p>
                </div>

                <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                  <Image
                    src={artwork.imageUrl ?? "/images/artwork-placeholder.jpg"}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <Button asChild size="sm" className="w-full">
                  <Link href={`/artworks/${artwork._id}`}>More Info</Link>
                </Button>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}
