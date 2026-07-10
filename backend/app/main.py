"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models import init_db
from .routers import questions, results

app = FastAPI(
    title="MBTI Cognitive Function Assessment API",
    description="Science-based personality assessment using Jungian cognitive functions",
    version="1.0.0",
)

# CORS — allow frontend dev server and production domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:4173",
        "https://mbti-cognitive.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(questions.router)
app.include_router(results.router)


@app.on_event("startup")
async def startup():
    init_db()


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}
