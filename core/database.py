"""
Database configuration and connection management
Optimized for production with connection pooling and health checks
"""

import asyncio
import logging
from contextlib import contextmanager
from typing import Generator, Optional
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
from sqlalchemy.exc import SQLAlchemyError, DisconnectionError

from core.config import settings
from core.logging import get_logger

logger = get_logger(__name__)

# Optimized engine configuration
engine = create_engine(
    settings.DATABASE_URL,
    # Production-optimized pool settings
    poolclass=QueuePool,
    pool_size=settings.DATABASE_POOL_SIZE or 20,
    max_overflow=settings.DATABASE_MAX_OVERFLOW or 30,
    pool_pre_ping=True,  # Validate connections before use
    pool_recycle=3600,    # Recycle connections every hour
    pool_timeout=30,     # Timeout for getting connection from pool
    echo=settings.DEBUG and settings.DEBUG.lower() == "true",  # Only echo in debug mode
    # Performance settings
    connect_args={
        "connect_timeout": 10,
        "command_timeout": 30,
        "application_name": "case_law_ai",
        # SSL settings for production
        "sslmode": "require" if not settings.DEBUG else "prefer",
    } if "postgresql" in settings.DATABASE_URL else {}
)

# Optimized session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False  # Better performance
)

@contextmanager
def get_db_session() -> Generator[Session, None, None]:
    """Get database session with proper error handling"""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        logger.error(f"Database session error: {e}")
        raise
    finally:
        session.close()

def get_db() -> Generator[Session, None, None]:
    """Get database session (FastAPI compatibility)"""
    with get_db_session() as session:
        yield session

class DatabaseManager:
    """Advanced database management with health checks and monitoring"""
    
    def __init__(self):
        self.engine = engine
        self.session_factory = SessionLocal
        self._health_cache = {}
        self._last_health_check = None
    
    async def check_health(self) -> dict:
        """Check database health with caching"""
        try:
            current_time = asyncio.get_event_loop().time()
            
            # Cache health check results for 30 seconds
            if (self._last_health_check and 
                current_time - self._last_health_check < 30):
                return self._health_cache
            
            with get_db_session() as session:
                # Test basic connectivity
                result = session.execute(text("SELECT 1 as health_check"))
                health_check = result.scalar() == 1
                
                # Get database stats
                stats = await self._get_database_stats(session)
                
                health_data = {
                    "status": "healthy" if health_check else "unhealthy",
                    "connected": health_check,
                    "timestamp": current_time,
                    "stats": stats,
                    "pool_size": engine.pool.size(),
                    "pool_checked_in": engine.pool.checkedin(),
                    "pool_checked_out": engine.pool.checkedout(),
                    "pool_overflow": engine.pool.overflow()
                }
            
            self._health_cache = health_data
            self._last_health_check = current_time
            
            return health_data
            
        except Exception as e:
            logger.error(f"Database health check failed: {e}")
            return {
                "status": "unhealthy",
                "connected": False,
                "timestamp": asyncio.get_event_loop().time(),
                "error": str(e)
            }
    
    async def _get_database_stats(self, session: Session) -> dict:
        """Get database statistics"""
        try:
            # Get table counts
            tables = [
                "users", "cases", "laws", "court_decisions", 
                "legal_dictionary", "ai_interactions"
            ]
            
            table_counts = {}
            for table in tables:
                try:
                    result = session.execute(text(f"SELECT COUNT(*) FROM {table}"))
                    table_counts[table] = result.scalar()
                except SQLAlchemyError:
                    table_counts[table] = 0
            
            # Get database size (PostgreSQL specific)
            try:
                result = session.execute(text("""
                    SELECT pg_size_pretty(pg_database_size(current_database())) as size
                """))
                db_size = result.scalar()
            except SQLAlchemyError:
                db_size = "Unknown"
            
            return {
                "table_counts": table_counts,
                "database_size": db_size
            }
            
        except Exception as e:
            logger.error(f"Error getting database stats: {e}")
            return {"error": str(e)}
    
    async def execute_query(self, query: str, params: Optional[dict] = None) -> dict:
        """Execute raw query with safety checks"""
        try:
            with get_db_session() as session:
                result = session.execute(text(query), params or {})
                
                # Handle different query types
                if result.returns_rows:
                    rows = result.fetchall()
                    columns = result.keys()
                    
                    return {
                        "success": True,
                        "data": [dict(zip(columns, row)) for row in rows],
                        "row_count": len(rows)
                    }
                else:
                    return {
                        "success": True,
                        "row_count": result.rowcount
                    }
                    
        except SQLAlchemyError as e:
            logger.error(f"Query execution error: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def backup_database(self, backup_path: Optional[str] = None) -> dict:
        """Create database backup (PostgreSQL specific)"""
        try:
            import subprocess
            import os
            
            if not backup_path:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                backup_path = f"backup_case_law_ai_{timestamp}.sql"
            
            # Extract database connection details
            db_url = settings.DATABASE_URL
            if "postgresql://" in db_url:
                # Parse connection string
                import re
                pattern = r"postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)"
                match = re.match(pattern, db_url)
                
                if match:
                    user, password, host, port, database = match.groups()
                    
                    # Create pg_dump command
                    cmd = [
                        "pg_dump",
                        f"--host={host}",
                        f"--port={port}",
                        f"--username={user}",
                        f"--dbname={database}",
                        f"--file={backup_path}",
                        "--verbose",
                        "--no-password",
                        "--format=custom",
                        "--compress=9"
                    ]
                    
                    # Set password environment variable
                    env = os.environ.copy()
                    env["PGPASSWORD"] = password
                    
                    # Execute backup
                    result = subprocess.run(
                        cmd,
                        env=env,
                        capture_output=True,
                        text=True,
                        timeout=300  # 5 minutes timeout
                    )
                    
                    if result.returncode == 0:
                        file_size = os.path.getsize(backup_path) if os.path.exists(backup_path) else 0
                        return {
                            "success": True,
                            "backup_path": backup_path,
                            "file_size": file_size,
                            "timestamp": datetime.now().isoformat()
                        }
                    else:
                        return {
                            "success": False,
                            "error": result.stderr
                        }
                else:
                    return {
                        "success": False,
                        "error": "Could not parse database URL"
                    }
            else:
                return {
                    "success": False,
                    "error": "Only PostgreSQL is supported for backup"
                }
                
        except Exception as e:
            logger.error(f"Database backup error: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_connection_info(self) -> dict:
        """Get connection information for monitoring"""
        try:
            pool = self.engine.pool
            
            return {
                "dialect": self.engine.dialect.name,
                "driver": self.engine.driver,
                "pool_size": pool.size(),
                "checked_in": pool.checkedin(),
                "checked_out": pool.checkedout(),
                "overflow": pool.overflow(),
                "invalid": pool.invalid(),
                "recorded_gets": pool.recorded_gets(),
                "recorded_put": pool.recorded_put(),
                "status": "connected" if pool else "disconnected"
            }
        except Exception as e:
            logger.error(f"Error getting connection info: {e}")
            return {"error": str(e)}

# Global database manager instance
db_manager = DatabaseManager()

# Health check endpoint
async def get_database_health() -> dict:
    """Get database health status"""
    return await db_manager.check_health()

# Connection monitoring
def get_database_metrics() -> dict:
    """Get database connection metrics"""
    return db_manager.get_connection_info()
