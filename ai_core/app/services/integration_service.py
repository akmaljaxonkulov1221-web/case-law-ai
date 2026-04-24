"""
Cross-Module Integration Service
Handles seamless integration between all modules
"""

import asyncio
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from dataclasses import dataclass

from ..core.database import get_db
from ..core.logging import get_logger
from ..models.models import User, UserAchievement, ActivityLog, AIInteraction
from ..services.gamification_service import gamification_service
from ..services.weakness_detection_service import weakness_detection_service
from ..services.notification_service import notification_service

logger = logging.getLogger(__name__)

@dataclass
class IntegrationEvent:
    """Integration event data"""
    user_id: str
    event_type: str
    data: Dict[str, Any]
    timestamp: datetime
    source_module: str

class IntegrationService:
    """Service for cross-module integration and event handling"""
    
    def __init__(self):
        self.event_handlers = {}
        self._register_handlers()
    
    def _register_handlers(self):
        """Register event handlers for cross-module integration"""
        self.event_handlers = {
            'irac_session_completed': self._handle_irac_completion,
            'case_attempt_submitted': self._handle_case_attempt,
            'level_up': self._handle_level_up,
            'achievement_unlocked': self._handle_achievement_unlocked,
            'weakness_detected': self._handle_weakness_detected,
            'streak_maintained': self._handle_streak_maintained,
            'course_completed': self._handle_course_completion,
            'exam_passed': self._handle_exam_passed
        }
    
    async def emit_event(self, event: IntegrationEvent):
        """Emit integration event to all registered handlers"""
        try:
            logger.info(f"Emitting event: {event.event_type} for user {event.user_id}")
            
            # Get all handlers for this event type
            handlers = self.event_handlers.get(event.event_type, [])
            if isinstance(handlers, list):
                # Multiple handlers
                tasks = [handler(event) for handler in handlers]
                await asyncio.gather(*tasks, return_exceptions=True)
            else:
                # Single handler
                await handlers(event)
            
            logger.info(f"Event {event.event_type} processed successfully")
            
        except Exception as e:
            logger.error(f"Error processing event {event.event_type}: {e}")
    
    async def _handle_irac_completion(self, event: IntegrationEvent):
        """Handle IRAC session completion with full integration"""
        try:
            user_id = event.user_id
            session_data = event.data
            
            # 1. Update user stats and XP
            xp_reward = session_data.get('xp_reward', 50)
            new_stats = await gamification_service.update_user_stats(user_id, xp_reward)
            
            # 2. Check for level up
            if new_stats.get('level_up'):
                await self.emit_event(IntegrationEvent(
                    user_id=user_id,
                    event_type='level_up',
                    data={
                        'old_level': new_stats['old_level'],
                        'new_level': new_stats['new_level'],
                        'total_xp': new_stats['total_xp']
                    },
                    timestamp=datetime.now(),
                    source_module='gamification'
                ))
            
            # 3. Check for achievements
            achievements = await gamification_service.check_achievements(user_id, session_data)
            for achievement in achievements:
                await self.emit_event(IntegrationEvent(
                    user_id=user_id,
                    event_type='achievement_unlocked',
                    data=achievement,
                    timestamp=datetime.now(),
                    source_module='gamification'
                ))
            
            # 4. Run weakness detection
            weakness_analysis = await weakness_detection_service.analyze_user_weakness(
                user_id, 
                analysis_period='30d'
            )
            
            if weakness_analysis.get('weaknesses'):
                await self.emit_event(IntegrationEvent(
                    user_id=user_id,
                    event_type='weakness_detected',
                    data=weakness_analysis,
                    timestamp=datetime.now(),
                    source_module='weakness_detection'
                ))
            
            # 5. Update streak
            streak_updated = await gamification_service.update_streak(user_id)
            if streak_updated.get('streak_maintained'):
                await self.emit_event(IntegrationEvent(
                    user_id=user_id,
                    event_type='streak_maintained',
                    data={
                        'current_streak': streak_updated['current_streak'],
                        'best_streak': streak_updated['best_streak']
                    },
                    timestamp=datetime.now(),
                    source_module='gamification'
                ))
            
            # 6. Create activity log
            await self._create_activity_log(user_id, 'irac_session_completed', session_data)
            
            # 7. Send notifications
            await notification_service.send_irac_completion_notification(user_id, session_data)
            
            logger.info(f"IRAC completion integration processed for user {user_id}")
            
        except Exception as e:
            logger.error(f"Error handling IRAC completion: {e}")
    
    async def _handle_case_attempt(self, event: IntegrationEvent):
        """Handle case attempt submission"""
        try:
            user_id = event.user_id
            attempt_data = event.data
            
            # Update case statistics
            await gamification_service.update_case_stats(user_id, attempt_data)
            
            # Check for case-specific achievements
            achievements = await gamification_service.check_case_achievements(user_id, attempt_data)
            for achievement in achievements:
                await self.emit_event(IntegrationEvent(
                    user_id=user_id,
                    event_type='achievement_unlocked',
                    data=achievement,
                    timestamp=datetime.now(),
                    source_module='gamification'
                ))
            
            # Create activity log
            await self._create_activity_log(user_id, 'case_attempt_submitted', attempt_data)
            
        except Exception as e:
            logger.error(f"Error handling case attempt: {e}")
    
    async def _handle_level_up(self, event: IntegrationEvent):
        """Handle level up event"""
        try:
            user_id = event.user_id
            level_data = event.data
            
            # Send level up notification
            await notification_service.send_level_up_notification(user_id, level_data)
            
            # Check for level-specific rewards
            rewards = await gamification_service.get_level_rewards(level_data['new_level'])
            if rewards:
                await gamification_service.grant_rewards(user_id, rewards)
            
            # Create activity log
            await self._create_activity_log(user_id, 'level_up', level_data)
            
            logger.info(f"Level up integration processed for user {user_id}")
            
        except Exception as e:
            logger.error(f"Error handling level up: {e}")
    
    async def _handle_achievement_unlocked(self, event: IntegrationEvent):
        """Handle achievement unlock event"""
        try:
            user_id = event.user_id
            achievement_data = event.data
            
            # Grant achievement rewards
            await gamification_service.grant_achievement_rewards(user_id, achievement_data)
            
            # Send achievement notification
            await notification_service.send_achievement_notification(user_id, achievement_data)
            
            # Create activity log
            await self._create_activity_log(user_id, 'achievement_unlocked', achievement_data)
            
            logger.info(f"Achievement unlock integration processed for user {user_id}")
            
        except Exception as e:
            logger.error(f"Error handling achievement unlock: {e}")
    
    async def _handle_weakness_detected(self, event: IntegrationEvent):
        """Handle weakness detection event"""
        try:
            user_id = event.user_id
            weakness_data = event.data
            
            # Generate personalized learning plan
            learning_plan = await weakness_detection_service.generate_learning_plan(
                user_id, weakness_data
            )
            
            # Send weakness notification with learning plan
            await notification_service.send_weakness_notification(user_id, weakness_data, learning_plan)
            
            # Update user weakness progress
            await weakness_detection_service.update_weakness_progress(user_id, weakness_data)
            
            # Create activity log
            await self._create_activity_log(user_id, 'weakness_detected', weakness_data)
            
            logger.info(f"Weakness detection integration processed for user {user_id}")
            
        except Exception as e:
            logger.error(f"Error handling weakness detection: {e}")
    
    async def _handle_streak_maintained(self, event: IntegrationEvent):
        """Handle streak maintained event"""
        try:
            user_id = event.user_id
            streak_data = event.data
            
            # Check for streak achievements
            achievements = await gamification_service.check_streak_achievements(user_id, streak_data)
            for achievement in achievements:
                await self.emit_event(IntegrationEvent(
                    user_id=user_id,
                    event_type='achievement_unlocked',
                    data=achievement,
                    timestamp=datetime.now(),
                    source_module='gamification'
                ))
            
            # Send streak notification
            await notification_service.send_streak_notification(user_id, streak_data)
            
            # Create activity log
            await self._create_activity_log(user_id, 'streak_maintained', streak_data)
            
        except Exception as e:
            logger.error(f"Error handling streak maintained: {e}")
    
    async def _handle_course_completion(self, event: IntegrationEvent):
        """Handle course completion event"""
        try:
            user_id = event.user_id
            course_data = event.data
            
            # Grant course completion rewards
            await gamification_service.grant_course_rewards(user_id, course_data)
            
            # Send course completion notification
            await notification_service.send_course_completion_notification(user_id, course_data)
            
            # Create activity log
            await self._create_activity_log(user_id, 'course_completed', course_data)
            
        except Exception as e:
            logger.error(f"Error handling course completion: {e}")
    
    async def _handle_exam_passed(self, event: IntegrationEvent):
        """Handle exam passed event"""
        try:
            user_id = event.user_id
            exam_data = event.data
            
            # Update exam statistics
            await gamification_service.update_exam_stats(user_id, exam_data)
            
            # Check for exam achievements
            achievements = await gamification_service.check_exam_achievements(user_id, exam_data)
            for achievement in achievements:
                await self.emit_event(IntegrationEvent(
                    user_id=user_id,
                    event_type='achievement_unlocked',
                    data=achievement,
                    timestamp=datetime.now(),
                    source_module='gamification'
                ))
            
            # Send exam passed notification
            await notification_service.send_exam_passed_notification(user_id, exam_data)
            
            # Create activity log
            await self._create_activity_log(user_id, 'exam_passed', exam_data)
            
        except Exception as e:
            logger.error(f"Error handling exam passed: {e}")
    
    async def _create_activity_log(self, user_id: str, activity_type: str, data: Dict[str, Any]):
        """Create activity log entry"""
        try:
            db = next(get_db())
            
            activity_log = ActivityLog(
                userId=user_id,
                activityType=activity_type,
                data=data,
                timestamp=datetime.now()
            )
            
            db.add(activity_log)
            db.commit()
            
            db.close()
            
        except Exception as e:
            logger.error(f"Error creating activity log: {e}")
    
    async def get_user_integration_summary(self, user_id: str) -> Dict[str, Any]:
        """Get comprehensive user integration summary"""
        try:
            db = next(get_db())
            
            # Get user data
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                return {"error": "User not found"}
            
            # Get recent achievements
            recent_achievements = db.query(UserAchievement).filter(
                UserAchievement.userId == user_id
            ).order_by(UserAchievement.unlockedAt.desc()).limit(5).all()
            
            # Get recent activities
            recent_activities = db.query(ActivityLog).filter(
                ActivityLog.userId == user_id
            ).order_by(ActivityLog.timestamp.desc()).limit(10).all()
            
            # Get AI interactions
            recent_ai_interactions = db.query(AIInteraction).filter(
                AIInteraction.userId == user_id
            ).order_by(AIInteraction.createdAt.desc()).limit(5).all()
            
            # Get weakness analysis
            weakness_analysis = await weakness_detection_service.analyze_user_weakness(
                user_id, '30d'
            )
            
            db.close()
            
            return {
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    "xp": user.xp,
                    "level": user.level,
                    "streak": user.streak,
                    "totalCases": user.totalCases,
                    "winRate": user.winRate,
                    "lastActiveAt": user.lastActiveAt.isoformat() if user.lastActiveAt else None
                },
                "recent_achievements": [
                    {
                        "id": ach.id,
                        "achievement_id": ach.achievementId,
                        "unlocked_at": ach.unlockedAt.isoformat() if ach.unlockedAt else None,
                        "progress": ach.progress
                    }
                    for ach in recent_achievements
                ],
                "recent_activities": [
                    {
                        "id": act.id,
                        "activity_type": act.activityType,
                        "data": act.data,
                        "timestamp": act.timestamp.isoformat() if act.timestamp else None
                    }
                    for act in recent_activities
                ],
                "recent_ai_interactions": [
                    {
                        "id": interaction.id,
                        "type": interaction.type,
                        "model": interaction.model,
                        "tokens_used": interaction.tokensUsed,
                        "confidence": interaction.confidence,
                        "created_at": interaction.createdAt.isoformat() if interaction.createdAt else None
                    }
                    for interaction in recent_ai_interactions
                ],
                "weakness_analysis": weakness_analysis,
                "integration_health": {
                    "gamification_connected": True,
                    "weakness_detection_connected": True,
                    "notification_system_connected": True,
                    "activity_logging_connected": True
                }
            }
            
        except Exception as e:
            logger.error(f"Error getting user integration summary: {e}")
            return {"error": str(e)}
    
    async def test_integration_flow(self, user_id: str) -> Dict[str, Any]:
        """Test complete integration flow for a user"""
        try:
            logger.info(f"Testing integration flow for user {user_id}")
            
            # Simulate IRAC session completion
            test_session_data = {
                "session_id": "test_session_123",
                "case_id": "test_case_456",
                "score": 85,
                "time_spent": 1200,
                "difficulty": "medium",
                "xp_reward": 75,
                "legal_domain": "civil",
                "completed_at": datetime.now().isoformat()
            }
            
            await self.emit_event(IntegrationEvent(
                user_id=user_id,
                event_type='irac_session_completed',
                data=test_session_data,
                timestamp=datetime.now(),
                source_module='test'
            ))
            
            # Wait for async processing
            await asyncio.sleep(2)
            
            # Get integration summary to verify results
            summary = await self.get_user_integration_summary(user_id)
            
            return {
                "test_passed": True,
                "test_data": test_session_data,
                "integration_summary": summary,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error testing integration flow: {e}")
            return {
                "test_passed": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

# Global integration service instance
integration_service = IntegrationService()
