from fastapi import FastAPI
from contextlib import asynccontextmanager

from .db.database import create_db_and_tables
from .api.v1.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")
    create_db_and_tables()
    yield
    print("Shutting down...")

app = FastAPI(lifespan=lifespan, title="EdTech Assignment Tracker")

app.include_router(api_router, prefix="/api/v1")