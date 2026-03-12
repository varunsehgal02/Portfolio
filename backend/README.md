# Backend

Express API starter for the portfolio.

## Setup

1. Copy environment file:
   - `.env.example` -> `.env`
2. Install dependencies:
   - `npm install`
3. Run dev server:
   - `npm run dev`

Server default: `http://localhost:4000`

## Routes

- `GET /api/health`
- `POST /api/auth/login`
   - body: `{ "id": "<ADMIN_USERNAME>", "password": "<ADMIN_PASSWORD>" }`
- `GET /api/content`
- `GET /api/content/:key`
- `PUT /api/content/:key` (auth required)
- `POST /api/analytics/page-view`
- `POST /api/analytics/about-popup`
- `GET /api/analytics/summary` (auth required)

## Notes

- Auth token format: `Authorization: Bearer <token>`
- Data persists to `backend/data/store.json`
- Admin login credentials are controlled by `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- If `JWT_SECRET` is not set locally, a development fallback secret is used automatically
- API rate limits are configurable via `*_RATE_LIMIT_*` environment variables
- Default limits:
   - `API_RATE_LIMIT_MAX=300` per 15 minutes
   - `AUTH_RATE_LIMIT_MAX=10` failed logins per 15 minutes
   - `CONTACT_RATE_LIMIT_MAX=6` submissions per 15 minutes
- Contact form submissions are persisted and can also trigger email notifications when SMTP env vars are configured (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`)
- Visitor IP drill-down supports geolocation lookup (city/region/country/ISP) and caches results in store
- CORS allowlist is configured with `CORS_ORIGIN` and optionally allows `*.vercel.app` when `CORS_ALLOW_VERCEL=true`
