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
  - body: `{ "id": "varun", "password": "test" }`
- `GET /api/content`
- `GET /api/content/:key`
- `PUT /api/content/:key` (auth required)
- `POST /api/analytics/page-view`
- `POST /api/analytics/about-popup`
- `GET /api/analytics/summary` (auth required)

## Notes

- Auth token format: `Authorization: Bearer <token>`
- Data persists to `backend/data/store.json`
