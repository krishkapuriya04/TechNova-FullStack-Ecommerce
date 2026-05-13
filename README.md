# TechNova

Full-stack e-commerce foundation: **React (Vite) + Tailwind** in `client/`, **Express + MongoDB + JWT-ready middleware** in `server/`.

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

- **Server:** copy `server/.env.example` → `server/.env` and set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`.
- **Client:** optional `client/.env`; `VITE_API_BASE_URL` defaults to `/api/v1` (proxied to the API in dev).

## Scripts

- **Client:** `npm run dev`, `npm run build`, `npm run lint`, `npm run format`
- **Server:** `npm run dev`, `npm start`, `npm run lint`

## API

- Health: `GET /api/v1/health`

## Next phase (Auth + users)

- **Server:** add `User` Mongoose model (`server/src/models/User.js`), auth routes (`/api/v1/auth/register`, `/login`, `/me`), password hashing (e.g. bcrypt), and reuse `authenticate` from `server/src/middleware/auth.middleware.js`.
- **Client:** add auth pages in place of `PlaceholderPage` for `ROUTES.AUTH_*`, an `AuthProvider` + token storage aligned with `apiClient` interceptors, and protected route wrappers when checkout/profile ships.

## License

Private / your choice — add a `LICENSE` when you publish.
