FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Hech qanday PYTHONPATH kerak emas, hamma narsa bir joyda
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
