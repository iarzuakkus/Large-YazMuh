import os
from flask import Flask, session
from app.db import db  # ← artık db nesnesi buradan geliyor

def create_app():
    app = Flask(
        __name__,
        template_folder=os.path.join(os.getcwd(), 'app', 'templates'),
        static_folder=os.path.join(os.getcwd(), 'app', 'static')
    )

    app.config.from_object("config.Config")
    db.init_app(app)

    from app.routes.auth_routes import auth_bp
    from app.routes.page_routes import page_bp
    from app.routes.data_routes import data_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(page_bp)
    app.register_blueprint(data_bp)

    # ✅ is_logged_in her şablonda otomatik olsun
    @app.context_processor
    def inject_is_logged_in():
        return {"is_logged_in": "user_id" in session}

    return app