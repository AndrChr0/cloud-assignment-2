from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Database configuration
db_config = {
    'user': 'root',
    'password': 'root',
    'host': '127.0.0.1',
    'port': '3306',
    'database': 'cloud_db_a2'
}

# Connect to the database
def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn

# Define the /posts endpoint
@app.route('/posts', methods=['GET', 'POST'])
def posts():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        new_post = request.get_json()
        title = new_post['title']
        description = new_post['description']
        cursor.execute('INSERT INTO posts (title, description) VALUES (%s, %s)', (title, description))
        conn.commit()
        return jsonify({'status': 'success', 'message': 'Post added'}), 201

    elif request.method == 'GET':
        cursor.execute('SELECT * FROM posts')
        posts = cursor.fetchall()
        return jsonify(posts)

    cursor.close()
    conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)