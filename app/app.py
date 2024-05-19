from flask_cors import CORS
import hashlib

from flask import Flask, request, jsonify  # Importing necessary modules
import mysql.connector

app = Flask(__name__)  # Creating a Flask application
CORS(app)  # Allowing Cross-Origin Resource Sharing (CORS)

def get_db_connection():  # Function to establish a database connection
    config = {
        'user': 'root',
        'password': 'root',
        'host': 'db',
        'port': '3306',
        'database': 'cloud_reddit_db'
    }
    return mysql.connector.connect(**config)

def get_user_count() -> int:  # Function to get the count of users in the database
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT COUNT(*) FROM users')
    user_count = cursor.fetchone()[0]
    cursor.close()
    connection.close()
    return user_count

@app.route('/')  # Route for the home page
def index() -> str:
    return jsonify({'user_count': get_user_count()})  # Returning the user count as JSON

@app.route('/register', methods=['POST'])  # Route for user registration
def register():
    data = request.json  # Getting the JSON data from the request
    username = data.get('username')  # Extracting username from the data
    email = data.get('email')  # Extracting email from the data
    password = data.get('password')  # Extracting password from the data

    if not username or not email or not password:  # Checking if all required fields are present
        return jsonify({'error': 'Username, email, and password are required'}), 400  # Returning an error message if any field is missing

    hashed_password = hashlib.sha256(password.encode()).hexdigest()  # Hashing the password

    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute('INSERT INTO users (username, email, password) VALUES (%s, %s, %s)', (username, email, hashed_password))  # Inserting the user data into the database
        connection.commit()
    except mysql.connector.IntegrityError as err:  # Handling integrity errors (e.g., duplicate username)
        return jsonify({'error': str(err)}), 400  # Returning an error message
    finally:
        cursor.close()
        connection.close()

    return jsonify({'message': 'User registered successfully'})  # Returning a success message

@app.route('/login', methods=['POST'])  # Route for user login
def login():
    data = request.json  # Getting the JSON data from the request
    username = data.get('username')  # Extracting username from the data
    password = data.get('password')  # Extracting password from the data

    if not username or not password:  # Checking if both username and password are present
        return jsonify({'error': 'Username and password are required'}), 400  # Returning an error message if any field is missing

    hashed_password = hashlib.sha256(password.encode()).hexdigest()  # Hashing the password

    connection = get_db_connection()
    cursor = connection.cursor()
    query = 'SELECT * FROM users WHERE username = %(username)s AND password = %(hashed_password)s'
    params = {'username': username, 'hashed_password': hashed_password}
    cursor.execute(query, params)  # Executing the query to check if the user exists
    user = cursor.fetchone()
    cursor.close()
    connection.close()

    if user:  # If user exists
        return jsonify({'message': 'Login successful', 'user_id': user[0], 'username': user[1]})  # Returning a success message with user details
    else:
        return jsonify({'error': 'Invalid username or password'}), 401  # Returning an error message if user does not exist or password is incorrect

@app.route('/posts', methods=['GET'])  # Route to get all posts
def get_posts():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM posts')  # Fetching all posts from the database
    posts = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify([{
        'post_id': post[0],
        'title': post[1],
        'content': post[2],
        'user_id': post[3],
        'category_id': post[4],
        'creation_date': post[5]
    } for post in posts])  # Returning the posts as JSON

@app.route('/categories/<int:category_id>/posts', methods=['GET'])  # Route to get posts by category
def get_posts_by_category(category_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    query = 'SELECT * FROM posts WHERE category_id = %s ORDER BY creation_date DESC'
    cursor.execute(query, (category_id,))  # Fetching posts for the specified category from the database
    posts = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify([{
        'post_id': post[0],
        'title': post[1],
        'content': post[2],
        'user_id': post[3],
        'category_id': post[4],
        'creation_date': post[5]
    } for post in posts])  # Returning the posts as JSON

@app.route('/categories', methods=['GET'])  # Route to get all categories
def get_categories():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM categories')  # Fetching all categories from the database
    categories = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify([{
        'category_id': category[0],
        'name': category[1],
        'description': category[2],
        'creation_date': category[3]
    } for category in categories])  # Returning the categories as JSON

if __name__ == '__main__':
    app.run(host='0.0.0.0')  # Running the Flask application on the specified host
