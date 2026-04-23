"""
Simple FastAPI main without AI dependencies
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
import uvicorn

app = FastAPI(
    title="Case-Law AI Platform API",
    description="Legal Education Platform API",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Basic models
class HealthResponse(BaseModel):
    status: str
    message: str
    version: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    xp: int
    level: int

# Sample data
sample_users = [
    {
        "id": "user_001",
        "name": "Admin User",
        "email": "admin@caselaw.ai",
        "role": "admin",
        "xp": 10000,
        "level": 50
    },
    {
        "id": "user_002", 
        "name": "Teacher User",
        "email": "teacher@caselaw.ai",
        "role": "teacher",
        "xp": 5000,
        "level": 25
    },
    {
        "id": "user_003",
        "name": "Student User", 
        "email": "student@caselaw.ai",
        "role": "student",
        "xp": 2500,
        "level": 12
    }
]

sample_laws = [
    {
        "id": "law_001",
        "title": "Shartnoma erkinligi",
        "code_name": "Fuqarolik Kodeksi",
        "article_number": "357-modda",
        "summary": "Fuqarolar va tashkilotlar oʻz xohish-irodalariga koʻra shartnoma tuzish huquqiga egadirlar.",
        "legal_domain": "civil",
        "importance_level": "high"
    },
    {
        "id": "law_002",
        "title": "Shartnoma tuzish shakli",
        "code_name": "Fuqarolik Kodeksi", 
        "article_number": "360-modda",
        "summary": "Shartnoma yozma shaklda, ogʻzaki shaklda yoki tomonlar oʻrtasida oʻrnatilgan odatlarda belgilanishi mumkin.",
        "legal_domain": "civil",
        "importance_level": "high"
    }
]

sample_cases = [
    {
        "id": "case_001",
        "title": "Shartnoma majburiyatlarini buzish",
        "description": "Kompaniya tomonidan yetkazib berish shartnomasidagi majburiyatlar bajarmaganligi toʻgʻrisida daʼvo",
        "legal_domain": "civil",
        "difficulty": "medium",
        "status": "active"
    }
]

# Routes
@app.get("/", response_model=Dict[str, Any])
async def root():
    return {
        "message": "Case-Law AI Platform API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        message="API is running successfully",
        version="1.0.0"
    )

@app.get("/api/v1/users", response_model=List[UserResponse])
async def get_users():
    return sample_users

@app.get("/api/v1/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    user = next((u for u in sample_users if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/api/v1/laws", response_model=List[Dict[str, Any]])
async def get_laws():
    return sample_laws

@app.get("/api/v1/laws/{law_id}", response_model=Dict[str, Any])
async def get_law(law_id: str):
    law = next((l for l in sample_laws if l["id"] == law_id), None)
    if not law:
        raise HTTPException(status_code=404, detail="Law not found")
    return law

@app.get("/api/v1/cases", response_model=List[Dict[str, Any]])
async def get_cases():
    return sample_cases

@app.get("/api/v1/cases/{case_id}", response_model=Dict[str, Any])
async def get_case(case_id: str):
    case = next((c for c in sample_cases if c["id"] == case_id), None)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@app.get("/api/v1/stats", response_model=Dict[str, Any])
async def get_stats():
    return {
        "total_users": len(sample_users),
        "total_laws": len(sample_laws),
        "total_cases": len(sample_cases),
        "active_sessions": 42,
        "server_status": "healthy"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=7777)
