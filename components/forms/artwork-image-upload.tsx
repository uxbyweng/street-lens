"use client";

import * as React from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
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
  const isDisabled = isUploadingImage || isSubmitting;

  const handleDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) {
        return;
      }

      await onFileSelect(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
    noClick: !!imagePreviewUrl,
    noKeyboard: !!imagePreviewUrl,
    disabled: isDisabled,
    useFsAccessApi: false,
  });

  const statusClassName =
    statusVariant === "success"
      ? "text-green-700"
      : statusVariant === "warning"
        ? "text-amber-700"
        : "text-muted-foreground";

  if (imagePreviewUrl) {
    return (
      <div className="space-y-3">
        <div className="overflow-hidden rounded-xl border bg-muted">
          <div className="relative aspect-video w-full">
            <Image
              src={imagePreviewUrl}
              alt="Artwork preview"
              fill
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
                Max. 4 MB · JPG, PNG, WebP
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={open}
            disabled={isDisabled}
          >
            {isUploadingImage ? "Uploading..." : "Change image"}
          </Button>
        </div>

        <input {...getInputProps()} />
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={[
        "rounded-xl border border-dashed p-6 transition",
        isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        isDragActive
          ? "border-primary bg-muted"
          : "border-border bg-muted/40 hover:bg-muted/60",
      ].join(" ")}
    >
      <input {...getInputProps()} />

      <div className="flex aspect-video flex-col items-center justify-center gap-3 text-center">
        <IconUpload className="size-6" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            <span className="hidden md:inline">
              {isDragActive
                ? "Drop image here"
                : "Drag an image here or choose one"}
            </span>
          </p>
        </div>

        <Button type="button" variant="outline" size="sm" disabled={isDisabled}>
          Choose image
        </Button>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            Max. 4.5 MB · JPG, PNG, WebP
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
