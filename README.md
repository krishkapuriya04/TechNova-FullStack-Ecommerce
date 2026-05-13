# TechNova (Full-Stack E-Commerce)

Modern full-stack gadget e-commerce application: **React (Vite) + Tailwind** in `client/`, **Express + MongoDB + JWT-ready middleware** in `server/`.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- MongoDB Atlas cluster (connection string)

## Commands (what each does)

| Command | Purpose |
|--------|---------|
| `cd client` then `npm install` | Install frontend dependencies from `client/package.json`. |
| `cd client` then `npm run dev` | Start Vite dev server (default [http://localhost:5173](http://localhost:5173)). |
| `cd server` then `npm install` | Install backend dependencies from `server/package.json`. |
| `cd server` then `npm run dev` | Start API with file watch ([http://localhost:5000](http://localhost:5000)). |
| `cp server/.env.example server/.env` (Unix) or copy the file on Windows | Create local env file for the API. |
| `cp client/.env.example client/.env` | Optional: set `VITE_API_BASE_URL`; dev proxy already maps `/api` to the backend. |

## Environment

- **Server:** copy `server/.env.example` → `server/.env` and set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, and optional `JWT_EXPIRES_IN` (defaults to `7d`).
- **Client:** optional `client/.env`; `VITE_API_BASE_URL` defaults to `/api/v1` (proxied to the API in dev).

## Seed data

After MongoDB is configured, run `cd server && npm run seed` to insert demo products and a development admin:

- Email: `admin@technova.dev`
- Password: `Password123`

Rotate or delete this account before any production deployment.

## API (v1)

**Auth**

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (Bearer token)

**Products**

- `GET /api/v1/products` — pagination (`page`, `limit`), `search`, `category`, `featured`, `minPrice`, `maxPrice`, `sort`
- `GET /api/v1/products/slug/:slug`
- `GET /api/v1/products/:id`
- `POST|PUT|DELETE /api/v1/products/...` — admin only (`role: admin` in JWT)

**System**

- `GET /api/v1/health`

## Scripts

- **Client:** `npm run dev`, `npm run build`, `npm run lint`, `npm run format`
- **Server:** `npm run dev`, `npm start`, `npm run lint`, `npm run seed`

## Next phase (commerce modules)

- **Cart & checkout:** persist line items per user/session, integrate payments, reuse `ProtectedRoute` on `ROUTES.CHECKOUT`.
- **Wishlist & orders:** MongoDB collections + `/api/v1/wishlist` and `/api/v1/orders`, syncing with the existing UI placeholders.
- **Admin dashboard:** product CRUD UI using the secured admin routes and richer analytics.

## License

Private / your choice — add a `LICENSE` when you publish.
