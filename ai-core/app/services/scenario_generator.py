"""
Scenario Generator for Decision Tree AI
Generates A, B, C scenarios from decision tree nodes with probability analysis
"""

import asyncio
import logging
from typing import Dict, Any, List, Optional, Tuple
from dataclasses import dataclass
import json
import random
from openai import AsyncOpenAI

from app.core.config import settings
from app.core.database import get_db
from app.models.models import DecisionTreeNode, DecisionTree, DecisionTreeEdge, WhatIfScenario

logger = logging.getLogger(__name__)

@dataclass
class ScenarioOption:
    """Individual scenario option"""
    option_letter: str  # A, B, C
    title: str
    description: str
    probability: float
    potential_outcome: str
    reasoning: str
    risk_level: str
    legal_implications: List[str]

@dataclass
class ScenarioGeneration:
    """Complete scenario generation result"""
    current_node_id: int
    node_title: str
    node_description: str
    scenarios: List[ScenarioOption]
    analysis_summary: str
    confidence_score: float
    recommended_path: str

class ScenarioGenerator:
    """AI-powered scenario generator for decision trees"""
    
    def __init__(self):
        self.openai_client = None
        self.max_scenarios = settings.SCENARIO_MAX_BRANCHES
        self.min_probability = settings.SCENARIO_MIN_PROBABILITY
        
    async def initialize(self):
        """Initialize the scenario generator"""
        try:
            self.openai_client = AsyncOpenAI(
                api_key=settings.OPENAI_API_KEY
            )
            logger.info("Scenario Generator initialized")
        except Exception as e:
            logger.error(f"Failed to initialize Scenario Generator: {e}")
            raise
    
    async def generate_scenarios(
        self,
        node_id: int,
        user_id: int,
        context: Optional[Dict[str, Any]] = None
    ) -> ScenarioGeneration:
        """Generate scenarios for a decision tree node"""
        try:
            logger.info(f"Generating scenarios for node {node_id}")
            
            # Step 1: Get node information from database
            node_info = await self._get_node_info(node_id)
            if not node_info:
                raise ValueError(f"Node {node_id} not found")
            
            # Step 2: Analyze current context and conditions
            context_analysis = await self._analyze_context(node_info, context)
            
            # Step 3: Generate scenario options using AI
            scenarios = await self._generate_scenario_options(
                node_info=node_info,
                context_analysis=context_analysis,
                user_id=user_id
            )
            
            # Step 4: Validate and adjust probabilities
            scenarios = self._validate_probabilities(scenarios)
            
            # Step 5: Generate analysis summary
            analysis_summary = await self._generate_analysis_summary(
                node_info=node_info,
                scenarios=scenarios
            )
            
            # Step 6: Determine recommended path
            recommended_path = await self._determine_recommended_path(scenarios)
            
            # Step 7: Calculate confidence score
            confidence_score = self._calculate_confidence_score(scenarios)
            
            return ScenarioGeneration(
                current_node_id=node_id,
                node_title=node_info["title"],
                node_description=node_info["description"],
                scenarios=scenarios,
                analysis_summary=analysis_summary,
                confidence_score=confidence_score,
                recommended_path=recommended_path
            )
            
        except Exception as e:
            logger.error(f"Failed to generate scenarios: {e}")
            raise
    
    async def _get_node_info(self, node_id: int) -> Optional[Dict[str, Any]]:
        """Get node information from database"""
        try:
            db = next(get_db())
            
            # Get node with tree information
            node = db.query(DecisionTreeNode).filter(
                DecisionTreeNode.id == node_id,
                DecisionTreeNode.is_active == True
            ).first()
            
            if not node:
                return None
            
            # Get tree information
            tree = db.query(DecisionTree).filter(
                DecisionTree.id == node.tree_id
            ).first()
            
            # Get outgoing edges
            edges = db.query(DecisionTreeEdge).filter(
                DecisionTreeEdge.from_node_id == node_id
            ).all()
            
            # Get parent node context
            parent_node = None
            if node.parent_node_id:
                parent_node = db.query(DecisionTreeNode).filter(
                    DecisionTreeNode.id == node.parent_node_id
                ).first()
            
            node_info = {
                "id": node.id,
                "title": node.title,
                "description": node.description,
                "content": node.content,
                "node_type": node.node_type,
                "conditions": node.conditions or {},
                "actions": node.actions or {},
                "outcomes": node.outcomes or {},
                "tree_id": node.tree_id,
                "tree_name": tree.name if tree else "",
                "tree_type": tree.tree_type if tree else "",
                "parent_node": {
                    "id": parent_node.id,
                    "title": parent_node.title,
                    "description": parent_node.description
                } if parent_node else None,
                "existing_edges": [
                    {
                        "id": edge.id,
                        "label": edge.label,
                        "condition": edge.condition,
                        "probability": edge.probability,
                        "to_node_id": edge.to_node_id
                    }
                    for edge in edges
                ]
            }
            
            db.close()
            return node_info
            
        except Exception as e:
            logger.error(f"Failed to get node info: {e}")
            return None
    
    async def _analyze_context(
        self,
        node_info: Dict[str, Any],
        context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze current context and conditions"""
        try:
            context_analysis = {
                "node_type": node_info["node_type"],
                "existing_conditions": node_info.get("conditions", {}),
                "existing_actions": node_info.get("actions", {}),
                "existing_outcomes": node_info.get("outcomes", {}),
                "parent_context": node_info.get("parent_node"),
                "existing_edges": node_info.get("existing_edges", []),
                "tree_type": node_info.get("tree_type", ""),
                "user_context": context or {}
            }
            
            # If this is a decision node, analyze conditions
            if node_info["node_type"] == "decision":
                context_analysis["decision_factors"] = await self._analyze_decision_factors(
                    node_info, context
                )
            
            # If this is an action node, analyze potential actions
            elif node_info["node_type"] == "action":
                context_analysis["action_options"] = await self._analyze_action_options(
                    node_info, context
                )
            
            return context_analysis
            
        except Exception as e:
            logger.error(f"Failed to analyze context: {e}")
            return {}
    
    async def _analyze_decision_factors(
        self,
        node_info: Dict[str, Any],
        context: Optional[Dict[str, Any]]
    ) -> List[str]:
        """Analyze factors influencing decision"""
        try:
            factors = []
            
            # Extract factors from conditions
            conditions = node_info.get("conditions", {})
            if conditions:
                for key, value in conditions.items():
                    factors.append(f"{key}: {value}")
            
            # Add tree-specific factors
            tree_type = node_info.get("tree_type", "")
            if tree_type == "legal_scenario":
                factors.extend([
                    "Legal compliance requirements",
                    "Regulatory constraints",
                    "Risk assessment factors",
                    "Stakeholder interests"
                ])
            elif tree_type == "decision_process":
                factors.extend([
                    "Resource availability",
                    "Time constraints",
                    "Budget considerations",
                    "Team capabilities"
                ])
            
            return factors
            
        except Exception as e:
            logger.error(f"Failed to analyze decision factors: {e}")
            return []
    
    async def _analyze_action_options(
        self,
        node_info: Dict[str, Any],
        context: Optional[Dict[str, Any]]
    ) -> List[str]:
        """Analyze potential action options"""
        try:
            options = []
            
            # Extract options from actions
            actions = node_info.get("actions", {})
            if actions:
                for key, value in actions.items():
                    options.append(f"{key}: {value}")
            
            # Add context-specific options
            if context:
                for key, value in context.items():
                    if key in ["resources", "constraints", "objectives"]:
                        options.append(f"{key}: {value}")
            
            return options
            
        except Exception as e:
            logger.error(f"Failed to analyze action options: {e}")
            return []
    
    async def _generate_scenario_options(
        self,
        node_info: Dict[str, Any],
        context_analysis: Dict[str, Any],
        user_id: int
    ) -> List[ScenarioOption]:
        """Generate scenario options using AI"""
        try:
            # Build prompt for AI
            prompt = self._build_scenario_prompt(node_info, context_analysis)
            
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
            
            # Create scenario options
            scenarios = []
            for option_data in result.get("scenarios", []):
                scenario = ScenarioOption(
                    option_letter=option_data.get("option_letter", ""),
                    title=option_data.get("title", ""),
                    description=option_data.get("description", ""),
                    probability=option_data.get("probability", 0.0),
                    potential_outcome=option_data.get("potential_outcome", ""),
                    reasoning=option_data.get("reasoning", ""),
                    risk_level=option_data.get("risk_level", "medium"),
                    legal_implications=option_data.get("legal_implications", [])
                )
                scenarios.append(scenario)
            
            return scenarios
            
        except Exception as e:
            logger.error(f"Failed to generate scenario options: {e}")
            raise
    
    def _build_scenario_prompt(
        self,
        node_info: Dict[str, Any],
        context_analysis: Dict[str, Any]
    ) -> str:
        """Build prompt for scenario generation"""
        return f"""
        Generate {self.max_scenarios} scenario options (A, B, C) for the following decision tree node.
        
        NODE INFORMATION:
        Title: {node_info['title']}
        Description: {node_info['description']}
        Type: {node_info['node_type']}
        Content: {node_info.get('content', '')}
        
        CONTEXT ANALYSIS:
        Node Type: {context_analysis.get('node_type', '')}
        Tree Type: {context_analysis.get('tree_type', '')}
        Existing Conditions: {context_analysis.get('existing_conditions', {})}
        Existing Actions: {context_analysis.get('existing_actions', {})}
        Decision Factors: {context_analysis.get('decision_factors', [])}
        
        Generate scenarios in the following JSON format:
        {{
            "scenarios": [
                {{
                    "option_letter": "A",
                    "title": "Clear, concise title for the scenario",
                    "description": "Detailed description of what this scenario entails",
                    "probability": 0.35,
                    "potential_outcome": "Most likely outcome if this scenario is chosen",
                    "reasoning": "Legal and logical reasoning behind this scenario",
                    "risk_level": "low|medium|high",
                    "legal_implications": ["List of legal implications"]
                }},
                {{
                    "option_letter": "B",
                    "title": "Second scenario title",
                    "description": "Second scenario description",
                    "probability": 0.40,
                    "potential_outcome": "Most likely outcome for this scenario",
                    "reasoning": "Reasoning for this scenario",
                    "risk_level": "medium",
                    "legal_implications": ["Legal implications for scenario B"]
                }},
                {{
                    "option_letter": "C",
                    "title": "Third scenario title",
                    "description": "Third scenario description",
                    "probability": 0.25,
                    "potential_outcome": "Most likely outcome for this scenario",
                    "reasoning": "Reasoning for this scenario",
                    "risk_level": "high",
                    "legal_implications": ["Legal implications for scenario C"]
                }}
            ]
        }}
        
        Guidelines:
        1. Ensure probabilities sum to 1.0 (or close to it)
        2. Each scenario should be distinct and viable
        3. Consider legal implications and risks
        4. Provide realistic outcomes based on the context
        5. Include practical reasoning for each option
        6. Assess risk levels accurately
        """
    
    def _get_system_prompt(self) -> str:
        """Get system prompt for scenario generation"""
        return """
        You are an expert legal analyst and decision strategist with deep knowledge of Uzbekistan law.
        You specialize in generating realistic scenario options for legal decision trees.
        
        Your scenarios should be:
        - Legally sound and well-reasoned
        - Practically viable and realistic
        - Comprehensive in their analysis
        - Clear in their implications and outcomes
        - Accurate in risk assessment
        
        Always consider:
        - Legal compliance requirements
        - Regulatory constraints
        - Practical implementation challenges
        - Risk factors and mitigation strategies
        - Stakeholder interests and impacts
        """
    
    def _validate_probabilities(self, scenarios: List[ScenarioOption]) -> List[ScenarioOption]:
        """Validate and adjust scenario probabilities"""
        try:
            if not scenarios:
                return scenarios
            
            # Ensure probabilities sum to 1.0
            total_probability = sum(s.probability for s in scenarios)
            
            if total_probability == 0:
                # Equal distribution if no probabilities
                equal_prob = 1.0 / len(scenarios)
                for scenario in scenarios:
                    scenario.probability = equal_prob
            elif abs(total_probability - 1.0) > 0.1:
                # Normalize if sum is too far from 1.0
                for scenario in scenarios:
                    scenario.probability = scenario.probability / total_probability
            
            # Ensure minimum probability
            for scenario in scenarios:
                if scenario.probability < self.min_probability:
                    scenario.probability = self.min_probability
            
            # Re-normalize after minimum adjustment
            total_probability = sum(s.probability for s in scenarios)
            if total_probability != 1.0:
                for scenario in scenarios:
                    scenario.probability = scenario.probability / total_probability
            
            return scenarios
            
        except Exception as e:
            logger.error(f"Failed to validate probabilities: {e}")
            return scenarios
    
    async def _generate_analysis_summary(
        self,
        node_info: Dict[str, Any],
        scenarios: List[ScenarioOption]
    ) -> str:
        """Generate analysis summary for scenarios"""
        try:
            scenarios_summary = []
            for scenario in scenarios:
                scenarios_summary.append(f"""
                {scenario.option_letter}. {scenario.title}
                - Probability: {scenario.probability:.2f}
                - Risk Level: {scenario.risk_level}
                - Outcome: {scenario.potential_outcome}
                - Key Legal Implications: {', '.join(scenario.legal_implications[:3])}
                """)
            
            prompt = f"""
            Analyze the following decision node and generated scenarios:
            
            Node: {node_info['title']}
            Type: {node_info['node_type']}
            
            Scenarios:
            {''.join(scenarios_summary)}
            
            Provide a concise analysis summary covering:
            1. Overall assessment of the decision point
            2. Key factors influencing the scenarios
            3. Risk considerations
            4. Strategic recommendations
            
            Keep it under 200 words and focus on actionable insights.
            """
            
            response = await self.openai_client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a strategic legal analyst."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.1
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Failed to generate analysis summary: {e}")
            return "Analysis summary unavailable."
    
    async def _determine_recommended_path(self, scenarios: List[ScenarioOption]) -> str:
        """Determine the recommended path based on scenarios"""
        try:
            if not scenarios:
                return "No recommendation available."
            
            # Find scenario with best risk-reward ratio
            best_scenario = None
            best_score = -1
            
            for scenario in scenarios:
                # Calculate score based on probability and risk
                risk_multiplier = {
                    "low": 1.0,
                    "medium": 0.7,
                    "high": 0.4
                }.get(scenario.risk_level, 0.5)
                
                score = scenario.probability * risk_multiplier
                if score > best_score:
                    best_score = score
                    best_scenario = scenario
            
            if best_scenario:
                return f"""
                Recommended: Option {best_scenario.option_letter} - {best_scenario.title}
                Reasoning: {best_scenario.reasoning[:100]}...
                Confidence: {best_scenario.probability:.2f}
                """
            
            return "No clear recommendation available."
            
        except Exception as e:
            logger.error(f"Failed to determine recommended path: {e}")
            return "Recommendation unavailable."
    
    def _calculate_confidence_score(self, scenarios: List[ScenarioOption]) -> float:
        """Calculate confidence score for scenario generation"""
        try:
            if not scenarios:
                return 0.0
            
            # Factors affecting confidence
            factors = {
                "scenario_count": min(len(scenarios) / 3.0, 1.0),  # Ideal is 3 scenarios
                "probability_distribution": self._calculate_probability_distribution_score(scenarios),
                "risk_diversity": self._calculate_risk_diversity_score(scenarios),
                "content_quality": 0.8  # Assume good quality from AI
            }
            
            # Weighted average
            weights = {
                "scenario_count": 0.2,
                "probability_distribution": 0.3,
                "risk_diversity": 0.2,
                "content_quality": 0.3
            }
            
            confidence = sum(factors[key] * weights[key] for key in factors)
            return min(confidence, 1.0)
            
        except Exception as e:
            logger.error(f"Failed to calculate confidence score: {e}")
            return 0.5
    
    def _calculate_probability_distribution_score(self, scenarios: List[ScenarioOption]) -> float:
        """Calculate how well probabilities are distributed"""
        try:
            if not scenarios:
                return 0.0
            
            probabilities = [s.probability for s in scenarios]
            
            # Check for reasonable distribution (not too skewed)
            max_prob = max(probabilities)
            min_prob = min(probabilities)
            
            # Ideal distribution has some variation but not extreme
            if max_prob - min_prob > 0.6:
                return 0.5  # Too skewed
            elif max_prob - min_prob < 0.1:
                return 0.7  # Too equal
            else:
                return 1.0  # Good distribution
                
        except Exception as e:
            logger.error(f"Failed to calculate probability distribution score: {e}")
            return 0.5
    
    def _calculate_risk_diversity_score(self, scenarios: List[ScenarioOption]) -> float:
        """Calculate risk level diversity"""
        try:
            if not scenarios:
                return 0.0
            
            risk_levels = set(s.risk_level for s in scenarios)
            
            # Good diversity includes different risk levels
            if len(risk_levels) >= 2:
                return 1.0
            elif len(risk_levels) == 1:
                return 0.6  # All same risk level
            else:
                return 0.0
                
        except Exception as e:
            logger.error(f"Failed to calculate risk diversity score: {e}")
            return 0.5
    
    async def save_what_if_scenario(
        self,
        user_id: int,
        node_id: int,
        scenario: ScenarioOption,
        base_case_id: Optional[int] = None
    ) -> bool:
        """Save scenario as what-if scenario"""
        try:
            db = next(get_db())
            
            # Create what-if scenario
            what_if = WhatIfScenario(
                name=f"Scenario {scenario.option_letter}: {scenario.title}",
                description=scenario.description,
                base_case_id=base_case_id,
                scenario_type="decision_tree_analysis",
                changed_facts={
                    "node_id": node_id,
                    "option_letter": scenario.option_letter,
                    "title": scenario.title
                },
                predicted_outcome=scenario.potential_outcome,
                confidence_score=scenario.probability,
                reasoning=scenario.reasoning,
                impact_assessment={
                    "risk_level": scenario.risk_level,
                    "legal_implications": scenario.legal_implications
                },
                created_by=user_id
            )
            
            db.add(what_if)
            db.commit()
            db.close()
            
            logger.info(f"Saved what-if scenario for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to save what-if scenario: {e}")
            return False
    
    async def get_user_scenario_history(
        self,
        user_id: int,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get user's scenario generation history"""
        try:
            db = next(get_db())
            
            scenarios = db.query(WhatIfScenario).filter(
                WhatIfScenario.created_by == user_id
            ).order_by(WhatIfScenario.created_at.desc()).limit(limit).all()
            
            history = []
            for scenario in scenarios:
                history.append({
                    "id": scenario.id,
                    "name": scenario.name,
                    "description": scenario.description,
                    "scenario_type": scenario.scenario_type,
                    "predicted_outcome": scenario.predicted_outcome,
                    "confidence_score": scenario.confidence_score,
                    "created_at": scenario.created_at.isoformat()
                })
            
            db.close()
            return history
            
        except Exception as e:
            logger.error(f"Failed to get scenario history: {e}")
            return []
    
    async def health_check(self) -> str:
        """Check scenario generator health"""
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
            logger.error(f"Scenario generator health check failed: {e}")
            return "unhealthy"
    
    async def get_stats(self) -> Dict[str, Any]:
        """Get scenario generator statistics"""
        try:
            db = next(get_db())
            
            total_scenarios = db.query(WhatIfScenario).count()
            
            # Get scenario type distribution
            scenario_types = db.query(WhatIfScenario.scenario_type, func.count(WhatIfScenario.id)).group_by(WhatIfScenario.scenario_type).all()
            
            db.close()
            
            return {
                "total_scenarios": total_scenarios,
                "scenario_types": dict(scenario_types),
                "max_scenarios_per_request": self.max_scenarios,
                "min_probability_threshold": self.min_probability,
                "ai_model": settings.OPENAI_MODEL
            }
            
        except Exception as e:
            logger.error(f"Failed to get scenario stats: {e}")
            return {}
