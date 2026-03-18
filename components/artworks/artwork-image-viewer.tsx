// components\artworks\artwork-detail.tsx

"use client";

import * as React from "react";
import Image from "next/image";
import { IconMaximize, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type ArtworkImageViewerProps = {
  src: string;
  alt: string;
};

export function ArtworkImageViewer({ src, alt }: ArtworkImageViewerProps) {
  const [isFullscreenOpen, setIsFullscreenOpen] = React.useState(false);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFullscreenOpen(false);
      }
    }

    if (isFullscreenOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isFullscreenOpen]);

  return (
    <>
      <div className="relative">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={675}
          className="aspect-video w-full object-cover"
        />

        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute right-3 top-3 z-10"
          onClick={() => setIsFullscreenOpen(true)}
          aria-label="Open image in fullscreen"
        >
          <IconMaximize className="h-5 w-5" />
        </Button>
      </div>

      {isFullscreenOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-14 z-50 bg-black/70">
          <div className="absolute right-4 top-4 z-20">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="bg-background/75"
              onClick={() => setIsFullscreenOpen(false)}
              aria-label="Close fullscreen image"
            >
              <IconX className="h-5 w-5" />
            </Button>
          </div>

          <div className="h-full w-full">
            <TransformWrapper
              initialScale={0.7}
              minScale={0.3}
              maxScale={2}
              centerOnInit
              centerZoomedOut
              limitToBounds={false}
              doubleClick={{ mode: "zoomIn" }}
              panning={{ disabled: false }}
              pinch={{ disabled: false }}
              wheel={{ disabled: false }}
            >
              <TransformComponent wrapperClass="!w-full !h-full">
                <div className="flex h-full w-full items-center justify-center">
                  <Image
                    src={src}
                    alt={alt}
                    width={1600}
                    height={1200}
                    className="h-auto max-h-full w-auto max-w-none object-contain"
                    priority
                  />
                </div>
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>
      ) : null}
    </>
  );
}
