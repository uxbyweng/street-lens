import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

const userSchema = new Schema(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "standard"],
      default: "standard",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type UserDocument = InferSchemaType<typeof userSchema>;

export const User =
  (models.User as Model<UserDocument>) ||
  model<UserDocument>("User", userSchema);
