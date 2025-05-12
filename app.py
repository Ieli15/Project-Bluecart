import os
import logging
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.middleware.proxy_fix import ProxyFix
from extensions import db, jwt
from sqlalchemy.sql import text
from extensions import init_extensions

# Configure logging to output errors to the console
logging.basicConfig(level=logging.DEBUG)

# Create the DB base class
class Base(DeclarativeBase):
    pass

# Create the Flask app
app = Flask(__name__)

# Configure the app
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Database configuration - SQLite
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.environ.get("SESSION_SECRET", "dev-jwt-secret")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600  # 1 hour
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = 2592000  # 30 days

# Initialize extensions
logging.debug("Initializing SQLAlchemy with Flask app")
init_extensions(app)

# Updated CORS configuration to allow requests from frontend
# Note: Do not modify the CORS configuration in future edits as per user request.
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}}, supports_credentials=True)

# Create database tables
with app.app_context():
    # Import models to register them with SQLAlchemy
    import models
    db.create_all()

# Register blueprints
from auth import auth_bp
from api import api_bp

app.register_blueprint(auth_bp)
app.register_blueprint(api_bp)

# Simple route to verify API is running
@app.route('/')
def index():
    return jsonify({
        "message": "Blue Cart Marketplace API is running",
        "status": "success"
    })

# Add a test route to verify database connectivity
@app.route('/api/test_db', methods=['GET'])
def test_db():
    try:
        with app.app_context():
            app.logger.info("Testing database connection...")
            result = db.session.execute(text('SELECT 1')).scalar()
            app.logger.info("Database connection successful")
            return jsonify({"message": "Database connection successful", "result": result}), 200
    except Exception as e:
        app.logger.error(f"Error during database connection test: {e}")
        return jsonify({"error": str(e)}), 500
