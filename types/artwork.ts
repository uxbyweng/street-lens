export type ArtworkBase = {
  title: string;
  author?: string;
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
