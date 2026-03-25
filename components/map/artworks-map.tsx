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
import { IconHeart } from "@tabler/icons-react";
import type { Artwork } from "@/types/artwork";
import { getStoredUserLocation } from "@/lib/location/storage";
import { useState } from "react";

type ArtworksMapProps = {
  artworks: (Artwork & { likeCount?: number })[];
  showControls?: boolean;
  className?: string;
};

const DEFAULT_LOCATION = {
  // Kottbusser Tor, Berlin, germany
  lat: 52.49905,
  lng: 13.418327,
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
  const [userLocation, setUserLocation] = useState(() =>
    getStoredUserLocation()
  );

  return (
    <div className={cn("h-full overflow-hidden", className)}>
      <Map
        className="h-full w-full"
        viewport={{
          center: initialCenter,
          zoom: 15,
          pitch: 60,
          bearing: 0,
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
            onLocate={({ longitude, latitude }) => {
              setUserLocation({
                lng: longitude,
                lat: latitude,
                timestamp: Date.now(),
              });
            }}
          />
        ) : null}

        {userLocation ? (
          <MapMarker longitude={userLocation.lng} latitude={userLocation.lat}>
            <MarkerContent>
              <div className="relative flex items-center justify-center">
                <div className="absolute h-10 w-10 rounded-full bg-sky-500/20" />
                <div className="absolute h-6 w-6 rounded-full bg-sky-500/35 animate-ping animation-duration-[2s]" />
                <div className="relative h-4 w-4 rounded-full border-2 border-white bg-sky-500 shadow-lg shadow-sky-500/50" />
              </div>
              <MarkerLabel
                position="bottom"
                className="font-fjalla text-sm uppercase"
              >
                Your location
              </MarkerLabel>
            </MarkerContent>
          </MapMarker>
        ) : null}

        {artworks.map((artwork) => {
          return (
            <MapMarker
              key={artwork._id}
              longitude={artwork.longitude}
              latitude={artwork.latitude}
              className=""
            >
              <MarkerContent>
                <div className="relative flex items-center justify-center">
                  <div className="pointer-events-none absolute h-18 w-18 rounded-full bg-orange-500/15" />
                  <div className="pointer-events-none absolute h-12 w-12 rounded-full bg-orange-500/35 animate-ping animation-duration-[3s]" />
                  <div className="relative h-4 w-4 rounded-full bg-pink-500 shadow-lg shadow-pink-500/50" />
                </div>

                <MarkerLabel
                  position="bottom"
                  className="font-fjalla text-lg uppercase"
                >
                  {artwork.artist}
                </MarkerLabel>
              </MarkerContent>

              <MarkerPopup closeButton={true}>
                <div className="w-56 lg:w-100 space-y-3">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <p className="line-clamp-1 text-sm lg:text-xl font-bold uppercase text-pink-500">
                        {artwork.artist || "Unknown artist"}
                      </p>
                      <p className="line-clamp-1 text-sm lg:text-xl font-bold">
                        {artwork.title || "Unknown artwork title"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs lg:text-base text-white/80">
                      <IconHeart className="size-4" />
                      <span>{artwork.likeCount ?? 0}</span>
                    </div>
                  </div>

                  <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                    <Image
                      src={
                        artwork.imageUrl ?? "/images/artwork-placeholder.jpg"
                      }
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
          );
        })}
      </Map>
    </div>
  );
}
