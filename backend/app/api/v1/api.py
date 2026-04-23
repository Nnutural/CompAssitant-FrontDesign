from fastapi import APIRouter

from app.api.v1.endpoints import health, placeholder, system

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(system.router, prefix="/system", tags=["system"])
api_router.include_router(
    placeholder.router,
    prefix="/placeholder",
    tags=["placeholder"],
)
