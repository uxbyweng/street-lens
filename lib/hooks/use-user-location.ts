// lib\hooks\use-user-location.ts

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
    // 1. Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.lat && parsed?.lng) {
          setLocation(parsed);
          setIsLoading(false);
          return;
        }
      } catch {
        // ignore broken storage
      }
    }

    // 2. Check if geolocation is available
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      setIsLoading(false);
      return;
    }

    // 3. Request location
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
        console.error("Geolocation error:", err);

        if (err.code === err.PERMISSION_DENIED) {
          setError("Location permission denied.");
        } else {
          setError("Could not retrieve location.");
        }

        setIsLoading(false);
      }
    );
  }, []);

  return { location, isLoading, error };
}
