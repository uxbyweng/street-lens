import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

const userSchema = new Schema(
  {
    provider: {
      type: String,
      enum: ["github", "google", "credentials"],
      required: true,
      index: true,
      trim: true,
    },
    providerAccountId: {
      type: String,
      required: true,
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

userSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export type UserDocument = InferSchemaType<typeof userSchema>;

export const User =
  (models.User as Model<UserDocument>) ||
  model<UserDocument>("User", userSchema);
