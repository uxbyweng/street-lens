// UPLOAD STEUERUNG

import exifr from "exifr"; // importier Bibliothek zum Auslesen von EXIF-Daten

// --- TYP-DEFINITIONEN ---
export type ExtractedCoordinates = {
  latitude: number; // Breitengrad (Zahl)
  longitude: number; // Längengrad (Zahl)
};

type CloudinaryUploadResult = {
  secureUrl: string; // URL des hochgeladenen Bildes
  publicId: string; // eindeutige ID von Cloudinary für das Bild
  originalFilename?: string; // Optional: Der ursprüngliche Name der Datei
};

// --- FUNKTION: KOORDINATEN AUSLESEN ---
/**
 * Versucht, GPS-Daten aus einer Bilddatei zu extrahieren.
 */
// export async function extractCoordinatesFromImage(
//   file: File
// ): Promise<ExtractedCoordinates | null> {
//   try {
//     // exifr.gps(file) sucht nach Breiten- und Längengraden in den Bilddaten
//     const gpsData = await exifr.gps(file);
//     console.log("gpsData from exifr:", gpsData);

//     const latitude = Number(gpsData?.latitude);
//     const longitude = Number(gpsData?.longitude);

//     const hasValidCoordinates =
//       Number.isFinite(latitude) && Number.isFinite(longitude);

//     // Wenn keine GPS-Daten vorhanden > "null" zurückgeben.
//     if (!hasValidCoordinates) {
//       return null;
//     }
//     // Wenn alles passt, geben wir die Koordinaten zurück.
//     // toFixed(6) rundet auf 6 Nachkommastellen für eine saubere Speicherung.
//     return {
//       latitude: Number(latitude.toFixed(6)),
//       longitude: Number(longitude.toFixed(6)),
//     };
//   } catch (error) {
//     // Fehler Logging bei Absturz (z.b. Datei ist defekt)
//     console.error("Client EXIF GPS extraction failed:", error);
//     return null;
//   }
// }

export async function extractCoordinatesFromImage(
  file: File
): Promise<ExtractedCoordinates | null> {
  try {
    const gpsData = await exifr.gps(file);

    let latitude = Number(gpsData?.latitude);
    let longitude = Number(gpsData?.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      const fallbackData = await exifr.parse(file, { gps: true });
      latitude = Number(fallbackData?.latitude);
      longitude = Number(fallbackData?.longitude);
    }

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }

    return {
      latitude: Number(latitude.toFixed(6)),
      longitude: Number(longitude.toFixed(6)),
    };
  } catch (error) {
    console.error("Client EXIF GPS extraction failed:", error);
    return null;
  }
}

// --- FUNKTION: BILD HOCHLADEN ---
/**
Client-Utility, die das Bild direkt vom Browser zu Cloudinary sendet
Diese Funktion macht:
- FormData erzeugen
- file anhängen
- upload_preset anhängen
- fetch("https://api.cloudinary.com/v1_1/<cloud>/image/upload")
 */
export async function uploadImageToCloudinary(
  file: File
): Promise<CloudinaryUploadResult> {
  // Zugangsdaten aus den Umgebungsvariablen (.env Datei) holen
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Sicherheitscheck: Sind die Zugangsdaten überhaupt konfiguriert?
  if (!cloudName) {
    throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.");
  }

  if (!uploadPreset) {
    throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.");
  }

  // "digitales Formular" erstellen, um Datei zu versenden
  const uploadFormData = new FormData();
  uploadFormData.append("file", file); // Das eigentliche Bild
  uploadFormData.append("upload_preset", uploadPreset); // Die Hochlade-Einstellung

  // Formular per POST-Anfrage an Cloudinary-Schnittstelle (API) senden
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: uploadFormData,
    }
  );

  // Server-Antwort in JavaScript-Objekt umwandeln
  const result = await response.json().catch(() => null);

  // Prüfen, ob der Server einen Fehler gemeldet hat (z.B. Code 400 oder 500)
  if (!response.ok) {
    throw new Error(result?.error?.message || "Cloudinary upload failed.");
  }

  // Prüfen, ob wirklich eine Bild-URL zurückgeliefert wurde
  if (!result?.secure_url) {
    throw new Error("Cloudinary upload returned no secure_url.");
  }

  // Alles erfolgreich! Return der wichtigsten Infos
  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
    originalFilename: result.original_filename,
  };
}
