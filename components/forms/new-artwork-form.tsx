"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
    .optional()
    .or(z.literal(""))
    .refine((value) => {
      if (!value) return true;

      const isAbsoluteUrl = /^https?:\/\/.+/i.test(value);
      const isRelativePath = /^\/.+/.test(value);

      return isAbsoluteUrl || isRelativePath;
    }, "Please enter a valid image URL or relative path."),
  latitude: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true;
      const number = Number(value);
      return !Number.isNaN(number) && number >= -90 && number <= 90;
    }, "Latitude must be between -90 and 90."),
  longitude: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true;
      const number = Number(value);
      return !Number.isNaN(number) && number >= -180 && number <= 180;
    }, "Longitude must be between -180 and 180."),
  tags: z.string().optional(),
});

type ArtworkFormValues = z.infer<typeof artworkFormSchema>;

type ArtworkPayload = {
  title: string;
  artist: string;
  description: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  tags: string[];
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

export function NewArtworkForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkFormSchema),
    defaultValues: {
      title: "",
      artist: "",
      description: "",
      imageUrl: "",
      latitude: undefined,
      longitude: undefined,
      tags: "",
    },
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

    try {
      const response = await fetch("/api/artworks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save artwork.");
      }

      toast.success("Artwork created successfully.");

      form.reset();
      router.push("/artworks?success=created");
    } catch (error) {
      console.error(error);
      toast.error("Artwork could not be created.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Artwork details</CardTitle>
      </CardHeader>

      <CardContent>
        <form id="new-artwork-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
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
                  <FieldDescription>
                    Give the artwork a clear title.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

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
                  <FieldDescription>
                    Enter the name of the artist or creator.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

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

            <Controller
              name="imageUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="https://example.com/artwork.jpg"
                  />
                  <FieldDescription>
                    Optional image URL for the artwork.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field>
              <FieldLabel>Image upload</FieldLabel>
              <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
                Upload placeholder — file upload and EXIF extraction can be
                added in a later step.
              </div>
              <FieldDescription>
                This is only a placeholder for now.
              </FieldDescription>
            </Field>

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
          onClick={() => form.reset()}
          disabled={isSubmitting}
        >
          Reset
        </Button>
        <Button type="submit" form="new-artwork-form" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save artwork"}
        </Button>
      </CardFooter>
    </Card>
  );
}
