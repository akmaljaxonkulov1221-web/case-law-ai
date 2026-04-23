"""
Template Engine API Router
Handles legal document generation based on law articles
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

from app.core.database import get_db
from app.core.logging import get_logger
from app.core.guardrails import guardrails
from app.services.template_engine import template_engine
from app.models.models import Law, DocumentTemplate

logger = get_logger(__name__)

router = APIRouter(prefix="/api/v1/template-engine", tags=["template-engine"])

# Pydantic models
class UserData(BaseModel):
    name: str = Field(..., description="User full name")
    address: str = Field(..., description="User address")
    phone: str = Field(..., description="User phone number")
    email: Optional[str] = Field(None, description="User email")
    passport_series: Optional[str] = Field(None, description="Passport series")
    passport_number: Optional[str] = Field(None, description="Passport number")
    birth_date: Optional[str] = Field(None, description="Birth date (DD.MM.YYYY)")
    birth_place: Optional[str] = Field(None, description="Birth place")

class CaseData(BaseModel):
    court_name: Optional[str] = Field(None, description="Court name")
    case_number: Optional[str] = Field(None, description="Case number")
    defendant: Optional[Dict[str, Any]] = Field(None, description="Defendant information")
    respondent: Optional[Dict[str, Any]] = Field(None, description="Respondent information")
    claim_amount: Optional[float] = Field(None, description="Claim amount")
    claim_description: Optional[str] = Field(None, description="Claim description")
    petition_type: Optional[str] = Field(None, description="Petition type")
    petition_subject: Optional[str] = Field(None, description="Petition subject")
    petition_request: Optional[str] = Field(None, description="Petition request")
    facts: Optional[str] = Field(None, description="Case facts")
    evidence: Optional[List[str]] = Field(default=[], description="Evidence list")
    witnesses: Optional[List[str]] = Field(default=[], description="Witness list")
    damages: Optional[Dict[str, Any]] = Field(None, description="Damages information")
    procedure_type: Optional[str] = Field(None, description="Procedure type")
    claim_type: Optional[str] = Field(None, description="Claim type")

class ContractData(BaseModel):
    party2: Dict[str, Any] = Field(..., description="Second party information")
    subject: str = Field(..., description="Contract subject")
    value: float = Field(..., description="Contract value")
    currency: str = Field(default="UZS", description="Currency")
    duration: Optional[str] = Field(None, description="Contract duration")
    start_date: Optional[str] = Field(None, description="Start date (DD.MM.YYYY)")
    end_date: Optional[str] = Field(None, description="End date (DD.MM.YYYY)")
    terms: Optional[List[str]] = Field(default=[], description="Contract terms")
    obligations: Optional[Dict[str, Any]] = Field(None, description="Obligations")
    penalties: Optional[Dict[str, Any]] = Field(None, description="Penalties")
    conditions: Optional[List[str]] = Field(default=[], description="Contract conditions")
    facts: Optional[str] = Field(None, description="Contract facts")

class ComplaintRequest(BaseModel):
    article_id: str = Field(..., description="Law article ID")
    user_data: UserData = Field(..., description="User information")
    case_data: CaseData = Field(..., description="Case information")

class PetitionRequest(BaseModel):
    article_id: str = Field(..., description="Law article ID")
    user_data: UserData = Field(..., description="User information")
    case_data: CaseData = Field(..., description="Case information")

class ContractRequest(BaseModel):
    article_id: str = Field(..., description="Law article ID")
    user_data: UserData = Field(..., description="User information")
    contract_data: ContractData = Field(..., description="Contract information")

class PreviewRequest(BaseModel):
    template_type: str = Field(..., description="Template type")
    article_id: str = Field(..., description="Law article ID")
    sample_data: Optional[Dict[str, Any]] = Field(None, description="Sample data for preview")

# API Endpoints

@router.get("/templates", response_model=List[Dict[str, Any]])
async def get_available_templates(db: Session = Depends(get_db)):
    """Get all available document templates"""
    try:
        templates = await template_engine.get_available_templates()
        return templates
    except Exception as e:
        logger.error(f"Error getting templates: {e}")
        raise HTTPException(status_code=500, detail="Failed to get templates")

@router.get("/laws/{article_id}")
async def get_law_details(article_id: str, db: Session = Depends(get_db)):
    """Get law article details for template generation"""
    try:
        law_details = await template_engine.get_law_details(article_id)
        if not law_details:
            raise HTTPException(status_code=404, detail="Law article not found")
        return law_details
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting law details {article_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get law details")

@router.post("/complaint")
async def generate_complaint(request: ComplaintRequest):
    """Generate complaint document based on law article"""
    try:
        # Validate input
        if not request.article_id or not request.user_data.name:
            raise HTTPException(status_code=400, description="Article ID and user name are required")
        
        # Generate complaint
        result = await template_engine.generate_complaint_template(
            article_id=request.article_id,
            user_data=request.user_data.dict(),
            case_data=request.case_data.dict()
        )
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating complaint: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate complaint")

@router.post("/petition")
async def generate_petition(request: PetitionRequest):
    """Generate petition document based on law article"""
    try:
        # Validate input
        if not request.article_id or not request.user_data.name:
            raise HTTPException(status_code=400, description="Article ID and user name are required")
        
        # Generate petition
        result = await template_engine.generate_petition_template(
            article_id=request.article_id,
            user_data=request.user_data.dict(),
            case_data=request.case_data.dict()
        )
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating petition: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate petition")

@router.post("/contract")
async def generate_contract(request: ContractRequest):
    """Generate contract document based on law article"""
    try:
        # Validate input
        if not request.article_id or not request.user_data.name or not request.contract_data.party2:
            raise HTTPException(status_code=400, description="Article ID, user name, and second party are required")
        
        # Generate contract
        result = await template_engine.generate_contract_template(
            article_id=request.article_id,
            user_data=request.user_data.dict(),
            contract_data=request.contract_data.dict()
        )
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating contract: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate contract")

@router.post("/preview")
async def preview_template(request: PreviewRequest):
    """Preview template with sample data"""
    try:
        # Validate input
        if not request.template_type or not request.article_id:
            raise HTTPException(status_code=400, description="Template type and article ID are required")
        
        # Generate preview
        result = await template_engine.preview_template(
            template_type=request.template_type,
            article_id=request.article_id,
            sample_data=request.sample_data
        )
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error previewing template: {e}")
        raise HTTPException(status_code=500, detail="Failed to preview template")

@router.get("/template-types")
async def get_template_types():
    """Get available template types"""
    try:
        return {
            "template_types": [
                {
                    "type": "complaint",
                    "name": "Da'vo arizasi",
                    "description": "Sudga da'vo arizasi shabloni",
                    "required_fields": ["article_id", "user_data.name", "case_data"]
                },
                {
                    "type": "petition",
                    "name": "Ariza",
                    "description": "Turli xil arizalar uchun shablon",
                    "required_fields": ["article_id", "user_data.name", "case_data"]
                },
                {
                    "type": "contract",
                    "name": "Shartnoma",
                    "description": "Shartnoma tuzish uchun shablon",
                    "required_fields": ["article_id", "user_data.name", "contract_data.party2"]
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error getting template types: {e}")
        raise HTTPException(status_code=500, detail="Failed to get template types")

@router.get("/laws/search")
async def search_laws(
    query: str = Query(..., min_length=2, description="Search query"),
    legal_domain: Optional[str] = Query(None, description="Filter by legal domain"),
    limit: int = Query(10, ge=1, le=50, description="Number of results"),
    db: Session = Depends(get_db)
):
    """Search laws for template generation"""
    try:
        laws = db.query(Law).filter(
            Law.is_current == True
        )
        
        if query:
            laws = laws.filter(
                (Law.title.ilike(f"%{query}%")) |
                (Law.codeName.ilike(f"%{query}%")) |
                (Law.articleNumber.ilike(f"%{query}%")) |
                (Law.summary.ilike(f"%{query}%"))
            )
        
        if legal_domain:
            laws = laws.filter(Law.legalDomain == legal_domain)
        
        laws = laws.limit(limit).all()
        
        return [
            {
                "id": law.id,
                "uuid": law.uuid,
                "title": law.title,
                "code_name": law.codeName,
                "article_number": law.articleNumber,
                "legal_domain": law.legalDomain,
                "subcategory": law.subcategory,
                "summary": law.summary,
                "importance_level": law.importanceLevel,
                "difficulty_level": law.difficultyLevel,
                "tags": law.tags,
                "effective_date": law.effectiveDate.strftime("%d.%m.%Y") if law.effectiveDate else None
            }
            for law in laws
        ]
        
    except Exception as e:
        logger.error(f"Error searching laws: {e}")
        raise HTTPException(status_code=500, detail="Failed to search laws")

@router.get("/legal-domains")
async def get_legal_domains(db: Session = Depends(get_db)):
    """Get available legal domains"""
    try:
        domains = db.query(Law.legalDomain).distinct().all()
        return {
            "legal_domains": [domain[0] for domain in domains if domain[0]]
        }
    except Exception as e:
        logger.error(f"Error getting legal domains: {e}")
        raise HTTPException(status_code=500, detail="Failed to get legal domains")

@router.post("/validate-template-data")
async def validate_template_data(
    template_type: str = Field(..., description="Template type"),
    article_id: str = Field(..., description="Law article ID"),
    user_data: Optional[UserData] = Field(None, description="User data"),
    case_data: Optional[CaseData] = Field(None, description="Case data"),
    contract_data: Optional[ContractData] = Field(None, description="Contract data"),
    db: Session = Depends(get_db)
):
    """Validate template data before generation"""
    try:
        # Check if law exists
        law = db.query(Law).filter(Law.id == article_id).first()
        if not law:
            return {
                "valid": False,
                "errors": ["Law article not found"]
            }
        
        # Check if template exists
        template = await template_engine.get_template(template_type)
        if not template:
            return {
                "valid": False,
                "errors": [f"Template type '{template_type}' not found"]
            }
        
        errors = []
        warnings = []
        
        # Validate required fields based on template type
        if template_type in ["complaint", "petition"]:
            if not user_data or not user_data.name:
                errors.append("User name is required")
            if not case_data:
                errors.append("Case data is required")
            elif not case_data.facts:
                warnings.append("Case facts are recommended")
        
        elif template_type == "contract":
            if not user_data or not user_data.name:
                errors.append("User name is required")
            if not contract_data or not contract_data.party2:
                errors.append("Second party information is required")
            elif not contract_data.subject:
                warnings.append("Contract subject is recommended")
            elif not contract_data.value or contract_data.value <= 0:
                warnings.append("Contract value should be positive")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings,
            "template_info": {
                "name": template.name,
                "description": template.description,
                "variables": template.variables
            },
            "law_info": {
                "title": law.title,
                "code_name": law.codeName,
                "article_number": law.articleNumber,
                "legal_domain": law.legalDomain
            }
        }
        
    except Exception as e:
        logger.error(f"Error validating template data: {e}")
        raise HTTPException(status_code=500, detail="Failed to validate template data")
