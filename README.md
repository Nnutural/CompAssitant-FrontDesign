# 安枢智梯 SecureHub Full-Stack Monorepo

SecureHub is organized as a full-stack monorepo. The existing Vite frontend has been moved into `frontend/`, and a new FastAPI backend scaffold lives in `backend/`.

## Structure

```text
.
├─ frontend/   # Existing React + Vite frontend
├─ backend/    # FastAPI backend scaffold
├─ docs/       # Architecture and engineering notes
├─ scripts/    # Local development helper scripts
└─ docker-compose.yml
```

## Frontend

The frontend keeps the original Vite structure, dependencies, build configuration, and source code.

```bash
cd frontend
npm install
npm run dev
```

The local frontend dev server runs on `http://localhost:5173` by default. Future API calls should read the backend base URL from:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Backend

The backend is a minimal FastAPI project using `uv`, `pydantic-settings`, and `pytest`.

```bash
cd backend
uv sync
./start.sh
```

Available starter endpoints:

```text
GET /
GET /api/v1/health
GET /api/v1/system/ping
GET /api/v1/placeholder/modules
```

Run backend tests:

```bash
cd backend
uv run pytest
```

## Local Integration

1. Start the backend on `http://127.0.0.1:8000`.
2. Start the frontend on `http://localhost:5173`.
3. Keep `frontend/.env` aligned with `frontend/.env.example`.
4. The backend CORS configuration allows both `http://localhost:5173` and `http://127.0.0.1:5173` by default.

## Docker Compose

The compose file is intended for local development structure and smoke testing:

```bash
docker compose up
```

It starts the Vite dev server and FastAPI development server with mounted source directories.

## Next Steps

- Add real business endpoints under `backend/app/api/v1/endpoints/`.
- Put orchestration logic in `backend/app/services/`.
- Add persistence behind `backend/app/repositories/` and `backend/app/models/` when a database is introduced.
- Wire frontend pages to backend APIs through `frontend/src/lib/api.ts`.
