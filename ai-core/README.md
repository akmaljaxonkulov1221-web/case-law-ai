# Case-Law AI Core

AI-powered legal analysis and reasoning system built with FastAPI and LangChain.

## Features

### 🤖 AI IRAC Solver Agent
- Automatic Issue, Rule, Application, Conclusion analysis
- RAG (Retrieval Augmented Generation) with legal document search
- Multi-language support (Uzbekistan law focus)
- Confidence scoring and feedback

### 🌳 Scenario Generator (Decision Tree)
- AI-powered scenario generation (A, B, C options)
- Probability analysis and outcome prediction
- Risk assessment and legal implications
- What-if analysis integration

### 🔍 Weakness Detection Logic
- Pattern-based weakness identification
- Machine learning analysis of user performance
- Personalized improvement recommendations
- Progress tracking and monitoring

### 📊 RAG System
- Vector database with ChromaDB
- Legal document indexing and retrieval
- Semantic search capabilities
- Context-aware AI responses

## Tech Stack

- **Backend**: FastAPI
- **AI Framework**: LangChain
- **Database**: PostgreSQL with SQLAlchemy
- **Vector DB**: ChromaDB
- **Embeddings**: Sentence Transformers
- **AI Model**: OpenAI GPT-4 Turbo

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ai-core
```

2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Setup environment variables
```bash
cp env.example .env
# Edit .env with your configuration
```

5. Setup database
```bash
# Create PostgreSQL database
# Run schema.sql to create tables
psql -d caselaw_ai -f database-schema.sql
```

## Usage

### Start the server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### IRAC Solver
- `POST /api/v1/irac/solve` - Solve case with IRAC analysis
- `GET /api/v1/irac/session/{id}` - Get IRAC session
- `PUT /api/v1/irac/session/{id}` - Update IRAC component
- `POST /api/v1/irac/session/{id}/evaluate` - Evaluate IRAC session

### Scenario Generator
- `POST /api/v1/scenarios/generate` - Generate scenarios
- `POST /api/v1/scenarios/save` - Save scenario
- `GET /api/v1/scenarios/history` - Get scenario history
- `GET /api/v1/scenarios/node/{id}` - Get node info

### Weakness Detection
- `POST /api/v1/weakness/analyze` - Analyze user weaknesses
- `GET /api/v1/weakness/user/{id}` - Get user weaknesses
- `PUT /api/v1/weakness/progress` - Update weakness progress

## Configuration

### Environment Variables
- `OPENAI_API_KEY` - OpenAI API key
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `CHROMA_HOST` - ChromaDB host

### AI Settings
- `OPENAI_MODEL` - AI model to use (default: gpt-4-turbo-preview)
- `OPENAI_TEMPERATURE` - AI response creativity
- `RAG_TOP_K` - Number of documents to retrieve
- `RAG_SCORE_THRESHOLD` - Minimum similarity score

## Development

### Run tests
```bash
pytest
```

### Code formatting
```bash
black app/
flake8 app/
```

### Database migrations
```bash
alembic upgrade head
```

## Architecture

```
ai-core/
├── app/
│   ├── core/           # Core configuration
│   ├── models/         # Database models
│   ├── services/       # AI services
│   ├── routers/        # API endpoints
│   └── main.py         # Application entry
├── tests/              # Test files
├── requirements.txt    # Dependencies
└── README.md          # Documentation
```

## Services

### RAGService
- Document indexing and retrieval
- Semantic search with embeddings
- Context augmentation for AI

### IRACSolverAgent
- IRAC methodology implementation
- Legal domain detection
- Case analysis and evaluation

### ScenarioGenerator
- Decision tree scenario generation
- Probability calculation
- Risk assessment

### WeaknessDetector
- Pattern recognition
- Performance analysis
- Improvement recommendations

## Monitoring

### Health Checks
- `GET /health` - Overall system health
- `GET /api/v1/irac/health` - IRAC solver health
- `GET /api/v1/scenarios/health` - Scenario generator health
- `GET /api/v1/weakness/health` - Weakness detector health

### Statistics
- `GET /api/v1/stats` - System statistics
- Individual service stats available at respective endpoints

## License

MIT License
