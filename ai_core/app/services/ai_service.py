"""
Main AI Service
Coordinates all AI services and provides unified interface
"""

import asyncio
import logging
from typing import Dict, Any

from ..core.config import settings
from ..core.rag_service import RAGService
from ..services.irac_solver import IRACSolverAgent
from ..services.scenario_generator import ScenarioGenerator
from ..services.weakness_detector import WeaknessDetector

logger = logging.getLogger(__name__)

class AIService:
    """Main AI service coordinator"""
    
    def __init__(self):
        self.rag_service = None
        self.irac_solver = None
        self.scenario_generator = None
        self.weakness_detector = None
        self.initialized = False
        
    async def initialize(self):
        """Initialize all AI services"""
        try:
            logger.info("Initializing AI services...")
            
            # Initialize RAG service first (others depend on it)
            self.rag_service = RAGService()
            await self.rag_service.initialize()
            
            # Initialize other services
            self.irac_solver = IRACSolverAgent(self.rag_service)
            await self.irac_solver.initialize()
            
            self.scenario_generator = ScenarioGenerator()
            await self.scenario_generator.initialize()
            
            self.weakness_detector = WeaknessDetector()
            await self.weakness_detector.initialize()
            
            self.initialized = True
            logger.info("All AI services initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize AI services: {e}")
            raise
    
    async def health_check(self) -> str:
        """Check health of all AI services"""
        if not self.initialized:
            return "not_initialized"
        
        try:
            health_checks = []
            
            if self.rag_service:
                health_checks.append(await self.rag_service.health_check())
            
            if self.irac_solver:
                health_checks.append(await self.irac_solver.health_check())
            
            if self.scenario_generator:
                health_checks.append(await self.scenario_generator.health_check())
            
            if self.weakness_detector:
                health_checks.append(await self.weakness_detector.health_check())
            
            # Overall health
            if all(check == "healthy" for check in health_checks):
                return "healthy"
            elif any(check == "unhealthy" for check in health_checks):
                return "unhealthy"
            else:
                return "degraded"
                
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return "error"
    
    async def get_stats(self) -> Dict[str, Any]:
        """Get statistics from all AI services"""
        if not self.initialized:
            return {"status": "not_initialized"}
        
        try:
            stats = {
                "status": "healthy",
                "services": {}
            }
            
            if self.rag_service:
                stats["services"]["rag"] = await self.rag_service.get_stats()
            
            if self.irac_solver:
                stats["services"]["irac_solver"] = await self.irac_solver.get_stats()
            
            if self.scenario_generator:
                stats["services"]["scenario_generator"] = await self.scenario_generator.get_stats()
            
            if self.weakness_detector:
                stats["services"]["weakness_detector"] = await self.weakness_detector.get_stats()
            
            return stats
            
        except Exception as e:
            logger.error(f"Failed to get AI stats: {e}")
            return {"status": "error", "error": str(e)}
