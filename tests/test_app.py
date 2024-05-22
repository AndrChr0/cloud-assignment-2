import pytest
from flask import Flask
from flask.testing import FlaskClient
from typing import Generator
from unittest.mock import MagicMock

from app.app import app, get_db_connection

# Pytest fixture to create a test client for the Flask app
@pytest.fixture
def client() -> Generator[FlaskClient, None, None]:
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

# Test for the index route
def test_index(client: FlaskClient, mocker):
    # Mocking the database connection and cursor
    mock_db_connection = mocker.patch("app.app.get_db_connection")
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = (42,)
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    # Making a GET request to the index route
    response = client.get("/")
    assert response.status_code == 200
    assert b"user_count" in response.data

# Test for the register route
def test_register(client: FlaskClient, mocker):
    # Mocking the database connection and cursor
    mock_db_connection = mocker.patch('app.app.get_db_connection')
    mock_cursor = MagicMock()
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    # Making a POST request to register a new user
    response = client.post("/register", json={
        "username": "testuser",
        "email": "test@user.com",
        "password": "test@user.com"
    })
    assert response.status_code == 200
    assert b"User registered successfully" in response.data

# Test for the login route
def test_login(client: FlaskClient, mocker):
    # Mocking the database connection and cursor
    mock_db_connection = mocker.patch('app.app.get_db_connection')
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = (1, "testuser", "test@user.com")  # Mocking user data
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    # Making a POST request to log in
    response = client.post("/login", json={
        "username": "testuser",
        "password": "test@user.com"
    })
    assert response.status_code == 200
    assert b"Login successful" in response.data

# Test for the get posts route
def test_get_posts(client: FlaskClient, mocker):
    # Mocking the database connection and cursor
    mock_db_connection = mocker.patch('app.app.get_db_connection')
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = [
        (1, 'Post Title', 'Post Content', 1, 1, '2024-01-01 12:00:00', 0)
    ]
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    # Making a GET request to fetch posts
    response = client.get("/posts")
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['title'] == 'Post Title'

# Test for the get posts by category route
def test_get_posts_by_category(client: FlaskClient, mocker):
    # Mocking the database connection and cursor
    mock_db_connection = mocker.patch('app.app.get_db_connection')
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = [
        (1, 'Post Title', 'Post Content', 1, 1, '2024-01-01 12:00:00', 0)
    ]
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    # Making a GET request to fetch posts by category
    response = client.get("/categories/1/posts")
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['title'] == 'Post Title'

# Test for the get categories route
def test_get_categories(client: FlaskClient, mocker):
    # Mocking the database connection and cursor
    mock_db_connection = mocker.patch('app.app.get_db_connection')
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = [
        (1, 'Category Name', 'Category Description', '2024-01-01 12:00:00')
    ]
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    # Making a GET request to fetch categories
    response = client.get("/categories")
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['name'] == 'Category Name'

# Test for the create post route
def test_create_post(client: FlaskClient, mocker):
    # Mocking the database connection and cursor
    mock_db_connection = mocker.patch('app.app.get_db_connection')
    mock_cursor = MagicMock()
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    # Making a POST request to create a new post
    response = client.post("/posts", json={
        "title": "New Post",
        "content": "Post Content",
        "category_id": 1,
        "user_id": 1
    })
    assert response.status_code == 200
    assert b"Post created successfully" in response.data

# Test for the create category route
def test_create_category(client: FlaskClient, mocker):
    # Mocking the database connection and cursor
    mock_db_connection = mocker.patch('app.app.get_db_connection')
    mock_cursor = MagicMock()
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    # Making a POST request to create a new category
    response = client.post("/categories", json={
        "name": "New Category",
        "description": "Category Description"
    })
    assert response.status_code == 200
    assert b"Category created successfully" in response.data

# Test for the like post route
def test_like_post(client: FlaskClient, mocker):
    # Mocking the database connection and cursor
    mock_db_connection = mocker.patch('app.app.get_db_connection')
    mock_cursor = MagicMock()
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    # Making a POST request to like a post
    response = client.post("/posts/1/like", json={"user_id": 1})
    assert response.status_code == 200
    assert b"Post liked successfully" in response.data

# Test for the get user by ID route
def test_get_user(client: FlaskClient, mocker):
    # Mocking the database connection and cursor
    mock_db_connection = mocker.patch('app.app.get_db_connection')
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = (1, "testuser", "test@user.com")
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    # Making a GET request to fetch user details by ID
    response = client.get("/users/1")
    assert response.status_code == 200
    assert response.json['username'] == "testuser"

# Test for the delete user route
def test_delete_user(client: FlaskClient, mocker):
    # Mocking the database connection and cursor
    mock_db_connection = mocker.patch('app.app.get_db_connection')
    mock_cursor = MagicMock()
    mock_cursor.rowcount = 1
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    # Making a DELETE request to delete a user
    response = client.delete("/users/1")
    assert response.status_code == 200
    assert b"User deleted successfully" in response.data
