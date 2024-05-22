from flask_cors import CORS
import hashlib
from flask import Flask, request, jsonify, Response
import mysql.connector

app = Flask(__name__)
# CORS config
CORS(app)


# Establish a database connection
def get_db_connection():
    config = {
        'user': 'root',
        'password': 'root',
        'host': 'db',
        'port': '3306',
        'database': 'cloud_reddit_db'
    }
    return mysql.connector.connect(**config)


# Function to get the count of users in the database
def get_user_count() -> int:
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT COUNT(*) FROM users')
    user_count = cursor.fetchone()[0]
    cursor.close()
    connection.close()
    return user_count


# Returning the user count
@app.route('/')
def index() -> Response:
    return jsonify({'user_count': get_user_count()})


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')  # Extracting username from the data
    email = data.get('email')  # Extracting email from the data
    password = data.get('password')  # Extracting password from the data

    if not username or not email or not password:  # Checking if all required fields are present
        return jsonify({'error': 'Username, email, and password are required'}), 400  # Returning an error message if any field is missing

    hashed_password = hashlib.sha256(password.encode()).hexdigest()  # Hashing the password

    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        # Inserting the user data into the database
        cursor.execute('INSERT INTO users (username, email, password) VALUES (%s, %s, %s)', (username, email, hashed_password))
        connection.commit()
    except mysql.connector.IntegrityError as err:  # Handling integrity errors (e.g., duplicate username)
        return jsonify({'error': str(err)}), 400
    finally:
        cursor.close()
        connection.close()

    return jsonify({'message': 'User registered successfully'})


# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')  # Extracting username from the data
    password = data.get('password')  # Extracting password from the data

    if not username or not password:  # Checking if both username and password are present
        return jsonify({'error': 'Username and password are required'}), 400

    hashed_password = hashlib.sha256(password.encode()).hexdigest()  # Hashing the password

    connection = get_db_connection()
    cursor = connection.cursor()
    query = 'SELECT * FROM users WHERE username = %(username)s AND password = %(hashed_password)s'  # Query to check if the user exists
    params = {'username': username, 'hashed_password': hashed_password}  # Parameters for the query
    cursor.execute(query, params)  # Executing the query
    user = cursor.fetchone()  # Fetching the result
    cursor.close()
    connection.close()

    if user:  # check if user exists
        return jsonify({'message': 'Login successful', 'user_id': user[0], 'username': user[1]})
    else:
        return jsonify({'error': 'Invalid username or password'}), 401


@app.route('/posts', methods=['GET'])  # Route to get all posts
def get_posts():
    connection = get_db_connection()
    cursor = connection.cursor()
    query = '''
        SELECT p.post_id, p.title, p.content, p.user_id, p.category_id, p.creation_date, COALESCE(COUNT(l.like_id), 0) as likes
        FROM posts p
        LEFT JOIN likes l ON p.post_id = l.post_id
        GROUP BY p.post_id
        ORDER BY p.creation_date DESC  # Sorting posts by creation date in descending order
    '''
    cursor.execute(query)
    posts = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify([{
        'post_id': post[0],
        'title': post[1],
        'content': post[2],
        'user_id': post[3],
        'category_id': post[4],
        'creation_date': post[5],
        'likes': post[6]
    } for post in posts])


