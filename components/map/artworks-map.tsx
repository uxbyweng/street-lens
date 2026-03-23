"use client";

import {
  Map,
  MapControls,
  MarkerLabel,
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
          pitch: 60,
          bearing: -20,
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
            className=""
          >
            <MarkerContent>
              <div className="relative flex items-center justify-center">
                <div className="absolute size-18 rounded-full bg-sky-500/30 pointer-events-none"></div>
                <div className="absolute size-7 rounded-full bg-orange-500/50 hover:bg-pink-500/50 hover:size-10"></div>
                <div className="bg-pink-500 rounded-full p-1.5"></div>
              </div>
              <MarkerLabel
                position="bottom"
                className="uppercase text-lg font-fjalla"
              >
                {artwork.artist}
              </MarkerLabel>
            </MarkerContent>
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
