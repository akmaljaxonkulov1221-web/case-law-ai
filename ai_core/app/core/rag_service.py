"""
RAG (Retrieval Augmented Generation) Service
Legal document retrieval and augmentation for AI analysis
"""

import asyncio
import logging
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
import numpy as np
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
import openai
from openai import AsyncOpenAI

from app.core.config import settings
from app.core.database import get_db
from app.models.models import Law, Case, CourtDecision, LawCourtDecision
from app.services.cache_service import cache_service

logger = logging.getLogger(__name__)

@dataclass
class RetrievedDocument:
    """Retrieved document with metadata"""
    content: str
    metadata: Dict[str, Any]
    score: float
    source: str
    law_id: Optional[int] = None
    case_id: Optional[int] = None

class RAGService:
    """RAG service for legal document retrieval and augmentation"""
    
    def __init__(self):
        self.embedding_model = None
        self.vector_db = None
        self.collection = None
        self.openai_client = None
        self.law_collection_name = "caselaw_laws"
        self.case_collection_name = "caselaw_cases"
        self.court_decision_collection_name = "caselaw_court_decisions"
        
    async def initialize(self):
        """Initialize RAG service components"""
        try:
            # Initialize embedding model
            self.embedding_model = SentenceTransformer(
                'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2'
            )
            logger.info("Embedding model loaded")
            
            # Initialize ChromaDB
            self.vector_db = chromadb.PersistentClient(
                path="./chroma_db",
                settings=Settings(anonymized_telemetry=False)
            )
            
            # Get or create collections
            try:
                self.law_collection = self.vector_db.get_collection(self.law_collection_name)
                logger.info(f"Law collection '{self.law_collection_name}' loaded")
            except Exception:
                self.law_collection = self.vector_db.create_collection(
                    name=self.law_collection_name,
                    metadata={"description": "Legal laws and articles"}
                )
                logger.info(f"Law collection '{self.law_collection_name}' created")
            
            try:
                self.case_collection = self.vector_db.get_collection(self.case_collection_name)
                logger.info(f"Case collection '{self.case_collection_name}' loaded")
            except Exception:
                self.case_collection = self.vector_db.create_collection(
                    name=self.case_collection_name,
                    metadata={"description": "Legal cases and decisions"}
                )
                logger.info(f"Case collection '{self.case_collection_name}' created")
            
            # Initialize OpenAI client
            self.openai_client = AsyncOpenAI(
                api_key=settings.OPENAI_API_KEY
            )
            
            # Index existing documents if needed
            await self._index_existing_documents()
            
            logger.info("RAG service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize RAG service: {e}")
            raise
    
    async def _index_existing_documents(self):
        """Index existing laws and cases in vector database"""
        try:
            db = next(get_db())
            
            # Initialize court decision collection
            try:
                self.court_decision_collection = self.vector_db.get_collection(self.court_decision_collection_name)
                logger.info(f"Court decision collection '{self.court_decision_collection_name}' loaded")
            except Exception:
                self.court_decision_collection = self.vector_db.create_collection(
                    name=self.court_decision_collection_name,
                    metadata={"description": "Court decisions and precedents"}
                )
                logger.info(f"Court decision collection '{self.court_decision_collection_name}' created")
            
            # Check if collections are empty
            law_count = self.law_collection.count()
            case_count = self.case_collection.count()
            court_decision_count = self.court_decision_collection.count()
            
            if law_count == 0:
                logger.info("Indexing laws...")
                await self._index_laws(db)
            
            if case_count == 0:
                logger.info("Indexing cases...")
                await self._index_cases(db)
            
            if court_decision_count == 0:
                logger.info("Indexing court decisions...")
                await self._index_court_decisions(db)
            
            db.close()
            
        except Exception as e:
            logger.error(f"Failed to index existing documents: {e}")
    
    async def _index_laws(self, db):
        """Index laws in vector database"""
        try:
            laws = db.query(Law).filter(Law.is_current == True).all()
            
            if not laws:
                logger.info("No laws to index")
                return
            
            # Prepare documents
            documents = []
            metadatas = []
            ids = []
            
            for law in laws:
                # Create searchable text
                searchable_text = f"""
                {law.title}
                {law.code_name} {law.article_number}
                {law.full_text}
                {law.summary or ''}
                {law.interpretation or ''}
                {' '.join(law.tags) if law.tags else ''}
                """.strip()
                
                documents.append(searchable_text)
                metadatas.append({
                    "id": law.id,
                    "title": law.title,
                    "code_name": law.code_name,
                    "article_number": law.article_number,
                    "legal_domain": law.legal_domain,
                    "subcategory": law.subcategory or "",
                    "tags": law.tags or [],
                    "importance_level": law.importance_level or "medium",
                    "difficulty_level": law.difficulty_level or "medium",
                    "source": "law"
                })
                ids.append(f"law_{law.id}")
            
            # Generate embeddings
            embeddings = self.embedding_model.encode(documents)
            
            # Add to collection
            self.law_collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids,
                embeddings=embeddings.tolist()
            )
            
            logger.info(f"Indexed {len(laws)} laws")
            
        except Exception as e:
            logger.error(f"Failed to index laws: {e}")
            raise
    
    async def _index_cases(self, db):
        """Index cases in vector database"""
        try:
            cases = db.query(Case).filter(Case.status == "active").all()
            
            if not cases:
                logger.info("No cases to index")
                return
            
            # Prepare documents
            documents = []
            metadatas = []
            ids = []
            
            for case in cases:
                # Create searchable text
                searchable_text = f"""
                {case.title}
                {case.description}
                {case.facts}
                {case.decision or ''}
                {case.reasoning or ''}
                {' '.join(case.legal_issues) if case.legal_issues else ''}
                {' '.join(case.applicable_laws) if case.applicable_laws else ''}
                {' '.join(case.tags) if case.tags else ''}
                """.strip()
                
                documents.append(searchable_text)
                metadatas.append({
                    "id": case.id,
                    "title": case.title,
                    "legal_domain": case.legal_domain,
                    "difficulty_level": case.difficulty_level,
                    "tags": case.tags or [],
                    "precedent_value": case.precedent_value or "low",
                    "court_name": case.court_name or "",
                    "decision_date": case.decision_date.isoformat() if case.decision_date else "",
                    "source": "case"
                })
                ids.append(f"case_{case.id}")
            
            # Generate embeddings
            embeddings = self.embedding_model.encode(documents)
            
            # Add to collection
            self.case_collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids,
                embeddings=embeddings.tolist()
            )
            
            logger.info(f"Indexed {len(cases)} cases")
            
        except Exception as e:
            logger.error(f"Failed to index cases: {e}")
            raise
    
    async def _index_court_decisions(self, db):
        """Index court decisions in vector database"""
        try:
            court_decisions = db.query(CourtDecision).filter(CourtDecision.status == "active").all()
            
            if not court_decisions:
                logger.info("No court decisions to index")
                return
            
            # Prepare documents
            documents = []
            metadatas = []
            ids = []
            
            for decision in court_decisions:
                # Create searchable text
                searchable_text = f"""
                {decision.title}
                {decision.description}
                {decision.caseNumber}
                {decision.courtName}
                {decision.facts}
                {decision.decision}
                {decision.reasoning}
                {' '.join(decision.legalIssues) if decision.legalIssues else ''}
                {' '.join(decision.applicableLaws) if decision.applicableLaws else ''}
                {' '.join(decision.tags) if decision.tags else ''}
                {decision.precedentValue}
                {decision.legalDomain}
                """.strip()
                
                documents.append(searchable_text)
                metadatas.append({
                    "id": decision.id,
                    "uuid": decision.uuid,
                    "title": decision.title,
                    "case_number": decision.caseNumber,
                    "court_name": decision.courtName,
                    "decision_date": decision.decisionDate.strftime("%Y-%m-%d"),
                    "legal_domain": decision.legalDomain,
                    "difficulty_level": decision.difficultyLevel,
                    "tags": decision.tags or [],
                    "precedent_value": decision.precedentValue,
                    "status": decision.status,
                    "is_featured": decision.isFeatured,
                    "source": "court_decision"
                })
                ids.append(f"court_decision_{decision.id}")
            
            # Generate embeddings
            embeddings = self.embedding_model.encode(documents)
            
            # Add to collection
            self.court_decision_collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids,
                embeddings=embeddings.tolist()
            )
            
            logger.info(f"Indexed {len(court_decisions)} court decisions")
            
        except Exception as e:
            logger.error(f"Failed to index court decisions: {e}")
            raise
    
    async def search_laws(
        self,
        query: str,
        legal_domain: Optional[str] = None,
        top_k: int = 5,
        score_threshold: float = 0.7
    ) -> List[RetrievedDocument]:
        """Search for relevant laws with caching"""
        try:
            # Check cache first
            cached_results = await cache_service.get_law_search(query, legal_domain, top_k)
            if cached_results:
                logger.info(f"Cache hit for law search: {query}")
                return [
                    RetrievedDocument(
                        content=doc["content"],
                        metadata=doc["metadata"],
                        score=doc["score"],
                        source=doc["source"],
                        law_id=doc.get("law_id")
                    )
                    for doc in cached_results
                ]
            
            # Generate query embedding
            query_embedding = self.embedding_model.encode([query])
            
            # Build where filter
            where_filter = {"source": "law"}
            if legal_domain:
                where_filter["legal_domain"] = legal_domain
            
            # Search in law collection
            results = self.law_collection.query(
                query_embeddings=query_embedding.tolist(),
                n_results=top_k,
                where=where_filter
            )
            
            # Format results
            retrieved_docs = []
            if results['documents'] and results['documents'][0]:
                for i, (doc, metadata, distance) in enumerate(zip(
                    results['documents'][0],
                    results['metadatas'][0],
                    results['distances'][0]
                )):
                    # Convert distance to similarity score
                    score = 1 - distance
                    
                    if score >= score_threshold:
                        retrieved_docs.append(RetrievedDocument(
                            content=doc,
                            metadata=metadata,
                            score=score,
                            source="law",
                            law_id=metadata.get("id")
                        ))
            
            # Cache the results
            cacheable_results = [
                {
                    "content": doc.content,
                    "metadata": doc.metadata,
                    "score": doc.score,
                    "source": doc.source,
                    "law_id": doc.law_id
                }
                for doc in retrieved_docs
            ]
            await cache_service.set_law_search(query, cacheable_results, legal_domain, top_k)
            
            return retrieved_docs
            
        except Exception as e:
            logger.error(f"Failed to search laws: {e}")
            return []
    
    async def search_cases(
        self,
        query: str,
        legal_domain: Optional[str] = None,
        difficulty_level: Optional[str] = None,
        top_k: int = 3,
        score_threshold: float = 0.7
    ) -> List[RetrievedDocument]:
        """Search for relevant cases"""
        try:
            # Generate query embedding
            query_embedding = self.embedding_model.encode([query])
            
            # Build where filter
            where_filter = {"source": "case"}
            if legal_domain:
                where_filter["legal_domain"] = legal_domain
            if difficulty_level:
                where_filter["difficulty_level"] = difficulty_level
            
            # Search in case collection
            results = self.case_collection.query(
                query_embeddings=query_embedding.tolist(),
                n_results=top_k,
                where=where_filter
            )
            
            # Format results
            retrieved_docs = []
            if results['documents'] and results['documents'][0]:
                for i, (doc, metadata, distance) in enumerate(zip(
                    results['documents'][0],
                    results['metadatas'][0],
                    results['distances'][0]
                )):
                    # Convert distance to similarity score
                    score = 1 - distance
                    
                    if score >= score_threshold:
                        retrieved_docs.append(RetrievedDocument(
                            content=doc,
                            metadata=metadata,
                            score=score,
                            source="case",
                            case_id=metadata.get("id")
                        ))
            
            return retrieved_docs
            
        except Exception as e:
            logger.error(f"Failed to search cases: {e}")
            return []
    
    async def search_court_decisions(
        self,
        query: str,
        legal_domain: Optional[str] = None,
        precedent_value: Optional[str] = None,
        top_k: int = 3,
        score_threshold: float = 0.7
    ) -> List[RetrievedDocument]:
        """Search for relevant court decisions"""
        try:
            # Generate query embedding
            query_embedding = self.embedding_model.encode([query])
            
            # Build where filter
            where_filter = {"source": "court_decision"}
            if legal_domain:
                where_filter["legal_domain"] = legal_domain
            if precedent_value:
                where_filter["precedent_value"] = precedent_value
            
            # Search in court decision collection
            results = self.court_decision_collection.query(
                query_embeddings=query_embedding.tolist(),
                n_results=top_k,
                where=where_filter
            )
            
            # Format results
            retrieved_docs = []
            if results['documents'] and results['documents'][0]:
                for i, (doc, metadata, distance) in enumerate(zip(
                    results['documents'][0],
                    results['metadatas'][0],
                    results['distances'][0]
                )):
                    # Convert distance to similarity score
                    score = 1 - distance
                    if score >= score_threshold:
                        retrieved_docs.append(RetrievedDocument(
                            content=doc,
                            metadata=metadata,
                            score=score,
                            source="court_decision"
                        ))
            
            return retrieved_docs
            
        except Exception as e:
            logger.error(f"Failed to search court decisions: {e}")
            return []
    
    async def augment_irac_context(
        self,
        case_text: str,
        legal_domain: Optional[str] = None
    ) -> Dict[str, List[RetrievedDocument]]:
        """Retrieve relevant context for IRAC analysis"""
        try:
            # Search for relevant laws
            laws = await self.search_laws(
                query=case_text,
                legal_domain=legal_domain,
                top_k=settings.RAG_TOP_K,
                score_threshold=settings.RAG_SCORE_THRESHOLD
            )
            
            # Search for relevant cases
            cases = await self.search_cases(
                query=case_text,
                legal_domain=legal_domain,
                top_k=3,
                score_threshold=settings.RAG_SCORE_THRESHOLD
            )
            
            # Search for relevant court decisions (Supreme Court decisions)
            court_decisions = await self.search_court_decisions(
                query=case_text,
                legal_domain=legal_domain,
                precedent_value="high",  # Prioritize high precedent value decisions
                top_k=3,
                score_threshold=settings.RAG_SCORE_THRESHOLD
            )
            
            return {
                "laws": laws,
                "cases": cases,
                "court_decisions": court_decisions
            }
            
        except Exception as e:
            logger.error(f"Failed to augment IRAC context: {e}")
            return {"laws": [], "cases": []}
    
    async def generate_context_summary(
        self,
        retrieved_docs: List[RetrievedDocument],
        max_tokens: int = 1000
    ) -> str:
        """Generate a summary of retrieved documents"""
        try:
            if not retrieved_docs:
                return "No relevant legal documents found."
            
            # Sort by score
            sorted_docs = sorted(retrieved_docs, key=lambda x: x.score, reverse=True)
            
            # Build context
            context_parts = []
            current_tokens = 0
            
            for doc in sorted_docs:
                if current_tokens >= max_tokens:
                    break
                
                # Truncate content if needed
                content = doc.content
                if len(content) > 500:  # Rough token estimation
                    content = content[:500] + "..."
                
                context_part = f"""
{doc.metadata.get('title', 'Unknown')} ({doc.source})
Relevance: {doc.score:.2f}
Content: {content}
                """.strip()
                
                context_parts.append(context_part)
                current_tokens += len(content.split()) * 1.3  # Rough token estimation
            
            return "\n\n---\n\n".join(context_parts)
            
        except Exception as e:
            logger.error(f"Failed to generate context summary: {e}")
            return "Error generating context summary."
    
    async def add_document(
        self,
        content: str,
        metadata: Dict[str, Any],
        document_type: str = "law"
    ) -> bool:
        """Add a new document to the vector database"""
        try:
            # Select collection
            collection = self.law_collection if document_type == "law" else self.case_collection
            
            # Generate embedding
            embedding = self.embedding_model.encode([content])
            
            # Add to collection
            collection.add(
                documents=[content],
                metadatas=[metadata],
                ids=[f"{document_type}_{metadata.get('id', 'unknown')}_{hash(content)}"],
                embeddings=embedding.tolist()
            )
            
            logger.info(f"Added {document_type} document to vector database")
            return True
            
        except Exception as e:
            logger.error(f"Failed to add document: {e}")
            return False
    
    async def update_document(
        self,
        document_id: str,
        content: str,
        metadata: Dict[str, Any],
        document_type: str = "law"
    ) -> bool:
        """Update an existing document in the vector database"""
        try:
            # Select collection
            collection = self.law_collection if document_type == "law" else self.case_collection
            
            # Generate embedding
            embedding = self.embedding_model.encode([content])
            
            # Update collection
            collection.update(
                ids=[document_id],
                documents=[content],
                metadatas=[metadata],
                embeddings=embedding.tolist()
            )
            
            logger.info(f"Updated {document_type} document {document_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update document: {e}")
            return False
    
    async def delete_document(
        self,
        document_id: str,
        document_type: str = "law"
    ) -> bool:
        """Delete a document from the vector database"""
        try:
            # Select collection
            collection = self.law_collection if document_type == "law" else self.case_collection
            
            # Delete from collection
            collection.delete(ids=[document_id])
            
            logger.info(f"Deleted {document_type} document {document_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete document: {e}")
            return False
    
    async def health_check(self) -> str:
        """Check RAG service health"""
        try:
            # Check collections
            law_count = self.law_collection.count()
            case_count = self.case_collection.count()
            
            # Test embedding
            test_embedding = self.embedding_model.encode("test")
            
            return f"healthy (laws: {law_count}, cases: {case_count})"
            
        except Exception as e:
            logger.error(f"RAG health check failed: {e}")
            return "unhealthy"
    
    async def get_stats(self) -> Dict[str, Any]:
        """Get RAG service statistics"""
        try:
            law_count = self.law_collection.count()
            case_count = self.case_collection.count()
            
            return {
                "total_laws": law_count,
                "total_cases": case_count,
                "total_documents": law_count + case_count,
                "embedding_model": "paraphrase-multilingual-MiniLM-L12-v2",
                "vector_db": "chromadb"
            }
            
        except Exception as e:
            logger.error(f"Failed to get RAG stats: {e}")
            return {}
