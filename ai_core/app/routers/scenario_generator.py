"""
Scenario Generator API Endpoints
FastAPI endpoints for decision tree scenario generation
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field

from ..core.database import get_db
from ..services.scenario_generator import ScenarioGenerator, ScenarioGeneration

router = APIRouter()

# Pydantic models
class ScenarioRequest(BaseModel):
    node_id: int = Field(..., description="Decision tree node ID")
    context: Optional[dict] = Field(None, description="Additional context for scenario generation")

class ScenarioResponse(BaseModel):
    success: bool
    generation: Optional[ScenarioGeneration] = None
    message: str

class ScenarioSaveRequest(BaseModel):
    node_id: int = Field(..., description="Decision tree node ID")
    option_letter: str = Field(..., regex="^[ABC]$", description="Scenario option letter")
    title: str = Field(..., description="Scenario title")
    description: str = Field(..., description="Scenario description")
    probability: float = Field(..., ge=0, le=1, description="Scenario probability")
    potential_outcome: str = Field(..., description="Potential outcome")
    reasoning: str = Field(..., description="Scenario reasoning")
    risk_level: str = Field(..., regex="^(low|medium|high)$", description="Risk level")
    legal_implications: List[str] = Field(..., description="Legal implications")
    base_case_id: Optional[int] = Field(None, description="Base case ID")

# Dependency injection
async def get_scenario_generator() -> ScenarioGenerator:
    """Get scenario generator instance"""
    generator = ScenarioGenerator()
    if not generator.openai_client:
        await generator.initialize()
    return generator

@router.post("/generate", response_model=ScenarioResponse)
async def generate_scenarios(
    request: ScenarioRequest,
    user_id: int = 1,  # TODO: Get from JWT token
    db: Session = Depends(get_db),
    scenario_generator: ScenarioGenerator = Depends(get_scenario_generator)
):
    """
    Generate scenarios for a decision tree node
    
    - **node_id**: Decision tree node ID
    - **context**: Additional context for generation
    """
    try:
        # Validate node exists
        from app.models.models import DecisionTreeNode
        node = db.query(DecisionTreeNode).filter(
            DecisionTreeNode.id == request.node_id,
            DecisionTreeNode.is_active == True
        ).first()
        
        if not node:
            raise HTTPException(
                status_code=404,
                detail="Decision tree node not found"
            )
        
        # Generate scenarios
        generation = await scenario_generator.generate_scenarios(
            node_id=request.node_id,
            user_id=user_id,
            context=request.context
        )
        
        return ScenarioResponse(
            success=True,
            generation=generation,
            message="Scenarios generated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.post("/save", response_model=dict)
async def save_scenario(
    request: ScenarioSaveRequest,
    user_id: int = 1,  # TODO: Get from JWT token
    scenario_generator: ScenarioGenerator = Depends(get_scenario_generator)
):
    """Save scenario as what-if scenario"""
    try:
        # Create scenario option object
        from ..services.scenario_generator import ScenarioOption
        
        scenario_option = ScenarioOption(
            option_letter=request.option_letter,
            title=request.title,
            description=request.description,
            probability=request.probability,
            potential_outcome=request.potential_outcome,
            reasoning=request.reasoning,
            risk_level=request.risk_level,
            legal_implications=request.legal_implications
        )
        
        # Save scenario
        success = await scenario_generator.save_what_if_scenario(
            user_id=user_id,
            node_id=request.node_id,
            scenario=scenario_option,
            base_case_id=request.base_case_id
        )
        
        if not success:
            raise HTTPException(
                status_code=500,
                detail="Failed to save scenario"
            )
        
        return {
            "success": True,
            "message": "Scenario saved successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Save failed: {str(e)}")

@router.get("/history", response_model=List[dict])
async def get_scenario_history(
    limit: int = 10,
    user_id: int = 1,  # TODO: Get from JWT token
    scenario_generator: ScenarioGenerator = Depends(get_scenario_generator)
):
    """Get user's scenario generation history"""
    try:
        if limit > 50:
            limit = 50
        
        history = await scenario_generator.get_user_scenario_history(user_id, limit)
        return history
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get history: {str(e)}")

