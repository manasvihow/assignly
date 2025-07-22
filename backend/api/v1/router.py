from fastapi import APIRouter
from .endpoints import auth
from .endpoints import assignments

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

api_router.include_router(
    assignments.router, prefix="/assignments", tags=["assignments"]
)