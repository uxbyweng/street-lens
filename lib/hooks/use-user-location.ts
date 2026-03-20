"use client";

import { useEffect, useRef, useState } from "react";
import {
  getStoredUserLocation,
  setStoredUserLocation,
} from "@/lib/location/storage";
import { toast } from "sonner";

type Coordinates = {
  lat: number;
  lng: number;
};

type UseUserLocationReturn = {
  location: Coordinates | null;
  isRequesting: boolean;
  error: string | null;
};

export function useUserLocation(): UseUserLocationReturn {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    const stored = getStoredUserLocation();

    if (stored) {
      setLocation({ lat: stored.lat, lng: stored.lng });
      return;
    }

    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    if (!navigator.geolocation) {
      toast.message("Geolocation is not supported on this device.");
      return;
    }

    setIsRequesting(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(coords);
        setStoredUserLocation(coords);
        setError(null);
        setIsRequesting(false);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location permission denied.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError("Location unavailable.");
        } else if (err.code === err.TIMEOUT) {
          setError("Location request timed out.");
        } else {
          setError("Could not retrieve location.");
        }

        setIsRequesting(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 5 * 60 * 1000,
      }
    );
  }, []);

  return { location, isRequesting, error };
}
