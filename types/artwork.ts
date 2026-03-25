export type ArtworkOwner = {
  _id: string;
  name?: string;
  username?: string;
  role?: "admin" | "standard";
};

export type ArtworkBase = {
  title: string;
  artist?: string;
  description: string;
  imageUrl?: string;
  cloudinaryPublicId?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  likeCount?: number;
  owner?: string | ArtworkOwner;
};

export type Artwork = ArtworkBase & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};
