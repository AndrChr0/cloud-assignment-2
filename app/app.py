from flask import Flask, json, request, jsonify  # Importing Flask and related modules
from flask_cors import CORS  # Importing CORS for handling cross-origin requests
import mysql.connector  # Importing MySQL connector for database operations
import hashlib  # Importing hashlib for hashing passwords

# Initialize the Flask application
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS) for the app

# Function to establish a connection to the database
def get_db_connection():
    # Configuration for connecting to the MySQL database
    config = {
        'user': 'root',
        'password': 'root',
        'host': 'db',
        'port': '3306',
        'database': 'cloud_reddit_db'
    }
    # Return a new MySQL connection using the provided configuration
    return mysql.connector.connect(**config)

# Function to retrieve the count of users in the database
def get_user_count() -> int:
    connection = get_db_connection()  # Establish database connection
    cursor = connection.cursor()  # Create a cursor object
    cursor.execute('SELECT COUNT(*) FROM users')  # Execute SQL query to count users
    user_count = cursor.fetchone()[0]  # Fetch the count from the result
    cursor.close()  # Close the cursor
    connection.close()  # Close the database connection
    return user_count  # Return the count of users

# Define the route for the home page
@app.route('/')
def index() -> str:
    # Return the user count as a JSON response
    return json.dumps({'user_count': get_user_count()})

# Define the route for user registration
@app.route('/register', methods=['POST'])
def register():
    data = request.json  # Get the JSON data from the request
    username = data.get('username')  # Extract the username
    email = data.get('email')  # Extract the email
    password = data.get('password')  # Extract the password

    # Check if all required fields are provided
    if not username or not email or not password:
        return jsonify({'error': 'Username, email, and password are required'}), 400

    # Hash the password using SHA-256
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    connection = get_db_connection()  # Establish database connection
    cursor = connection.cursor()  # Create a cursor object
    try:
        # Insert the new user into the users table
        cursor.execute('INSERT INTO users (username, email, password) VALUES (%s, %s, %s)', (username, email, hashed_password))
        connection.commit()  # Commit the transaction
    except mysql.connector.IntegrityError as err:
        # Return an error response if there's an integrity error (e.g., duplicate username or email)
        return jsonify({'error': str(err)}), 400
    finally:
        cursor.close()  # Close the cursor
        connection.close()  # Close the database connection

    # Return a success message
    return jsonify({'message': 'User registered successfully'})

# Define the route for user login
@app.route('/login', methods=['POST'])
def login():
    data = request.json  # Get the JSON data from the request
    username = data.get('username')  # Extract the username
    password = data.get('password')  # Extract the password

    # Check if both username and password are provided
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    # Hash the password using SHA-256
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    
    connection = get_db_connection()  # Establish database connection
    cursor = connection.cursor()  # Create a cursor object
    # SQL query to find the user with the given username and hashed password
    query = 'SELECT * FROM users WHERE username = %(username)s AND password = %(hashed_password)s'
    params = {'username': username, 'hashed_password': hashed_password}  # Parameters for the query
    cursor.execute(query, params)  # Execute the query with parameters
    user = cursor.fetchone()  # Fetch the user from the result
    cursor.close()  # Close the cursor
    connection.close()  # Close the database connection

    if user:
        # Return a success message with user details if the user is found
        return jsonify({'message': 'Login successful', 'user_id': user[0], 'username': user[1]})
    else:
        # Return an error message if the username or password is incorrect
        return jsonify({'error': 'Invalid username or password'}), 401

# Define the route for retrieving posts
@app.route('/posts', methods=['GET'])
def get_posts():
    connection = get_db_connection()  # Establish database connection
    cursor = connection.cursor()  # Create a cursor object
    cursor.execute('SELECT * FROM posts')  # Execute SQL query to retrieve posts
    posts = cursor.fetchall()  # Fetch all posts from the result
    cursor.close()  # Close the cursor
    connection.close()  # Close the database connection
    return jsonify(posts)  # Return the posts as a JSON response

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0')
