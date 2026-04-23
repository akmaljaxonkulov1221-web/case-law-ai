# Multi-stage build for Case-Law AI Platform
FROM node:20-slim AS frontend-builder

# Set working directory
WORKDIR /app

# Install system dependencies for Prisma and build tools
RUN apt-get update && apt-get install -y \
    openssl \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./

# Install all dependencies with legacy peer deps and increased memory
RUN NODE_OPTIONS="--max-old-space-size=2048" npm install --legacy-peer-deps

# Copy source code
COPY src/ ./src/
COPY public/ ./public/

# Build the application
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build

# Backend stage
FROM python:3.11-slim AS backend

# Set working directory
WORKDIR /app

# Install system dependencies for AI libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    curl \
    wget \
    git \
    libffi-dev \
    libssl-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY ai-core/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY ai-core/ ./ai-core/

# Copy frontend build from builder stage
COPY --from=frontend-builder /app/.next/standalone ./
COPY --from=frontend-builder /app/.next/static ./.next/static
COPY --from=frontend-builder /app/public ./public

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
ENV HOST=0.0.0.0
ENV PORT=8000
ENV NODE_ENV=production

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start the application
CMD ["gunicorn", "app.main:app", "-w", "2", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "--timeout", "300", "--keepalive", "2", "--max-requests", "500", "--max-requests-jitter", "50"]

