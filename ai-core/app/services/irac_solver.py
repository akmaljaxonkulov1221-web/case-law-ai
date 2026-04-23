"""
AI IRAC Solver Agent
Automatic Issue, Rule, Application, Conclusion analysis with RAG
"""

import asyncio
import logging
from typing import Dict, Any, List, Optional, Tuple
from dataclasses import dataclass
import json
import re
from openai import AsyncOpenAI

from app.core.config import settings
from app.core.rag_service import RAGService
from app.core.guardrails import guardrails, RetrievedDocument
from app.core.database import get_db
from app.models.models import IRACSession, Case, User

logger = logging.getLogger(__name__)

@dataclass
class IRACAnalysis:
    """IRAC analysis result"""
    issue: str
    rule: str
    application: str
    conclusion: str
    confidence_score: float
    relevant_laws: List[Dict[str, Any]]
    relevant_cases: List[Dict[str, Any]]
    reasoning: str
    feedback: str

@dataclass
class IRACComponent:
    """Individual IRAC component"""
    text: str
    confidence: float
    sources: List[str]
    reasoning: str

class IRACSolverAgent:
    """AI-powered IRAC solver with RAG capabilities"""
    
    def __init__(self, rag_service: RAGService):
        self.rag_service = rag_service
        self.openai_client = None
        self.legal_domains = [
            "civil", "criminal", "constitutional", "administrative", 
            "family", "labor", "commercial", "tax", "intellectual_property", "environmental"
        ]
        
    async def initialize(self):
        """Initialize the IRAC solver"""
        try:
            self.openai_client = AsyncOpenAI(
                api_key=settings.OPENAI_API_KEY
            )
            logger.info("IRAC Solver Agent initialized")
        except Exception as e:
            logger.error(f"Failed to initialize IRAC Solver: {e}")
            raise
    
    async def solve_case(
        self,
        case_text: str,
        user_id: int,
        case_id: Optional[int] = None,
        legal_domain: Optional[str] = None
    ) -> IRACAnalysis:
        """
        Solve a legal case using IRAC methodology with AI analysis
        
        Args:
            case_text: Full case text to analyze
            user_id: User ID for session tracking
            case_id: Optional existing case ID
            legal_domain: Optional legal domain specification
        
        Returns:
            IRACAnalysis: Complete IRAC analysis with confidence scores
        """
        try:
            # Start request tracking
            guardrails.handle_request_start()
            
            # Validate with guardrails
            validation_result = guardrails.validate_irac_request(case_text, str(user_id))
            
            if not validation_result["allowed"]:
                raise ValueError(validation_result["message"])
            
            # Log warnings if any
            if validation_result["violations"]:
                logger.warning(f"IRAC request warnings for user {user_id}: {validation_result['violations']}")
            
            # Detect legal domain if not provided
            if not legal_domain:
                legal_domain = await self._detect_legal_domain(case_text)
            
            # Retrieve relevant legal context
            context = await self.rag_service.augment_irac_context(case_text, legal_domain)
            
            # Generate IRAC analysis using AI
            analysis = await self._analyze_case_with_ai(
                case_text=case_text,
                context_summary=await self.rag_service.generate_context_summary(
                    context["laws"] + context["cases"],
                    max_tokens=1500
                ),
                legal_domain=legal_domain,
                retrieved_context=context
            )
            
            # Save to database
            session_id = await self._save_irac_session(
                user_id=user_id,
                case_id=case_id,
                analysis=analysis
            )
            # Step 5: Save analysis to database
            if case_id:
                await self._save_irac_session(
                    user_id=user_id,
                    case_id=case_id,
                    analysis=analysis
                )
            
            logger.info(f"IRAC analysis completed for user {user_id}")
            return analysis
            
        except Exception as e:
            logger.error(f"Failed to solve case: {e}")
            raise
    
    async def _detect_legal_domain(self, case_text: str) -> str:
        """Detect legal domain from case text"""
        try:
            prompt = f"""
            Analyze the following legal case text and determine the primary legal domain.
            
            Legal domains: {', '.join(self.legal_domains)}
            
            Case text:
            {case_text[:1000]}
            
            Respond with only the domain name:
            """
            
            response = await self.openai_client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a legal expert specializing in Uzbekistan law."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=50,
                temperature=0.1
            )
            
            domain = response.choices[0].message.content.strip().lower()
            
            # Validate domain
            if domain in self.legal_domains:
                return domain
            else:
                logger.warning(f"Unknown domain '{domain}', defaulting to 'civil'")
                return "civil"
                
        except Exception as e:
            logger.error(f"Failed to detect legal domain: {e}")
            return "civil"
    
    async def _analyze_case_with_ai(
        self,
        case_text: str,
        context_summary: str,
        legal_domain: str,
        retrieved_context: Dict[str, List[RetrievedDocument]]
    ) -> IRACAnalysis:
        """Analyze case using AI with retrieved context"""
        try:
            # Build comprehensive prompt
            prompt = self._build_irac_prompt(
                case_text=case_text,
                context_summary=context_summary,
                legal_domain=legal_domain
            )
            
            # Get AI response
            response = await self.openai_client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": self._get_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=settings.OPENAI_MAX_TOKENS,
                temperature=settings.OPENAI_TEMPERATURE,
                response_format={"type": "json_object"}
            )
            
            # Parse response
            result = json.loads(response.choices[0].message.content)
            
            # Format sources
            relevant_laws = [
                {
                    "id": doc.metadata.get("id"),
                    "title": doc.metadata.get("title"),
                    "article_number": doc.metadata.get("article_number"),
                    "code_name": doc.metadata.get("code_name"),
                    "relevance": doc.score
                }
                for doc in retrieved_context["laws"]
            ]
            
            relevant_cases = [
                {
                    "id": doc.metadata.get("id"),
                    "title": doc.metadata.get("title"),
                    "legal_domain": doc.metadata.get("legal_domain"),
                    "precedent_value": doc.metadata.get("precedent_value"),
                    "relevance": doc.score
                }
                for doc in retrieved_context["cases"]
            ]
            
            return IRACAnalysis(
                issue=result.get("issue", ""),
                rule=result.get("rule", ""),
                application=result.get("application", ""),
                conclusion=result.get("conclusion", ""),
                confidence_score=result.get("confidence_score", 0.0),
                relevant_laws=relevant_laws,
                relevant_cases=relevant_cases,
                reasoning=result.get("reasoning", ""),
                feedback=result.get("feedback", "")
            )
            
        except Exception as e:
            logger.error(f"Failed to analyze case with AI: {e}")
            raise
    
    def _build_irac_prompt(
        self,
        case_text: str,
        context_summary: str,
        legal_domain: str
    ) -> str:
        """Build comprehensive IRAC analysis prompt"""
        return f"""
        As an expert legal analyst specializing in {legal_domain} law, analyze the following case using the IRAC methodology.
        
        IRAC stands for:
        - Issue: What is the legal question or problem?
        - Rule: What laws or legal principles apply?
        - Application: How do the rules apply to the facts?
        - Conclusion: What is the likely outcome?
        
        CASE TEXT:
        {case_text}
        
        RELEVANT LEGAL CONTEXT:
        {context_summary}
        
        Please provide a comprehensive IRAC analysis in the following JSON format:
        {{
            "issue": "Clear statement of the legal issue",
            "rule": "Applicable laws and legal principles with citations",
            "application": "Detailed analysis of how rules apply to the facts",
            "conclusion": "Likely outcome with reasoning",
            "confidence_score": 0.85,
            "reasoning": "Step-by-step legal reasoning process",
            "feedback": "Suggestions for improvement or areas to consider"
        }}
        
        Guidelines:
        1. Be thorough and precise in your analysis
        2. Cite specific laws and precedents when applicable
        3. Consider counterarguments and alternative interpretations
        4. Provide practical, actionable insights
        5. Rate your confidence (0.0 to 1.0) based on available information
        """
    
    def _get_system_prompt(self) -> str:
        """Get system prompt for IRAC analysis"""
        return """
        You are an expert legal analyst with deep knowledge of Uzbekistan law and legal methodology.
        You specialize in IRAC (Issue, Rule, Application, Conclusion) analysis and have extensive experience
        in legal research, case analysis, and legal reasoning.
        
        Your analysis should be:
        - Accurate and well-reasoned
        - Based on applicable laws and precedents
        - Practical and actionable
        - Clear and well-structured
        - Objective and unbiased
        
        Always cite relevant laws and precedents when available, and provide confidence scores
        based on the quality and completeness of available information.
        """
    
    async def _save_irac_session(
        self,
        user_id: int,
        case_id: int,
        analysis: IRACAnalysis
    ):
        """Save IRAC session to database"""
        try:
            db = next(get_db())
            
            # Create new IRAC session
            session = IRACSession(
                user_id=user_id,
                case_id=case_id,
                issue=analysis.issue,
                rule=analysis.rule,
                application=analysis.application,
                conclusion=analysis.conclusion,
                confidence_score=analysis.confidence_score,
                ai_analysis={
                    "relevant_laws": analysis.relevant_laws,
                    "relevant_cases": analysis.relevant_cases,
                    "reasoning": analysis.reasoning
                },
                feedback=analysis.feedback,
                completion_status="completed"
            )
            
            db.add(session)
            db.commit()
            db.close()
            
            logger.info(f"IRAC session saved for user {user_id}, case {case_id}")
            
        except Exception as e:
            logger.error(f"Failed to save IRAC session: {e}")
            raise
    
    async def get_irac_analysis(
        self,
        session_id: int,
        user_id: int
    ) -> Optional[IRACAnalysis]:
        """Get existing IRAC analysis"""
        try:
            db = next(get_db())
            
            session = db.query(IRACSession).filter(
                IRACSession.id == session_id,
                IRACSession.user_id == user_id
            ).first()
            
            if not session:
                return None
            
            analysis = IRACAnalysis(
                issue=session.issue or "",
                rule=session.rule or "",
                application=session.application or "",
                conclusion=session.conclusion or "",
                confidence_score=session.confidence_score or 0.0,
                relevant_laws=session.ai_analysis.get("relevant_laws", []) if session.ai_analysis else [],
                relevant_cases=session.ai_analysis.get("relevant_cases", []) if session.ai_analysis else [],
                reasoning=session.ai_analysis.get("reasoning", "") if session.ai_analysis else "",
                feedback=session.feedback or ""
            )
            
            db.close()
            return analysis
            
        except Exception as e:
            logger.error(f"Failed to get IRAC analysis: {e}")
            return None
    
    async def update_irac_component(
        self,
        session_id: int,
        user_id: int,
        component_type: str,
        new_text: str
    ) -> bool:
        """Update a specific IRAC component"""
        try:
            db = next(get_db())
            
            session = db.query(IRACSession).filter(
                IRACSession.id == session_id,
                IRACSession.user_id == user_id
            ).first()
            
            if not session:
                return False
            
            # Update the specific component
            if component_type == "issue":
                session.issue = new_text
            elif component_type == "rule":
                session.rule = new_text
            elif component_type == "application":
                session.application = new_text
            elif component_type == "conclusion":
                session.conclusion = new_text
            else:
                return False
            
            session.updated_at = datetime.utcnow()
            db.commit()
            db.close()
            
            logger.info(f"Updated {component_type} for IRAC session {session_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update IRAC component: {e}")
            return False
    
    async def evaluate_irac_session(
        self,
        session_id: int,
        user_id: int,
        max_score: float = 100.0
    ) -> Tuple[float, str]:
        """Evaluate IRAC session and provide score"""
        try:
            db = next(get_db())
            
            session = db.query(IRACSession).filter(
                IRACSession.id == session_id,
                IRACSession.user_id == user_id
            ).first()
            
            if not session:
                return 0.0, "Session not found"
            
            # Build evaluation prompt
            evaluation_prompt = f"""
            Evaluate the following IRAC analysis and provide a score out of {max_score}.
            
            Issue: {session.issue}
            Rule: {session.rule}
            Application: {session.application}
            Conclusion: {session.conclusion}
            
            Evaluate based on:
            1. Clarity and precision of the issue statement
            2. Accuracy and completeness of legal rules
            3. Logical application of rules to facts
            4. Soundness of the conclusion
            5. Overall legal reasoning quality
            
            Provide the evaluation in JSON format:
            {{
                "score": 85.0,
                "feedback": "Detailed feedback on strengths and areas for improvement",
                "strengths": ["List of strengths"],
                "improvements": ["List of areas to improve"]
            }}
            """
            
            response = await self.openai_client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are an expert legal educator."},
                    {"role": "user", "content": evaluation_prompt}
                ],
                max_tokens=1000,
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            score = result.get("score", 0.0)
            feedback = result.get("feedback", "")
            
            # Update session with evaluation
            session.score = score
            session.max_score = max_score
            session.feedback = feedback
            session.completion_status = "reviewed"
            session.graded_at = datetime.utcnow()
            
            db.commit()
            db.close()
            
            return score, feedback
            
        except Exception as e:
            logger.error(f"Failed to evaluate IRAC session: {e}")
            return 0.0, "Evaluation failed"
    
    async def get_user_irac_history(
        self,
        user_id: int,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get user's IRAC analysis history"""
        try:
            db = next(get_db())
            
            sessions = db.query(IRACSession).filter(
                IRACSession.user_id == user_id
            ).order_by(IRACSession.created_at.desc()).limit(limit).all()
            
            history = []
            for session in sessions:
                history.append({
                    "id": session.id,
                    "case_id": session.case_id,
                    "issue": session.issue,
                    "rule": session.rule,
                    "application": session.application,
                    "conclusion": session.conclusion,
                    "score": session.score,
                    "confidence_score": session.confidence_score,
                    "completion_status": session.completion_status,
                    "created_at": session.created_at.isoformat(),
                    "completed_at": session.completed_at.isoformat() if session.completed_at else None
                })
            
            db.close()
            return history
            
        except Exception as e:
            logger.error(f"Failed to get IRAC history: {e}")
            return []
    
    async def health_check(self) -> str:
        """Check IRAC solver health"""
        try:
            if not self.openai_client:
                return "uninitialized"
            
            # Test OpenAI connection
            response = await self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "Hello"}],
                max_tokens=10
            )
            
            return "healthy"
            
        except Exception as e:
            logger.error(f"IRAC solver health check failed: {e}")
            return "unhealthy"
    
    async def get_stats(self) -> Dict[str, Any]:
        """Get IRAC solver statistics"""
        try:
            db = next(get_db())
            
            total_sessions = db.query(IRACSession).count()
            completed_sessions = db.query(IRACSession).filter(
                IRACSession.completion_status == "completed"
            ).count()
            
            avg_confidence = db.query(func.avg(IRACSession.confidence_score)).scalar() or 0.0
            avg_score = db.query(func.avg(IRACSession.score)).scalar() or 0.0
            
            db.close()
            
            return {
                "total_sessions": total_sessions,
                "completed_sessions": completed_sessions,
                "completion_rate": (completed_sessions / total_sessions * 100) if total_sessions > 0 else 0,
                "average_confidence": float(avg_confidence),
                "average_score": float(avg_score),
                "ai_model": settings.OPENAI_MODEL
            }
            
        except Exception as e:
            logger.error(f"Failed to get IRAC stats: {e}")
            return {}
