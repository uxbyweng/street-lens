"use client";

import { MapPicker } from "@/components/map/map-picker";
import { getStoredUserLocation } from "@/lib/location/storage";

export function ProfileLocationCard() {
  const storedLocation = getStoredUserLocation();

  const hasCoordinates =
    storedLocation?.lat != null && storedLocation?.lng != null;

  return hasCoordinates ? (
    <MapPicker
      latitude={storedLocation.lat}
      longitude={storedLocation.lng}
      disabled
      showControls
      className="h-full rounded-none border-0"
    />
  ) : (
    <MapPicker
      latitude={52.49905}
      longitude={13.418327}
      disabled
      showControls
      className="h-full rounded-none border-0"
    />
  );
}
