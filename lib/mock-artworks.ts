import type { Artwork } from "@/types/artwork";

export const mockArtworks: Artwork[] = [
  {
    _id: "1",
    title: "A Wise Man",
    author: "Hiariu",
    description:
      "Beneath its striking black-and-white composition, A Wise Man explores how wisdom often clashes with modern society.",
    imageUrl: "/images/huariu-a-whise-man.jpg",
    latitude: 52.5038944,
    longitude: 13.4181378,
    tags: ["berlin", "mural", "urban"],
    createdAt: "2026-03-10T10:00:00.000Z",
    updatedAt: "2026-03-10T10:00:00.000Z",
  },
  {
    _id: "2",
    title: "A Beautiful Mind",
    author: "Tank",
    description:
      "Dieses Mural von TANK (Eike Conzen) entstand im Rahmen des Berlin Mural Fest 2018 und befindet sich etwas versteckt an einer zurückgesetzten Seitenwand der Manteuffelstraße 12 in Kreuzberg. ",
    imageUrl: "/images/tank-a-beautiful-mind.jpg",
    latitude: 52.5042,
    longitude: 13.41795,
    tags: ["mural", "bird", "wall-art"],
    createdAt: "2026-03-09T09:30:00.000Z",
    updatedAt: "2026-03-09T09:30:00.000Z",
  },
  {
    _id: "2",
    title: "The jungle in my head",
    author: "Millo",
    description:
      "One of the top international street artists: Millo! The wall is finished in May 2018. Step inside the playground to catch the full glory.",
    imageUrl: "/images/millo-the-jungle-in-my-head.jpg",
    latitude: 52.5042,
    longitude: 13.41795,
    tags: ["mural", "kreuzberg", "wall-art"],
    createdAt: "2026-03-09T09:30:00.000Z",
    updatedAt: "2026-03-09T09:30:00.000Z",
  },
];
