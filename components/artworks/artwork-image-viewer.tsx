"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { IconMaximize, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { cn } from "@/lib/utils";

type ArtworkImageViewerProps = {
  src: string;
  alt: string;
  className?: string;
};

type FullscreenOverlayProps = {
  src: string;
  alt: string;
  className?: string;
  onClose: () => void;
};

function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLocked]);
}

function FullscreenOverlay({
  src,
  alt,
  onClose,
  className,
}: FullscreenOverlayProps) {
  useLockBodyScroll(true);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 top-14 z-50 bg-black/70",
        className
      )}
    >
      <div className="absolute right-4 top-4 z-20">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="cursor-pointer bg-background/75"
          onClick={onClose}
          aria-label="Close fullscreen image"
        >
          <IconX className="h-5 w-5" />
        </Button>
      </div>

      <div className="h-full w-full">
        <TransformWrapper
          initialScale={3}
          minScale={2}
          maxScale={7}
          centerOnInit
          //   centerZoomedOut
          limitToBounds={false}
          doubleClick={{ mode: "zoomIn" }}
          panning={{ disabled: false }}
          pinch={{ disabled: false }}
          wheel={{ disabled: false }}
        >
          <TransformComponent wrapperClass="!h-full !w-full">
            <div className="flex h-full w-full items-center justify-center">
              <Image
                src={src}
                alt={alt}
                width={1200}
                height={675}
                sizes="100vw"
                loading="eager"
                fetchPriority="high"
                quality={75}
                className="aspect-video w-full object-cover lg:aspect-auto lg:max-h-120"
              />
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}

export function ArtworkImageViewer({
  src,
  alt,
  className,
}: ArtworkImageViewerProps) {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const openFullscreen = useCallback(() => {
    setIsFullscreenOpen(true);
  }, []);

  const closeFullscreen = useCallback(() => {
    setIsFullscreenOpen(false);
  }, []);

  return (
    <>
      <div className={cn("relative", className)}>
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={675}
          sizes="(max-width: 768px) 100vw, 1024px"
          className="aspect-video lg:aspect-auto lg:max-h-120 w-full object-cover object-[center_20%]"
        />

        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute right-3 top-3 z-10 cursor-pointer"
          onClick={openFullscreen}
          aria-label="Open image in fullscreen"
        >
          <IconMaximize className="h-5 w-5" />
        </Button>
      </div>

      {isFullscreenOpen ? (
        <FullscreenOverlay src={src} alt={alt} onClose={closeFullscreen} />
      ) : null}
    </>
  );
}
