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
import { getStoredUserLocation } from "@/lib/location/storage";
import { useState } from "react";

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

function getInitialCenter(): [number, number] {
  const stored = getStoredUserLocation();

  if (stored) {
    return [stored.lng, stored.lat];
  }

  return [DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat];
}

export function ArtworksMap({
  artworks,
  showControls = true,
  className,
}: ArtworksMapProps) {
  const [initialCenter] = useState<[number, number]>(() => getInitialCenter());

  return (
    <div className={cn("h-full overflow-hidden", className)}>
      <Map
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
                    sizes="224px"
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
