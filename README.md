# STREETLENS

A mobile-first web application to create, manage, and discover street art in a simple visual way. Users can add entries with text, images, and location data, browse existing artworks, and later explore them on an interactive map.

The project is intentionally scoped around a strong CRUD foundation first. Map features, nearby search, and authentication are planned only after the core product is stable.

## Project Goals

The goal of this capstone project is to build a clean, functional, and deployable full-stack application from scratch with a clear focus on:

- reliable CRUD operations
- clean component and folder structure
- responsive mobile-first UI
- maintainable code quality
- realistic feature prioritization

## MVP Features

- Create an artwork
- Read and display all artworks
- View artwork details
- Update existing artworks
- Delete artworks with confirmation dialog
- Upload images for an artwork
- Remove uploaded assets when an artwork is deleted
- Responsive mobile-first interface
- Deployment on Vercel
- Interactive map view

## Planned After MVP

- Authentication and protected actions (next-auth 4.24.x)
- Nearby search / geo queries
- Improved filtering and sorting
- distance to artwork
- mobile camera capture

## Tech Stack

### Runtime / Language

- Node.js >= 20.9
- TypeScript >= 5.1

### Core Framework

- Next.js 16.1.x
- React 19.2.x

### Styling / UI

- Tailwind CSS 4.2.x
- shadcn/ui via shadcn CLI v4

### Data / Backend

- MongoDB Atlas
- Mongoose 9.2.x
- Next.js Route Handlers (`app/api/...`) for CRUD and uploads

### Media Upload

- Direct Cloudinary browser upload
- Unsigned upload preset
- Client-side EXIF GPS extraction
- Asset cleanup on delete

### Map / Geo

- mapcn
- MapLibre GL


### Deployment

- Vercel


## Data Model

### Artwork

Fields:

- `_id`
- `title`
- `artist`
- `description`
- `imageUrl`
- `cloudinaryPublicId`
- `latitude`
- `longitude`
- `tags`
- `createdAt`
- `updatedAt`

## Folder Structure

```bash
app/
  api/
    artworks/
      [id]/
  artworks/
  map/
  page.tsx
components/
  artworks/
  forms/
  layout/
  map/
  ui/
lib/
  cloudinary/
  data/
  db/
  hooks/
  models/
hooks/
public/
types/
```
## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-repo-name>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `.env.local` file in the project root and add the required environment variables.

```bash
# MongoDB
MONGODB_URI=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET=

# Cloudinary (unsigned)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

See `env.example` for the expected variable names.


### 4. Start development server

```bash
npm run dev
```

Open `http://localhost:3000` in the browser.


## Roadmap

- [x] Project setup
- [x] Database connection
- [x] CRUD for artworks
- [x] Image upload
- [x] Deployment on Vercel
- [x] Delete cleanup for assets
- [x] Map integration with mapcn / MapLibre
- [ ] Authentication
- [ ] Geo queries


## Deployment

The application is intended to be deployed on **Vercel**.

## Notes

This project is deliberately scoped to stay realistic within the capstone timeframe. The main objective is not to collect as many technologies as possible, but to ship a clean, working, explainable application.
