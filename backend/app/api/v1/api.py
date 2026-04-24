from fastapi import APIRouter

<<<<<<< HEAD
from app.api.v1.endpoints import health, placeholder, research, system, ctftime
=======
from app.api.v1.endpoints import health, placeholder, research, system
>>>>>>> 9885d94d13a475a882e2b6b9a21fb81ae3f43809

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
<<<<<<< HEAD
api_router.include_router(
    ctftime.router,
    prefix="/ctftime",
    tags=["ctftime"],
)
=======
>>>>>>> 9885d94d13a475a882e2b6b9a21fb81ae3f43809
