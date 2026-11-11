from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from models import db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}}, supports_credentials=True)

    from routes.auth import auth_bp
    from routes.transactions import transactions_bp
    from routes.budgets import budgets_bp

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(transactions_bp, url_prefix="/api")
    app.register_blueprint(budgets_bp, url_prefix="/api")

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
