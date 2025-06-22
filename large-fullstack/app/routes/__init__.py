from .auth_routes import auth_bp
from .page_routes import page_bp
from .data_routes import data_bp   # Yeni eklenen

__all__ = ["auth_bp", "page_bp", "data_bp"]
