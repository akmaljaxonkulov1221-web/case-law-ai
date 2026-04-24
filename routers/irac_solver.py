"""
IRAC Solver API Endpoints
FastAPI endpoints for AI-powered IRAC analysis
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field

from core.database import get_db
from services.irac_solver import IRACSolverAgent, IRACAnalysis
from core.rag_service import RAGService

router = APIRouter()

# Pydantic models
class IRACRequest(BaseModel):
    case_text: str = Field(..., min_length=100, description="Case text to analyze")
    case_id: Optional[int] = Field(None, description="Optional case ID")
    legal_domain: Optional[str] = Field(None, description="Legal domain (optional)")

class IRACResponse(BaseModel):
    success: bool
    analysis: Optional[IRACAnalysis] = None
    message: str

class IRACUpdateRequest(BaseModel):
    component_type: str = Field(..., regex="^(issue|rule|application|conclusion)$")
    new_text: str = Field(..., min_length=10, description="Updated component text")

class IRACEvaluationRequest(BaseModel):
    max_score: float = Field(100.0, ge=0, le=1000, description="Maximum score for evaluation")

class IRACEvaluationResponse(BaseModel):
    success: bool
    score: float
    feedback: str
    message: str

# Dependency injection
async def get_irac_solver(rag_service: RAGService = Depends(get_rag_service)) -> IRACSolverAgent:
    """Get IRAC solver instance"""
    solver = IRACSolverAgent(rag_service)
    if not solver.openai_client:
        await solver.initialize()
    return solver

@router.post("/solve", response_model=IRACResponse)
async def solve_case(
    request: IRACRequest,
    user_id: int = 1,  # TODO: Get from JWT token
    db: Session = Depends(get_db),
    irac_solver: IRACSolverAgent = Depends(get_irac_solver)
):
    """
    Solve a case using IRAC methodology with AI analysis
    
    - **case_text**: Full case text to analyze
    - **case_id**: Optional existing case ID
    - **legal_domain**: Optional legal domain specification
    """
    try:
        # Validate case text length
        if len(request.case_text) > 10000:
            raise HTTPException(
                status_code=400,
                detail="Case text too long (max 10000 characters)"
            )
        
        # Perform IRAC analysis
        analysis = await irac_solver.solve_case(
            case_text=request.case_text,
            user_id=user_id,
            case_id=request.case_id,
            legal_domain=request.legal_domain
        )
        
        return IRACResponse(
            success=True,
            analysis=analysis,
            message="IRAC analysis completed successfully"
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/session/{session_id}", response_model=IRACResponse)
async def get_irac_session(
    session_id: int,
    user_id: int = 1,  # TODO: Get from JWT token
    irac_solver: IRACSolverAgent = Depends(get_irac_solver)
):
    """Get existing IRAC analysis session"""
    try:
        analysis = await irac_solver.get_irac_analysis(session_id, user_id)
        
        if not analysis:
            raise HTTPException(
                status_code=404,
                detail="IRAC session not found"
            )
        
        return IRACResponse(
            success=True,
            analysis=analysis,
            message="IRAC session retrieved successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get session: {str(e)}")

@router.put("/session/{session_id}", response_model=dict)
async def update_irac_component(
    session_id: int,
    request: IRACUpdateRequest,
    user_id: int = 1,  # TODO: Get from JWT token
    irac_solver: IRACSolverAgent = Depends(get_irac_solver)
):
    """Update a specific IRAC component"""
    try:
        success = await irac_solver.update_irac_component(
            session_id=session_id,
            user_id=user_id,
            component_type=request.component_type,
            new_text=request.new_text
        )
        
        if not success:
            raise HTTPException(
                status_code=400,
                detail="Failed to update IRAC component"
            )
        
        return {
            "success": True,
            "message": f"IRAC {request.component_type} updated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")

@router.post("/session/{session_id}/evaluate", response_model=IRACEvaluationResponse)
async def evaluate_irac_session(
    session_id: int,
    request: IRACEvaluationRequest,
    user_id: int = 1,  # TODO: Get from JWT token
    irac_solver: IRACSolverAgent = Depends(get_irac_solver)
):
    """Evaluate IRAC session and provide score"""
    try:
        score, feedback = await irac_solver.evaluate_irac_session(
            session_id=session_id,
            user_id=user_id,
            max_score=request.max_score
        )
        
        return IRACEvaluationResponse(
            success=True,
            score=score,
            feedback=feedback,
            message="Evaluation completed successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")

@router.get("/history", response_model=List[dict])
async def get_irac_history(
    limit: int = 10,
    user_id: int = 1,  # TODO: Get from JWT token
    irac_solver: IRACSolverAgent = Depends(get_irac_solver)
):
    """Get user's IRAC analysis history"""
    try:
        if limit > 50:
            limit = 50
        
        history = await irac_solver.get_user_irac_history(user_id, limit)
        return history
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get history: {str(e)}")

@router.get("/domains", response_model=List[str])
async def get_legal_domains():
    """Get available legal domains"""
    return [
        "civil",
        "criminal", 
        "constitutional",
        "administrative",
        "family",
        "labor",
        "commercial",
        "tax",
        "intellectual_property",
        "environmental"
    ]

@router.get("/stats")
async def get_irac_stats(
    irac_solver: IRACSolverAgent = Depends(get_irac_solver)
):
    """Get IRAC solver statistics"""
    try:
        stats = await irac_solver.get_stats()
        return {
            "success": True,
            "stats": stats
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

@router.get("/health")
async def health_check(
    irac_solver: IRACSolverAgent = Depends(get_irac_solver)
):
    """Check IRAC solver health"""
    try:
        status = await irac_solver.health_check()
        return {
            "status": status,
            "service": "IRAC Solver"
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "IRAC Solver",
            "error": str(e)
        }
