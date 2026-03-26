// lib\constants\artwork-tags.ts

export const ALLOWED_TAGS = [
  "canvas",
  "paint",
  "stencil",
  "mural",
  "paste-up",
  "spray-paint",
  "portrait",
  "cut-out",
  "sticker",
  "roll-on",
  "urban-knitting",
  "graffiti",
  "yarn-bombing",
  "poster-art",
  "installation",
] as const;

export type AllowedArtworkTag = (typeof ALLOWED_TAGS)[number];
