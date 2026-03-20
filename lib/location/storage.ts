export type StoredUserLocation = {
  lat: number;
  lng: number;
  timestamp: number;
};

export const USER_LOCATION_STORAGE_KEY = "streetlens:user-location";

// --- FUNKTION: STANDORT LADEN ---
export function getStoredUserLocation(): StoredUserLocation | null {
  // Zur Sicherheit prüfen, ob Seite im Browser aufgerufen wird,
  // da es auf dem Server keinen Speicher gibt
  if (typeof window === "undefined") return null;

  // Daten aus localStorage holen
  const raw = window.localStorage.getItem(USER_LOCATION_STORAGE_KEY);
  if (!raw) return null; // Abbrechen, wenn keine Daten da sind.

  try {
    // im Speicher enthaltne Daten (die als String vorliegen,
    // zurück in ein Objekt umwandeln
    const parsed = JSON.parse(raw);

    // Checken, ob alle wichtigen Zahlen (lat, lng, timestamp) vorhanden sind.
    if (
      typeof parsed?.lat === "number" &&
      typeof parsed?.lng === "number" &&
      typeof parsed?.timestamp === "number"
    ) {
      return parsed; // Wenn alles o.k., Standort wiedergeben
    }

    return null;
  } catch {
    return null;
  }
}

// --- FUNKTION: STANDORT SPEICHERN ---
export function setStoredUserLocation(coords: {
  lat: number;
  lng: number;
}): void {
  if (typeof window === "undefined") return;

  // Objekt mit Koordinaten und aktuellen Uhrzeit (Date.now()) erstellen
  const value: StoredUserLocation = {
    lat: coords.lat,
    lng: coords.lng,
    timestamp: Date.now(),
  };

  // Objekt in einen String  umwandeln und legen es im localStorage speichern
  window.localStorage.setItem(USER_LOCATION_STORAGE_KEY, JSON.stringify(value));
}

// --- FUNKTION: SPEICHER LEEREN ---
export function clearStoredUserLocation(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(USER_LOCATION_STORAGE_KEY);
}
