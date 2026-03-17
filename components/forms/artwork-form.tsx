"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { ArtworkImageUpload } from "@/components/forms/artwork-image-upload";
import { MapPlaceholder } from "@/components/map/map-placeholder";
import { FormTextField } from "@/components/forms/form-text-field";
import { Button } from "@/components/ui/button";
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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

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
  tags: z.string().optional(),
});

export type ArtworkFormValues = z.infer<typeof artworkFormSchema>;

type ArtworkPayload = {
  title: string;
  artist: string;
  description: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  tags: string[];
};

type ArtworkFormProps = {
  mode: "create" | "edit";
  artworkId?: string;
  initialValues?: Partial<ArtworkFormValues>;
};

async function saveArtwork(
  payload: ArtworkPayload,
  options: {
    mode: "create" | "edit";
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

export function ArtworkForm({
  mode,
  artworkId,
  initialValues,
}: ArtworkFormProps) {
  const router = useRouter();
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
  const MAX_IMAGE_FILE_SIZE_BYTES = 4.5 * 1024 * 1024; // 4.5 MB

  const defaultValues: ArtworkFormValues = {
    title: initialValues?.title ?? "",
    artist: initialValues?.artist ?? "",
    description: initialValues?.description ?? "",
    imageUrl: initialValues?.imageUrl ?? "",
    latitude: initialValues?.latitude ?? "",
    longitude: initialValues?.longitude ?? "",
    tags: initialValues?.tags ?? "",
  };

  React.useEffect(() => {
    return () => {
      if (imagePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const form = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkFormSchema),
    defaultValues,
  });

  // Check if there are Geo Cordinates
  const watchedLatitudeValue = form.watch("latitude");
  const watchedLongitudeValue = form.watch("longitude");
  const watchedLatitude =
    watchedLatitudeValue && !Number.isNaN(Number(watchedLatitudeValue))
      ? Number(watchedLatitudeValue)
      : undefined;
  const watchedLongitude =
    watchedLongitudeValue && !Number.isNaN(Number(watchedLongitudeValue))
      ? Number(watchedLongitudeValue)
      : undefined;

  // Build Payload
  function buildArtworkPayload(values: ArtworkFormValues): ArtworkPayload {
    return {
      title: values.title,
      artist: values.artist,
      description: values.description,
      imageUrl: values.imageUrl || undefined,
      latitude: parseCoordinate(values.latitude),
      longitude: parseCoordinate(values.longitude),
      tags: parseTags(values.tags),
    };
  }

  // submit functiom
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

      router.replace("/artworks");
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

  // check (selected) image function
  async function handleSelectedFile(file: File) {
    setImageStatusMessage(null);
    setImageStatusVariant("default");
    if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
      setImageStatusMessage(
        "Image is too large. Please choose a file smaller than 4 MB."
      );
      setImageStatusVariant("warning");
      const id = toast.error(
        "Image is too large. Please upload an image smaller than 4 MB.",
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

    const localPreviewUrl = URL.createObjectURL(file);

    setImagePreviewUrl((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      return localPreviewUrl;
    });

    await handleImageUpload(file);
  }

  // image upload function
  async function handleImageUpload(file: File) {
    setIsUploadingImage(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setImageStatusMessage("Image upload failed. Please try again.");
        setImageStatusVariant("warning");
        throw new Error(result?.message || "Image upload failed.");
      }

      const secureUrl = result?.data?.secureUrl;
      const extractedLatitude = result?.data?.latitude;
      const extractedLongitude = result?.data?.longitude;

      if (!secureUrl) {
        throw new Error("No uploaded image URL returned.");
      }

      form.setValue("imageUrl", secureUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });

      const hasExtractedCoordinates =
        typeof extractedLatitude === "number" &&
        typeof extractedLongitude === "number";

      if (hasExtractedCoordinates) {
        form.setValue("latitude", String(extractedLatitude), {
          shouldValidate: true,
          shouldDirty: true,
        });

        form.setValue("longitude", String(extractedLongitude), {
          shouldValidate: true,
          shouldDirty: true,
        });
        setAreCoordinatesEditable(false);
        setImageStatusMessage("Image uploaded and geo coordinates extracted.");
        setImageStatusVariant("success");

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

      toast.error(message, {
        className: "!bg-red-200 !text-red-700 !border-red-500",
      });
    } finally {
      setIsUploadingImage(false);
    }
  }

  // parse coordinates
  function parseCoordinate(value?: string): number | undefined {
    if (!value) return undefined;

    const parsedValue = Number(value);
    return Number.isNaN(parsedValue) ? undefined : parsedValue;
  }

  // parse tags
  function parseTags(value?: string): string[] {
    if (!value) return [];

    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  // reset function
  function handleReset() {
    form.reset(defaultValues);
    setSelectedFileName(null);
    setImagePreviewUrl(initialValues?.imageUrl ?? null);
    setImageStatusMessage(null);
    setImageStatusVariant("default");
    setAreCoordinatesEditable(
      !initialValues?.latitude || !initialValues?.longitude
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardContent>
        <form id="artwork-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Image Upload */}
            <Field>
              <FieldLabel>
                {mode === "edit" ? "Update Image" : "Upload Image"}
              </FieldLabel>

              <ArtworkImageUpload
                imagePreviewUrl={imagePreviewUrl}
                isUploadingImage={isUploadingImage}
                isSubmitting={isSubmitting}
                selectedFileName={selectedFileName}
                onFileSelect={handleSelectedFile}
                statusMessage={imageStatusMessage}
                statusVariant={imageStatusVariant}
              />
            </Field>

            {/* Image URL (hidden) -> bekommt die URL von Cloudinary */}
            <Controller
              name="imageUrl"
              control={form.control}
              render={({ field }) => <input type="hidden" {...field} />}
            />

            {/* Title */}
            <FormTextField
              name="title"
              label="Title"
              control={form.control}
              placeholder="e.g. Girl with Balloon"
            />

            {/* Artist */}
            <FormTextField
              name="artist"
              label="Artist"
              control={form.control}
              placeholder="e.g. Banksy"
            />

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id={field.name}
                      rows={6}
                      className="min-h-28 resize-none"
                      aria-invalid={fieldState.invalid}
                      placeholder="Describe the artwork, context, or why it is interesting."
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/1000
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* location */}
            <Field>
              <FieldLabel>Location</FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="latitude"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs text-muted-foreground"
                      >
                        Lat.
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="text"
                        value={field.value ?? ""}
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g. 52.520008"
                        disabled={!areCoordinatesEditable}
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
                        className="text-xs text-muted-foreground"
                      >
                        Long.
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="text"
                        value={field.value ?? ""}
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g. 13.404954"
                        disabled={!areCoordinatesEditable}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </div>
                  )}
                />
              </div>

              {!areCoordinatesEditable ? (
                <FieldDescription className="text-xs">
                  Geo coordinates were extracted automatically from the uploaded
                  image.
                </FieldDescription>
              ) : (
                <FieldDescription className="text-xs">
                  Enter latitude and longitude manually if no geo data could be
                  extracted.
                </FieldDescription>
              )}
            </Field>

            {/* Map Placeholder */}
            {(watchedLatitude === undefined ||
              watchedLongitude === undefined) && <MapPlaceholder />}

            {/* Tags */}
            <FormTextField
              name="tags"
              label="Tags"
              control={form.control}
              placeholder="street art, berlin, mural"
              description="Separate tags with commas."
            />
          </FieldGroup>
          <div className="flex items-center justify-between gap-3 pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
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
