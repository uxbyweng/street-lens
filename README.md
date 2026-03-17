# STREETLENS

A mobile-first web application to create, manage, and discover streetart in a simple, visual way. Users can add entries with text, images, and location data, browse existing artworks, and later explore them on an interactive map.

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

## Planned After MVP

- Interactive map view
- List / Map toggle
- Nearby search with radius filter
- Geo-based queries with MongoDB
- Authentication and protected actions
- Improved filtering and sorting
- Toasts and additional UX polish

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

Minimal UI components:

- Button
- Input
- Textarea
- Label
- Card
- Badge
- Dialog
- Sheet

Optional UI components:

- Tabs
- Select
- Sonner

### Data / Backend

- MongoDB Atlas
- Mongoose 9.2.x
- Next.js Route Handlers (`app/api/...`) for CRUD and uploads

### Media Upload

- Cloudinary Node SDK
- Signed upload flow via API Route
- Asset cleanup on delete

### Map / Geo

Map functionality is intentionally **not part of the MVP**.

Planned stack after CRUD is stable:

- mapcn
- MapLibre GL
- GeoJSON Point
- MongoDB `2dsphere` index
- nearby queries based on coordinates

Reasoning:

- `mapcn` fits well into a Tailwind + shadcn/ui stack
- It is more visually consistent with the rest of the UI
- It keeps the map layer aligned with the component-driven frontend approach
- Geo features are useful, but not essential for the first working release

### Auth

Authentication is **not part of the MVP**.

Possible later addition:

- next-auth 4.24.x

Reasoning:

- stable CRUD has higher priority than auth complexity
- authentication should only be added after the core product works reliably

### Deployment

- Vercel

## Why This Stack

This stack was chosen to balance modern tooling with realistic delivery for a capstone project.

- **Next.js** provides a strong full-stack foundation with App Router and Route Handlers.
- **React + TypeScript** support maintainable, component-based development.
- **Tailwind CSS + shadcn/ui** allow fast, consistent UI work without locking the project into a rigid design system.
- **MongoDB + Mongoose** are a practical choice for flexible document-based data.
- **Cloudinary** keeps media handling separate from the app and simplifies upload management.
- **mapcn + MapLibre** are better suited as a second-phase feature once the CRUD base is stable.

## Data Model (Planned)

### Spot

Possible fields:

- `_id`
- `title`
- `description`
- `category`
- `images`
- `locationName`
- `coordinates` (`GeoJSON Point`)
- `createdAt`
- `updatedAt`

### Image

Embedded or referenced image data may include:

- `publicId`
- `url`
- `alt`

## Folder Structure (Planned)

```bash
app/
  api/
    spots/
    upload/
  spots/
  page.tsx
components/
  ui/
  shared/
lib/
  db/
  models/
  cloudinary/
hooks/
public/
```

## Development Priorities

1. Set up project foundation
2. Connect MongoDB and Mongoose
3. Build stable CRUD routes
4. Build forms and detail views
5. Integrate Cloudinary uploads
6. Refine responsive UI
7. Deploy working MVP
8. Add map and geo features only after MVP is complete

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
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

See `env.example` for the expected variable names.

If authentication is added later, additional variables will be required.

### 4. Start development server

```bash
npm run dev
```

Open `http://localhost:3000` in the browser.

## Quality Standards

This project follows these implementation principles:

- mobile-first design
- clean and understandable naming
- reusable components
- separation of UI and business logic
- simple architecture over unnecessary complexity
- code quality over feature overload

## Status

This repository is part of a bootcamp capstone project and is being built incrementally.

Current implementation focus:

- stable CRUD
- media upload
- responsive UI
- deployment-ready architecture

## Roadmap

- [x] Project setup
- [x] Database connection
- [x] CRUD for artworks
- [x] Image upload
- [x] Deployment on Vercel
- [ ] Delete cleanup for assets
- [ ] Responsive polish
- [ ] Map integration with mapcn / MapLibre
- [ ] Geo queries
- [ ] Authentication

## Deployment

The application is intended to be deployed on **Vercel**.

## Notes

This project is deliberately scoped to stay realistic within the capstone timeframe. The main objective is not to collect as many technologies as possible, but to ship a clean, working, explainable application.
