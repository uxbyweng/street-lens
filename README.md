# BERLIN STREET VIEW

BERLIN STREET VIEW is a mobile-first full-stack web application for discovering street art in Berlin in a visual, location-based way. Users can browse artworks, view details, explore locations on a map and save favorites. Admin users can create, edit, and delete artworks, including image upload with automatic EXIF GPS extraction and Cloudinary asset management. 

**Live App:** https://www.berlin-street-view.de/

## Project Goals

The goal of this project is to build a clean, functional, and deployable full-stack application from scratch with a clear focus on:

- reliable CRUD operations
- clean component and folder structure
- responsive mobile-first UI
- maintainable code quality
- realistic feature prioritization

## Implemented Features

- Public artwork overview and artwork detail pages
- Admin-only create, edit, and delete workflows
- Direct browser image upload to Cloudinary
- Automatic EXIF GPS extraction from uploaded images
- Interactive map view with artwork markers
- GitHub and Google authentication via Auth.js
- Preview login for Vercel preview deployments
- Role-based route and API protection
- Like functionality for authenticated users
- Mobile-first responsive interface

## Technical Highlights

- Full-stack architecture with Next.js App Router and Route Handlers
- Role-based access control for protected pages and write operations
- Direct browser upload workflow with Cloudinary
- Client-side EXIF GPS extraction for automatic geo-tagging
- Cloudinary asset cleanup on artwork deletion
- Interactive map integration with MapLibre and mapcn
- Reusable, mobile-first component architecture


## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 
- shadcn/ui

### Backend / Data
- Next.js App Router
- Route Handlers
- MongoDB Atlas
- Mongoose

### Tooling
- ESLint
- Prettier
- PostCSS

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


## Authentication & Authorization
- Public read access for artworks
- Admin-only create, edit, and delete permissions
- GitHub and Google OAuth via Auth.js
- Preview credentials login for Vercel preview deployments


## Data Model

### Artwork
- `_id`
- `title`
- `artist`
- `description`
- `imageUrl`
- `cloudinaryPublicId`
- `latitude`
- `longitude`
- `tags`
- `owner`
- `createdAt`
- `updatedAt`

### User:
- `_id`
- `provider`
- `providerAccountId`
- `createdAt`
- `email`
- `image`
- `name`
- `role`
- `updatedAt`
- `username`

### Like:
- `_id`
- `artworkId`
- `userId`
- `createdAt`
- `updatedAt`

## Folder Structure

The project follows a modular App Router structure with a clear separation between routes, UI components, data access, and domain models.

```bash
app/
  api/
  artworks/
    [id]/
      edit/
    new/
  login/
  map/
  profile/
  imprint/
  layout.tsx
  page.tsx
  globals.css

components/
  artworks/
  auth/
  forms/
  layout/
  map/
  profile/
  ui/

lib/
  cloudinary/
  constants/
  data/
  db/
  location/
  models/
  utils.ts

hooks/
types/
public/
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

Create a  `.env.local` file in the project root.

Use `env.example` as the source of truth for all required variables.

```bash
# Auth.js / NextAuth
AUTH_SECRET=
AUTH_URL=http://localhost:3000

# GitHub OAuth
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# Google OAuth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# MongoDB
MONGODB_URI=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET=

# Public Cloudinary upload
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

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
- [x] Authentication
- [ ] Geo queries
- [ ] Nearby search
- [ ] Distance-based discovery
- [ ] Better filtering and sorting
- [ ] Comments / seen artworks / saved routes

## Deployment

The project is deployed on Vercel. Environment variables are configured in Vercel for production and preview deployments. A preview login flow is included to simplify testing in preview environments.


## Notes

This project is deliberately scoped to stay realistic within the capstone timeframe. The main objective is not to collect as many technologies as possible, but to ship a clean, working, explainable application.
