"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  imageUrl: z
    .string()
    .trim()
    .or(z.literal(""))
    .refine((value) => {
      const isAbsoluteUrl = /^https?:\/\/.+/i.test(value);
      const isRelativePath = /^\/.+/.test(value);

      return value === "" || isAbsoluteUrl || isRelativePath;
    }, "Please enter a valid image URL or relative path."),
  latitude: z.string().refine((value) => {
    if (value === "") return true;
    const number = Number(value);
    return !Number.isNaN(number) && number >= -90 && number <= 90;
  }, "Latitude must be between -90 and 90."),
  longitude: z.string().refine((value) => {
    if (value === "") return true;
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

function MapPlaceholder({
  latitude,
  longitude,
  onPickLocation,
}: {
  latitude?: number;
  longitude?: number;
  onPickLocation: (lat: number, lng: number) => void;
}) {
  const handleFakePick = () => {
    onPickLocation(52.520008, 13.404954);
  };

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="text-sm font-medium">Map placeholder</div>
      <p className="text-sm text-muted-foreground">
        Later, show a Google Map here if the uploaded image has no EXIF/GEO
        data. For now, this is a placeholder for manual location selection.
      </p>

      <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed bg-muted/40 text-sm text-muted-foreground">
        Google Maps placeholder
      </div>

      <Button type="button" variant="outline" onClick={handleFakePick}>
        Set demo coordinates
      </Button>

      {(latitude !== undefined || longitude !== undefined) && (
        <p className="text-sm text-muted-foreground">
          Current selection: {latitude ?? "—"}, {longitude ?? "—"}
        </p>
      )}
    </div>
  );
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

  async function onSubmit(values: ArtworkFormValues) {
    setIsSubmitting(true);

    const payload: ArtworkPayload = {
      title: values.title,
      artist: values.artist,
      description: values.description,
      imageUrl: values.imageUrl || undefined,
      latitude: values.latitude ? Number(values.latitude) : undefined,
      longitude: values.longitude ? Number(values.longitude) : undefined,
      tags: values.tags
        ? values.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
    };

    const endpoint =
      mode === "edit" && artworkId
        ? `/api/artworks/${artworkId}`
        : "/api/artworks";

    const method = mode === "edit" ? "PATCH" : "POST";

    try {
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
            (mode === "edit"
              ? "Failed to update artwork."
              : "Failed to save artwork.")
        );
      }

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
        throw new Error(result?.message || "Image upload failed.");
      }

      const secureUrl = result?.data?.secureUrl;

      if (!secureUrl) {
        throw new Error("No uploaded image URL returned.");
      }

      form.setValue("imageUrl", secureUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setImagePreviewUrl((current) => {
        if (current?.startsWith("blob:")) {
          URL.revokeObjectURL(current);
        }
        return secureUrl;
      });

      toast.success("Image uploaded successfully.", {
        className: "!bg-green-200 !text-green-700 !border-green-500 mt-15",
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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-red-700">
          {mode === "edit" ? "Edit artwork details" : "Artwork details"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form id="artwork-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Image Upload */}
            <Field>
              <FieldLabel htmlFor="artwork-image-upload">Image</FieldLabel>

              <div className="space-y-3 rounded-xl  p-0">
                <Input
                  id="artwork-image-upload"
                  type="file"
                  accept="image/*"
                  disabled={isUploadingImage || isSubmitting}
                  onChange={async (event) => {
                    const file = event.target.files?.[0];

                    if (!file) {
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

                    event.target.value = "";
                  }}
                />

                {imagePreviewUrl ? (
                  <div className="overflow-hidden rounded-xl border bg-muted">
                    <div className="relative aspect-video w-full">
                      <Image
                        src={imagePreviewUrl}
                        alt="Artwork preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed bg-muted/40 text-sm text-muted-foreground">
                    No image uploaded yet.
                  </div>
                )}

                {selectedFileName ? (
                  <p className="text-sm text-muted-foreground">
                    Selected file: {selectedFileName}
                  </p>
                ) : null}

                {isUploadingImage ? (
                  <p className="text-sm text-muted-foreground">
                    Uploading image...
                  </p>
                ) : null}

                {/* {form.watch("imageUrl") ? (
                  <p className="text-sm text-muted-foreground break-all">
                    Current image URL: {form.watch("imageUrl")}
                  </p>
                ) : null} */}
              </div>
            </Field>

            {/* Image URL */}
            <Controller
              name="imageUrl"
              control={form.control}
              render={({ field }) => <input type="hidden" {...field} />}
            />

            {/* Title */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Girl with Balloon"
                  />
                  <FieldDescription
                    className={fieldState.invalid ? "text-destructive" : ""}
                  >
                    {fieldState.error?.message ??
                      "Give the artwork a clear title."}
                  </FieldDescription>
                </Field>
              )}
            />

            {/* Artist */}
            <Controller
              name="artist"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Artist</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Banksy"
                  />
                  <FieldDescription
                    className={fieldState.invalid ? "text-destructive" : ""}
                  >
                    {fieldState.error?.message ??
                      "Enter the name of the artist or creator."}
                  </FieldDescription>
                </Field>
              )}
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

            {/* latitude */}
            <Controller
              name="latitude"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Latitude</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    step="any"
                    value={field.value ?? ""}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. 52.520008"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* longitude */}
            <Controller
              name="longitude"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Longitude</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    step="any"
                    value={field.value ?? ""}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. 13.404954"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {(watchedLatitude === undefined ||
              watchedLongitude === undefined) && (
              <MapPlaceholder
                latitude={watchedLatitude}
                longitude={watchedLongitude}
                onPickLocation={(lat, lng) => {
                  form.setValue("latitude", String(lat), {
                    shouldValidate: true,
                  });
                  form.setValue("longitude", String(lng), {
                    shouldValidate: true,
                  });
                }}
              />
            )}

            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Tags</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="street art, berlin, mural"
                  />
                  <FieldDescription>
                    Separate tags with commas.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset(defaultValues)}
          disabled={isSubmitting}
        >
          Reset
        </Button>
        <Button type="submit" form="artwork-form" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "edit"
              ? "Save changes"
              : "Save artwork"}
        </Button>
      </CardFooter>
    </Card>
  );
}
