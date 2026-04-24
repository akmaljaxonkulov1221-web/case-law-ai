"""
Court Precedents Module API Router
Handles Many-to-Many relationships between laws and court decisions
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field

from ..core.database import get_db
from ..core.logging import get_logger
from ..core.guardrails import guardrails
from ..models.models import Law, CourtDecision, LawCourtDecision

logger = get_logger(__name__)

router = APIRouter(prefix="/api/v1/court-precedents", tags=["court-precedents"])

# Pydantic models
class CourtDecisionBase(BaseModel):
    title: str = Field(..., description="Decision title")
    description: str = Field(..., description="Decision description")
    case_number: str = Field(..., description="Case number")
    court_name: str = Field(..., description="Court name")
    decision_date: str = Field(..., description="Decision date (YYYY-MM-DD)")
    legal_domain: str = Field(..., description="Legal domain")
    difficulty_level: str = Field(default="medium", description="Difficulty level")
    tags: List[str] = Field(default=[], description="Tags")
    facts: str = Field(..., description="Case facts")
    legal_issues: List[str] = Field(default=[], description="Legal issues")
    applicable_laws: List[str] = Field(default=[], description="Applicable laws")
    decision: str = Field(..., description="Court decision")
    reasoning: str = Field(..., description="Court reasoning")
    precedent_value: str = Field(default="medium", description="Precedent value")
    status: str = Field(default="active", description="Status")

class CourtDecisionCreate(CourtDecisionBase):
    law_ids: List[str] = Field(default=[], description="Associated law IDs")

class CourtDecisionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    case_number: Optional[str] = None
    court_name: Optional[str] = None
    decision_date: Optional[str] = None
    legal_domain: Optional[str] = None
    difficulty_level: Optional[str] = None
    tags: Optional[List[str]] = None
    facts: Optional[str] = None
    legal_issues: Optional[List[str]] = None
    applicable_laws: Optional[List[str]] = None
    decision: Optional[str] = None
    reasoning: Optional[str] = None
    precedent_value: Optional[str] = None
    status: Optional[str] = None

class CourtDecisionResponse(CourtDecisionBase):
    id: str
    uuid: str
    created_at: str
    created_by: str
    estimated_time: int
    min_xp_required: int
    xp_reward: int
    is_featured: bool
    associated_laws: List[dict] = Field(default=[], description="Associated laws")

class LawCourtDecisionBase(BaseModel):
    law_id: str = Field(..., description="Law ID")
    court_decision_id: str = Field(..., description="Court decision ID")
    relevance_score: float = Field(default=1.0, description="Relevance score")
    context: Optional[str] = Field(None, description="Context of relationship")

class LawCourtDecisionCreate(LawCourtDecisionBase):
    pass

class LawCourtDecisionResponse(LawCourtDecisionBase):
    id: str
    created_at: str
    law: dict = Field(..., description="Law details")
    court_decision: dict = Field(..., description="Court decision details")

# API Endpoints

@router.get("/decisions", response_model=List[CourtDecisionResponse])
async def get_court_decisions(
    skip: int = Query(0, ge=0, description="Number of decisions to skip"),
    limit: int = Query(50, ge=1, le=100, description="Number of decisions to return"),
    legal_domain: Optional[str] = Query(None, description="Filter by legal domain"),
    difficulty_level: Optional[str] = Query(None, description="Filter by difficulty level"),
    precedent_value: Optional[str] = Query(None, description="Filter by precedent value"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    db: Session = Depends(get_db)
):
    """Get all court decisions with optional filtering"""
    try:
        query = db.query(CourtDecision)
        
        if legal_domain:
            query = query.filter(CourtDecision.legal_domain == legal_domain)
        if difficulty_level:
            query = query.filter(CourtDecision.difficulty_level == difficulty_level)
        if precedent_value:
            query = query.filter(CourtDecision.precedent_value == precedent_value)
        if search:
            query = query.filter(
                (CourtDecision.title.ilike(f"%{search}%")) |
                (CourtDecision.description.ilike(f"%{search}%"))
            )
        
        decisions = query.offset(skip).limit(limit).all()
        
        response = []
        for decision in decisions:
            # Get associated laws
            law_decisions = db.query(LawCourtDecision).filter(
                LawCourtDecision.court_decision_id == decision.id
            ).all()
            
            associated_laws = []
            for ld in law_decisions:
                law = db.query(Law).filter(Law.id == ld.law_id).first()
                if law:
                    associated_laws.append({
                        "id": law.id,
                        "uuid": law.uuid,
                        "title": law.title,
                        "code_name": law.codeName,
                        "article_number": law.articleNumber,
                        "relevance_score": ld.relevance_score,
                        "context": ld.context
                    })
            
            response.append({
                "id": decision.id,
                "uuid": decision.uuid,
                "title": decision.title,
                "description": decision.description,
                "case_number": decision.caseNumber,
                "court_name": decision.courtName,
                "decision_date": decision.decisionDate.strftime("%Y-%m-%d"),
                "legal_domain": decision.legalDomain,
                "difficulty_level": decision.difficultyLevel,
                "tags": decision.tags,
                "facts": decision.facts,
                "legal_issues": decision.legalIssues,
                "applicable_laws": decision.applicableLaws,
                "decision": decision.decision,
                "reasoning": decision.reasoning,
                "precedent_value": decision.precedentValue,
                "status": decision.status,
                "created_at": decision.createdAt.isoformat(),
                "created_by": decision.createdBy,
                "estimated_time": decision.estimatedTime,
                "min_xp_required": decision.minXpRequired,
                "xp_reward": decision.xpReward,
                "is_featured": decision.isFeatured,
                "associated_laws": associated_laws
            })
        
        return response
        
    except Exception as e:
        logger.error(f"Error getting court decisions: {e}")
        raise HTTPException(status_code=500, detail="Failed to get court decisions")

@router.get("/decisions/{decision_id}", response_model=CourtDecisionResponse)
async def get_court_decision(
    decision_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific court decision by ID"""
    try:
        decision = db.query(CourtDecision).filter(CourtDecision.id == decision_id).first()
        if not decision:
            raise HTTPException(status_code=404, detail="Court decision not found")
        
        # Get associated laws
        law_decisions = db.query(LawCourtDecision).filter(
            LawCourtDecision.court_decision_id == decision.id
        ).all()
        
        associated_laws = []
        for ld in law_decisions:
            law = db.query(Law).filter(Law.id == ld.law_id).first()
            if law:
                associated_laws.append({
                    "id": law.id,
                    "uuid": law.uuid,
                    "title": law.title,
                    "code_name": law.codeName,
                    "article_number": law.articleNumber,
                    "relevance_score": ld.relevance_score,
                    "context": ld.context
                })
        
        return {
            "id": decision.id,
            "uuid": decision.uuid,
            "title": decision.title,
            "description": decision.description,
            "case_number": decision.caseNumber,
            "court_name": decision.courtName,
            "decision_date": decision.decisionDate.strftime("%Y-%m-%d"),
            "legal_domain": decision.legalDomain,
            "difficulty_level": decision.difficultyLevel,
            "tags": decision.tags,
            "facts": decision.facts,
            "legal_issues": decision.legalIssues,
            "applicable_laws": decision.applicableLaws,
            "decision": decision.decision,
            "reasoning": decision.reasoning,
            "precedent_value": decision.precedentValue,
            "status": decision.status,
            "created_at": decision.createdAt.isoformat(),
            "created_by": decision.createdBy,
            "estimated_time": decision.estimatedTime,
            "min_xp_required": decision.minXpRequired,
            "xp_reward": decision.xpReward,
            "is_featured": decision.isFeatured,
            "associated_laws": associated_laws
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting court decision {decision_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get court decision")

@router.post("/decisions", response_model=CourtDecisionResponse)
async def create_court_decision(
    decision: CourtDecisionCreate,
    db: Session = Depends(get_db)
):
    """Create a new court decision"""
    try:
        # Validate input
        if not decision.title or not decision.case_number:
            raise HTTPException(status_code=400, detail="Title and case number are required")
        
        # Check if case number already exists
        existing = db.query(CourtDecision).filter(
            CourtDecision.caseNumber == decision.case_number
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Case number already exists")
        
        # Create decision
        db_decision = CourtDecision(
            title=decision.title,
            description=decision.description,
            caseNumber=decision.case_number,
            courtName=decision.court_name,
            decisionDate=decision.decision_date,
            legalDomain=decision.legal_domain,
            difficultyLevel=decision.difficulty_level,
            tags=decision.tags,
            facts=decision.facts,
            legalIssues=decision.legal_issues,
            applicableLaws=decision.applicable_laws,
            decision=decision.decision,
            reasoning=decision.reasoning,
            precedentValue=decision.precedent_value,
            status=decision.status,
            createdBy="system" # TODO: Get from auth
        )
        
        db.add(db_decision)
        db.commit()
        db.refresh(db_decision)
        
        # Associate with laws if provided
        if decision.law_ids:
            for law_id in decision.law_ids:
                # Check if law exists
                law = db.query(Law).filter(Law.id == law_id).first()
                if law:
                    law_decision = LawCourtDecision(
                        lawId=law_id,
                        courtDecisionId=db_decision.id,
                        relevanceScore=1.0
                    )
                    db.add(law_decision)
            
            db.commit()
        
        return await get_court_decision(db_decision.id, db)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating court decision: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create court decision")

@router.put("/decisions/{decision_id}", response_model=CourtDecisionResponse)
async def update_court_decision(
    decision_id: str,
    decision_update: CourtDecisionUpdate,
    db: Session = Depends(get_db)
):
    """Update a court decision"""
    try:
        decision = db.query(CourtDecision).filter(CourtDecision.id == decision_id).first()
        if not decision:
            raise HTTPException(status_code=404, detail="Court decision not found")
        
        # Update fields
        update_data = decision_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            if hasattr(decision, field):
                setattr(decision, field, value)
        
        db.commit()
        db.refresh(decision)
        
        return await get_court_decision(decision_id, db)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating court decision {decision_id}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update court decision")

@router.delete("/decisions/{decision_id}")
async def delete_court_decision(
    decision_id: str,
    db: Session = Depends(get_db)
):
    """Delete a court decision"""
    try:
        decision = db.query(CourtDecision).filter(CourtDecision.id == decision_id).first()
        if not decision:
            raise HTTPException(status_code=404, detail="Court decision not found")
        
        # Delete associated law relationships
        db.query(LawCourtDecision).filter(
            LawCourtDecision.court_decision_id == decision_id
        ).delete()
        
        # Delete decision
        db.delete(decision)
        db.commit()
        
        return {"message": "Court decision deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting court decision {decision_id}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete court decision")

@router.get("/laws/{law_id}/decisions", response_model=List[CourtDecisionResponse])
async def get_decisions_by_law(
    law_id: str,
    skip: int = Query(0, ge=0, description="Number of decisions to skip"),
    limit: int = Query(50, ge=1, le=100, description="Number of decisions to return"),
    db: Session = Depends(get_db)
):
    """Get all court decisions associated with a specific law"""
    try:
        # Check if law exists
        law = db.query(Law).filter(Law.id == law_id).first()
        if not law:
            raise HTTPException(status_code=404, detail="Law not found")
        
        # Get law-decision relationships
        law_decisions = db.query(LawCourtDecision).filter(
            LawCourtDecision.law_id == law_id
        ).offset(skip).limit(limit).all()
        
        decisions = []
        for ld in law_decisions:
            decision = db.query(CourtDecision).filter(
                CourtDecision.id == ld.court_decision_id
            ).first()
            if decision:
                decisions.append(await get_court_decision(decision.id, db))
        
        return decisions
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting decisions for law {law_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get decisions for law")

@router.post("/laws/{law_id}/decisions/{decision_id}", response_model=LawCourtDecisionResponse)
async def associate_law_with_decision(
    law_id: str,
    decision_id: str,
    association: LawCourtDecisionCreate,
    db: Session = Depends(get_db)
):
    """Associate a law with a court decision"""
    try:
        # Check if law exists
        law = db.query(Law).filter(Law.id == law_id).first()
        if not law:
            raise HTTPException(status_code=404, detail="Law not found")
        
        # Check if decision exists
        decision = db.query(CourtDecision).filter(CourtDecision.id == decision_id).first()
        if not decision:
            raise HTTPException(status_code=404, detail="Court decision not found")
        
        # Check if association already exists
        existing = db.query(LawCourtDecision).filter(
            LawCourtDecision.law_id == law_id,
            LawCourtDecision.court_decision_id == decision_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Association already exists")
        
        # Create association
        law_decision = LawCourtDecision(
            lawId=law_id,
            courtDecisionId=decision_id,
            relevanceScore=association.relevance_score,
            context=association.context
        )
        
        db.add(law_decision)
        db.commit()
        db.refresh(law_decision)
        
        return {
            "id": law_decision.id,
            "law_id": law_decision.lawId,
            "court_decision_id": law_decision.courtDecisionId,
            "relevance_score": law_decision.relevanceScore,
            "context": law_decision.context,
            "created_at": law_decision.createdAt.isoformat(),
            "law": {
                "id": law.id,
                "uuid": law.uuid,
                "title": law.title,
                "code_name": law.codeName,
                "article_number": law.articleNumber
            },
            "court_decision": {
                "id": decision.id,
                "uuid": decision.uuid,
                "title": decision.title,
                "case_number": decision.caseNumber,
                "court_name": decision.courtName
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error associating law {law_id} with decision {decision_id}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to associate law with decision")

@router.delete("/laws/{law_id}/decisions/{decision_id}")
async def remove_law_decision_association(
    law_id: str,
    decision_id: str,
    db: Session = Depends(get_db)
):
    """Remove association between law and court decision"""
    try:
        association = db.query(LawCourtDecision).filter(
            LawCourtDecision.law_id == law_id,
            LawCourtDecision.court_decision_id == decision_id
        ).first()
        if not association:
            raise HTTPException(status_code=404, detail="Association not found")
        
        db.delete(association)
        db.commit()
        
        return {"message": "Association removed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error removing association between law {law_id} and decision {decision_id}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to remove association")

@router.get("/search", response_model=List[CourtDecisionResponse])
async def search_court_decisions(
    query: str = Query(..., min_length=2, description="Search query"),
    legal_domain: Optional[str] = Query(None, description="Filter by legal domain"),
    precedent_value: Optional[str] = Query(None, description="Filter by precedent value"),
    limit: int = Query(20, ge=1, le=50, description="Number of results to return"),
    db: Session = Depends(get_db)
):
    """Search court decisions"""
    try:
        # Build search query
        search_query = db.query(CourtDecision).filter(
            (CourtDecision.title.ilike(f"%{query}%")) |
            (CourtDecision.description.ilike(f"%{query}%")) |
            (CourtDecision.decision.ilike(f"%{query}%")) |
            (CourtDecision.reasoning.ilike(f"%{query}%"))
        )
        
        if legal_domain:
            search_query = search_query.filter(CourtDecision.legal_domain == legal_domain)
        if precedent_value:
            search_query = search_query.filter(CourtDecision.precedent_value == precedent_value)
        
        decisions = search_query.limit(limit).all()
        
        results = []
        for decision in decisions:
            results.append(await get_court_decision(decision.id, db))
        
        return results
        
    except Exception as e:
        logger.error(f"Error searching court decisions: {e}")
        raise HTTPException(status_code=500, detail="Failed to search court decisions")

@router.get("/featured", response_model=List[CourtDecisionResponse])
async def get_featured_decisions(
    limit: int = Query(10, ge=1, le=20, description="Number of featured decisions to return"),
    db: Session = Depends(get_db)
):
    """Get featured court decisions"""
    try:
        decisions = db.query(CourtDecision).filter(
            CourtDecision.is_featured == True,
            CourtDecision.status == "active"
        ).limit(limit).all()
        
        results = []
        for decision in decisions:
            results.append(await get_court_decision(decision.id, db))
        
        return results
        
    except Exception as e:
        logger.error(f"Error getting featured decisions: {e}")
        raise HTTPException(status_code=500, detail="Failed to get featured decisions")
