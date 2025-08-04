# Python 3.9 veya üstü bir sürüm kullan
FROM python:3.9-slim

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılık dosyalarını kopyala
COPY requirements.txt requirements.txt

# Bağımlılıkları yükle
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Proje dosyalarını kopyala
COPY . .

# Render'ın port değişkenini kullan ve uygulamayı başlat
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
