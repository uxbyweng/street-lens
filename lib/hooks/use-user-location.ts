"use client";

import { useEffect, useState } from "react";

type Coordinates = {
  lat: number;
  lng: number;
};

type UseUserLocationReturn = {
  location: Coordinates | null;
  isLoading: boolean;
  error: string | null;
};

const STORAGE_KEY = "userLocation";

export function useUserLocation(): UseUserLocationReturn {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        if (
          typeof parsed?.lat === "number" &&
          typeof parsed?.lng === "number"
        ) {
          setLocation(parsed);
          setIsLoading(false);
          return;
        }
      } catch {
        // ignore broken storage
      }
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(coords);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(coords));
        setIsLoading(false);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location permission denied.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          console.warn("Geolocation unavailable.");
          setError("Location unavailable.");
        } else if (err.code === err.TIMEOUT) {
          console.warn("Geolocation request timed out.");
          setError("Location request timed out.");
        } else {
          console.warn("Unknown geolocation error.");
          setError("Could not retrieve location.");
        }

        setIsLoading(false);
      }
    );
  }, []);

  return { location, isLoading, error };
}
