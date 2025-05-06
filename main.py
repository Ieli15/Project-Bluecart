from app import app
import routes
import auth
import api

if __name__ == "__main__":
    with app.app_context():  # Ensure app context is globally active
        app.run(host="0.0.0.0", port=8000, debug=True)
