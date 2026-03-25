import { Schema, model, models, type InferSchemaType } from "mongoose";

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

// unique, um Dopplungen zu vermeiden
likeSchema.index({ artworkId: 1, userId: 1 }, { unique: true });

export type LikeDocument = InferSchemaType<typeof likeSchema>;

const Like = models.Like || model("Like", likeSchema);

export default Like;
