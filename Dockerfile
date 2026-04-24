FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# PYTHONPATH-ni loyiha ildiziga o'rnatamiz
ENV PYTHONPATH=/app
CMD ["uvicorn", "ai_core.app.main:app", "--host", "0.0.0.0", "--port", "7860"]
