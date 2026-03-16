"use client";

import * as React from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

type ArtworkImageUploadProps = {
  imagePreviewUrl: string | null;
  isUploadingImage: boolean;
  isSubmitting: boolean;
  selectedFileName: string | null;
  onFileSelect: (file: File) => Promise<void>;
};

export function ArtworkImageUpload({
  imagePreviewUrl,
  isUploadingImage,
  isSubmitting,
  selectedFileName,
  onFileSelect,
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
  });

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
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {selectedFileName ? (
              <p className="truncate text-sm text-muted-foreground">
                {selectedFileName}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Supported image upload up to 4.5 MB.
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
        isDragActive ? "border-primary bg-muted" : "border-border bg-muted/40",
      ].join(" ")}
    >
      <input {...getInputProps()} />

      <div className="flex aspect-video flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm font-medium text-foreground">
          {isDragActive
            ? "Drop image here"
            : "Drag image here or browse from filesystem"}
        </p>

        <p className="text-xs text-muted-foreground">
          Supported image upload up to 4.5 MB.
        </p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={open}
          disabled={isDisabled}
        >
          Choose image
        </Button>

        {selectedFileName ? (
          <p className="text-sm text-muted-foreground">{selectedFileName}</p>
        ) : null}

        {isUploadingImage ? (
          <p className="text-sm text-muted-foreground">Uploading image...</p>
        ) : null}
      </div>
    </div>
  );
}
