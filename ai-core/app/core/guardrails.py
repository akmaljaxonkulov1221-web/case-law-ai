"""
AI Guardrails System
Protects AI services from edge cases and abuse
"""

import asyncio
import logging
import re
import time
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
from enum import Enum

from app.core.config import settings

logger = logging.getLogger(__name__)

class GuardrailLevel(Enum):
    """Guardrail severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class GuardrailType(Enum):
    """Types of guardrails"""
    INPUT_VALIDATION = "input_validation"
    CONTENT_FILTER = "content_filter"
    RATE_LIMITING = "rate_limiting"
    ERROR_HANDLING = "error_handling"
    RESOURCE_LIMITS = "resource_limits"
    SECURITY_CHECK = "security_check"

@dataclass
class GuardrailViolation:
    """Guardrail violation details"""
    type: GuardrailType
    level: GuardrailLevel
    message: str
    details: Dict[str, Any]
    timestamp: float
    user_id: Optional[str] = None
    session_id: Optional[str] = None

class InputValidator:
    """Validates user inputs for AI services"""
    
    @staticmethod
    def validate_case_text(text: str) -> List[GuardrailViolation]:
        """Validate case text input"""
        violations = []
        
        # Check minimum length
        if len(text) < 10:
            violations.append(GuardrailViolation(
                type=GuardrailType.INPUT_VALIDATION,
                level=GuardrailLevel.HIGH,
                message="Case text too short",
                details={"min_length": 10, "actual_length": len(text)},
                timestamp=time.time()
            ))
        
        # Check maximum length
        if len(text) > 10000:
            violations.append(GuardrailViolation(
                type=GuardrailType.INPUT_VALIDATION,
                level=GuardrailLevel.MEDIUM,
                message="Case text too long",
                details={"max_length": 10000, "actual_length": len(text)},
                timestamp=time.time()
            ))
        
        # Check for suspicious patterns
        suspicious_patterns = [
            r'<script.*?>.*?</script>',  # Script tags
            r'javascript:',              # JavaScript URLs
            r'data:',                   # Data URLs
            r'file:',                   # File URLs
            r'ftp:',                    # FTP URLs
        ]
        
        for pattern in suspicious_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                violations.append(GuardrailViolation(
                    type=GuardrailType.SECURITY_CHECK,
                    level=GuardrailLevel.CRITICAL,
                    message="Suspicious content detected",
                    details={"pattern": pattern},
                    timestamp=time.time()
                ))
        
        # Check for personal information
        personal_info_patterns = [
            r'\b\d{4}-\d{4}-\d{4}-\d{4}\b',  # Credit card numbers
            r'\b\d{3}-\d{2}-\d{4}\b',        # SSN-like numbers
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',  # Email addresses
            r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b',  # IP addresses
        ]
        
        for pattern in personal_info_patterns:
            if re.search(pattern, text):
                violations.append(GuardrailViolation(
                    type=GuardrailType.SECURITY_CHECK,
                    level=GuardrailLevel.MEDIUM,
                    message="Personal information detected",
                    details={"pattern": pattern},
                    timestamp=time.time()
                ))
        
        # Check for empty or whitespace-only content
        if not text.strip():
            violations.append(GuardrailViolation(
                type=GuardrailType.INPUT_VALIDATION,
                level=GuardrailLevel.HIGH,
                message="Empty or whitespace-only input",
                details={},
                timestamp=time.time()
            ))
        
        return violations
    
    @staticmethod
    def validate_node_id(node_id: int) -> List[GuardrailViolation]:
        """Validate decision tree node ID"""
        violations = []
        
        if node_id <= 0:
            violations.append(GuardrailViolation(
                type=GuardrailType.INPUT_VALIDATION,
                level=GuardrailLevel.HIGH,
                message="Invalid node ID",
                details={"node_id": node_id},
                timestamp=time.time()
            ))
        
        if node_id > 1000000:  # Reasonable upper limit
            violations.append(GuardrailViolation(
                type=GuardrailType.INPUT_VALIDATION,
                level=GuardrailLevel.MEDIUM,
                message="Node ID too large",
                details={"node_id": node_id, "max_allowed": 1000000},
                timestamp=time.time()
            ))
        
        return violations
    
    @staticmethod
    def validate_user_id(user_id: int) -> List[GuardrailViolation]:
        """Validate user ID"""
        violations = []
        
        if user_id <= 0:
            violations.append(GuardrailViolation(
                type=GuardrailType.INPUT_VALIDATION,
                level=GuardrailLevel.HIGH,
                message="Invalid user ID",
                details={"user_id": user_id},
                timestamp=time.time()
            ))
        
        return violations

class ContentFilter:
    """Filters inappropriate content"""
    
    INAPPROPRIATE_WORDS = [
        # Add inappropriate words in Uzbek and English
        # This is a placeholder - in production, use comprehensive lists
        "spam", "abuse", "hate", "violence"
    ]
    
    @staticmethod
    def filter_content(text: str) -> List[GuardrailViolation]:
        """Filter content for inappropriate material"""
        violations = []
        
        text_lower = text.lower()
        
        # Check for inappropriate words
        for word in ContentFilter.INAPPROPRIATE_WORDS:
            if word in text_lower:
                violations.append(GuardrailViolation(
                    type=GuardrailType.CONTENT_FILTER,
                    level=GuardrailLevel.MEDIUM,
                    message="Inappropriate content detected",
                    details={"word": word},
                    timestamp=time.time()
                ))
        
        # Check for excessive repetition
        words = text.split()
        word_counts = {}
        for word in words:
            word_counts[word] = word_counts.get(word, 0) + 1
        
        for word, count in word_counts.items():
            if count > len(words) * 0.3:  # More than 30% repetition
                violations.append(GuardrailViolation(
                    type=GuardrailType.CONTENT_FILTER,
                    level=GuardrailLevel.LOW,
                    message="Excessive repetition detected",
                    details={"word": word, "count": count, "threshold": len(words) * 0.3},
                    timestamp=time.time()
                ))
        
        return violations

class RateLimiter:
    """Rate limiting for API requests"""
    
    def __init__(self):
        self.requests = {}  # user_id -> list of timestamps
        self.limits = {
            "irac_solver": {"requests": 10, "window": 60},  # 10 requests per minute
            "scenario_generator": {"requests": 5, "window": 60},  # 5 requests per minute
            "weakness_detector": {"requests": 3, "window": 60},  # 3 requests per minute
        }
    
    def check_rate_limit(self, user_id: str, service: str) -> List[GuardrailViolation]:
        """Check if user exceeds rate limits"""
        violations = []
        current_time = time.time()
        
        if user_id not in self.requests:
            self.requests[user_id] = {}
        
        if service not in self.requests[user_id]:
            self.requests[user_id][service] = []
        
        # Remove old requests outside the window
        window_start = current_time - self.limits[service]["window"]
        self.requests[user_id][service] = [
            req_time for req_time in self.requests[user_id][service]
            if req_time > window_start
        ]
        
        # Check current request count
        request_count = len(self.requests[user_id][service])
        
        if request_count >= self.limits[service]["requests"]:
            violations.append(GuardrailViolation(
                type=GuardrailType.RATE_LIMITING,
                level=GuardrailLevel.MEDIUM,
                message="Rate limit exceeded",
                details={
                    "service": service,
                    "current_requests": request_count,
                    "limit": self.limits[service]["requests"],
                    "window": self.limits[service]["window"]
                },
                timestamp=current_time,
                user_id=user_id
            ))
        else:
            # Add current request
            self.requests[user_id][service].append(current_time)
        
        return violations

class ResourceMonitor:
    """Monitors resource usage"""
    
    def __init__(self):
        self.active_requests = 0
        self.max_concurrent_requests = settings.MAX_CONCURRENT_REQUESTS
    
    def check_resource_limits(self) -> List[GuardrailViolation]:
        """Check if system is at capacity"""
        violations = []
        
        if self.active_requests >= self.max_concurrent_requests:
            violations.append(GuardrailViolation(
                type=GuardrailType.RESOURCE_LIMITS,
                level=GuardrailLevel.HIGH,
                message="System at capacity",
                details={
                    "active_requests": self.active_requests,
                    "max_concurrent": self.max_concurrent_requests
                },
                timestamp=time.time()
            ))
        
        return violations
    
    def start_request(self):
        """Start tracking a request"""
        self.active_requests += 1
    
    def end_request(self):
        """End tracking a request"""
        if self.active_requests > 0:
            self.active_requests -= 1

class ErrorHandler:
    """Handles errors gracefully"""
    
    @staticmethod
    def handle_ai_error(error: Exception, context: str) -> Dict[str, Any]:
        """Handle AI service errors"""
        error_info = {
            "error_type": type(error).__name__,
            "message": str(error),
            "context": context,
            "timestamp": time.time()
        }
        
        # Log the error
        logger.error(f"AI Error in {context}: {error}")
        
        # Determine error severity and response
        if "openai" in str(error).lower() or "api" in str(error).lower():
            error_info["severity"] = "high"
            error_info["user_message"] = "AI service temporarily unavailable. Please try again later."
        elif "timeout" in str(error).lower():
            error_info["severity"] = "medium"
            error_info["user_message"] = "Request timed out. Please try again."
        elif "rate" in str(error).lower():
            error_info["severity"] = "low"
            error_info["user_message"] = "Too many requests. Please wait a moment."
        else:
            error_info["severity"] = "medium"
            error_info["user_message"] = "An error occurred. Please try again."
        
        return error_info

class GuardrailsSystem:
    """Main guardrails system"""
    
    def __init__(self):
        self.input_validator = InputValidator()
        self.content_filter = ContentFilter()
        self.rate_limiter = RateLimiter()
        self.resource_monitor = ResourceMonitor()
        self.error_handler = ErrorHandler()
        self.violations = []  # Track violations for monitoring
    
    def validate_irac_request(self, case_text: str, user_id: str) -> Dict[str, Any]:
        """Validate IRAC solver request"""
        violations = []
        
        # Input validation
        violations.extend(self.input_validator.validate_case_text(case_text))
        violations.extend(self.input_validator.validate_user_id(int(user_id)))
        
        # Content filtering
        violations.extend(self.content_filter.filter_content(case_text))
        
        # Rate limiting
        violations.extend(self.rate_limiter.check_rate_limit(user_id, "irac_solver"))
        
        # Resource limits
        violations.extend(self.resource_monitor.check_resource_limits())
        
        # Store violations
        for violation in violations:
            violation.user_id = user_id
            self.violations.append(violation)
        
        # Determine if request should be blocked
        critical_violations = [v for v in violations if v.level == GuardrailLevel.CRITICAL]
        high_violations = [v for v in violations if v.level == GuardrailLevel.HIGH]
        
        if critical_violations:
            return {
                "allowed": False,
                "violations": violations,
                "message": "Request blocked due to security concerns"
            }
        elif high_violations:
            return {
                "allowed": False,
                "violations": violations,
                "message": "Request blocked due to validation errors"
            }
        elif violations:
            return {
                "allowed": True,
                "violations": violations,
                "message": "Request allowed with warnings"
            }
        else:
            return {
                "allowed": True,
                "violations": [],
                "message": "Request allowed"
            }
    
    def validate_scenario_request(self, node_id: int, user_id: str) -> Dict[str, Any]:
        """Validate scenario generator request"""
        violations = []
        
        # Input validation
        violations.extend(self.input_validator.validate_node_id(node_id))
        violations.extend(self.input_validator.validate_user_id(int(user_id)))
        
        # Rate limiting
        violations.extend(self.rate_limiter.check_rate_limit(user_id, "scenario_generator"))
        
        # Resource limits
        violations.extend(self.resource_monitor.check_resource_limits())
        
        # Store violations
        for violation in violations:
            violation.user_id = user_id
            self.violations.append(violation)
        
        # Determine if request should be blocked
        critical_violations = [v for v in violations if v.level == GuardrailLevel.CRITICAL]
        high_violations = [v for v in violations if v.level == GuardrailLevel.HIGH]
        
        if critical_violations:
            return {
                "allowed": False,
                "violations": violations,
                "message": "Request blocked due to security concerns"
            }
        elif high_violations:
            return {
                "allowed": False,
                "violations": violations,
                "message": "Request blocked due to validation errors"
            }
        elif violations:
            return {
                "allowed": True,
                "violations": violations,
                "message": "Request allowed with warnings"
            }
        else:
            return {
                "allowed": True,
                "violations": [],
                "message": "Request allowed"
            }
    
    def validate_weakness_request(self, user_id: str, analysis_period: str) -> Dict[str, Any]:
        """Validate weakness detection request"""
        violations = []
        
        # Input validation
        violations.extend(self.input_validator.validate_user_id(int(user_id)))
        
        # Validate analysis period
        if not re.match(r'^\d+d$', analysis_period):
            violations.append(GuardrailViolation(
                type=GuardrailType.INPUT_VALIDATION,
                level=GuardrailLevel.MEDIUM,
                message="Invalid analysis period format",
                details={"period": analysis_period, "expected_format": "Xd"},
                timestamp=time.time(),
                user_id=user_id
            ))
        
        # Rate limiting
        violations.extend(self.rate_limiter.check_rate_limit(user_id, "weakness_detector"))
        
        # Resource limits
        violations.extend(self.resource_monitor.check_resource_limits())
        
        # Store violations
        for violation in violations:
            self.violations.append(violation)
        
        # Determine if request should be blocked
        critical_violations = [v for v in violations if v.level == GuardrailLevel.CRITICAL]
        high_violations = [v for v in violations if v.level == GuardrailLevel.HIGH]
        
        if critical_violations:
            return {
                "allowed": False,
                "violations": violations,
                "message": "Request blocked due to security concerns"
            }
        elif high_violations:
            return {
                "allowed": False,
                "violations": violations,
                "message": "Request blocked due to validation errors"
            }
        elif violations:
            return {
                "allowed": True,
                "violations": violations,
                "message": "Request allowed with warnings"
            }
        else:
            return {
                "allowed": True,
                "violations": [],
                "message": "Request allowed"
            }
    
    def handle_request_start(self):
        """Start tracking a request"""
        self.resource_monitor.start_request()
    
    def handle_request_end(self):
        """End tracking a request"""
        self.resource_monitor.end_request()
    
    def get_violations_summary(self) -> Dict[str, Any]:
        """Get summary of violations"""
        if not self.violations:
            return {"total_violations": 0, "by_type": {}, "by_level": {}}
        
        by_type = {}
        by_level = {}
        recent_violations = [v for v in self.violations if time.time() - v.timestamp < 3600]  # Last hour
        
        for violation in recent_violations:
            by_type[violation.type.value] = by_type.get(violation.type.value, 0) + 1
            by_level[violation.level.value] = by_level.get(violation.level.value, 0) + 1
        
        return {
            "total_violations": len(recent_violations),
            "by_type": by_type,
            "by_level": by_level,
            "recent_violations": recent_violations[-10:]  # Last 10 violations
        }

# Global guardrails instance
guardrails = GuardrailsSystem()
