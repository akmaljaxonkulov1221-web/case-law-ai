"""
Weakness Detection API Endpoints
FastAPI endpoints for AI-powered weakness detection and analysis
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field

from app.core.database import get_db
from app.services.weakness_detector import WeaknessDetector, WeaknessAnalysis

router = APIRouter()

# Pydantic models
class WeaknessAnalysisRequest(BaseModel):
    user_id: int = Field(..., description="User ID to analyze")
    analysis_period: str = Field("30d", regex="^\\d+d$", description="Analysis period (e.g., '30d', '7d')")

class WeaknessAnalysisResponse(BaseModel):
    success: bool
    analysis: Optional[WeaknessAnalysis] = None
    message: str

class WeaknessUpdateRequest(BaseModel):
    weakness_id: int = Field(..., description="Weakness detection ID")
    progress: int = Field(..., ge=0, le=100, description="Improvement progress (0-100)")

class WeaknessResponse(BaseModel):
    success: bool
    message: str

# Dependency injection
async def get_weakness_detector() -> WeaknessDetector:
    """Get weakness detector instance"""
    detector = WeaknessDetector()
    if not detector.openai_client:
        await detector.initialize()
    return detector

@router.post("/analyze", response_model=WeaknessAnalysisResponse)
async def analyze_user_weaknesses(
    request: WeaknessAnalysisRequest,
    db: Session = Depends(get_db),
    weakness_detector: WeaknessDetector = Depends(get_weakness_detector)
):
    """
    Analyze user's weaknesses across IRAC sessions
    
    - **user_id**: User ID to analyze
    - **analysis_period**: Analysis period in days (e.g., '30d', '7d')
    """
    try:
        # Validate user exists
        from app.models.models import User
        user = db.query(User).filter(User.id == request.user_id).first()
        
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        
        # Validate analysis period
        days = int(request.analysis_period.replace('d', ''))
        if days > 365:
            raise HTTPException(
                status_code=400,
                detail="Analysis period cannot exceed 365 days"
            )
        
        # Perform weakness analysis
        analysis = await weakness_detector.analyze_user_weaknesses(
            user_id=request.user_id,
            analysis_period=request.analysis_period
        )
        
        return WeaknessAnalysisResponse(
            success=True,
            analysis=analysis,
            message="Weakness analysis completed successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/user/{user_id}", response_model=List[dict])
async def get_user_weaknesses(
    user_id: int,
    status: Optional[str] = None,
    weakness_detector: WeaknessDetector = Depends(get_weakness_detector)
):
    """Get user's detected weaknesses"""
    try:
        # Validate status parameter
        if status:
            valid_statuses = ["detected", "addressing", "improving", "resolved"]
            if status not in valid_statuses:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
                )
        
        weaknesses = await weakness_detector.get_user_weaknesses(user_id, status)
        return weaknesses
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get weaknesses: {str(e)}")

@router.put("/progress", response_model=WeaknessResponse)
async def update_weakness_progress(
    request: WeaknessUpdateRequest,
    user_id: int = 1,  # TODO: Get from JWT token
    weakness_detector: WeaknessDetector = Depends(get_weakness_detector)
):
    """Update weakness improvement progress"""
    try:
        success = await weakness_detector.update_weakness_progress(
            weakness_id=request.weakness_id,
            user_id=user_id,
            progress=request.progress
        )
        
        if not success:
            raise HTTPException(
                status_code=400,
                detail="Failed to update weakness progress"
            )
        
        return WeaknessResponse(
            success=True,
            message="Weakness progress updated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")

@router.get("/weakness/{weakness_id}")
async def get_weakness_detail(
    weakness_id: int,
    user_id: int = 1,  # TODO: Get from JWT token
    weakness_detector: WeaknessDetector = Depends(get_weakness_detector)
):
    """Get detailed information about a specific weakness"""
    try:
        weaknesses = await weakness_detector.get_user_weaknesses(user_id)
        
        # Find the specific weakness
        weakness_detail = None
        for weakness in weaknesses:
            if weakness["id"] == weakness_id:
                weakness_detail = weakness
                break
        
        if not weakness_detail:
            raise HTTPException(
                status_code=404,
                detail="Weakness not found"
            )
        
        return weakness_detail
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get weakness detail: {str(e)}")

