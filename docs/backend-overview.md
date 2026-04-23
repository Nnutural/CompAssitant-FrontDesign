# Backend Overview

The backend is a modular FastAPI scaffold. Each directory has a narrow responsibility so future business code can grow without turning `main.py` into a monolith.

## `app/main.py`

Creates the FastAPI application, configures CORS, registers routers, and exposes the root endpoint.

## `app/core/`

Contains cross-cutting application infrastructure:

- `config.py`: environment-driven settings with `pydantic-settings`
- `logging.py`: basic logging setup

## `app/api/`

Contains versioned HTTP routing.

- `api/router.py` aggregates versioned API routers.
- `api/v1/api.py` aggregates endpoint modules under `/api/v1`.
- `api/v1/endpoints/` contains endpoint files such as `health.py`, `system.py`, and future business modules.

## `app/schemas/`

Contains Pydantic models used for request and response shapes. API modules should return these schemas rather than ad-hoc dictionaries when the response is part of the public contract.

## `app/services/`

Reserved for business orchestration. Services should coordinate domain rules and repositories, and should not depend on FastAPI request objects.

## `app/repositories/`

Reserved for persistence adapters. Add database, cache, or external data-source access here when storage is introduced.

## `app/models/`

Reserved for domain models or database models. Keep this layer separate from API schemas so transport contracts and persistence details can evolve independently.

## `app/deps.py`

Contains reusable FastAPI dependencies, such as typed access to application settings.
