"use client"; // Sagt Next.js: Dies ist ein interaktives Bauteil für den Browser

/* IMPORTS */
import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"; // Verbindet Formular mit Validierung
import { Controller, useForm } from "react-hook-form"; // Das Hauptwerkzeug für Formulare
import { toast } from "sonner"; // Fehlermeldungen (Popups)
import * as z from "zod"; // Werkzeug, um Regeln für Eingabefelder festzulegen
import { ArtworkImageUpload } from "@/components/forms/artwork-image-upload";
import {
  extractCoordinatesFromImage,
  uploadImageToCloudinary,
} from "@/lib/cloudinary/client-upload";
import { MapPicker } from "@/components/map/map-picker";
import { FormTextField } from "@/components/forms/form-text-field";
import { FormTextareaField } from "@/components/forms/form-textarea-field";
import { Button } from "@/components/ui/button";
import { IconPencil } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ALLOWED_TAGS,
  type AllowedArtworkTag,
} from "@/lib/constants/artwork-tags";

/* SCHEMA */
// Definition, was "richtig" ausgefüllt bedeutet.
const artworkFormSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters.")
    .max(100, "Title must be at most 100 characters."),
  artist: z
    .string()
    .min(2, "Artist must be at least 2 characters.")
    .max(100, "Artist must be at most 100 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(1000, "Description must be at most 1000 characters."),
  imageUrl: z.string().trim().optional(),
  cloudinaryPublicId: z.string().trim().optional(),
  latitude: z
    .string()
    .trim()
    .min(1, "Latitude is required.")
    .refine((value) => {
      const number = Number(value);
      return !Number.isNaN(number) && number >= -90 && number <= 90;
    }, "Latitude must be between -90 and 90."),
  longitude: z
    .string()
    .trim()
    .min(1, "Longitude is required.")
    .refine((value) => {
      const number = Number(value);
      return !Number.isNaN(number) && number >= -180 && number <= 180;
    }, "Longitude must be between -180 and 180."),
  tags: z.array(z.enum(ALLOWED_TAGS)).default([]),
});

/* EXPORT TYPES */
export type ArtworkFormInput = z.input<typeof artworkFormSchema>;
export type ArtworkFormValues = z.output<typeof artworkFormSchema>;

/* LOCAL TYPES */
type ArtworkPayload = {
  title: string;
  artist: string;
  description: string;
  imageUrl?: string;
  cloudinaryPublicId?: string;
  latitude?: number;
  longitude?: number;
  tags: string[];
};

type ArtworkFormProps = {
  mode: "create" | "edit";
  artworkId?: string;
  initialValues?: Partial<ArtworkFormInput>;
};

/* HELPER FUNCTIONS */
// Text in Zahl umwandeln, falls möglich
function parseCoordinate(value?: string): number | undefined {
  if (!value) return undefined;

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? undefined : parsedValue;
}

// Formular-Werte in Objekt für Datenbank bündeln
function buildArtworkPayload(values: ArtworkFormValues): ArtworkPayload {
  return {
    title: values.title,
    artist: values.artist,
    description: values.description,
    imageUrl: values.imageUrl || undefined,
    cloudinaryPublicId: values.cloudinaryPublicId || undefined,
    latitude: parseCoordinate(values.latitude),
    longitude: parseCoordinate(values.longitude),
    tags: values.tags ?? [],
  };
}

const MAX_IMAGE_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// --- API-FUNKTION: DATEN SPEICHERN ---
async function saveArtwork(
  payload: ArtworkPayload,
  options: {
    mode: "create" | "edit"; //  neu erstellen (POST) oder editieren (PATCH)
    artworkId?: string;
  }
) {
  const endpoint =
    options.mode === "edit" && options.artworkId
      ? `/api/artworks/${options.artworkId}`
      : "/api/artworks";

  const method = options.mode === "edit" ? "PATCH" : "POST";

  const response = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ||
        (options.mode === "edit"
          ? "Failed to update artwork."
          : "Failed to save artwork.")
    );
  }

  return result;
}

