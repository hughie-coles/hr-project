from hr_backend import app
from flask_cors import CORS

# Enable CORS for the app
CORS(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
