# SecureHub Architecture

SecureHub is now organized as a full-stack monorepo with a clear boundary between the existing frontend and the new backend scaffold.

## Layers

```text
frontend/  React + Vite UI
backend/   FastAPI HTTP API
docs/      Architecture and implementation notes
scripts/   Local development helpers
```

The frontend remains a Vite application. It owns rendering, routing, interaction state, and future API calls from browser code.

The backend owns HTTP APIs, configuration, CORS, response schemas, and future business modules. All versioned API routes are exposed below `/api/v1`.

## Frontend to Backend Communication

The frontend should use `VITE_API_BASE_URL` to locate the backend:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
```

For local development:

- Frontend: `http://localhost:5173`
- Backend: `http://127.0.0.1:8000`
- Backend CORS allows both `localhost:5173` and `127.0.0.1:5173`.

`frontend/src/lib/api.ts` provides a small starting point for future API requests.

## Current Scope

This stage intentionally creates only the engineering foundation. It does not implement recommender, planner, careers, data ingestion, authentication, or persistence logic yet.

Keeping the backend small avoids locking future business design into premature abstractions while still making the project runnable and testable.

## Extension Points

Future backend modules can be added under:

```text
backend/app/api/v1/endpoints/
backend/app/services/
backend/app/repositories/
backend/app/models/
```

Likely next modules:

- Opportunities and competition intelligence APIs
- Recommendation APIs
- Planner and task APIs
- Career insight APIs
- Evidence and data source APIs
