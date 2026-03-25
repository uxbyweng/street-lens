// components\artworks\like-toggle.tsx

"use client";

import { useState } from "react";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { toast } from "sonner";

type LikeToggleProps = {
  artworkId: string;
  initialLiked: boolean;
  initialLikeCount: number;
  isAuthenticated?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  countClassName?: string;
  showCount?: boolean;
  likedIconClassName?: string;
  unlikedIconClassName?: string;
};

export function LikeToggle({
  artworkId,
  initialLiked,
  initialLikeCount,
  isAuthenticated = true,
  onClick,
  className = "",
  countClassName = "",
  showCount = true,
  likedIconClassName = "size-5 fill-current text-pink-500",
  unlikedIconClassName = "size-5 text-white",
}: LikeToggleProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isPending, setIsPending] = useState(false);

  async function handleLikeClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);

    if (!isAuthenticated) {
      toast.error("Log in to like this artwork.");
      return;
    }

    if (isPending) return;

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
    <button
      type="button"
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
      className={className}
    >
      {liked ? (
        <IconHeartFilled className={likedIconClassName} />
      ) : (
        <IconHeart className={unlikedIconClassName} />
      )}

      {showCount ? <span className={countClassName}>{likeCount}</span> : null}
    </button>
  );
}
