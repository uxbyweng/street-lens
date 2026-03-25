"use client";

import { useState } from "react";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type LikeButtonProps = {
  artworkId: string;
  initialLiked: boolean;
  initialLikeCount: number;
  isAuthenticated: boolean;
};

export function LikeButton({
  artworkId,
  initialLiked,
  initialLikeCount,
  isAuthenticated,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isPending, setIsPending] = useState(false);

  async function handleLikeClick() {
    if (!isAuthenticated) {
      toast.error("Log in to like this artwork.");
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch(`/api/artworks/${artworkId}/like`, {
        method: liked ? "DELETE" : "POST",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? "Like request failed.");
      }

      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch {
      toast.error("Could not update like. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleLikeClick}
      disabled={isPending}
      aria-pressed={liked}
      aria-label={
        isAuthenticated
          ? liked
            ? "Remove like"
            : "Like artwork"
          : "Log in to like this artwork"
      }
      className="h-auto px-1 py-1 hover:bg-transparent"
    >
      <span className="flex items-center gap-2 cursor-pointer">
        {liked ? (
          <IconHeartFilled className="size-6 transition text-red-500" />
        ) : (
          <IconHeart className="size-6 transition text-foreground" />
        )}
        <span className="text-base font-medium text-foreground">
          {likeCount}
        </span>
      </span>
    </Button>
  );
}
