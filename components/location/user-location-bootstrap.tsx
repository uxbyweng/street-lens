"use client";

import { useUserLocation } from "@/lib/hooks/use-user-location";

/**
 * Diese Komponente dient als "Starter" für die Standort-Logik.
 */
export function UserLocationBootstrap() {
  // Hook aufrufen, der ...
  // ... prüft, ob der Standort im localStorage gespeichert ist.
  // ... ansonsten den Browser nach dem aktuellen Standort fragt (GPS-Abfrage).
  // ... und den globalen Zustand der App mit diesen Daten aktualisiert.
  useUserLocation();

  // Die Komponente gibt "null" zurück und rendert rin gar nichts.
  // Sie existiert nur, damit der Code in "useUserLocation" ausgeführt wird.
  return null;
}
