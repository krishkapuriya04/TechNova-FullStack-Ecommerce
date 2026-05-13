# TechNova — deployment guide

This project is a **decoupled** SPA (Vite/React) + REST API (Express/MongoDB). Deploy the frontend and backend separately, then wire environment variables so the browser can call the API with CORS.

## 1. MongoDB Atlas (production)

1. Create a cluster (M0 free tier is fine for demos).
2. **Database Access** → create a database user (username + password).
3. **Network Access** → add IP allowlist (`0.0.0.0/0` for quick tests only; tighten for real production).
4. **Database** → Connect → Drivers → copy the connection string.
5. Replace `<password>` with the user password and set a database name in the path, e.g. `...mongodb.net/technova?retryWrites=true&w=majority`.

Use this value as **`MONGODB_URI`** on the backend host.

## 2. Backend on Render (example)

1. New **Web Service** → connect this repo → root directory **`server`**.
2. **Build command:** `npm install`
3. **Start command:** `npm start`
4. **Environment** (Render dashboard):

| Key | Example |
|-----|---------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render sets `PORT` automatically — keep default binding) |
| `MONGODB_URI` | your Atlas URI |
| `JWT_SECRET` | long random string (32+ chars) |
| `CLIENT_ORIGIN` | `https://your-app.vercel.app` **or** use `CLIENT_ORIGINS` with comma-separated URLs |
| `TRUST_PROXY` | `true` (recommended behind Render’s proxy) |

5. After deploy, note the public URL, e.g. `https://technova-api.onrender.com`.

**Health checks**

- Liveness: `GET https://YOUR_API_HOST/api/v1/health/live` → always `200` when process is up.
- Readiness: `GET https://YOUR_API_HOST/api/v1/health` → `200` when MongoDB is connected.

## 3. Frontend on Vercel (example)

1. New **Project** → import repo → set **Root Directory** to **`client`**.
2. **Build command:** `npm run build`
3. **Output directory:** `dist`
4. **Environment variables:**

| Key | Example |
|-----|---------|
| `VITE_API_BASE_URL` | `https://technova-api.onrender.com/api/v1` |
| `VITE_APP_URL` | `https://your-app.vercel.app` (canonical + Open Graph; no trailing slash) |
| `VITE_SITE_NAME` | `TechNova` (optional) |

5. Redeploy after changing env vars (Vite bakes `VITE_*` at build time).

## 4. Local development (unchanged)

- **Client:** `cd client && npm run dev` — uses Vite proxy: `/api` → `http://127.0.0.1:5000` (override with `VITE_DEV_PROXY_TARGET` in `client/.env.local` if needed).
- **Server:** `cd server && npm run dev` — reads `server/.env`.

## 5. CORS checklist

- Browser `Origin` must **exactly** match one entry in `CLIENT_ORIGIN` or `CLIENT_ORIGINS` (scheme + host + port, no trailing slash).
- After changing frontend domain (e.g. new Vercel preview), add that origin to `CLIENT_ORIGINS` on the API and redeploy the API.

## 6. Sitemap (optional next step)

For SEO, generate a `sitemap.xml` served from the frontend (static file or serverless route) listing public URLs. `public/robots.txt` includes a commented `Sitemap:` line you can uncomment once the URL is known.
