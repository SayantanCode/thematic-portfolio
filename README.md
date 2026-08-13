# Sayantan Chakraborty — Portfolio

A backend-focused developer portfolio built as a themeable, animated single-page site — live at **[thematic-potfolio.vercel.app](https://thematic-potfolio.vercel.app/)**.

## Tech Stack

- **React 19** + **Vite 7** — app shell and dev/build tooling
- **Tailwind CSS 4** — styling
- **Framer Motion** + **GSAP** — UI and scroll-driven animation
- **React Three Fiber** (`@react-three/fiber`, `@react-three/drei`, `three`) — the WebGL space/particle background, including a fully procedural, shader-driven jellyfish swarm
- **Lenis** — smooth scrolling
- **React Router** — routing
- **Radix UI** + **Vaul** — accessible dialog/popover/tooltip/drawer primitives
- **Axios** — API client for the optional theme backend
- **ESLint 9** — linting

## Features

- **Hero** — animated intro with kinetic/scramble text effects and a tech-stack strip
- **About** — bio, profile photo, and live stats (years of experience, repos, stars, packages)
- **Skills** — categorized stack grid (frontend, backend core, data/real-time/jobs, tools)
- **Featured Projects** — real production and open-source work, each linked out
- **Journey** — timeline from classroom to backend architecture
- **Global Collaboration** — a dotted-map visualization of cross-border team/client work
- **GitHub Footprint** — live-feeling stats pulled from GitHub activity
- **Interactive space background** — a rotating starfield, occasional shooting stars, and a small swarm of procedurally animated, glowing jellyfish (breathing bell, undulating tentacles, wandering movement, theme-aware coloring) — all GPU-drawn via custom GLSL shaders, no 3D models
- **Theming** — 5 preset environments (Midnight Gold, Cyber Cyan, Emerald Night, Nordic Frost, Monochrome) plus support for custom themes persisted through an optional backend, with automatic localStorage fallback
- **Reduced-motion aware** — the WebGL background is skipped for users who prefer reduced motion or are on low-power devices
- **Custom cursor & cursor-trail effects**, smooth-scroll navigation, and a responsive layout throughout

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Environment variables

The site works out of the box with no backend — theme selection falls back to `localStorage`. To connect a live theme API (for custom, persisted themes), create a `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

### Run the dev server

```bash
npm run dev          # binds to all network interfaces (--host)
npm run dev:no-host   # localhost only
```

### Build & preview

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```text
src/
  app/            App shell, providers, error boundary
  pages/          Route-level pages
  layouts/        MainLayout (sidebar nav, footer)
  features/       Section components (hero, about, skills, projects, journey, collab, github)
  shared/
    components/   Cross-feature UI (background, cursor effects, section header, text effects)
    ui/           Reusable primitives (Button, Card, Dialog, Drawer, Modal, Tooltip)
    hooks/        Custom hooks (theme/accent color, media query, scroll, reduced-motion)
    contexts/     ThemeContext
    lib/          Utilities (class merging, smooth scroll)
  services/       API client + theme service
  constants/      Static content (skills, journey timeline, GitHub stats)
  config/         Env and theme configuration
  routes/         Route registry and router
```

## Deployment

Deployed on [Vercel](https://vercel.com/). Any static host that can serve a Vite build works equally well:

```bash
npm run build   # outputs to dist/
```

## Author

**Sayantan Chakraborty** — Backend-focused MERN stack developer, Kolkata, India
[GitHub](https://github.com/SayantanCode) · [LinkedIn](https://www.linkedin.com/in/sayantan-chakraborty-code) · [sayantan648@gmail.com](mailto:sayantan648@gmail.com)

## License

MIT
