"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react";

// Mitteilen, was die Komponente von außen wissen muss
// -> ID und den Namen des Kunstwerks
type DeleteArtworkButtonProps = {
  artworkId: string;
  artworkTitle: string;
};

export function DeleteArtworkButton({ artworkId }: DeleteArtworkButtonProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true); // Button sperren und "Lösche..." anzeigen

    try {
      const response = await fetch(`/api/artworks/${artworkId}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Failed to delete artwork.");
      }

      toast.success("Artwork successfully deleted.", {
        className: "!bg-green-200 !text-green-700 !border-green-500 mt-15",
      });

      router.push("/artworks");
      router.refresh();
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Artwork could not be deleted.";

      toast.error(message, {
        className: "!bg-red-200 !text-red-700 !border-red-500",
      });

      setIsConfirming(false);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isConfirming) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-3 rounded-lg border bg-muted/40 px-4 py-3">
        <p className="text-sm font-medium text-foreground">
          Do you really want to delete this artwork?
        </p>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() => setIsConfirming(false)}
            disabled={isDeleting}
            className="hover:bg-sky-800 cursor-pointer"
            size="xs"
          >
            Cancel
          </Button>

          <Button
            type="button"
            className="bg-red-600 hover:bg-red-800 cursor-pointer"
            onClick={handleDelete}
            disabled={isDeleting}
            size="xs"
          >
            {isDeleting ? "Deleting..." : "OK"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-3">
      <Button
        asChild
        type="button"
        size="xs"
        className="hover:bg-sky-800 cursor-pointer"
      >
        <Link href={`/artworks/${artworkId}/edit`}>
          <IconPencil className="size-4" />
          Edit
        </Link>
      </Button>

      <Button
        type="button"
        className="bg-red-600 hover:bg-red-800 cursor-pointer"
        onClick={() => setIsConfirming(true)}
        size="xs"
      >
        <IconTrash className="size-4" />
        Delete
      </Button>
    </div>
  );
}
