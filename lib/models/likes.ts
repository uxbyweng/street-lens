// lib/models/like.ts
import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

const likeSchema = new Schema(
  {
    artworkId: {
      type: Schema.Types.ObjectId,
      ref: "Artwork",
      required: true,
      index: true,
    },
    userId: {
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

likeSchema.index({ artworkId: 1, userId: 1 }, { unique: true });

export type LikeDocument = InferSchemaType<typeof likeSchema>;

export const Like =
  (models.Like as Model<LikeDocument>) ||
  model<LikeDocument>("Like", likeSchema);
