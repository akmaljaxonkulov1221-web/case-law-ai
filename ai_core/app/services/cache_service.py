"""
Cache Service for RAG and Dictionary
Optimizes performance with intelligent caching
"""

import asyncio
import logging
import json
import hashlib
from typing import Dict, Any, Optional, List, Union
from datetime import datetime, timedelta
import redis.asyncio as redis
from dataclasses import dataclass

from app.core.config import settings
from app.core.logging import get_logger

logger = logging.getLogger(__name__)

@dataclass
class CacheConfig:
    """Cache configuration"""
    default_ttl: int = 3600  # 1 hour
    rag_ttl: int = 7200      # 2 hours
    dictionary_ttl: int = 86400  # 24 hours
    session_ttl: int = 1800   # 30 minutes
    max_size: int = 1000     # Max cached items

class CacheService:
    """Redis-based cache service with intelligent invalidation"""
    
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
        self.config = CacheConfig()
        self._local_cache: Dict[str, Any] = {}
        self._cache_timestamps: Dict[str, datetime] = {}
        
    async def initialize(self):
        """Initialize Redis connection"""
        try:
            self.redis_client = redis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                socket_timeout=5,
                socket_connect_timeout=5
            )
            
            # Test connection
            await self.redis_client.ping()
            logger.info("Cache service initialized successfully")
            
        except Exception as e:
            logger.warning(f"Redis connection failed, using local cache: {e}")
            self.redis_client = None
    
    def _generate_key(self, prefix: str, *args) -> str:
        """Generate cache key"""
        key_data = ":".join(str(arg) for arg in args)
        key_hash = hashlib.md5(key_data.encode()).hexdigest()[:8]
        return f"{prefix}:{key_hash}"
    
    def _is_expired(self, key: str, ttl: int) -> bool:
        """Check if cache entry is expired"""
        if key not in self._cache_timestamps:
            return True
        
        age = datetime.now() - self._cache_timestamps[key]
        return age.total_seconds() > ttl
    
    async def get(self, key: str, use_redis: bool = True) -> Optional[Any]:
        """Get value from cache"""
        try:
            # Try Redis first
            if use_redis and self.redis_client:
                value = await self.redis_client.get(key)
                if value:
                    return json.loads(value)
            
            # Fallback to local cache
            if key in self._local_cache and not self._is_expired(key, self.config.default_ttl):
                return self._local_cache[key]
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting cache key {key}: {e}")
            return None
    
    async def set(self, key: str, value: Any, ttl: Optional[int] = None, use_redis: bool = True):
        """Set value in cache"""
        try:
            ttl = ttl or self.config.default_ttl
            serialized_value = json.dumps(value, default=str)
            
            # Set in Redis
            if use_redis and self.redis_client:
                await self.redis_client.setex(key, ttl, serialized_value)
            
            # Set in local cache
            self._local_cache[key] = value
            self._cache_timestamps[key] = datetime.now()
            
            # Cleanup old entries
            await self._cleanup_local_cache()
            
        except Exception as e:
            logger.error(f"Error setting cache key {key}: {e}")
    
    async def delete(self, key: str, use_redis: bool = True):
        """Delete value from cache"""
        try:
            # Delete from Redis
            if use_redis and self.redis_client:
                await self.redis_client.delete(key)
            
            # Delete from local cache
            self._local_cache.pop(key, None)
            self._cache_timestamps.pop(key, None)
            
        except Exception as e:
            logger.error(f"Error deleting cache key {key}: {e}")
    
    async def clear_pattern(self, pattern: str, use_redis: bool = True):
        """Clear cache entries matching pattern"""
        try:
            # Clear from Redis
            if use_redis and self.redis_client:
                keys = await self.redis_client.keys(pattern)
                if keys:
                    await self.redis_client.delete(*keys)
            
            # Clear from local cache
            keys_to_remove = [k for k in self._local_cache.keys() if pattern.replace('*', '') in k]
            for key in keys_to_remove:
                self._local_cache.pop(key, None)
                self._cache_timestamps.pop(key, None)
            
        except Exception as e:
            logger.error(f"Error clearing cache pattern {pattern}: {e}")
    
    async def _cleanup_local_cache(self):
        """Clean up expired local cache entries"""
        try:
            current_time = datetime.now()
            expired_keys = []
            
            for key, timestamp in self._cache_timestamps.items():
                age = current_time - timestamp
                if age.total_seconds() > self.config.default_ttl:
                    expired_keys.append(key)
            
            for key in expired_keys:
                self._local_cache.pop(key, None)
                self._cache_timestamps.pop(key, None)
            
            # Limit cache size
            if len(self._local_cache) > self.config.max_size:
                # Remove oldest entries
                sorted_items = sorted(
                    self._cache_timestamps.items(),
                    key=lambda x: x[1]
                )
                excess_count = len(self._local_cache) - self.config.max_size
                
                for key, _ in sorted_items[:excess_count]:
                    self._local_cache.pop(key, None)
                    self._cache_timestamps.pop(key, None)
                    
        except Exception as e:
            logger.error(f"Error cleaning up local cache: {e}")
    
    # RAG-specific cache methods
    async def get_rag_context(self, query: str, legal_domain: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Get cached RAG context"""
        key = self._generate_key("rag", query, legal_domain or "")
        return await self.get(key, ttl=self.config.rag_ttl)
    
    async def set_rag_context(self, query: str, context: Dict[str, Any], legal_domain: Optional[str] = None):
        """Set cached RAG context"""
        key = self._generate_key("rag", query, legal_domain or "")
        await self.set(key, context, ttl=self.config.rag_ttl)
    
    async def get_law_search(self, query: str, legal_domain: Optional[str] = None, top_k: int = 5) -> Optional[List[Dict[str, Any]]]:
        """Get cached law search results"""
        key = self._generate_key("law_search", query, legal_domain or "", top_k)
        return await self.get(key, ttl=self.config.rag_ttl)
    
    async def set_law_search(self, query: str, results: List[Dict[str, Any]], legal_domain: Optional[str] = None, top_k: int = 5):
        """Set cached law search results"""
        key = self._generate_key("law_search", query, legal_domain or "", top_k)
        await self.set(key, results, ttl=self.config.rag_ttl)
    
    async def get_court_decision_search(self, query: str, precedent_value: Optional[str] = None, top_k: int = 3) -> Optional[List[Dict[str, Any]]]:
        """Get cached court decision search results"""
        key = self._generate_key("court_search", query, precedent_value or "", top_k)
        return await self.get(key, ttl=self.config.rag_ttl)
    
    async def set_court_decision_search(self, query: str, results: List[Dict[str, Any]], precedent_value: Optional[str] = None, top_k: int = 3):
        """Set cached court decision search results"""
        key = self._generate_key("court_search", query, precedent_value or "", top_k)
        await self.set(key, results, ttl=self.config.rag_ttl)
    
    # Dictionary-specific cache methods
    async def get_legal_term(self, term: str) -> Optional[Dict[str, Any]]:
        """Get cached legal term"""
        key = self._generate_key("term", term.lower())
        return await self.get(key, ttl=self.config.dictionary_ttl)
    
    async def set_legal_term(self, term: str, term_data: Dict[str, Any]):
        """Set cached legal term"""
        key = self._generate_key("term", term.lower())
        await self.set(key, term_data, ttl=self.config.dictionary_ttl)
    
    async def get_term_search(self, query: str, limit: int = 20) -> Optional[List[Dict[str, Any]]]:
        """Get cached term search results"""
        key = self._generate_key("term_search", query, limit)
        return await self.get(key, ttl=self.config.dictionary_ttl)
    
    async def set_term_search(self, query: str, results: List[Dict[str, Any]], limit: int = 20):
        """Set cached term search results"""
        key = self._generate_key("term_search", query, limit)
        await self.set(key, results, ttl=self.config.dictionary_ttl)
    
    async def get_all_terms(self, category: Optional[str] = None, limit: int = 100) -> Optional[List[Dict[str, Any]]]:
        """Get cached all terms list"""
        key = self._generate_key("all_terms", category or "", limit)
        return await self.get(key, ttl=self.config.dictionary_ttl)
    
    async def set_all_terms(self, terms: List[Dict[str, Any]], category: Optional[str] = None, limit: int = 100):
        """Set cached all terms list"""
        key = self._generate_key("all_terms", category or "", limit)
        await self.set(key, terms, ttl=self.config.dictionary_ttl)
    
    # Session-specific cache methods
    async def get_session_data(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get cached session data"""
        key = self._generate_key("session", session_id)
        return await self.get(key, ttl=self.config.session_ttl)
    
    async def set_session_data(self, session_id: str, session_data: Dict[str, Any]):
        """Set cached session data"""
        key = self._generate_key("session", session_id)
        await self.set(key, session_data, ttl=self.config.session_ttl)
    
    async def invalidate_user_cache(self, user_id: str):
        """Invalidate all cache entries for a user"""
        patterns = [
            f"session:*{user_id}*",
            f"user_stats:{user_id}",
            f"achievements:{user_id}",
            f"weakness:{user_id}"
        ]
        
        for pattern in patterns:
            await self.clear_pattern(pattern)
    
    async def invalidate_law_cache(self, law_id: str):
        """Invalidate cache entries for a specific law"""
        patterns = [
            f"rag:*{law_id}*",
            f"law_search:*{law_id}*",
            f"court_search:*{law_id}*"
        ]
        
        for pattern in patterns:
            await self.clear_pattern(pattern)
    
    async def invalidate_term_cache(self, term: str):
        """Invalidate cache entries for a specific term"""
        key = self._generate_key("term", term.lower())
        await self.delete(key)
        
        # Also clear search results that might include this term
        await self.clear_pattern("term_search:*")
    
    async def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        try:
            stats = {
                "local_cache_size": len(self._local_cache),
                "local_cache_keys": list(self._local_cache.keys())[:10],  # First 10 keys
                "redis_connected": self.redis_client is not None
            }
            
            if self.redis_client:
                try:
                    redis_info = await self.redis_client.info()
                    stats.update({
                        "redis_used_memory": redis_info.get("used_memory_human"),
                        "redis_connected_clients": redis_info.get("connected_clients"),
                        "redis_keyspace_hits": redis_info.get("keyspace_hits"),
                        "redis_keyspace_misses": redis_info.get("keyspace_misses")
                    })
                    
                    # Get cache keys by pattern
                    rag_keys = await self.redis_client.keys("rag:*")
                    term_keys = await self.redis_client.keys("term:*")
                    session_keys = await self.redis_client.keys("session:*")
                    
                    stats.update({
                        "rag_cache_size": len(rag_keys),
                        "term_cache_size": len(term_keys),
                        "session_cache_size": len(session_keys)
                    })
                    
                except Exception as e:
                    logger.warning(f"Error getting Redis stats: {e}")
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting cache stats: {e}")
            return {"error": str(e)}
    
    async def warm_up_cache(self):
        """Warm up cache with frequently accessed data"""
        try:
            logger.info("Starting cache warm-up")
            
            # Cache common legal terms
            common_terms = ["shartnoma", "da'vo", "huquq", "majburiyat", "tomon", "javobgarlik"]
            
            for term in common_terms:
                # This would typically call the actual service to get term data
                # For now, we'll just create placeholder entries
                await self.set_legal_term(term, {
                    "term": term,
                    "cached": True,
                    "warm_up": True
                })
            
            # Cache common search queries
            common_queries = ["fuqarolik kodeksi", "jinoyat kodeksi", "ma'muriy huquqbuzarliklar"]
            
            for query in common_queries:
                await self.set_law_search(query, [], "civil", 5)
            
            logger.info("Cache warm-up completed")
            
        except Exception as e:
            logger.error(f"Error during cache warm-up: {e}")

# Global cache service instance
cache_service = CacheService()
