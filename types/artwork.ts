export type ArtworkBase = {
  title: string;
  artist?: string;
  description: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
};

export type Artwork = ArtworkBase & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};