@router.get("/types", response_model=List[dict])
async def get_weakness_types():
    """Get available weakness types"""
    return [
        {
            "type": "legal_concept",
            "category": "knowledge",
            "description": "Misunderstanding of legal concepts and terminology",
            "examples": [
                "Incorrect interpretation of legal terms",
                "Confusion about legal principles",
                "Misapplication of legal concepts"
            ]
        },
        {
            "type": "case_analysis",
            "category": "analytical",
            "description": "Issues with case fact analysis and identification",
            "examples": [
                "Incomplete fact analysis",
                "Missing key facts",
                "Irrelevant information focus"
            ]
        },
        {
            "type": "argumentation",
            "category": "reasoning",
            "description": "Weak argument construction and logical reasoning",
            "examples": [
                "Unsupported claims",
                "Logical fallacies",
                "Weak argument structure"
            ]
        },
        {
            "type": "research",
            "category": "research",
            "description": "Insufficient or outdated legal research",
            "examples": [
                "Missing precedents",
                "Outdated legal sources",
                "Insufficient legal research"
            ]
        },
        {
            "type": "writing",
            "category": "communication",
            "description": "Issues with legal writing and communication",
            "examples": [
                "Unclear legal writing",
                "Poor legal communication",
                "Grammatical errors"
            ]
        },
        {
            "type": "critical_thinking",
            "category": "cognitive",
            "description": "Lack of critical thinking in legal analysis",
            "examples": [
                "Superficial analysis",
                "One-sided arguments",
                "Lack of critical evaluation"
            ]
        },
        {
            "type": "procedural_knowledge",
            "category": "procedural",
            "description": "Errors in legal procedures and processes",
            "examples": [
                "Incorrect procedures",
                "Procedural errors",
                "Wrong legal processes"
            ]
        }
    ]

@router.get("/categories", response_model=List[str])
async def get_weakness_categories():
    """Get available weakness categories"""
    return [
        "knowledge",
        "analytical",
        "reasoning",
        "research",
        "communication",
        "cognitive",
        "procedural"
    ]

@router.get("/severity-levels", response_model=List[str])
async def get_severity_levels():
    """Get available severity levels"""
    return [
        "low",
        "medium",
        "high",
        "critical"
    ]

@router.get("/recommendations/{weakness_type}")
async def get_improvement_recommendations(
    weakness_type: str,
    weakness_detector: WeaknessDetector = Depends(get_weakness_detector)
):
    """Get improvement recommendations for a specific weakness type"""
    try:
        # Get predefined recommendations based on weakness type
        recommendations = {
            "legal_concept": [
                "Study fundamental legal concepts and terminology",
                "Practice legal concept identification exercises",
                "Review legal dictionaries and glossaries",
                "Take legal concept quizzes and tests"
            ],
            "case_analysis": [
                "Practice structured case analysis frameworks",
                "Learn to identify key facts vs. irrelevant information",
                "Study case analysis methodologies",
                "Practice with diverse case types"
            ],
            "argumentation": [
                "Study logical reasoning and argument structure",
                "Practice building legal arguments with evidence",
                "Learn about logical fallacies and how to avoid them",
                "Review well-structured legal arguments"
            ],
            "research": [
                "Learn effective legal research techniques",
                "Practice using legal databases and resources",
                "Study precedent analysis and application",
                "Stay updated with current legal developments"
            ],
            "writing": [
                "Practice legal writing exercises",
                "Study legal writing style guides",
                "Get feedback on legal writing samples",
                "Read and analyze well-written legal documents"
            ],
            "critical_thinking": [
                "Practice critical thinking exercises",
                "Study logical reasoning frameworks",
                "Analyze multiple perspectives on legal issues",
                "Practice identifying biases in legal analysis"
            ],
            "procedural_knowledge": [
                "Study legal procedures and processes",
                "Practice procedural problem scenarios",
                "Review procedural guidelines and manuals",
                "Learn from procedural case studies"
            ]
        }
        
        return recommendations.get(weakness_type, [
            "Practice regularly with diverse legal materials",
            "Seek feedback from legal experts",
            "Study relevant legal resources and materials"
        ])
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get recommendations: {str(e)}")

@router.get("/stats")
async def get_weakness_stats(
    weakness_detector: WeaknessDetector = Depends(get_weakness_detector)
):
    """Get weakness detector statistics"""
    try:
        stats = await weakness_detector.get_stats()
        return {
            "success": True,
            "stats": stats
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

@router.get("/health")
async def health_check(
    weakness_detector: WeaknessDetector = Depends(get_weakness_detector)
):
    """Check weakness detector health"""
    try:
        status = await weakness_detector.health_check()
        return {
            "status": status,
            "service": "Weakness Detector"
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "Weakness Detector",
            "error": str(e)
        }
