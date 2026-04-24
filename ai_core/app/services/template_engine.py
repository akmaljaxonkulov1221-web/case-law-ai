"""
Smart Template Engine
Automatically generates legal documents based on law articles
"""

import asyncio
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
from jinja2 import Template, Environment
import re

from app.core.database import get_db
from app.core.logging import get_logger
from app.models.models import Law, DocumentTemplate

logger = logging.getLogger(__name__)

class TemplateEngine:
    """Smart template engine for legal document generation"""
    
    def __init__(self):
        self.jinja_env = Environment(
            autoescape=True,
            trim_blocks=True,
            lstrip_blocks=True
        )
        
        # Add custom filters
        self.jinja_env.filters['format_date'] = self._format_date
        self.jinja_env.filters['format_number'] = self._format_number
        self.jinja_env.filters['capitalize_first'] = self._capitalize_first
        self.jinja_env.filters['legal_case_format'] = self._legal_case_format
    
    def _format_date(self, date_str: str, format: str = "%d.%m.%Y") -> str:
        """Format date string"""
        try:
            if isinstance(date_str, str):
                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
            else:
                date_obj = date_str
            return date_obj.strftime(format)
        except:
            return str(date_str)
    
    def _format_number(self, number: Any) -> str:
        """Format number with Uzbek formatting"""
        try:
            if isinstance(number, (int, float)):
                return f"{number:,}".replace(",", " ")
            return str(number)
        except:
            return str(number)
    
    def _capitalize_first(self, text: str) -> str:
        """Capitalize first letter"""
        if not text:
            return text
        return text[0].upper() + text[1:]
    
    def _legal_case_format(self, text: str) -> str:
        """Format text in legal case style"""
        if not text:
            return text
        # Convert to lowercase first, then capitalize first letter
        return text.lower().capitalize()
    
    async def get_template(self, template_type: str) -> Optional[DocumentTemplate]:
        """Get template by type"""
        try:
            db = next(get_db())
            template = db.query(DocumentTemplate).filter(
                DocumentTemplate.type == template_type,
                DocumentTemplate.is_public == True
            ).first()
            db.close()
            return template
        except Exception as e:
            logger.error(f"Failed to get template {template_type}: {e}")
            return None
    
    async def get_law_details(self, article_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed law information"""
        try:
            db = next(get_db())
            law = db.query(Law).filter(Law.id == article_id).first()
            db.close()
            
            if not law:
                return None
            
            return {
                "id": law.id,
                "uuid": law.uuid,
                "title": law.title,
                "code_name": law.codeName,
                "article_number": law.articleNumber,
                "full_text": law.fullText,
                "summary": law.summary,
                "interpretation": law.interpretation,
                "legal_domain": law.legalDomain,
                "subcategory": law.subcategory,
                "tags": law.tags,
                "importance_level": law.importanceLevel,
                "difficulty_level": law.difficultyLevel,
                "effective_date": law.effectiveDate.strftime("%d.%m.%Y") if law.effectiveDate else "",
                "is_current": law.isCurrent
            }
        except Exception as e:
            logger.error(f"Failed to get law details {article_id}: {e}")
            return None
    
    async def generate_complaint_template(
        self, 
        article_id: str,
        user_data: Dict[str, Any],
        case_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate complaint document based on law article"""
        try:
            # Get template
            template = await self.get_template("complaint")
            if not template:
                return {
                    "success": False,
                    "error": "Complaint template not found"
                }
            
            # Get law details
            law_details = await self.get_law_details(article_id)
            if not law_details:
                return {
                    "success": False,
                    "error": "Law article not found"
                }
            
            # Prepare template variables
            template_vars = {
                # Law information
                "law": law_details,
                "article": law_details,
                
                # User information
                "user": user_data,
                "plaintiff": user_data,  # Alias for user
                
                # Case information
                "case": case_data,
                "dispute": case_data,  # Alias for case
                
                # Current date
                "current_date": datetime.now().strftime("%d.%m.%Y"),
                "current_year": datetime.now().year,
                
                # Court information
                "court_name": case_data.get("court_name", "Toshkent shahar ... tumani sudi"),
                "case_number": case_data.get("case_number", f"{datetime.now().year}/{datetime.now().month}/{datetime.now().day}-{article_id[:8]}"),
                
                # Defendant information
                "defendant": case_data.get("defendant", {}),
                
                # Claim details
                "claim_amount": case_data.get("claim_amount", 0),
                "claim_description": case_data.get("claim_description", ""),
                
                # Legal basis
                "legal_basis": law_details.get("full_text", ""),
                "legal_summary": law_details.get("summary", ""),
                "legal_interpretation": law_details.get("interpretation", ""),
                
                # Additional context
                "dispute_facts": case_data.get("facts", ""),
                "evidence": case_data.get("evidence", []),
                "witnesses": case_data.get("witnesses", []),
                "damages": case_data.get("damages", {}),
                
                # Procedural information
                "procedure_type": case_data.get("procedure_type", "sud ishi"),
                "claim_type": case_data.get("claim_type", "moddiy da'vo"),
                
                # Format helpers
                "format_date": self._format_date,
                "format_number": self._format_number,
                "capitalize_first": self._capitalize_first,
                "legal_case_format": self._legal_case_format
            }
            
            # Render template
            jinja_template = self.jinja_env.from_string(template.template)
            rendered_content = jinja_template.render(template_vars)
            
            # Extract title from rendered content
            title_match = re.search(r"^(.*?)(?:\n|\r)", rendered_content)
            title = title_match.group(1).strip() if title_match else "Da'vo arizasi"
            
            return {
                "success": True,
                "title": title,
                "content": rendered_content,
                "template_id": template.id,
                "template_name": template.name,
                "law_article": law_details,
                "generated_at": datetime.now().isoformat(),
                "variables_used": list(template_vars.keys())
            }
            
        except Exception as e:
            logger.error(f"Failed to generate complaint template: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def generate_petition_template(
        self, 
        article_id: str,
        user_data: Dict[str, Any],
        case_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate petition document based on law article"""
        try:
            # Get template
            template = await self.get_template("petition")
            if not template:
                return {
                    "success": False,
                    "error": "Petition template not found"
                }
            
            # Get law details
            law_details = await self.get_law_details(article_id)
            if not law_details:
                return {
                    "success": False,
                    "error": "Law article not found"
                }
            
            # Prepare template variables
            template_vars = {
                # Law information
                "law": law_details,
                "article": law_details,
                
                # User information
                "user": user_data,
                "petitioner": user_data,
                
                # Case information
                "case": case_data,
                "dispute": case_data,
                
                # Current date
                "current_date": datetime.now().strftime("%d.%m.%Y"),
                "current_year": datetime.now().year,
                
                # Court information
                "court_name": case_data.get("court_name", "Toshkent shahar ... tumani sudi"),
                "case_number": case_data.get("case_number", f"{datetime.now().year}/{datetime.now().month}/{datetime.now().day}-{article_id[:8]}"),
                
                # Respondent information
                "respondent": case_data.get("respondent", {}),
                
                # Petition details
                "petition_type": case_data.get("petition_type", "ariza"),
                "petition_subject": case_data.get("petition_subject", ""),
                "petition_request": case_data.get("petition_request", ""),
                
                # Legal basis
                "legal_basis": law_details.get("full_text", ""),
                "legal_summary": law_details.get("summary", ""),
                "legal_interpretation": law_details.get("interpretation", ""),
                
                # Additional context
                "petition_facts": case_data.get("facts", ""),
                "evidence": case_data.get("evidence", []),
                "witnesses": case_data.get("witnesses", []),
                
                # Format helpers
                "format_date": self._format_date,
                "format_number": self._format_number,
                "capitalize_first": self._capitalize_first,
                "legal_case_format": self._legal_case_format
            }
            
            # Render template
            jinja_template = self.jinja_env.from_string(template.template)
            rendered_content = jinja_template.render(template_vars)
            
            # Extract title from rendered content
            title_match = re.search(r"^(.*?)(?:\n|\r)", rendered_content)
            title = title_match.group(1).strip() if title_match else "Ariza"
            
            return {
                "success": True,
                "title": title,
                "content": rendered_content,
                "template_id": template.id,
                "template_name": template.name,
                "law_article": law_details,
                "generated_at": datetime.now().isoformat(),
                "variables_used": list(template_vars.keys())
            }
            
        except Exception as e:
            logger.error(f"Failed to generate petition template: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def generate_contract_template(
        self, 
        article_id: str,
        user_data: Dict[str, Any],
        contract_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate contract document based on law article"""
        try:
            # Get template
            template = await self.get_template("contract")
            if not template:
                return {
                    "success": False,
                    "error": "Contract template not found"
                }
            
            # Get law details
            law_details = await self.get_law_details(article_id)
            if not law_details:
                return {
                    "success": False,
                    "error": "Law article not found"
                }
            
            # Prepare template variables
            template_vars = {
                # Law information
                "law": law_details,
                "article": law_details,
                
                # Contract parties
                "user": user_data,
                "party1": user_data,
                "party2": contract_data.get("party2", {}),
                
                # Contract information
                "contract": contract_data,
                "agreement": contract_data,
                
                # Current date
                "current_date": datetime.now().strftime("%d.%m.%Y"),
                "current_year": datetime.now().year,
                
                # Contract details
                "contract_type": contract_data.get("contract_type", "shartnoma"),
                "contract_subject": contract_data.get("subject", ""),
                "contract_value": contract_data.get("value", 0),
                "contract_currency": contract_data.get("currency", "UZS"),
                "contract_duration": contract_data.get("duration", ""),
                "contract_start_date": contract_data.get("start_date", datetime.now().strftime("%d.%m.%Y")),
                "contract_end_date": contract_data.get("end_date", ""),
                
                # Legal basis
                "legal_basis": law_details.get("full_text", ""),
                "legal_summary": law_details.get("summary", ""),
                "legal_interpretation": law_details.get("interpretation", ""),
                
                # Contract terms
                "contract_terms": contract_data.get("terms", []),
                "contract_obligations": contract_data.get("obligations", {}),
                "contract_penalties": contract_data.get("penalties", {}),
                
                # Additional context
                "contract_facts": contract_data.get("facts", ""),
                "contract_conditions": contract_data.get("conditions", []),
                
                # Format helpers
                "format_date": self._format_date,
                "format_number": self._format_number,
                "capitalize_first": self._capitalize_first,
                "legal_case_format": self._legal_case_format
            }
            
            # Render template
            jinja_template = self.jinja_env.from_string(template.template)
            rendered_content = jinja_template.render(template_vars)
            
            # Extract title from rendered content
            title_match = re.search(r"^(.*?)(?:\n|\r)", rendered_content)
            title = title_match.group(1).strip() if title_match else "Shartnoma"
            
            return {
                "success": True,
                "title": title,
                "content": rendered_content,
                "template_id": template.id,
                "template_name": template.name,
                "law_article": law_details,
                "generated_at": datetime.now().isoformat(),
                "variables_used": list(template_vars.keys())
            }
            
        except Exception as e:
            logger.error(f"Failed to generate contract template: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_available_templates(self) -> List[Dict[str, Any]]:
        """Get all available templates"""
        try:
            db = next(get_db())
            templates = db.query(DocumentTemplate).filter(
                DocumentTemplate.is_public == True
            ).all()
            db.close()
            
            return [
                {
                    "id": template.id,
                    "name": template.name,
                    "type": template.type,
                    "description": template.description,
                    "category": template.category,
                    "variables": template.variables
                }
                for template in templates
            ]
        except Exception as e:
            logger.error(f"Failed to get available templates: {e}")
            return []
    
    async def preview_template(
        self, 
        template_type: str,
        article_id: str,
        sample_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Preview template with sample data"""
        try:
            # Use sample data if provided, otherwise use default sample data
            if sample_data:
                user_data = sample_data.get("user", {})
                case_data = sample_data.get("case", {})
            else:
                # Default sample data
                user_data = {
                    "name": "Aliyev Ali",
                    "address": "Toshkent shahar, Yunusobod tumani, Beruniy ko'chasi, 5-uy",
                    "phone": "+998 90 123 45 67",
                    "email": "ali@example.com",
                    "passport_series": "AA",
                    "passport_number": "1234567",
                    "birth_date": "01.01.1990",
                    "birth_place": "Toshkent shahar"
                }
                
                case_data = {
                    "court_name": "Toshkent shahar Yunusobod tumani sudi",
                    "defendant": {
                        "name": "Karimov Karim",
                        "address": "Toshkent shahar, Chilonzor tumani, Navoiy ko'chasi, 10-uy"
                    },
                    "claim_amount": 5000000,
                    "claim_description": "Moddiy tovon talabini qondirish",
                    "facts": "2023-yil 15-yanvarda shartnoma bo'yicha to'lov amalga oshirilmadi",
                    "evidence": ["Shartnoma", "To'lov cheki", "Xatlar"],
                    "witnesses": ["Teshayev Teshay", "Rahimov Rahim"]
                }
            
            # Generate preview based on template type
            if template_type == "complaint":
                return await self.generate_complaint_template(article_id, user_data, case_data)
            elif template_type == "petition":
                return await self.generate_petition_template(article_id, user_data, case_data)
            elif template_type == "contract":
                contract_data.update({
                    "party2": {
                        "name": "Karimov Karim",
                        "address": "Toshkent shahar, Chilonzor tumani"
                    },
                    "subject": "Xizmat ko'rsatish shartnomasi",
                    "value": 10000000,
                    "currency": "UZS",
                    "duration": "6 oy",
                    "start_date": datetime.now().strftime("%d.%m.%Y"),
                    "end_date": datetime.now().strftime("%d.%m.%Y")
                })
                return await self.generate_contract_template(article_id, user_data, contract_data)
            else:
                return {
                    "success": False,
                    "error": f"Unknown template type: {template_type}"
                }
                
        except Exception as e:
            logger.error(f"Failed to preview template {template_type}: {e}")
            return {
                "success": False,
                "error": str(e)
            }

# Global template engine instance
template_engine = TemplateEngine()
