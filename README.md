# File Uploader

A pragmatic PERN-TS monorepo for uploading, organizing, and sharing files. Backend (Express + Prisma + JWT) and Frontend (React + Vite + Tailwind + Supabase).

## Monorepo Layout

- `backend/`
  - `src/` Express API, routes, middleware, utilities
  - `prisma/` schema and migrations
- `frontend/`
  - `src/` React app, components, hooks, pages, utils

## Prerequisites

- Node.js LTS (recommended)
- A PostgreSQL-compatible database for Prisma
- Supabase project (storage + client access) for file storage
- Stripe account for subscriptions (optional)

## Setup

1. Install dependencies
   ```sh
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Configure environment
   - Create environment files in `backend/` and `frontend/` as needed for your runtime.
   - Do not commit secrets. Use `.env.local` for local development where applicable.

3. Database
   - Apply migrations and generate Prisma client
   ```sh
   cd backend
   npm run migrate
   ```

## Development

- Backend (watch mode)
  ```sh
  cd backend
  npm run dev
  ```
  Starts the API server using TypeScript ESM loader with file watching.

- Frontend (Vite dev server)
  ```sh
  cd frontend
  npm run dev
  ```
  Ensure the frontend points to your API base URL via your environment configuration.

## Ports & URLs

- Backend: http://localhost:4000 (API base: http://localhost:4000/api)
- Frontend: http://localhost:5173

## Build & Run (Production)

- Backend
  ```sh
  cd backend
  npm run build
  npm start
  ```

- Frontend
  ```sh
  cd frontend
  npm run build
  npm run preview   # optional local preview
  ```

## Testing

- Unit tests
  - Backend: Vitest
    ```sh
    cd backend
    npm test
    ```
  - Frontend: Vitest
    ```sh
    cd frontend
    npm test
    ```

- E2E (frontend)
  ```sh
  cd frontend
  npx playwright test
  ```

## Linting & Formatting

- Frontend lint
  ```sh
  cd frontend
  npm run lint
  ```

- TypeScript
  - Both apps are TypeScript-first. Prefer explicit function signatures and clear naming.

## API Surface (High-Level)

- Auth: login, signup, password recovery, token refresh
- Files: create, list by folder, rename, delete
- Folders: create, list children, rename, delete
- Profile: get current user, update profile
- Billing: Stripe subscriptions (checkout session, webhooks)

Endpoint prefixes:
- `POST /api/auth/*`
- `GET|POST|PATCH|DELETE /api/file/*`
- `GET|POST|PATCH|DELETE /api/folder/*`
- `GET|PATCH /api/profile/*`
- `POST /api/stripe/create-checkout-session`
- `POST /webhooks/stripe` (Stripe webhooks)

Refer to route handlers under `backend/src/routes/` and middleware in `backend/src/middleware/` for exact behavior and validations.

## Data & Storage

- Database access via Prisma (`backend/prisma/`)
- File storage via Supabase (client used in frontend for upload, download, rename and delete)

## Conventions

- Validation and sanitization on both client and server
- JWT for auth with short-lived access tokens and refresh strategy
- Rate limiting on API
- Consistent UI feedback with toasts on the frontend

## Troubleshooting

- If Prisma client is missing:
  ```sh
  cd backend
  npm run migrate   # also runs generate via postinstall on fresh install
  ```
- CORS: backend allows `http://localhost:5173` by default. If your dev origin differs, add it in `backend/src/index.ts`.
- Stripe webhooks: ensure your webhook endpoint targets `/webhooks/stripe` and sends the raw request body.
- Ensure environment configuration exists for both apps before running.

---

This README is the single source of truth for the repository. For details, read the code in `backend/src` and `frontend/src`. Keep docs minimal and up-to-date by reflecting actual scripts and code paths.
