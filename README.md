# Sayantan Chakraborty — Portfolio

A backend-focused developer portfolio: a themeable, animated single-page site backed by a real admin CMS — live at **[thematic-potfolio.vercel.app](https://thematic-potfolio.vercel.app/)**.

A monorepo with two independently deployable halves:

```text
frontend/   React + Vite site (deploys to Vercel)
backend/    Express + MongoDB API (deploys to Render)
```

## Tech Stack

### Frontend

- **React 19** + **Vite 7** — app shell and dev/build tooling
- **Tailwind CSS 4** — styling
- **Framer Motion** + **GSAP** — UI and scroll-driven animation
- **React Three Fiber** (`@react-three/fiber`, `@react-three/drei`, `three`) — the WebGL space/particle background, including a fully procedural, shader-driven jellyfish swarm
- **Lenis** — smooth scrolling
- **React Router** — routing
- **Radix UI** + **Vaul** — accessible dialog/popover/tooltip/drawer primitives
- **Axios** — API client
- **DOMPurify** — sanitizes blog post HTML before render
- **ESLint 9** — linting

### Backend

- **Express 4** + **MongoDB/Mongoose** — REST API, feature-layered (routes → controllers → services → repositories → models)
- **JWT + TOTP (`otplib`)** — two-factor admin authentication
- **Cloudinary** — image hosting for project/blog images, uploaded through the admin panel
- **`sanitize-html`** — server-side HTML sanitization for blog content, mirroring the frontend's DOMPurify pass (defense-in-depth)
- **Zod** — request validation
- **Helmet**, **CORS**, **express-rate-limit** — baseline security/hardening

## Features

- **Hero** — animated intro with kinetic/scramble text effects and a tech-stack strip
- **About** — bio, profile photo, and live stats (years of experience, repos, stars, packages)
- **Skills** — categorized stack grid (frontend, backend core, data/real-time/jobs, tools)
- **Featured Projects** — real production and open-source work, images uploaded via the admin panel to Cloudinary (no images bundled into the frontend build)
- **Blog** — posts authored as raw HTML in the admin panel (no paid rich-text editor), sanitized server- and client-side; supports per-post scoped `<style>`/`@media` blocks for custom layout. Includes anonymous view tracking, a like/unlike toggle, and native share
- **Journey** — timeline from classroom to backend architecture
- **Global Collaboration** — a dotted-map visualization of cross-border team/client work
- **GitHub Footprint** — live-feeling stats pulled from GitHub activity
- **Interactive space background** — a rotating starfield, occasional shooting stars, and a small swarm of procedurally animated, glowing jellyfish (breathing bell, undulating tentacles, wandering movement, theme-aware coloring) — all GPU-drawn via custom GLSL shaders, no 3D models
- **Theming** — 5 preset environments (Midnight Gold, Cyber Cyan, Emerald Night, Nordic Frost, Monochrome) plus support for custom themes persisted through the backend, with automatic localStorage fallback if it's unreachable
- **Admin CMS** — a JWT + TOTP-gated `/admin` panel for managing projects, blog posts, and site content, with direct-to-Cloudinary image uploads
- **Reduced-motion aware** — the WebGL background is skipped for users who prefer reduced motion or are on low-power devices
- **Custom cursor & cursor-trail effects**, smooth-scroll navigation, and a responsive layout throughout

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A MongoDB database (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)
- A [Cloudinary](https://cloudinary.com/) account (free tier) for image uploads

### Install

```bash
cd frontend && npm install
cd ../backend && npm install
```

### Environment variables

**`frontend/.env`** (see `frontend/.env.example`):

```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

The site works with no backend running at all — theme selection and site content fall back to `localStorage`/bundled defaults. Blog, projects, and the admin panel need the backend.

**`backend/.env`** (see `backend/.env.example` for the full list, including how to generate the admin password hash and Cloudinary keys):

```bash
MONGO_URI=...
JWT_SECRET=...
ADMIN_USERNAME=...
ADMIN_PASSWORD_HASH=...
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Run the dev servers

```bash
# frontend/
npm run dev          # binds to all network interfaces (--host)
npm run dev:no-host   # localhost only

# backend/
npm run dev           # nodemon, auto-restarts on changes
```

### Build & preview (frontend)

```bash
npm run build
npm run preview
```

### Lint (frontend)

```bash
npm run lint
```

## Project Structure

```text
frontend/src/
  app/            App shell, providers, error boundary
  pages/          Route-level pages (including admin/)
  layouts/        MainLayout (sidebar nav, footer) and AdminLayout
  features/       Section components (hero, about, skills, projects, blog, journey, collab, github)
  shared/
    components/   Cross-feature UI (background, cursor effects, section header, text effects)
    ui/           Reusable primitives (Button, Card, Dialog, Drawer, Modal, Tooltip, ImageUploadField)
    hooks/        Custom hooks (theme/accent color, media query, scroll, site content, reduced-motion)
    contexts/     ThemeContext
    lib/, utils/  Utilities (class merging, smooth scroll, HTML sanitization)
  services/       API clients (auth, posts, projects, media, site content, theme)
  constants/      Static content (skills, journey timeline, GitHub stats, site content defaults)
  config/         Env and theme configuration
  routes/         Route registry and router

backend/
  app/            Express app assembly, bootstrap (Mongo connection, admin seed), middlewares
  config/         Centralized env access
  features/       auth, posts, projects, media, siteContent, theme — each with its own
                   routes/controllers/services/repositories/validators/models
  platform/       Cross-cutting integrations (Cloudinary config, JWT admin guard)
  shared/         Base repository class, shared error types, utilities (slugify, HTML sanitize)
```

## Deployment

- **Frontend** — [Vercel](https://vercel.com/). Root Directory: `frontend`. Env var: `VITE_API_BASE_URL` pointing at the deployed backend + `/api/v1`. `frontend/vercel.json` handles SPA route rewrites (so refreshing on e.g. `/blog/some-post` or `/admin` doesn't 404).
- **Backend** — [Render](https://render.com/). Root Directory: `backend`. Build command `npm install`, start command `npm start`. Health check path: `/health`. Set all the env vars listed above in Render's dashboard (never commit `.env`). MongoDB Atlas free tier needs "Allow access from anywhere" (0.0.0.0/0) enabled since Render's free tier has no static egress IP. Render's free tier spins the service down after ~15 min idle — the first request after a while will be slow to wake it up.

Any static host that can serve a Vite build works equally well for the frontend, and any Node host works for the backend:

```bash
cd frontend && npm run build   # outputs to frontend/dist/
```

## Author

**Sayantan Chakraborty** — Backend-focused MERN stack developer, Kolkata, India
[GitHub](https://github.com/SayantanCode) · [LinkedIn](https://www.linkedin.com/in/sayantan-chakraborty-code) · [sayantan648@gmail.com](mailto:sayantan648@gmail.com)

## License

MIT
