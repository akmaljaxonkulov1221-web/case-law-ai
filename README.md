---
title: Case Law AI
emoji: ⚖️
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
---

# Case-Law AI Platform 🏛️

Interactive 3D Legal Education Platform powered by AI for Uzbekistan law students and professionals.

## 🌟 Features

- **🎯 AI-Powered Legal Analysis**: GPT-4 integration for case analysis and legal reasoning
- **📊 3D Visualization**: Interactive 3D legal article anatomy using React Three Fiber
- **🔍 Smart Search**: RAG (Retrieval Augmented Generation) system for legal document search
- **🎓 Gamification**: XP system, achievements, and progress tracking
- **💬 AI Chat**: Interactive legal assistant for students
- **📚 Legal Dictionary**: Comprehensive glossary with tooltips
- **⚖️ Case Solver**: IRAC framework for legal case analysis
- **🗳️ Decision Trees**: Interactive legal decision-making flowcharts

## 🏗️ Architecture

### Frontend (Next.js 14 + TypeScript)
- **Framework**: Next.js 14 with App Router
- **UI**: Tailwind CSS + shadcn/ui components
- **3D Graphics**: React Three Fiber + Three.js
- **State Management**: React hooks + Context API
- **Charts**: Chart.js + React-Chartjs-2

### Backend (FastAPI + Python)
- **Framework**: FastAPI with Uvicorn
- **Database**: PostgreSQL with SQLAlchemy ORM
- **AI**: OpenAI GPT-4 + LangChain
- **Vector DB**: ChromaDB for semantic search
- **Cache**: Redis for performance optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/your-username/case-law-ai.git
cd case-law-ai
```

2. **Environment Setup**
```bash
# Copy environment file
cp env.production .env

# Install dependencies
npm install
cd ai-core && pip install -r requirements.txt
```

3. **Start with Docker (Recommended)**
```bash
docker-compose up --build
```

4. **Manual Setup**
```bash
# Start PostgreSQL, Redis, ChromaDB
docker-compose up postgres redis chromadb -d

# Start Backend
cd ai-core && python -m uvicorn app.main:app --reload

# Start Frontend
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🐳 Docker Deployment

### Production Build
```bash
docker-compose -f docker-compose.yml up --build -d
```

### Services
- **Frontend**: Next.js on port 3000
- **Backend**: FastAPI on port 8000
- **Database**: PostgreSQL on port 5432
- **Cache**: Redis on port 6379
- **Vector DB**: ChromaDB on port 8001

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/caselaw_ai

# AI Services
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4-turbo-preview

# Security
JWT_SECRET=your-jwt-secret
SECRET_KEY=your-secret-key

# Cache
REDIS_URL=redis://localhost:6379
```

## 📊 API Documentation

### Main Endpoints
- `GET /health` - Health check
- `GET /api/v1/users` - User management
- `GET /api/v1/laws` - Legal articles
- `GET /api/v1/cases` - Legal cases
- `POST /api/v1/ai/chat` - AI chat interface

### Authentication
JWT-based authentication with role-based access control (RBAC).

## 🎯 Usage Examples

### AI Legal Analysis
```typescript
// Analyze a legal case using AI
const analysis = await fetch('/api/v1/ai/analyze', {
  method: 'POST',
  body: JSON.stringify({
    case_description: "Contract breach scenario...",
    jurisdiction: "Uzbekistan"
  })
});
```

### 3D Legal Visualization
```typescript
// Display 3D legal article
import { LegalArticle3D } from '@/components/legal/LegalArticle3D';

<LegalArticle3D 
  articleId="civil-code-357"
  showAnatomy={true}
  interactive={true}
/>
```

## 🧪 Testing

```bash
# Frontend tests
npm run test

# Backend tests
cd ai-core && pytest

# Integration tests
npm run test:e2e
```

## 📈 Performance

- **Frontend**: Lighthouse score 95+
- **Backend**: <100ms average response time
- **Database**: Optimized with indexing and caching
- **AI**: 2-3 second response time for complex queries

## 🔒 Security

- JWT token authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

## 🌍 Deployment

### Render
1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### Vercel (Frontend only)
```bash
vercel --prod
```

### Self-hosted
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Uzbekistan Ministry of Justice for legal data
- React Three Fiber community
- FastAPI contributors

## 📞 Support

- 📧 Email: support@caselaw.ai
- 💬 Discord: [Join our community](https://discord.gg/caselaw-ai)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/case-law-ai/issues)

---

**⭐ If this project helped you, please give it a star!**

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