// --- HAUPT-KOMPONENTE ---
export function ArtworkForm({
  mode,
  artworkId,
  initialValues,
}: ArtworkFormProps) {
  // STATUS-VARIABLEN (States)
  const router = useRouter(); // Um User nach dem Speichern weiterzuleiten
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [selectedFileName, setSelectedFileName] = React.useState<string | null>(
    null
  );
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(
    initialValues?.imageUrl ?? null
  );
  const [imageStatusMessage, setImageStatusMessage] = React.useState<
    string | null
  >(null);
  const [imageStatusVariant, setImageStatusVariant] = React.useState<
    "default" | "success" | "warning"
  >("default");
  const [areCoordinatesEditable, setAreCoordinatesEditable] = React.useState(
    !initialValues?.latitude || !initialValues?.longitude
  );
  const [hasAutoExtractedCoordinates, setHasAutoExtractedCoordinates] =
    React.useState(
      Boolean(initialValues?.latitude && initialValues?.longitude)
    );

  const sanitizedTags: AllowedArtworkTag[] = (initialValues?.tags ?? []).filter(
    (tag): tag is AllowedArtworkTag =>
      ALLOWED_TAGS.includes(tag as AllowedArtworkTag)
  );

  // DEFAULT VALUES
  const defaultValues: ArtworkFormInput = {
    title: initialValues?.title ?? "",
    artist: initialValues?.artist ?? "",
    description: initialValues?.description ?? "",
    imageUrl: initialValues?.imageUrl ?? "",
    cloudinaryPublicId: initialValues?.cloudinaryPublicId ?? "",
    latitude: initialValues?.latitude ?? "",
    longitude: initialValues?.longitude ?? "",
    tags: sanitizedTags,
  };

  // FORMULAR-INITIALISIERUNG
  const form = useForm<ArtworkFormInput, unknown, ArtworkFormValues>({
    resolver: zodResolver(artworkFormSchema),
    defaultValues,
  });

  // WATCHED VALUES
  const watchedLatitudeValue = form.watch("latitude");
  const watchedLongitudeValue = form.watch("longitude");
  const watchedLatitude =
    watchedLatitudeValue !== "" && !Number.isNaN(Number(watchedLatitudeValue))
      ? Number(watchedLatitudeValue)
      : undefined;

  const watchedLongitude =
    watchedLongitudeValue !== "" && !Number.isNaN(Number(watchedLongitudeValue))
      ? Number(watchedLongitudeValue)
      : undefined;

  // USEEFFECT
  React.useEffect(() => {
    return () => {
      if (imagePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  /* HANDLERS */

  // Submit form
  async function onSubmit(values: ArtworkFormValues) {
    setIsSubmitting(true);

    const payload = buildArtworkPayload(values);

    try {
      const result = await saveArtwork(payload, {
        mode,
        artworkId,
      });

      toast.success(
        mode === "edit"
          ? "Artwork successfully updated."
          : "Artwork successfully added.",
        {
          className: "!bg-green-200 !text-green-700 !border-green-500 mt-15",
        }
      );

      const createdArtworkId = result?.data?._id;

      if (mode === "edit" && artworkId) {
        router.push(`/artworks/${artworkId}`);
        return;
      }

      form.reset(defaultValues);

      if (createdArtworkId) {
        router.push(`/artworks/${createdArtworkId}`);
        return;
      }

      router.replace("/artworks"); // Zurück zur Übersicht
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : mode === "edit"
            ? "Artwork could not be updated."
            : "Artwork could not be created.";

      toast.error(message, {
        className: "!bg-red-200 !text-red-700 !border-red-500",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle image selection
  // Wenn User eine Bilddatei auswählt ...
  async function handleImageSelection(file: File) {
    setImageStatusMessage(null);
    setImageStatusVariant("default");

    if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
      setImageStatusMessage(
        "Image is too large. Please choose a file smaller than 10 MB."
      );
      setImageStatusVariant("warning");

      const id = toast.error(
        "Image is too large. Please upload an image smaller than 10 MB.",
        {
          duration: Infinity,
          action: {
            label: "Dismiss",
            onClick: () => toast.dismiss(id),
          },
          className: "!bg-red-200 !text-red-700 !border-red-500",
        }
      );

      setSelectedFileName(null);
      setImagePreviewUrl(initialValues?.imageUrl ?? null);
      return;
    }

    setSelectedFileName(file.name);
    // Vorschau im Browser erstellen
    const localPreviewUrl = URL.createObjectURL(file);

    setImagePreviewUrl((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      return localPreviewUrl;
    });
    // Upload starten
    await handleImageUpload(file);
  }

  // Bild  hochladen und GPS-Daten klauen
  async function handleImageUpload(file: File) {
    setIsUploadingImage(true);

    try {
      // Koordinaten aus dem Bild lesen (falls vorhanden)
      const extractedCoordinates = await extractCoordinatesFromImage(file);

      // Bild zu Cloudinary schicken
      const uploadResult = await uploadImageToCloudinary(file);

      // SecureURL speichern
      const secureUrl = uploadResult.secureUrl;

      const publicId = uploadResult.publicId;

      form.setValue("imageUrl", secureUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });

      form.setValue("cloudinaryPublicId", publicId, {
        shouldValidate: false,
        shouldDirty: true,
      });

      const hasExtractedCoordinates =
        typeof extractedCoordinates?.latitude === "number" &&
        typeof extractedCoordinates?.longitude === "number";

      if (hasExtractedCoordinates) {
        form.setValue("latitude", String(extractedCoordinates.latitude), {
          shouldValidate: true,
          shouldDirty: true,
        });

        form.setValue("longitude", String(extractedCoordinates.longitude), {
          shouldValidate: true,
          shouldDirty: true,
        });

        setImageStatusMessage("Image uploaded and geo coordinates extracted.");
        setImageStatusVariant("success");
        setHasAutoExtractedCoordinates(true);
        setAreCoordinatesEditable(false); // GPS gefunden? Dann Felder sperren

        toast.success("Image uploaded and geo coordinates extracted.", {
          className: "!bg-green-200 !text-green-700 !border-green-500 mt-15",
        });
      } else {
        form.setValue("latitude", "", {
          shouldValidate: true,
          shouldDirty: true,
        });

        form.setValue("longitude", "", {
          shouldValidate: true,
          shouldDirty: true,
        });

        setHasAutoExtractedCoordinates(false);
        setAreCoordinatesEditable(true);
        setImageStatusMessage(
          "No geo coordinates found. Please enter them manually."
        );
        setImageStatusVariant("warning");

        const id = toast.error(
          "Could not extract geo coordinates. Please enter them manually.",
          {
            duration: Infinity,
            action: {
              label: "Dismiss",
              onClick: () => toast.dismiss(id),
            },
            className: "!bg-red-200 !text-red-700 !border-red-500",
          }
        );
      }

      setImagePreviewUrl((current) => {
        if (current?.startsWith("blob:")) {
          URL.revokeObjectURL(current);
        }
        return secureUrl;
      });
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error ? error.message : "Image upload failed.";

      setImageStatusMessage("Image upload failed. Please try again.");
      setImageStatusVariant("warning");

      toast.error(message, {
        className: "!bg-red-200 !text-red-700 !border-red-500",
      });
    } finally {
      setIsUploadingImage(false);
    }
  }

  // Reset form state
  function handleReset() {
    form.reset(defaultValues);
    setSelectedFileName(null);
    setImagePreviewUrl(initialValues?.imageUrl ?? null);
    setImageStatusMessage(null);
    setImageStatusVariant("default");
    setAreCoordinatesEditable(
      !initialValues?.latitude || !initialValues?.longitude
    );
    setHasAutoExtractedCoordinates(
      Boolean(initialValues?.latitude && initialValues?.longitude)
    );
  }

  // --- (JSX) ---
  return (
    <Card className="w-full bg-background border-0">
      <CardContent>
        <form id="artwork-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Left column */}
            <div className="space-y-6 lg:col-span-2">
              <FormTextField
                name="title"
                label="Title"
                control={form.control}
                placeholder="e.g. Girl with Balloon"
              />

              <FormTextField
                name="artist"
                label="Artist"
                control={form.control}
                placeholder="e.g. Banksy"
              />

              <FormTextareaField
                name="description"
                label="Description"
                rows={8}
                control={form.control}
                placeholder="Describe the artwork, context, or why it is interesting."
              />

              <Controller
                name="tags"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-xl">Tags</FieldLabel>

                    <div className="flex flex-wrap gap-3">
                      {ALLOWED_TAGS.map((tag) => {
                        const selectedTags = field.value ?? [];
                        const isActive = selectedTags.includes(tag);

                        function handleToggle() {
                          if (isActive) {
                            field.onChange(
                              selectedTags.filter((value) => value !== tag)
                            );
                            return;
                          }

                          field.onChange([...selectedTags, tag]);
                        }

                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={handleToggle}
                            aria-pressed={isActive}
                            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                              isActive
                                ? "border-pink-500 bg-pink-500/20 text-foreground"
                                : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            <span>{tag}</span>

                            {isActive ? (
                              <span
                                aria-hidden="true"
                                className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-current text-xs leading-none"
                              >
                                ×
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>

                    {fieldState.error ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      <FieldDescription className="text-base">
                        Choose from the predefined tags.
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Right column */}
            <div className="space-y-6 lg:col-span-1">
              <Field>
                <FieldLabel className="text-xl">
                  {mode === "edit" ? "Update Image" : "Upload Image"}
                </FieldLabel>

                <ArtworkImageUpload
                  imagePreviewUrl={imagePreviewUrl}
                  isUploadingImage={isUploadingImage}
                  isSubmitting={isSubmitting}
                  selectedFileName={selectedFileName}
                  onFileSelect={handleImageSelection}
                  statusMessage={imageStatusMessage}
                  statusVariant={imageStatusVariant}
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel className="text-xl">Location</FieldLabel>

                  {!areCoordinatesEditable && hasAutoExtractedCoordinates ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => setAreCoordinatesEditable(true)}
                    >
                      <IconPencil className="h-4 w-4" />
                      <span className="ml-1 text-xs">Edit</span>
                    </Button>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <Controller
                    name="latitude"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div className="space-y-2">
                        <FieldLabel
                          htmlFor={field.name}
                          className="hidden text-xs text-muted-foreground"
                        >
                          Latitude
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          type="text"
                          value={field.value ?? ""}
                          aria-invalid={fieldState.invalid}
                          placeholder="Lat. e.g. 52.520008"
                          disabled={!areCoordinatesEditable}
                          className="bg-gray-800! text-lg!"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="longitude"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div className="space-y-2">
                        <FieldLabel
                          htmlFor={field.name}
                          className="hidden text-xs text-muted-foreground"
                        >
                          Longitude
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          type="text"
                          value={field.value ?? ""}
                          aria-invalid={fieldState.invalid}
                          placeholder="Long. e.g. 13.404954"
                          disabled={!areCoordinatesEditable}
                          className="bg-gray-800! text-lg!"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </div>
                    )}
                  />
                </div>

                {!areCoordinatesEditable && hasAutoExtractedCoordinates ? (
                  <FieldDescription className="text-base">
                    Geo coordinates were extracted automatically from the
                    uploaded image. Click Edit to adjust the location manually.
                  </FieldDescription>
                ) : (
                  <FieldDescription className="text-base">
                    Enter latitude and longitude manually or select a position
                    on the map.
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-xl">Map</FieldLabel>

                <MapPicker
                  latitude={watchedLatitude}
                  longitude={watchedLongitude}
                  disabled={!areCoordinatesEditable}
                  scrollZoom={!areCoordinatesEditable}
                  dragPan={!areCoordinatesEditable}
                  dragRotate={!areCoordinatesEditable}
                  doubleClickZoom={!areCoordinatesEditable}
                  touchZoomRotate={!areCoordinatesEditable}
                  keyboard={!areCoordinatesEditable}
                  onChange={({ lat, lng }) => {
                    form.setValue("latitude", lat.toFixed(6), {
                      shouldValidate: true,
                      shouldDirty: true,
                    });

                    form.setValue("longitude", lng.toFixed(6), {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />

                <FieldDescription className="text-base">
                  {areCoordinatesEditable
                    ? "Tap or click on the map to select a location."
                    : "Map location is currently locked because coordinates were extracted automatically from the image."}
                </FieldDescription>
              </Field>
            </div>
          </FieldGroup>

          {/* Hidden fields */}
          <Controller
            name="imageUrl"
            control={form.control}
            render={({ field }) => <input type="hidden" {...field} />}
          />

          <Controller
            name="cloudinaryPublicId"
            control={form.control}
            render={({ field }) => <input type="hidden" {...field} />}
          />

          {/* Bottom actions */}
          <div className="flex items-center justify-between gap-3 pt-8">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                Reset
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              {isSubmitting
                ? "Saving..."
                : mode === "edit"
                  ? "Save changes"
                  : "Save artwork"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
