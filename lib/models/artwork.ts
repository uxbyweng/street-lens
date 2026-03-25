// lib\models\artwork.ts

import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

const artworkSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    cloudinaryPublicId: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    tags: {
      type: [String],
      default: [],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export type ArtworkDocument = InferSchemaType<typeof artworkSchema>;

export const Artwork =
  (models.Artwork as Model<ArtworkDocument>) ||
  model<ArtworkDocument>("Artwork", artworkSchema);
