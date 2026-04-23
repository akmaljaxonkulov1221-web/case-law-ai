# Local Build Strategy for Case-Law AI Platform
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for AI libraries and curl
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

# Copy pre-built frontend files (from local build)
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Environment variables
ENV PYTHONPATH=/app/ai-core
ENV PYTHONUNBUFFERED=1
ENV HOST=0.0.0.0
ENV PORT=8000
ENV NODE_ENV=production

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Change working directory to ai-core for module execution
WORKDIR /app/ai-core

# Start the application
CMD ["gunicorn", "app.main:app", "-w", "2", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "--timeout", "300", "--keep-alive", "5"]

