export type Artwork = {
export type Artwork = {
  _id: string;
  title: string;
  author?: string;
  description: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
};
