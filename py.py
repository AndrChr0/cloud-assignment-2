from flask import Flask

# Create a Flask app
app = Flask(__name__)

# Decorator to define the route
@app.route("/")
def index():
    return "Hello, World!"

# Run the app
app.run(host="0.0.0.0", port=80)
