"""
Error Handling System
Graceful error handling with beautiful error messages
"""

import asyncio
import logging
import traceback
from typing import Dict, Any, Optional, Union, List
from datetime import datetime
from enum import Enum
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from ..core.logging import get_logger

logger = logging.getLogger(__name__)

class ErrorSeverity(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ErrorCategory(Enum):
    VALIDATION = "validation"
    DATABASE = "database"
    AI_SERVICE = "ai_service"
    AUTHENTICATION = "authentication"
    AUTHORIZATION = "authorization"
    NETWORK = "network"
    SYSTEM = "system"
    USER_INPUT = "user_input"

class ErrorContext(BaseModel):
    """Error context information"""
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    request_id: Optional[str] = None
    endpoint: Optional[str] = None
    method: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    timestamp: datetime
    additional_data: Dict[str, Any] = {}

class BeautifulError(BaseModel):
    """Beautiful error response model"""
    success: bool = False
    error_id: str
    message: str
    user_message: str
    category: str
    severity: str
    suggestions: List[str]
    help_links: List[Dict[str, str]]
    retry_allowed: bool
    context: Optional[Dict[str, Any]] = None

class ErrorHandler:
    """Centralized error handler with beautiful error messages"""
    
    def __init__(self):
        self.error_templates = self._load_error_templates()
        self.error_stats = {}
    
    def _load_error_templates(self) -> Dict[str, Dict[str, Any]]:
        """Load error message templates"""
        return {
            "validation": {
                "title": "Ma'lumotlar noto'g'ri kiritilgan",
                "user_message": "Iltimos, kiritilgan ma'lumotlarni tekshirib, qaytadan urinib ko'ring.",
                "suggestions": [
                    "Barcha majburiy maydonlarni to'ldiring",
                    "Ma'lumotlar to'g'ri formatda ekanligiga ishonch hosil qiling",
                    "Email manzilining to'g'ri yozilishini tekshiring"
                ],
                "help_links": [
                    {"title": "Qo'llanma", "url": "/help/validation"},
                    {"title": "FAQ", "url": "/faq"}
                ]
            },
            "database": {
                "title": "Ma'lumotlar bazasi xatosi",
                "user_message": "Ma'lumotlar bazasiga ulanishda muammo yuz berdi. Iltimos, birozdan so'ng qaytadan urinib ko'ring.",
                "suggestions": [
                    "Internet aloqangizni tekshiring",
                    "Biroz kutib, qaytadan urinib ko'ring",
                    "Agar muammo davom etsa, administrator bilan bog'laning"
                ],
                "help_links": [
                    {"title": "Tizim holati", "url": "/status"},
                    {"title": "Yordam", "url": "/support"}
                ]
            },
            "ai_service": {
                "title": "AI xizmatida xatolik",
                "user_message": "AI tahlili jarayonida xatolik yuz berdi. Iltimos, qisqaroq matn bilan qaytadan urinib ko'ring.",
                "suggestions": [
                    "Matn uzunligini 10 000 belgidan kam qiling",
                    "Matnni sodda tilda yozing",
                    "Maxsus belgilardan foydalanmang"
                ],
                "help_links": [
                    {"title": "AI qo'llanma", "url": "/help/ai"},
                    {"title": "Cheklovlar", "url": "/help/limits"}
                ]
            },
            "authentication": {
                "title": "Autentifikatsiya xatosi",
                "user_message": "Tizimga kirishda muammo yuz berdi. Iltimos, login va parolni tekshirib, qaytadan urinib ko'ring.",
                "suggestions": [
                    "Login va parolning to'g'ri yozilishini tekshiring",
                    "Parolni qayta tiklash imkoniyatidan foydalaning",
                    "Administrator bilan bog'laning"
                ],
                "help_links": [
                    {"title": "Parolni tiklash", "url": "/auth/reset-password"},
                    {"title": "Yordam", "url": "/support/auth"}
                ]
            },
            "authorization": {
                "title": "Ruxsat etilmagan harakat",
                "user_message": "Bu amalni bajarish uchun sizda yetarli ruxsat yo'q. Iltimos, administrator bilan bog'laning.",
                "suggestions": [
                    "O'zingizga tegishli bo'lgan bo'limlardan foydalaning",
                    "Administrator bilan ruxsat so'rang",
                    "To'g'ri akkauntdan foydalanayotganingizga ishonch hosil qiling"
                ],
                "help_links": [
                    {"title": "Ruxsatlar tizimi", "url": "/help/permissions"},
                    {"title": "Administrator", "url": "/contact/admin"}
                ]
            },
            "network": {
                "title": "Tarmoq xatosi",
                "user_message": "Tarmoq aloqasida muammo yuz berdi. Iltimos, internet aloqangizni tekshiring.",
                "suggestions": [
                    "Internet aloqangizni tekshiring",
                    "VPN yoki proksi serverdan foydalanayotgan bo'lsangiz, o'chirib ko'ring",
                    "Biroz kutib, qaytadan urinib ko'ring"
                ],
                "help_links": [
                    {"title": "Tizim talablari", "url": "/help/requirements"},
                    {"title": "Yordam", "url": "/support"}
                ]
            },
            "system": {
                "title": "Tizim xatosi",
                "user_message": "Tizimda vaqtinchalik muammo bor. Iltimos, birozdan so'ng qaytadan urinib ko'ring.",
                "suggestions": [
                    "Sahifani yangilang (F5 tugmasi)",
                    "Biroz kutib, qaytadan urinib ko'ring",
                    "Agar muammo davom etsa, administrator bilan bog'laning"
                ],
                "help_links": [
                    {"title": "Tizim holati", "url": "/status"},
                    {"title": "Yordam", "url": "/support"}
                ]
            },
            "user_input": {
                "title": "Noto'g'ri kiritilgan ma'lumot",
                "user_message": "Kiritilgan ma'lumotlarda xatolik bor. Iltimos, ma'lumotlarni tekshirib, qaytadan urinib ko'ring.",
                "suggestions": [
                    "Matnni to'g'ri formatda kiriting",
                    "Maxsus belgilardan foydalanmang",
                    "Ma'lumotlar uzunligini cheklang"
                ],
                "help_links": [
                    {"title": "Kiritish qoidalari", "url": "/help/input"},
                    {"title": "Misollar", "url": "/help/examples"}
                ]
            }
        }
    
    def create_beautiful_error(
        self,
        error: Exception,
        category: ErrorCategory,
        severity: ErrorSeverity,
        context: Optional[ErrorContext] = None,
        custom_message: Optional[str] = None
    ) -> BeautifulError:
        """Create beautiful error response"""
        try:
            error_id = f"ERR_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{id(error) % 10000:04d}"
            
            template = self.error_templates.get(category.value, self.error_templates["system"])
            
            # Use custom message if provided
            if custom_message:
                user_message = custom_message
            else:
                user_message = template["user_message"]
            
            # Create beautiful error
            beautiful_error = BeautifulError(
                error_id=error_id,
                message=str(error),
                user_message=user_message,
                category=category.value,
                severity=severity.value,
                suggestions=template["suggestions"],
                help_links=template["help_links"],
                retry_allowed=severity in [ErrorSeverity.LOW, ErrorSeverity.MEDIUM],
                context={
                    "timestamp": context.timestamp.isoformat() if context else datetime.now().isoformat(),
                    "user_id": context.user_id if context else None,
                    "session_id": context.session_id if context else None,
                    "endpoint": context.endpoint if context else None
                }
            )
            
            # Log error
            self._log_error(error, category, severity, context, error_id)
            
            # Update error stats
            self._update_error_stats(category, severity)
            
            return beautiful_error
            
        except Exception as e:
            logger.error(f"Error creating beautiful error: {e}")
            # Fallback error
            return BeautifulError(
                error_id="FALLBACK",
                message=str(error),
                user_message="Tizimda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
                category="system",
                severity="medium",
                suggestions=["Sahifani yangilang", "Qaytadan urinib ko'ring"],
                help_links=[{"title": "Yordam", "url": "/help"}],
                retry_allowed=True
            )
    
    def _log_error(
        self,
        error: Exception,
        category: ErrorCategory,
        severity: ErrorSeverity,
        context: Optional[ErrorContext],
        error_id: str
    ):
        """Log error with context"""
        try:
            log_data = {
                "error_id": error_id,
                "category": category.value,
                "severity": severity.value,
                "error_type": type(error).__name__,
                "error_message": str(error),
                "traceback": traceback.format_exc(),
                "context": context.dict() if context else None
            }
            
            if severity in [ErrorSeverity.HIGH, ErrorSeverity.CRITICAL]:
                logger.error(f"Critical error {error_id}: {log_data}")
            elif severity == ErrorSeverity.MEDIUM:
                logger.warning(f"Medium error {error_id}: {log_data}")
            else:
                logger.info(f"Low error {error_id}: {log_data}")
                
        except Exception as e:
            logger.error(f"Error logging error: {e}")
    
    def _update_error_stats(self, category: ErrorCategory, severity: ErrorSeverity):
        """Update error statistics"""
        try:
            key = f"{category.value}_{severity.value}"
            self.error_stats[key] = self.error_stats.get(key, 0) + 1
        except Exception as e:
            logger.error(f"Error updating stats: {e}")
    
    def get_error_stats(self) -> Dict[str, Any]:
        """Get error statistics"""
        return {
            "total_errors": sum(self.error_stats.values()),
            "errors_by_category_severity": self.error_stats,
            "last_updated": datetime.now().isoformat()
        }
    
    async def handle_validation_error(
        self,
        error: ValueError,
        context: Optional[ErrorContext] = None,
        field_name: Optional[str] = None
    ) -> BeautifulError:
        """Handle validation errors"""
        custom_message = None
        if field_name:
            custom_message = f"'{field_name}' maydonida xatolik: {str(error)}"
        
        return self.create_beautiful_error(
            error=error,
            category=ErrorCategory.VALIDATION,
            severity=ErrorSeverity.LOW,
            context=context,
            custom_message=custom_message
        )
    
    async def handle_database_error(
        self,
        error: Exception,
        context: Optional[ErrorContext] = None
    ) -> BeautifulError:
        """Handle database errors"""
        # Determine severity based on error type
        if "connection" in str(error).lower() or "timeout" in str(error).lower():
            severity = ErrorSeverity.HIGH
        else:
            severity = ErrorSeverity.MEDIUM
        
        return self.create_beautiful_error(
            error=error,
            category=ErrorCategory.DATABASE,
            severity=severity,
            context=context
        )
    
    async def handle_ai_service_error(
        self,
        error: Exception,
        context: Optional[ErrorContext] = None
    ) -> BeautifulError:
        """Handle AI service errors"""
        # Determine severity based on error type
        if "openai" in str(error).lower() or "api" in str(error).lower():
            severity = ErrorSeverity.HIGH
        elif "timeout" in str(error).lower():
            severity = ErrorSeverity.MEDIUM
        else:
            severity = ErrorSeverity.LOW
        
        return self.create_beautiful_error(
            error=error,
            category=ErrorCategory.AI_SERVICE,
            severity=severity,
            context=context
        )
    
    async def handle_auth_error(
        self,
        error: Exception,
        context: Optional[ErrorContext] = None
    ) -> BeautifulError:
        """Handle authentication errors"""
        return self.create_beautiful_error(
            error=error,
            category=ErrorCategory.AUTHENTICATION,
            severity=ErrorSeverity.MEDIUM,
            context=context
        )
    
    async def handle_permission_error(
        self,
        error: Exception,
        context: Optional[ErrorContext] = None
    ) -> BeautifulError:
        """Handle authorization errors"""
        return self.create_beautiful_error(
            error=error,
            category=ErrorCategory.AUTHORIZATION,
            severity=ErrorSeverity.MEDIUM,
            context=context
        )
    
    async def handle_network_error(
        self,
        error: Exception,
        context: Optional[ErrorContext] = None
    ) -> BeautifulError:
        """Handle network errors"""
        return self.create_beautiful_error(
            error=error,
            category=ErrorCategory.NETWORK,
            severity=ErrorSeverity.MEDIUM,
            context=context
        )
    
    async def handle_system_error(
        self,
        error: Exception,
        context: Optional[ErrorContext] = None
    ) -> BeautifulError:
        """Handle system errors"""
        return self.create_beautiful_error(
            error=error,
            category=ErrorCategory.SYSTEM,
            severity=ErrorSeverity.HIGH,
            context=context
        )
    
    async def handle_user_input_error(
        self,
        error: Exception,
        context: Optional[ErrorContext] = None,
        input_type: Optional[str] = None
    ) -> BeautifulError:
        """Handle user input errors"""
        custom_message = None
        if input_type:
            custom_message = f"{input_type} kiritishda xatolik: {str(error)}"
        
        return self.create_beautiful_error(
            error=error,
            category=ErrorCategory.USER_INPUT,
            severity=ErrorSeverity.LOW,
            context=context,
            custom_message=custom_message
        )

# Global error handler instance
error_handler = ErrorHandler()

# FastAPI exception handler
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Global exception handler for FastAPI"""
    try:
        # Create context from request
        context = ErrorContext(
            user_id=getattr(request.state, 'user_id', None),
            session_id=getattr(request.state, 'session_id', None),
            request_id=getattr(request.state, 'request_id', None),
            endpoint=str(request.url.path),
            method=request.method,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get('user-agent'),
            timestamp=datetime.now(),
            additional_data={
                "query_params": dict(request.query_params),
                "path_params": dict(request.path_params)
            }
        )
        
        # Handle different error types
        if isinstance(exc, HTTPException):
            # FastAPI HTTP exceptions
            beautiful_error = BeautifulError(
                error_id=f"HTTP_{exc.status_code}",
                message=exc.detail,
                user_message=exc.detail,
                category="system",
                severity="medium",
                suggestions=["Qaytadan urinib ko'ring"],
                help_links=[{"title": "Yordam", "url": "/help"}],
                retry_allowed=exc.status_code < 500
            )
        elif isinstance(exc, ValueError):
            beautiful_error = await error_handler.handle_validation_error(exc, context)
        elif "database" in str(exc).lower() or "sql" in str(exc).lower():
            beautiful_error = await error_handler.handle_database_error(exc, context)
        elif "openai" in str(exc).lower() or "ai" in str(exc).lower():
            beautiful_error = await error_handler.handle_ai_service_error(exc, context)
        elif "auth" in str(exc).lower():
            beautiful_error = await error_handler.handle_auth_error(exc, context)
        elif "permission" in str(exc).lower() or "unauthorized" in str(exc).lower():
            beautiful_error = await error_handler.handle_permission_error(exc, context)
        elif "network" in str(exc).lower() or "connection" in str(exc).lower():
            beautiful_error = await error_handler.handle_network_error(exc, context)
        else:
            beautiful_error = await error_handler.handle_system_error(exc, context)
        
        return JSONResponse(
            status_code=500 if not isinstance(exc, HTTPException) else exc.status_code,
            content=beautiful_error.dict()
        )
        
    except Exception as e:
        # Fallback for errors in error handling
        logger.error(f"Error in global exception handler: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error_id": "CRITICAL_ERROR",
                "message": "Critical system error",
                "user_message": "Tizimda tanib bo'lmaydigan xatolik yuz berdi. Administrator bilan bog'laning.",
                "category": "system",
                "severity": "critical",
                "suggestions": ["Administrator bilan bog'laning"],
                "help_links": [{"title": "Yordam", "url": "/support"}],
                "retry_allowed": False
            }
        )

# Decorator for graceful error handling
def handle_errors(category: ErrorCategory = ErrorCategory.SYSTEM):
    """Decorator for graceful error handling"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            try:
                return await func(*args, **kwargs)
            except Exception as e:
                # Determine error type and handle accordingly
                if category == ErrorCategory.VALIDATION or isinstance(e, ValueError):
                    return await error_handler.handle_validation_error(e)
                elif category == ErrorCategory.DATABASE:
                    return await error_handler.handle_database_error(e)
                elif category == ErrorCategory.AI_SERVICE:
                    return await error_handler.handle_ai_service_error(e)
                elif category == ErrorCategory.AUTHENTICATION:
                    return await error_handler.handle_auth_error(e)
                elif category == ErrorCategory.AUTHORIZATION:
                    return await error_handler.handle_permission_error(e)
                elif category == ErrorCategory.NETWORK:
                    return await error_handler.handle_network_error(e)
                elif category == ErrorCategory.USER_INPUT:
                    return await error_handler.handle_user_input_error(e)
                else:
                    return await error_handler.handle_system_error(e)
        
        return wrapper
    return decorator
