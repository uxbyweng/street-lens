import * as z from "zod";
import {
  ALLOWED_TAGS,
  type AllowedArtworkTag,
} from "@/lib/constants/artwork-tags";

export const artworkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(100, "Title must be at most 100 characters."),
  artist: z
    .string()
    .trim()
    .min(2, "Artist must be at least 2 characters.")
    .max(100, "Artist must be at most 100 characters."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(2500, "Description must be at most 2500 characters."),
  imageUrl: z.string().trim().optional(),
  cloudinaryPublicId: z.string().trim().optional(),
  latitude: z
    .union([z.string(), z.number()])
    .transform((value) => Number(value))
    .refine((value) => !Number.isNaN(value) && value >= -90 && value <= 90, {
      message: "Latitude must be between -90 and 90.",
    }),
  longitude: z
    .union([z.string(), z.number()])
    .transform((value) => Number(value))
    .refine((value) => !Number.isNaN(value) && value >= -180 && value <= 180, {
      message: "Longitude must be between -180 and 180.",
    }),
  tags: z.array(z.enum(ALLOWED_TAGS)).default([]),
});

export type ArtworkInput = z.input<typeof artworkSchema>;
export type ArtworkValues = z.output<typeof artworkSchema>;
export type ArtworkTag = AllowedArtworkTag;
