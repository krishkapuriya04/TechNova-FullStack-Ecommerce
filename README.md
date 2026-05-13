# TechNova · Full-Stack E-Commerce

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![JWT](https://img.shields.io/badge/Auth-JWT-fb0150?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

**TechNova** is a production-style electronics storefront: **React 19 + Vite + Tailwind** on the client, **Express + MongoDB Atlas + JWT** on the API. It includes a live **catalog**, **cart**, **wishlist**, **checkout**, **orders**, and an **admin** area with analytics — suitable for portfolios and recruiter demos.

### Screenshots

Add images under [`docs/screenshots/`](./docs/screenshots/) and embed them here for portfolio and recruiter review.

<!-- ![Home](docs/screenshots/home.png) -->

## Features

- **Storefront** — hero, trending carousel, collections, brand grid, responsive shop with filters, search suggestions, product detail with gallery and recommendations.
- **Commerce** — JWT auth, cart, wishlist, checkout, order history (MongoDB-backed).
- **Admin** — products CRUD, orders, users, analytics charts (Recharts).
- **Production hooks** — API health (`/live` + DB readiness), CORS allowlist, Helmet, env validation, Vite `VITE_API_BASE_URL` for split deploys, SEO component, error boundary, scroll-to-top, PWA manifest.

---

## Tech stack

| Layer | Stack |
|--------|--------|
| Frontend | React 19, React Router 7, Vite 8, Tailwind 4, Framer Motion, Axios, react-helmet-async |
| Backend | Express 5, Mongoose 9, JWT, express-validator, Helmet, CORS |
| Data | MongoDB Atlas (or local URI) |

---

## Quick start

### Prerequisites

- **Node.js 20+**
- **MongoDB Atlas** (or local MongoDB) — connection string

### 1. Clone & install

```bash
git clone https://github.com/krishkapuriya04/TechNova-FullStack-Ecommerce.git
cd TechNova-FullStack-Ecommerce

cd server && npm install
cd ../client && npm install
```

### 2. Environment

**Server** — copy and edit:

```bash
cp server/.env.example server/.env   # Windows: copy server\.env.example server\.env
```

Set at minimum: **`MONGODB_URI`**, **`JWT_SECRET`**, and **`CLIENT_ORIGIN`** (or **`CLIENT_ORIGINS`** comma-separated) to match your frontend origin.

**Client** (optional for local dev — Vite proxies `/api` by default):

```bash
cp client/.env.example client/.env.local
```

For **production** builds, set **`VITE_API_BASE_URL`** and **`VITE_APP_URL`** (see [DEPLOYMENT.md](./DEPLOYMENT.md)).

### 3. Seed demo data

```bash
cd server
npm run seed          # first run inserts catalog + admin user
# npm run seed -- --fresh   # optional: wipe products and re-seed
```

**Demo admin (rotate or remove before any real deployment):**

| Field | Value |
|--------|--------|
| Email | `admin@technova.dev` |
| Password | `Password123` |

### 4. Run

```bash
# Terminal A — API (http://localhost:5000)
cd server && npm run dev

# Terminal B — UI (http://localhost:5173)
cd client && npm run dev
```

---

## Scripts

| Location | Command | Purpose |
|----------|---------|---------|
| `client/` | `npm run dev` | Vite dev server + API proxy |
| `client/` | `npm run build` | Production bundle → `client/dist` |
| `client/` | `npm run lint` | ESLint |
| `server/` | `npm run dev` | API with `--watch` |
| `server/` | `npm start` | API (production-style) |
| `server/` | `npm run seed` | Seed catalog + admin |
| `server/` | `npm run lint` | ESLint |

---

## Deployment

Step-by-step guides for **Vercel** (frontend), **Render** (backend), and **Atlas** are in **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

Summary:

1. Deploy **API** first; note the public URL (e.g. `https://…onrender.com`).
2. Set **`CLIENT_ORIGIN`** / **`CLIENT_ORIGINS`** on the server to your **Vercel** site URL (exact match for CORS).
3. Build the **client** with **`VITE_API_BASE_URL=https://YOUR_API/api/v1`** and **`VITE_APP_URL=https://YOUR_VERCEL_APP`**.

Health checks:

- `GET /api/v1/health/live` — process liveness (always 200 when up).
- `GET /api/v1/health` — includes MongoDB readiness.

---

## Architecture (high level)

```
client/                 Vite SPA, lazy routes, contexts (auth/cart/wishlist)
  src/services/api      Axios instance → VITE_API_BASE_URL or /api/v1 proxy
  src/components/seo    Helmet-based <Seo /> per route

server/                 Express app, versioned under /api/v1
  src/routes            Feature routers (auth, products, cart, …)
  src/config            env (dotenv path-safe), database
  src/models            Mongoose schemas
```

---

## API overview (v1)

| Area | Examples |
|------|-----------|
| Auth | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me` |
| Products | `GET /api/v1/products`, `GET /api/v1/products/slug/:slug` |
| Cart / wishlist / orders | `/api/v1/cart`, `/api/v1/wishlist`, `/api/v1/orders` |
| Admin | `/api/v1/admin/*` (JWT + `role: admin`) |
| Health | `GET /api/v1/health`, `GET /api/v1/health/live` |

Full detail: see earlier sections and route files under `server/src/routes/`.

---

## SEO & PWA

- **Per-route titles / descriptions** via `react-helmet-async` and `<Seo />` on key pages.
- **Static fallbacks** in `client/index.html` (Open Graph + Twitter defaults).
- **`public/manifest.json`** + **`public/robots.txt`** for installable-app foundation and crawlers.
- **`client/src/config/sitemap.js`** — seed list for a future sitemap generator.

---

## Security notes

- Never commit **`server/.env`** or real **JWT** / **Atlas** credentials.
- Use strong **`JWT_SECRET`** in production; the server refuses the dev placeholder when `NODE_ENV=production`.
- Restrict Atlas **Network Access** to known IPs in real production (avoid open `0.0.0.0/0` long term).

---

## Future improvements

- Payment provider (Stripe) + webhooks  
- Email receipts / password reset  
- Server-driven sitemap + SSR or prerender for flagship URLs  
- Rate limiting & Redis session store  
- E2E tests (Playwright) in CI  

---

## License

Add a `LICENSE` file when you publish publicly. Until then, treat as **private / portfolio use**.
