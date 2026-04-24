from fastapi import APIRouter

from app.api.v1.endpoints import health, placeholder, research, system, ctftime

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(system.router, prefix="/system", tags=["system"])
api_router.include_router(
    placeholder.router,
    prefix="/placeholder",
    tags=["placeholder"],
)
api_router.include_router(
    research.router,
    prefix="/research",
    tags=["research"],
)
api_router.include_router(
    ctftime.router,
    prefix="/ctftime",
    tags=["ctftime"],
)
