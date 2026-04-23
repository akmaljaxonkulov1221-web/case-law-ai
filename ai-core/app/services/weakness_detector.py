"""
Weakness Detection Logic
Analyzes user IRAC sessions to detect legal weaknesses and patterns
"""

import asyncio
import logging
from typing import Dict, Any, List, Optional, Tuple
from dataclasses import dataclass
import json
from collections import defaultdict, Counter
from datetime import datetime, timedelta
import re
from openai import AsyncOpenAI

from app.core.config import settings
from app.core.database import get_db
from app.models.models import IRACSession, WeaknessDetection, User

logger = logging.getLogger(__name__)

@dataclass
class WeaknessPattern:
    """Detected weakness pattern"""
    weakness_type: str
    weakness_category: str
    severity_level: str
    confidence: float
    occurrences: int
    examples: List[str]
    description: str
    recommended_actions: List[str]

@dataclass
class WeaknessAnalysis:
    """Complete weakness analysis result"""
    user_id: int
    analysis_period: str
    total_sessions_analyzed: int
    detected_weaknesses: List[WeaknessPattern]
    overall_assessment: str
    improvement_suggestions: List[str]
    confidence_score: float

class WeaknessDetector:
    """AI-powered weakness detection for legal analysis"""
    
    def __init__(self):
        self.openai_client = None
        self.confidence_threshold = settings.WEAKNESS_CONFIDENCE_THRESHOLD
        self.min_occurrences = settings.WEAKNESS_MIN_OCCURRENCES
        
        # Weakness type definitions
        self.weakness_types = {
            "legal_concept": {
                "patterns": [
                    r"misunderstanding.*legal.*concept",
                    r"incorrect.*interpretation.*law",
                    r"confusion.*legal.*term"
                ],
                "category": "knowledge",
                "severity": "medium"
            },
            "case_analysis": {
                "patterns": [
                    r"incomplete.*fact.*analysis",
                    r"missing.*key.*facts",
                    r"irrelevant.*information"
                ],
                "category": "analytical",
                "severity": "high"
            },
            "argumentation": {
                "patterns": [
                    r"weak.*argument",
                    r"unsupported.*claim",
                    r"logical.*fallacy"
                ],
                "category": "reasoning",
                "severity": "high"
            },
            "research": {
                "patterns": [
                    r"insufficient.*legal.*research",
                    r"missing.*precedent",
                    r"outdated.*legal.*source"
                ],
                "category": "research",
                "severity": "medium"
            },
            "writing": {
                "patterns": [
                    r"unclear.*writing",
                    r"poor.*legal.*writing",
                    r"grammatical.*error"
                ],
                "category": "communication",
                "severity": "low"
            },
            "critical_thinking": {
                "patterns": [
                    r"superficial.*analysis",
                    r"lack.*critical.*thinking",
                    r"one.*sided.*argument"
                ],
                "category": "cognitive",
                "severity": "high"
            },
            "procedural_knowledge": {
                "patterns": [
                    r"incorrect.*procedure",
                    r"procedural.*error",
                    r"wrong.*legal.*process"
                ],
                "category": "procedural",
                "severity": "medium"
            }
        }
        
    async def initialize(self):
        """Initialize the weakness detector"""
        try:
            self.openai_client = AsyncOpenAI(
                api_key=settings.OPENAI_API_KEY
            )
            logger.info("Weakness Detector initialized")
        except Exception as e:
            logger.error(f"Failed to initialize Weakness Detector: {e}")
            raise
    
    async def analyze_user_weaknesses(
        self,
        user_id: int,
        analysis_period: str = "30d"
    ) -> WeaknessAnalysis:
        """Analyze user's weaknesses across IRAC sessions"""
        try:
            logger.info(f"Analyzing weaknesses for user {user_id}")
            
            # Step 1: Get user's IRAC sessions
            sessions = await self._get_user_sessions(user_id, analysis_period)
            
            if not sessions:
                return WeaknessAnalysis(
                    user_id=user_id,
                    analysis_period=analysis_period,
                    total_sessions_analyzed=0,
                    detected_weaknesses=[],
                    overall_assessment="Insufficient data for analysis",
                    improvement_suggestions=[],
                    confidence_score=0.0
                )
            
            # Step 2: Extract patterns from sessions
            patterns = await self._extract_weakness_patterns(sessions)
            
            # Step 3: Analyze patterns with AI
            analyzed_weaknesses = await self._analyze_patterns_with_ai(patterns, user_id)
            
            # Step 4: Generate overall assessment
            overall_assessment = await self._generate_overall_assessment(analyzed_weaknesses)
            
            # Step 5: Generate improvement suggestions
            improvement_suggestions = await self._generate_improvement_suggestions(analyzed_weaknesses)
            
            # Step 6: Calculate confidence score
            confidence_score = self._calculate_analysis_confidence(analyzed_weaknesses, len(sessions))
            
            # Step 7: Save detected weaknesses
            await self._save_weakness_detections(user_id, analyzed_weaknesses)
            
            return WeaknessAnalysis(
                user_id=user_id,
                analysis_period=analysis_period,
                total_sessions_analyzed=len(sessions),
                detected_weaknesses=analyzed_weaknesses,
                overall_assessment=overall_assessment,
                improvement_suggestions=improvement_suggestions,
                confidence_score=confidence_score
            )
            
        except Exception as e:
            logger.error(f"Failed to analyze user weaknesses: {e}")
            raise
    
    async def _get_user_sessions(
        self,
        user_id: int,
        analysis_period: str
    ) -> List[Dict[str, Any]]:
        """Get user's IRAC sessions for analysis"""
        try:
            db = next(get_db())
            
            # Calculate date range
            days = int(analysis_period.replace('d', ''))
            start_date = datetime.utcnow() - timedelta(days=days)
            
            # Get sessions
            sessions = db.query(IRACSession).filter(
                IRACSession.user_id == user_id,
                IRACSession.created_at >= start_date,
                IRACSession.completion_status == "completed"
            ).order_by(IRACSession.created_at.desc()).all()
            
            session_data = []
            for session in sessions:
                session_data.append({
                    "id": session.id,
                    "issue": session.issue or "",
                    "rule": session.rule or "",
                    "application": session.application or "",
                    "conclusion": session.conclusion or "",
                    "score": session.score or 0.0,
                    "confidence_score": session.confidence_score or 0.0,
                    "feedback": session.feedback or "",
                    "ai_analysis": session.ai_analysis or {},
                    "created_at": session.created_at.isoformat()
                })
            
            db.close()
            return session_data
            
        except Exception as e:
            logger.error(f"Failed to get user sessions: {e}")
            return []
    
    async def _extract_weakness_patterns(
        self,
        sessions: List[Dict[str, Any]]
    ) -> Dict[str, List[Dict[str, Any]]]:
        """Extract weakness patterns from sessions"""
        try:
            patterns = defaultdict(list)
            
            for session in sessions:
                # Combine all IRAC components for analysis
                full_text = f"""
                Issue: {session['issue']}
                Rule: {session['rule']}
                Application: {session['application']}
                Conclusion: {session['conclusion']}
                Feedback: {session['feedback']}
                """.strip()
                
                # Check each weakness type
                for weakness_type, config in self.weakness_types.items():
                    matches = []
                    
                    # Pattern matching
                    for pattern in config["patterns"]:
                        if re.search(pattern, full_text, re.IGNORECASE):
                            matches.append(pattern)
                    
                    if matches:
                        patterns[weakness_type].append({
                            "session_id": session["id"],
                            "matches": matches,
                            "full_text": full_text,
                            "score": session["score"],
                            "confidence_score": session["confidence_score"],
                            "created_at": session["created_at"]
                        })
            
            return dict(patterns)
            
        except Exception as e:
            logger.error(f"Failed to extract weakness patterns: {e}")
            return {}
    
    async def _analyze_patterns_with_ai(
        self,
        patterns: Dict[str, List[Dict[str, Any]]],
        user_id: int
    ) -> List[WeaknessPattern]:
        """Analyze patterns with AI to identify weaknesses"""
        try:
            analyzed_weaknesses = []
            
            for weakness_type, occurrences in patterns.items():
                if len(occurrences) < self.min_occurrences:
                    continue
                
                # Build AI prompt for this weakness type
                prompt = self._build_weakness_analysis_prompt(
                    weakness_type=weakness_type,
                    occurrences=occurrences
                )
                
                # Get AI analysis
                response = await self.openai_client.chat.completions.create(
                    model=settings.OPENAI_MODEL,
                    messages=[
                        {"role": "system", "content": self._get_weakness_system_prompt()},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=1000,
                    temperature=0.1,
                    response_format={"type": "json_object"}
                )
                
                # Parse response
                result = json.loads(response.choices[0].message.content)
                
                # Create weakness pattern
                weakness_pattern = WeaknessPattern(
                    weakness_type=weakness_type,
                    weakness_category=self.weakness_types[weakness_type]["category"],
                    severity_level=result.get("severity", "medium"),
                    confidence=result.get("confidence", 0.0),
                    occurrences=len(occurrences),
                    examples=result.get("examples", [])[:5],  # Limit to 5 examples
                    description=result.get("description", ""),
                    recommended_actions=result.get("recommended_actions", [])
                )
                
                # Filter by confidence threshold
                if weakness_pattern.confidence >= self.confidence_threshold:
                    analyzed_weaknesses.append(weakness_pattern)
            
            return analyzed_weaknesses
            
        except Exception as e:
            logger.error(f"Failed to analyze patterns with AI: {e}")
            return []
    
    def _build_weakness_analysis_prompt(
        self,
        weakness_type: str,
        occurrences: List[Dict[str, Any]]
    ) -> str:
        """Build prompt for weakness analysis"""
        # Prepare examples
        examples_text = ""
        for i, occ in enumerate(occurrences[:3]):  # Limit to 3 examples
            examples_text += f"""
            Example {i+1}:
            Session ID: {occ['session_id']}
            Score: {occ['score']}
            Confidence: {occ['confidence_score']}
            Text: {occ['full_text'][:500]}...
            Matches: {', '.join(occ['matches'])}
            """
        
        return f"""
        Analyze the following weakness pattern for {weakness_type}:
        
        Total Occurrences: {len(occurrences)}
        
        Examples:
        {examples_text}
        
        Provide analysis in the following JSON format:
        {{
            "severity": "low|medium|high|critical",
            "confidence": 0.85,
            "description": "Clear description of the weakness pattern",
            "examples": ["Specific examples from the text"],
            "recommended_actions": ["Actionable recommendations for improvement"]
        }}
        
        Focus on:
        1. Identifying the root cause of the weakness
        2. Assessing the impact on legal analysis quality
        3. Providing specific, actionable recommendations
        4. Determining appropriate severity level
        """
    
    def _get_weakness_system_prompt(self) -> str:
        """Get system prompt for weakness analysis"""
        return """
        You are an expert legal educator and analyst specializing in identifying learning weaknesses.
        You have deep knowledge of legal methodology, critical thinking, and educational psychology.
        
        Your analysis should be:
        - Accurate and insightful
        - Constructive and educational
        - Specific and actionable
        - Focused on improvement rather than criticism
        - Based on sound pedagogical principles
        
        Always provide practical recommendations that help users improve their legal analysis skills.
        """
    
    async def _generate_overall_assessment(
        self,
        weaknesses: List[WeaknessPattern]
    ) -> str:
        """Generate overall assessment of user's weaknesses"""
        try:
            if not weaknesses:
                return "No significant weaknesses detected. User demonstrates strong legal analysis skills."
            
            # Build assessment prompt
            weaknesses_summary = []
            for weakness in weaknesses:
                weaknesses_summary.append(f"""
                {weakness.weakness_type}: {weakness.severity_level} severity ({weakness.occurrences} occurrences)
                - {weakness.description}
                """)
            
            prompt = f"""
            Analyze the following weakness patterns and provide an overall assessment:
            
            {''.join(weaknesses_summary)}
            
            Provide a concise assessment covering:
            1. Overall performance level
            2. Key areas of concern
            3. Strengths that can be leveraged
            4. Priority areas for improvement
            
            Keep it under 150 words and be constructive in tone.
            """
            
            response = await self.openai_client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a supportive legal educator."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=250,
                temperature=0.1
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Failed to generate overall assessment: {e}")
            return "Assessment unavailable."
    
    async def _generate_improvement_suggestions(
        self,
        weaknesses: List[WeaknessPattern]
    ) -> List[str]:
        """Generate improvement suggestions"""
        try:
            if not weaknesses:
                return ["Continue practicing with diverse legal cases", "Focus on advanced legal concepts"]
            
            # Collect all recommended actions
            all_actions = []
            for weakness in weaknesses:
                all_actions.extend(weakness.recommended_actions)
            
            # Remove duplicates and prioritize
            unique_actions = list(set(all_actions))
            
            # Use AI to refine and prioritize
            prompt = f"""
            Review and prioritize the following improvement suggestions for legal analysis:
            
            {' | '.join(unique_actions)}
            
            Provide the top 5 most important and actionable suggestions as a JSON array:
            {{
                "suggestions": ["Most important suggestion 1", "Important suggestion 2", ...]
            }}
            
            Focus on suggestions that:
            1. Address the most critical weaknesses first
            2. Are practical and implementable
            3. Provide clear guidance for improvement
            4. Cover different aspects of legal analysis
            """
            
            response = await self.openai_client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are an expert legal educator."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return result.get("suggestions", [])
            
        except Exception as e:
            logger.error(f"Failed to generate improvement suggestions: {e}")
            return ["Focus on practicing fundamental legal concepts", "Seek feedback on your analysis"]
    
    def _calculate_analysis_confidence(
        self,
        weaknesses: List[WeaknessPattern],
        session_count: int
    ) -> float:
        """Calculate confidence score for the analysis"""
        try:
            if not weaknesses:
                return 0.5  # Low confidence when no weaknesses found
            
            factors = {
                "sample_size": min(session_count / 10.0, 1.0),  # More sessions = higher confidence
                "pattern_consistency": self._calculate_pattern_consistency(weaknesses),
                "ai_confidence": self._calculate_ai_confidence(weaknesses),
                "weakness_diversity": min(len(weaknesses) / 3.0, 1.0)  # Multiple weakness types = better analysis
            }
            
            # Weighted average
            weights = {
                "sample_size": 0.25,
                "pattern_consistency": 0.25,
                "ai_confidence": 0.30,
                "weakness_diversity": 0.20
            }
            
            confidence = sum(factors[key] * weights[key] for key in factors)
            return min(confidence, 1.0)
            
        except Exception as e:
            logger.error(f"Failed to calculate analysis confidence: {e}")
            return 0.5
    
    def _calculate_pattern_consistency(self, weaknesses: List[WeaknessPattern]) -> float:
        """Calculate how consistent the weakness patterns are"""
        try:
            if len(weaknesses) <= 1:
                return 1.0
            
            # Check if weaknesses have consistent severity and confidence
            severities = [w.severity_level for w in weaknesses]
            confidences = [w.confidence for w in weaknesses]
            
            # Calculate variance (lower variance = more consistent)
            severity_consistency = 1.0 - (len(set(severities)) / len(severities))
            confidence_consistency = 1.0 - (max(confidences) - min(confidences))
            
            return (severity_consistency + confidence_consistency) / 2.0
            
        except Exception as e:
            logger.error(f"Failed to calculate pattern consistency: {e}")
            return 0.5
    
    def _calculate_ai_confidence(self, weaknesses: List[WeaknessPattern]) -> float:
        """Calculate average AI confidence"""
        try:
            if not weaknesses:
                return 0.0
            
            total_confidence = sum(w.confidence for w in weaknesses)
            return total_confidence / len(weaknesses)
            
        except Exception as e:
            logger.error(f"Failed to calculate AI confidence: {e}")
            return 0.5
    
    async def _save_weakness_detections(
        self,
        user_id: int,
        weaknesses: List[WeaknessPattern]
    ):
        """Save detected weaknesses to database"""
        try:
            db = next(get_db())
            
            for weakness in weaknesses:
                # Check if similar weakness already exists
                existing = db.query(WeaknessDetection).filter(
                    WeaknessDetection.user_id == user_id,
                    WeaknessDetection.weakness_type == weakness.weakness_type,
                    WeaknessDetection.status == "detected"
                ).first()
                
                if existing:
                    # Update existing weakness
                    existing.occurrences += weakness.occurrences
                    existing.confidence_score = weakness.confidence
                    existing.detected_at = datetime.utcnow()
                    existing.examples = weakness.examples
                    existing.recommended_actions = weakness.recommended_actions
                else:
                    # Create new weakness detection
                    new_weakness = WeaknessDetection(
                        user_id=user_id,
                        weakness_type=weakness.weakness_type,
                        weakness_category=weakness.weakness_category,
                        severity_level=weakness.severity_level,
                        title=f"{weakness.weakness_type.replace('_', ' ').title()} Weakness",
                        description=weakness.description,
                        examples=weakness.examples,
                        detection_method="pattern_analysis",
                        confidence_score=weakness.confidence,
                        recommended_actions=weakness.recommended_actions,
                        status="detected",
                        detected_at=datetime.utcnow()
                    )
                    db.add(new_weakness)
            
            db.commit()
            db.close()
            
            logger.info(f"Saved {len(weaknesses)} weakness detections for user {user_id}")
            
        except Exception as e:
            logger.error(f"Failed to save weakness detections: {e}")
            raise
    
    async def get_user_weaknesses(
        self,
        user_id: int,
        status: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get user's detected weaknesses"""
        try:
            db = next(get_db())
            
            query = db.query(WeaknessDetection).filter(
                WeaknessDetection.user_id == user_id
            )
            
            if status:
                query = query.filter(WeaknessDetection.status == status)
            
            weaknesses = query.order_by(WeaknessDetection.detected_at.desc()).all()
            
            weakness_data = []
            for weakness in weaknesses:
                weakness_data.append({
                    "id": weakness.id,
                    "weakness_type": weakness.weakness_type,
                    "weakness_category": weakness.weakness_category,
                    "severity_level": weakness.severity_level,
                    "title": weakness.title,
                    "description": weakness.description,
                    "examples": weakness.examples or [],
                    "confidence_score": weakness.confidence_score,
                    "recommended_actions": weakness.recommended_actions or [],
                    "status": weakness.status,
                    "improvement_progress": weakness.improvement_progress,
                    "detected_at": weakness.detected_at.isoformat(),
                    "resolved_at": weakness.resolved_at.isoformat() if weakness.resolved_at else None
                })
            
            db.close()
            return weakness_data
            
        except Exception as e:
            logger.error(f"Failed to get user weaknesses: {e}")
            return []
    
    async def update_weakness_progress(
        self,
        weakness_id: int,
        user_id: int,
        progress: int
    ) -> bool:
        """Update weakness improvement progress"""
        try:
            db = next(get_db())
            
            weakness = db.query(WeaknessDetection).filter(
                WeaknessDetection.id == weakness_id,
                WeaknessDetection.user_id == user_id
            ).first()
            
            if not weakness:
                return False
            
            weakness.improvement_progress = min(100, max(0, progress))
            
            # Update status if fully resolved
            if progress >= 100:
                weakness.status = "resolved"
                weakness.resolved_at = datetime.utcnow()
            
            db.commit()
            db.close()
            
            logger.info(f"Updated weakness {weakness_id} progress to {progress}%")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update weakness progress: {e}")
            return False
    
    async def health_check(self) -> str:
        """Check weakness detector health"""
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
            logger.error(f"Weakness detector health check failed: {e}")
            return "unhealthy"
    
    async def get_stats(self) -> Dict[str, Any]:
        """Get weakness detector statistics"""
        try:
            db = next(get_db())
            
            total_detections = db.query(WeaknessDetection).count()
            
            # Get weakness type distribution
            weakness_types = db.query(
                WeaknessDetection.weakness_type,
                func.count(WeaknessDetection.id)
            ).group_by(WeaknessDetection.weakness_type).all()
            
            # Get severity distribution
            severity_levels = db.query(
                WeaknessDetection.severity_level,
                func.count(WeaknessDetection.id)
            ).group_by(WeaknessDetection.severity_level).all()
            
            # Get status distribution
            statuses = db.query(
                WeaknessDetection.status,
                func.count(WeaknessDetection.id)
            ).group_by(WeaknessDetection.status).all()
            
            db.close()
            
            return {
                "total_detections": total_detections,
                "weakness_types": dict(weakness_types),
                "severity_levels": dict(severity_levels),
                "statuses": dict(statuses),
                "confidence_threshold": self.confidence_threshold,
                "min_occurrences": self.min_occurrences,
                "ai_model": settings.OPENAI_MODEL
            }
            
        except Exception as e:
            logger.error(f"Failed to get weakness stats: {e}")
            return {}
