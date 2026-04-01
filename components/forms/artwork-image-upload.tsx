"use client";

import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { IconUpload } from "@tabler/icons-react";

type UploadStatusVariant = "default" | "success" | "warning";

type ArtworkImageUploadProps = {
  imagePreviewUrl: string | null;
  isUploadingImage: boolean;
  isSubmitting: boolean;
  selectedFileName: string | null;
  onFileSelect: (file: File) => Promise<void>;
  statusMessage?: string | null;
  statusVariant?: UploadStatusVariant;
};

export function ArtworkImageUpload({
  imagePreviewUrl,
  isUploadingImage,
  isSubmitting,
  selectedFileName,
  onFileSelect,
  statusMessage,
  statusVariant = "default",
}: ArtworkImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isDisabled = isUploadingImage || isSubmitting;

  async function handleNativeFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    await onFileSelect(file);

    // wichtig: gleiche Datei erneut auswählbar machen
    event.target.value = "";
  }

  function openFilePicker() {
    if (isDisabled) {
      return;
    }

    inputRef.current?.click();
  }

  const statusClassName =
    statusVariant === "success"
      ? "text-green-700"
      : statusVariant === "warning"
        ? "text-amber-700"
        : "text-muted-foreground";

  if (imagePreviewUrl) {
    return (
      <div className="space-y-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleNativeFileChange}
          disabled={isDisabled}
        />

        <div className="overflow-hidden rounded-xl border">
          <div className="relative aspect-video w-full">
            <Image
              src={imagePreviewUrl}
              alt="Artwork preview"
              fill
              unoptimized
              className="object-cover"
            />

            {isUploadingImage ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <p className="rounded-md bg-background/90 px-3 py-2 text-sm font-medium text-foreground">
                  Uploading image...
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="truncate text-sm text-foreground">
              {selectedFileName ?? "Image ready"}
            </p>

            {statusMessage ? (
              <p className={`text-xs ${statusClassName}`}>{statusMessage}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Max. 10 MB · JPG, PNG, WebP
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openFilePicker}
            disabled={isDisabled}
          >
            {isUploadingImage ? "Uploading..." : "Change image"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/40 p-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleNativeFileChange}
        disabled={isDisabled}
      />

      <div className="flex aspect-video flex-col items-center justify-center gap-3 text-center">
        <IconUpload className="size-6" />

        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Choose an image</p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isDisabled}
          onClick={openFilePicker}
        >
          Choose image
        </Button>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            Max. 10 MB · JPG, PNG, WebP
          </p>

          {selectedFileName ? (
            <p className="text-xs text-muted-foreground">{selectedFileName}</p>
          ) : null}

          {statusMessage ? (
            <p className={`text-xs ${statusClassName}`}>{statusMessage}</p>
          ) : null}

          {isUploadingImage ? (
            <p className="text-xs text-muted-foreground">Uploading image...</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
