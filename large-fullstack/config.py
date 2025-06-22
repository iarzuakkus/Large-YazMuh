import os
import redis

class Config:
    if os.environ.get("GITHUB_ACTIONS") == "true":
        SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"  # CI/CD ortamı için
        REDIS_HOST = "localhost"
    else:
        SQLALCHEMY_DATABASE_URI = "postgresql://postgres:12345@host.docker.internal/large-blog"
        REDIS_HOST = "redis"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "gizli-bir-key"

    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = False

# Redis bağlantısı (CI/CD ve Compose uyumlu)
redis_client = redis.Redis(
    host=Config.REDIS_HOST,
    port=6379,
    db=0
)
