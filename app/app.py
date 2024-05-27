from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import hashlib
import mysql.connector
from like_batcher import like_batcher
from db_utils import get_db_connection

app = Flask(__name__)
CORS(app)


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


# User registration route
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Username, email, and password are required'}), 400

    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute(
            'INSERT INTO users (username, email, password) VALUES (%s, %s, %s)',
            (username, email, hashed_password)
        )
        connection.commit()
    except mysql.connector.IntegrityError as err:
        return jsonify({'error': str(err)}), 400
    finally:
        cursor.close()
        connection.close()

    return jsonify({'message': 'User registered successfully'})


# User login route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    connection = get_db_connection()
    cursor = connection.cursor()
    query = 'SELECT * FROM users WHERE username = %(username)s AND password = %(hashed_password)s'
    params = {'username': username, 'hashed_password': hashed_password}
    cursor.execute(query, params)
    user = cursor.fetchone()
    cursor.close()
    connection.close()

    if user:
        return jsonify({'message': 'Login successful', 'user_id': user[0], 'username': user[1]})
    else:
        return jsonify({'error': 'Invalid username or password'}), 401


# Route to get all posts
@app.route('/posts', methods=['GET'])
def get_posts():
    connection = get_db_connection()
    cursor = connection.cursor()
    query = '''
        SELECT p.post_id, p.title, p.content, p.user_id, p.category_id, p.creation_date, p.likes
        FROM posts p
        ORDER BY p.creation_date DESC
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


# Route to get posts by category
@app.route('/categories/<int:category_id>/posts', methods=['GET'])
def get_posts_by_category(category_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    query = '''
        SELECT p.post_id, p.title, p.content, p.user_id, p.category_id, p.creation_date, p.likes
        FROM posts p
        WHERE p.category_id = %s
        ORDER BY p.creation_date DESC
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


# Route to get all categories
@app.route('/categories', methods=['GET'])
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
    } for category in categories])


# Route to create a new post
@app.route('/posts', methods=['POST'])
def create_post():
    data = request.json
    title = data.get('title')
    content = data.get('content')
    category_id = data.get('category_id')
    user_id = data.get('user_id')

    if not title or not content or not category_id:
        return jsonify({'error': 'Title, content, and category are required'}), 400

    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute(
            'INSERT INTO posts (title, content, user_id, category_id, creation_date) VALUES (%s, %s, %s, %s, NOW())',
            (title, content, user_id, category_id)
        )
        connection.commit()
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 400
    finally:
        cursor.close()
        connection.close()

    return jsonify({'message': 'Post created successfully'})


# Route to create a new category
@app.route('/categories', methods=['POST'])
def create_category():
    data = request.json
    name = data.get('name')
    description = data.get('description')

    if not name or not description:
        return jsonify({'error': 'Name and description are required'}), 400

    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute(
            'INSERT INTO categories (name, description, creation_date) VALUES (%s, %s, NOW())',
            (name, description)
        )
        connection.commit()
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 400
    finally:
        cursor.close()
        connection.close()

    return jsonify({'message': 'Category created successfully'})


# Route to like a post
@app.route('/posts/<int:post_id>/like', methods=['POST'])
def like_post(post_id):
    data = request.json
    data.get('user_id')

    like_batcher.add_like(post_id)
    return jsonify({'message': 'Like received'})


# Route to get a user by ID
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT user_id, username, email FROM users WHERE user_id = %s', (user_id,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()

    if user:
        return jsonify({
            'user_id': user[0],
            'username': user[1],
            'email': user[2]
        })
    else:
        return jsonify({'error': 'User not found'}), 404


# Route to delete a user by ID
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute('DELETE FROM likes WHERE user_id = %s', (user_id,))
        cursor.execute('DELETE FROM posts WHERE user_id = %s', (user_id,))
        cursor.execute('DELETE FROM users WHERE user_id = %s', (user_id,))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': 'User not found'}), 404
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 400
    finally:
        cursor.close()
        connection.close()

    return jsonify({'message': 'User deleted successfully'})


# get posts by a specific user
@app.route('/users/<int:user_id>/posts', methods=['GET'])  
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
    try:
        app.run(host='0.0.0.0')
    finally:
        like_batcher.stop()