@router.get("/node/{node_id}")
async def get_node_info(
    node_id: int,
    db: Session = Depends(get_db)
):
    """Get decision tree node information"""
    try:
        from ..models.models import DecisionTreeNode, DecisionTree, DecisionTreeEdge
        
        # Get node with tree information
        node = db.query(DecisionTreeNode).filter(
            DecisionTreeNode.id == node_id,
            DecisionTreeNode.is_active == True
        ).first()
        
        if not node:
            raise HTTPException(
                status_code=404,
                detail="Decision tree node not found"
            )
        
        # Get tree information
        tree = db.query(DecisionTree).filter(
            DecisionTree.id == node.tree_id
        ).first()
        
        # Get outgoing edges
        edges = db.query(DecisionTreeEdge).filter(
            DecisionTreeEdge.from_node_id == node_id
        ).all()
        
        # Get parent node
        parent_node = None
        if node.parent_node_id:
            parent_node = db.query(DecisionTreeNode).filter(
                DecisionTreeNode.id == node.parent_node_id
            ).first()
        
        return {
            "id": node.id,
            "title": node.title,
            "description": node.description,
            "content": node.content,
            "node_type": node.node_type,
            "conditions": node.conditions or {},
            "actions": node.actions or {},
            "outcomes": node.outcomes or {},
            "position_x": node.position_x,
            "position_y": node.position_y,
            "node_color": node.node_color,
            "node_shape": node.node_shape,
            "tree": {
                "id": tree.id,
                "name": tree.name,
                "description": tree.description,
                "tree_type": tree.tree_type,
                "is_public": tree.is_public
            } if tree else None,
            "parent_node": {
                "id": parent_node.id,
                "title": parent_node.title,
                "description": parent_node.description
            } if parent_node else None,
            "outgoing_edges": [
                {
                    "id": edge.id,
                    "label": edge.label,
                    "condition": edge.condition,
                    "probability": edge.probability,
                    "to_node_id": edge.to_node_id,
                    "edge_type": edge.edge_type,
                    "edge_color": edge.edge_color
                }
                for edge in edges
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get node info: {str(e)}")

@router.get("/tree/{tree_id}/nodes")
async def get_tree_nodes(
    tree_id: int,
    db: Session = Depends(get_db)
):
    """Get all nodes in a decision tree"""
    try:
        from app.models.models import DecisionTreeNode, DecisionTree
        
        # Verify tree exists
        tree = db.query(DecisionTree).filter(
            DecisionTree.id == tree_id
        ).first()
        
        if not tree:
            raise HTTPException(
                status_code=404,
                detail="Decision tree not found"
            )
        
        # Get all nodes
        nodes = db.query(DecisionTreeNode).filter(
            DecisionTreeNode.tree_id == tree_id,
            DecisionTreeNode.is_active == True
        ).order_by(DecisionTreeNode.sort_order).all()
        
        return {
            "tree": {
                "id": tree.id,
                "name": tree.name,
                "description": tree.description,
                "tree_type": tree.tree_type,
                "is_public": tree.is_public,
                "status": tree.status
            },
            "nodes": [
                {
                    "id": node.id,
                    "title": node.title,
                    "description": node.description,
                    "node_type": node.node_type,
                    "position_x": node.position_x,
                    "position_y": node.position_y,
                    "node_color": node.node_color,
                    "node_shape": node.node_shape,
                    "parent_node_id": node.parent_node_id,
                    "sort_order": node.sort_order,
                    "conditions": node.conditions or {},
                    "actions": node.actions or {},
                    "outcomes": node.outcomes or {}
                }
                for node in nodes
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get tree nodes: {str(e)}")

@router.get("/tree-types", response_model=List[str])
async def get_tree_types():
    """Get available decision tree types"""
    return [
        "legal_scenario",
        "case_flow",
        "decision_process",
        "what_if_analysis"
    ]

@router.get("/node-types", response_model=List[str])
async def get_node_types():
    """Get available decision tree node types"""
    return [
        "start",
        "decision",
        "action",
        "outcome",
        "info",
        "question",
        "condition"
    ]

@router.get("/risk-levels", response_model=List[str])
async def get_risk_levels():
    """Get available risk levels"""
    return [
        "low",
        "medium",
        "high"
    ]

@router.get("/stats")
async def get_scenario_stats(
    scenario_generator: ScenarioGenerator = Depends(get_scenario_generator)
):
    """Get scenario generator statistics"""
    try:
        stats = await scenario_generator.get_stats()
        return {
            "success": True,
            "stats": stats
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

@router.get("/health")
async def health_check(
    scenario_generator: ScenarioGenerator = Depends(get_scenario_generator)
):
    """Check scenario generator health"""
    try:
        status = await scenario_generator.health_check()
        return {
            "status": status,
            "service": "Scenario Generator"
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "Scenario Generator",
            "error": str(e)
        }
