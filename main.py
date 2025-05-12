from app import app
import routes
import auth
import api

# Ensure the app instance is exposed for gunicorn
if __name__ == "__main__":
    app.run(debug=True)