@app.route('/categories/<int:category_id>/posts', methods=['GET'])  # Route to get posts by category
def get_posts_by_category(category_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    query = '''
        SELECT p.post_id, p.title, p.content, p.user_id, p.category_id, p.creation_date, COALESCE(COUNT(l.like_id), 0) as likes
        FROM posts p
        LEFT JOIN likes l ON p.post_id = l.post_id
        WHERE p.category_id = %s
        GROUP BY p.post_id
        ORDER BY p.creation_date DESC  # Sorting posts by creation date in descending order
    '''
    cursor.execute(query, (category_id,))
    posts = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify([{
        'post_id': post[0],
        'title': post[1],
        'content': post[2],
        'user_id': post[3],
        'category_id': post[4],
        'creation_date': post[5],
        'likes': post[6]
    } for post in posts])


@app.route('/categories', methods=['GET'])  # Route to get all categories
def get_categories():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM categories')
    categories = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify([{
        'category_id': category[0],
        'name': category[1],
        'description': category[2],
        'creation_date': category[3]
    } for category in categories])  # Returning the categories as JSON


@app.route('/posts', methods=['POST'])  # Route to create a new post
def create_post():
    data = request.json
    title = data.get('title')
    content = data.get('content')
    category_id = data.get('category_id')
    user_id = data.get('user_id')

    if not title or not content or not category_id:  # Checking if all required fields are present
        return jsonify({'error': 'Title, content, and category are required'}), 400

    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute(
            'INSERT INTO posts (title, content, user_id, category_id, creation_date) VALUES (%s, %s, %s, %s, NOW())',
            (title, content, user_id, category_id)
        )
        connection.commit()
    except mysql.connector.Error as err:  # Handling database errors
        return jsonify({'error': str(err)}), 400  # Returning an error message
    finally:
        cursor.close()
        connection.close()

    return jsonify({'message': 'Post created successfully'})


@app.route('/categories', methods=['POST'])  # Route to create a new category
def create_category():
    data = request.json
    name = data.get('name')
    description = data.get('description')

    if not name or not description:  # Checking if all required fields are present
        return jsonify({'error': 'Name and description are required'}), 400

    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute(
            'INSERT INTO categories (name, description, creation_date) VALUES (%s, %s, NOW())',
            (name, description)  # Inserting the category data into the database
        )
        connection.commit()
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 400
    finally:
        cursor.close()
        connection.close()

    return jsonify({'message': 'Category created successfully'})


@app.route('/posts/<int:post_id>/like', methods=['POST'])  # Route to like a post
def like_post(post_id):
    data = request.json
    user_id = data.get('user_id')

    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        # Inserting the like data into the database
        cursor.execute('INSERT INTO likes (user_id, post_id) VALUES (%s, %s)', (user_id, post_id))
        connection.commit()
    except mysql.connector.Error as err:  # Handling database errors
        return jsonify({'error': str(err)}), 400
    finally:
        cursor.close()
        connection.close()

    return jsonify({'message': 'Post liked successfully'})


@app.route('/users/<int:user_id>', methods=['GET'])  # Route to get a user by ID
def get_user(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT user_id, username, email FROM users WHERE user_id = %s', (user_id,))  # Query to get the user data
    user = cursor.fetchone()  # Fetching the result
    cursor.close()
    connection.close()

    if user:  # If user exists
        return jsonify({
            'user_id': user[0],
            'username': user[1],
            'email': user[2]
        })
    else:
        return jsonify({'error': 'User not found'}), 404


@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        # Delete likes associated with the user
        cursor.execute('DELETE FROM likes WHERE user_id = %s', (user_id,))

        # Delete posts associated with the user
        cursor.execute('DELETE FROM posts WHERE user_id = %s', (user_id,))

        # Now delete the user
        cursor.execute('DELETE FROM users WHERE user_id = %s', (user_id,))
        connection.commit()

        if cursor.rowcount == 0:  # If no rows were affected, user was not found
            return jsonify({'error': 'User not found'}), 404
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 400
    finally:
        cursor.close()
        connection.close()

    return jsonify({'message': 'User deleted successfully'})

@app.route('/users/<int:user_id>/posts', methods=['GET'])  # New route to get posts by a specific user
def get_posts_by_user(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    query = '''
        SELECT p.post_id, p.title, p.content, p.user_id, p.category_id, p.creation_date, COALESCE(COUNT(l.like_id), 0) as likes
        FROM posts p
        LEFT JOIN likes l ON p.post_id = l.post_id
        WHERE p.user_id = %s
        GROUP BY p.post_id
        ORDER BY p.creation_date DESC  # Sorting posts by creation date in descending order
    '''
    cursor.execute(query, (user_id,))
    posts = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify([{
        'post_id': post[0],
        'title': post[1],
        'content': post[2],
        'user_id': post[3],
        'category_id': post[4],
        'creation_date': post[5],
        'likes': post[6]
    } for post in posts])



if __name__ == '__main__':
    app.run(host='0.0.0.0')
