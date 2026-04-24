"""
Legal Dictionary API Router
Handles legal terms and definitions for glossary tooltips
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field

from ..core.database import get_db
from ..core.logging import get_logger
from ..models.models import LegalDictionary

logger = get_logger(__name__)

router = APIRouter(prefix="/api/v1/legal-dictionary", tags=["legal-dictionary"])

# Pydantic models
class LegalTermBase(BaseModel):
    term: str = Field(..., description="Legal term")
    definition: str = Field(..., description="Term definition")
    explanation: str = Field(..., description="Detailed explanation")
    category: str = Field(..., description="Term category")
    synonyms: List[str] = Field(default=[], description="Synonyms")
    examples: List[str] = Field(default=[], description="Usage examples")
    related_terms: List[str] = Field(default=[], description="Related terms")
    source: Optional[str] = Field(None, description="Source of definition")

class LegalTermCreate(LegalTermBase):
    pass

class LegalTermUpdate(BaseModel):
    definition: Optional[str] = None
    explanation: Optional[str] = None
    category: Optional[str] = None
    synonyms: Optional[List[str]] = None
    examples: Optional[List[str]] = None
    related_terms: Optional[List[str]] = None
    source: Optional[str] = None

class LegalTermResponse(LegalTermBase):
    id: str
    last_updated: str

# API Endpoints

@router.get("/terms", response_model=List[LegalTermResponse])
async def get_all_terms(
    skip: int = Query(0, ge=0, description="Number of terms to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of terms to return"),
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db)
):
    """Get all legal terms with optional filtering"""
    try:
        query = db.query(LegalDictionary)
        
        if category:
            query = query.filter(LegalDictionary.category == category)
        
        terms = query.offset(skip).limit(limit).all()
        
        return [
            {
                "id": term.id,
                "term": term.term,
                "definition": term.definition,
                "explanation": term.explanation,
                "category": term.category,
                "synonyms": term.synonyms or [],
                "examples": term.examples or [],
                "related_terms": term.relatedTerms or [],
                "source": term.source,
                "last_updated": term.lastUpdated.isoformat() if term.lastUpdated else ""
            }
            for term in terms
        ]
        
    except Exception as e:
        logger.error(f"Error getting terms: {e}")
        raise HTTPException(status_code=500, detail="Failed to get terms")

@router.get("/term/{term}", response_model=LegalTermResponse)
async def get_term_by_name(
    term: str,
    db: Session = Depends(get_db)
):
    """Get a specific legal term by name"""
    try:
        legal_term = db.query(LegalDictionary).filter(
            LegalDictionary.term.ilike(term)
        ).first()
        
        if not legal_term:
            raise HTTPException(status_code=404, detail="Term not found")
        
        return {
            "id": legal_term.id,
            "term": legal_term.term,
            "definition": legal_term.definition,
            "explanation": legal_term.explanation,
            "category": legal_term.category,
            "synonyms": legal_term.synonyms or [],
            "examples": legal_term.examples or [],
            "related_terms": legal_term.relatedTerms or [],
            "source": legal_term.source,
            "last_updated": legal_term.lastUpdated.isoformat() if legal_term.lastUpdated else ""
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting term {term}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get term")

@router.get("/search", response_model=List[LegalTermResponse])
async def search_terms(
    q: str = Query(..., min_length=2, description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(20, ge=1, le=100, description="Number of results"),
    db: Session = Depends(get_db)
):
    """Search legal terms"""
    try:
        query = db.query(LegalDictionary).filter(
            (LegalDictionary.term.ilike(f"%{q}%")) |
            (LegalDictionary.definition.ilike(f"%{q}%")) |
            (LegalDictionary.explanation.ilike(f"%{q}%"))
        )
        
        if category:
            query = query.filter(LegalDictionary.category == category)
        
        terms = query.limit(limit).all()
        
        return [
            {
                "id": term.id,
                "term": term.term,
                "definition": term.definition,
                "explanation": term.explanation,
                "category": term.category,
                "synonyms": term.synonyms or [],
                "examples": term.examples or [],
                "related_terms": term.relatedTerms or [],
                "source": term.source,
                "last_updated": term.lastUpdated.isoformat() if term.lastUpdated else ""
            }
            for term in terms
        ]
        
    except Exception as e:
        logger.error(f"Error searching terms: {e}")
        raise HTTPException(status_code=500, detail="Failed to search terms")

@router.get("/categories")
async def get_categories(db: Session = Depends(get_db)):
    """Get all available categories"""
    try:
        categories = db.query(LegalDictionary.category).distinct().all()
        return {
            "categories": [category[0] for category in categories if category[0]]
        }
    except Exception as e:
        logger.error(f"Error getting categories: {e}")
        raise HTTPException(status_code=500, detail="Failed to get categories")

@router.post("/terms", response_model=LegalTermResponse)
async def create_term(
    term: LegalTermCreate,
    db: Session = Depends(get_db)
):
    """Create a new legal term"""
    try:
        # Check if term already exists
        existing = db.query(LegalDictionary).filter(
            LegalDictionary.term.ilike(term.term)
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Term already exists")
        
        # Create new term
        db_term = LegalDictionary(
            term=term.term,
            definition=term.definition,
            explanation=term.explanation,
            category=term.category,
            synonyms=term.synonyms,
            examples=term.examples,
            relatedTerms=term.related_terms,
            source=term.source
        )
        
        db.add(db_term)
        db.commit()
        db.refresh(db_term)
        
        return {
            "id": db_term.id,
            "term": db_term.term,
            "definition": db_term.definition,
            "explanation": db_term.explanation,
            "category": db_term.category,
            "synonyms": db_term.synonyms or [],
            "examples": db_term.examples or [],
            "related_terms": db_term.relatedTerms or [],
            "source": db_term.source,
            "last_updated": db_term.lastUpdated.isoformat() if db_term.lastUpdated else ""
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating term: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create term")

@router.put("/term/{term}", response_model=LegalTermResponse)
async def update_term(
    term: str,
    term_update: LegalTermUpdate,
    db: Session = Depends(get_db)
):
    """Update a legal term"""
    try:
        db_term = db.query(LegalDictionary).filter(
            LegalDictionary.term.ilike(term)
        ).first()
        
        if not db_term:
            raise HTTPException(status_code=404, detail="Term not found")
        
        # Update fields
        update_data = term_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            if hasattr(db_term, field):
                setattr(db_term, field, value)
        
        db.commit()
        db.refresh(db_term)
        
        return {
            "id": db_term.id,
            "term": db_term.term,
            "definition": db_term.definition,
            "explanation": db_term.explanation,
            "category": db_term.category,
            "synonyms": db_term.synonyms or [],
            "examples": db_term.examples or [],
            "related_terms": db_term.relatedTerms or [],
            "source": db_term.source,
            "last_updated": db_term.lastUpdated.isoformat() if db_term.lastUpdated else ""
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating term {term}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update term")

@router.delete("/term/{term}")
async def delete_term(
    term: str,
    db: Session = Depends(get_db)
):
    """Delete a legal term"""
    try:
        db_term = db.query(LegalDictionary).filter(
            LegalDictionary.term.ilike(term)
        ).first()
        
        if not db_term:
            raise HTTPException(status_code=404, detail="Term not found")
        
        db.delete(db_term)
        db.commit()
        
        return {"message": "Term deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting term {term}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete term")

@router.get("/random", response_model=LegalTermResponse)
async def get_random_term(
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db)
):
    """Get a random legal term"""
    try:
        query = db.query(LegalDictionary)
        
        if category:
            query = query.filter(LegalDictionary.category == category)
        
        # Get random term
        import random
        terms = query.all()
        if not terms:
            raise HTTPException(status_code=404, detail="No terms found")
        
        random_term = random.choice(terms)
        
        return {
            "id": random_term.id,
            "term": random_term.term,
            "definition": random_term.definition,
            "explanation": random_term.explanation,
            "category": random_term.category,
            "synonyms": random_term.synonyms or [],
            "examples": random_term.examples or [],
            "related_terms": random_term.relatedTerms or [],
            "source": random_term.source,
            "last_updated": random_term.lastUpdated.isoformat() if random_term.lastUpdated else ""
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting random term: {e}")
        raise HTTPException(status_code=500, detail="Failed to get random term")

@router.get("/stats")
async def get_dictionary_stats(db: Session = Depends(get_db)):
    """Get dictionary statistics"""
    try:
        total_terms = db.query(LegalDictionary).count()
        
        # Terms by category
        categories = db.query(
            LegalDictionary.category,
            db.func.count(LegalDictionary.id).label('count')
        ).group_by(LegalDictionary.category).all()
        
        # Recently updated terms
        recent_terms = db.query(LegalDictionary).order_by(
            LegalDictionary.lastUpdated.desc()
        ).limit(5).all()
        
        return {
            "total_terms": total_terms,
            "categories": [
                {"category": cat[0], "count": cat[1]}
                for cat in categories
            ],
            "recently_updated": [
                {
                    "term": term.term,
                    "category": term.category,
                    "last_updated": term.lastUpdated.isoformat() if term.lastUpdated else ""
                }
                for term in recent_terms
            ]
        }
        
    except Exception as e:
        logger.error(f"Error getting dictionary stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get dictionary stats")
