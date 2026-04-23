# SecureHub Backend

This directory contains the FastAPI backend scaffold for SecureHub.

## Stack

- FastAPI for HTTP APIs
- Uvicorn for local ASGI serving
- pydantic-settings for environment-based configuration
- pytest and FastAPI TestClient for tests
- uv for Python dependency management

## Layout

```text
app/
├─ main.py              # FastAPI app factory and middleware setup
├─ api/                 # Versioned API routers
├─ core/                # Configuration and logging
├─ schemas/             # Pydantic request/response models
├─ services/            # Business orchestration layer
├─ repositories/        # Persistence adapters, added when needed
├─ models/              # Domain or database models, added when needed
└─ deps.py              # Shared FastAPI dependencies
tests/                  # Backend tests
```

## Run

```bash
uv sync
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

API docs are available at `http://127.0.0.1:8000/docs`.

## Test

```bash
uv run pytest
```

## API Prefix

All versioned APIs are mounted under:

```text
/api/v1
```

Current starter endpoints:

```text
GET /api/v1/health
GET /api/v1/system/ping
GET /api/v1/placeholder/modules
```
