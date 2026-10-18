"""Courtroom of Stupid Decisions — FastAPI Application Entry Point"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import create_tables
from routers.trials import router as trials_router

app = FastAPI(
    title="Courtroom of Stupid Decisions",
    description="Where your embarrassing moments face fictional justice.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trials_router)


@app.on_event("startup")
async def startup_event():
    create_tables()
    print("Court is now in session. Database initialized.")


@app.get("/")
def root():
    return {
        "message": "Welcome to the Courtroom of Stupid Decisions.",
        "docs": "/docs",
        "health": "/api/health",
    }
