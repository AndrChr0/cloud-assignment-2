from typing import Dict, List
from flask import Flask, json, request, jsonify
from flask_cors import CORS
import mysql.connector
import hashlib

app = Flask(__name__)
CORS(app)

def get_db_connection():
    config = {
        'user': 'root',
        'password': 'root',
        'host': 'db',
        'port': '3306',
        'database': 'cloud_reddit_db'
    }
    return mysql.connector.connect(**config)

def favorite_colors() -> List[Dict]:
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM favorite_colors')
    results = [{name: color} for (name, color) in cursor]
    cursor.close()
    connection.close()
    return results

@app.route('/')
def index() -> str:
    return json.dumps({'favorite_colors': favorite_colors()})

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
        cursor.execute('INSERT INTO users (username, email, password) VALUES (%s, %s, %s)', (username, email, hashed_password))
        connection.commit()
    except mysql.connector.IntegrityError as err:
        return jsonify({'error': str(err)}), 400
    finally:
        cursor.close()
        connection.close()

    return jsonify({'message': 'User registered successfully'})

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
    cursor.execute('SELECT * FROM users WHERE username = %s AND password = %s', (username, hashed_password))
    user = cursor.fetchone()
    cursor.close()
    connection.close()

    if user:
        return jsonify({'message': 'Login successful', 'user_id': user[0], 'username': user[1]})
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0')
