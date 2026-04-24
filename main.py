from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
import logging
from typing import List, Optional
import asyncio

from core.config import settings
from core.database import get_db, engine
from core.logging import setup_logging
from models import models
from routers import irac_solver, scenario_generator, weakness_detection
from services.ai_service import AIService
from core.rag_service import RAGService

# Logging setup
setup_logging()
logger = logging.getLogger(__name__)

# Global AI services
ai_service = None
rag_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global ai_service, rag_service
    
    logger.info("Starting Case-Law AI Core...")
    
    # Initialize AI services
    try:
        ai_service = AIService()
        rag_service = RAGService()
        
        # Warm up AI models
        await asyncio.gather(
            ai_service.initialize(),
            rag_service.initialize()
        )
        
        logger.info("AI services initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize AI services: {e}")
        raise
    
    yield
    
    # Cleanup
    logger.info("Shutting down Case-Law AI Core...")

# Create FastAPI app
app = FastAPI(
    title="Case-Law AI Core API",
    description="AI-powered legal analysis and reasoning system",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(irac_solver.router, prefix="/api/v1/irac", tags=["IRAC Solver"])
app.include_router(scenario_generator.router, prefix="/api/v1/scenarios", tags=["Scenario Generator"])
app.include_router(weakness_detection.router, prefix="/api/v1/weakness", tags=["Weakness Detection"])

# Dependency injection
async def get_ai_service() -> AIService:
    return ai_service

async def get_rag_service() -> RAGService:
    return rag_service

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token"""
    # TODO: Implement JWT verification
    return {"user_id": "demo_user"}

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Case-Law AI Core",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    try:
        # Check database connection
        db = next(get_db())
        db.execute("SELECT 1")
        db.close()
        
        # Check AI services
        ai_status = await ai_service.health_check() if ai_service else "unavailable"
        rag_status = await rag_service.health_check() if rag_service else "unavailable"
        
        return {
            "status": "healthy",
            "database": "connected",
            "ai_service": ai_status,
            "rag_service": rag_status
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unavailable")

@app.get("/api/v1/stats")
async def get_stats(
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    """Get system statistics"""
    try:
        # Get database stats
        total_cases = db.query(models.Case).count()
        total_laws = db.query(models.Law).count()
        total_users = db.query(models.User).count()
        
        # Get AI service stats
        ai_stats = await ai_service.get_stats() if ai_service else {}
        rag_stats = await rag_service.get_stats() if rag_service else {}
        
        return {
            "database": {
                "total_cases": total_cases,
                "total_laws": total_laws,
                "total_users": total_users
            },
            "ai_service": ai_stats,
            "rag_service": rag_stats
        }
    except Exception as e:
        logger.error(f"Failed to get stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get statistics")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
