FROM python:3.11

# Tizim kutubxonalarini yangilash
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV PYTHONUNBUFFERED=1

# Fayllarni nusxalash
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Hugging Face standart porti
EXPOSE 7860

# Gunicorn orqali ishga tushirish (ai_core.app.main:app yo'li bilan)
CMD ["gunicorn", "ai_core.app.main:app", "-w", "1", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:7860", "--timeout", "600"]
