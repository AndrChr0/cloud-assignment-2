import pytest
from flask import Flask
from flask.testing import FlaskClient
from typing import Generator
from unittest.mock import MagicMock
import sys
import os

# Ensure the 'app' directory is in the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app')))

from app import app
from db_utils import get_db_connection
from like_batcher import like_batcher

@pytest.fixture
def client() -> Generator[FlaskClient, None, None]:
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client
    print("Client fixture cleaned up")

@pytest.fixture(autouse=True)
def run_around_tests():
    # Code to run before each test
    print("Starting a test")
    yield
    # Code to run after each test
    print("Finished a test")
    like_batcher.stop()
    print("like_batcher stopped")

def test_index(client: FlaskClient, mocker):
    print("Running test_index")
    mock_db_connection = mocker.patch("app.get_db_connection")
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = (42,)
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    response = client.get("/")
    assert response.status_code == 200
    assert b"user_count" in response.data

def test_register(client: FlaskClient, mocker):
    print("Running test_register")
    mock_db_connection = mocker.patch('app.get_db_connection')
    mock_cursor = MagicMock()
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    response = client.post("/register", json={
        "username": "testuser",
        "email": "test@user.com",
        "password": "test@user.com"
    })
    assert response.status_code == 200
    assert b"User registered successfully" in response.data

def test_login(client: FlaskClient, mocker):
    print("Running test_login")
    mock_db_connection = mocker.patch('app.get_db_connection')
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = (1, "testuser", "test@user.com")  # Mocking user data
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    response = client.post("/login", json={
        "username": "testuser",
        "password": "test@user.com"
    })
    assert response.status_code == 200
    assert b"Login successful" in response.data

def test_get_posts(client: FlaskClient, mocker):
    print("Running test_get_posts")
    mock_db_connection = mocker.patch('app.get_db_connection')
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = [
        (1, 'Post Title', 'Post Content', 1, 1, '2024-01-01 12:00:00', 0)
    ]
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    response = client.get("/posts")
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['title'] == 'Post Title'

def test_get_posts_by_category(client: FlaskClient, mocker):
    print("Running test_get_posts_by_category")
    mock_db_connection = mocker.patch('app.get_db_connection')
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = [
        (1, 'Post Title', 'Post Content', 1, 1, '2024-01-01 12:00:00', 0)
    ]
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    response = client.get("/categories/1/posts")
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['title'] == 'Post Title'

def test_get_categories(client: FlaskClient, mocker):
    print("Running test_get_categories")
    mock_db_connection = mocker.patch('app.get_db_connection')
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = [
        (1, 'Category Name', 'Category Description', '2024-01-01 12:00:00')
    ]
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    response = client.get("/categories")
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['name'] == 'Category Name'

def test_create_post(client: FlaskClient, mocker):
    print("Running test_create_post")
    mock_db_connection = mocker.patch('app.get_db_connection')
    mock_cursor = MagicMock()
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    response = client.post("/posts", json={
        "title": "New Post",
        "content": "Post Content",
        "category_id": 1,
        "user_id": 1
    })
    assert response.status_code == 200
    assert b"Post created successfully" in response.data

def test_create_category(client: FlaskClient, mocker):
    print("Running test_create_category")
    mock_db_connection = mocker.patch('app.get_db_connection')
    mock_cursor = MagicMock()
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    response = client.post("/categories", json={
        "name": "New Category",
        "description": "Category Description"
    })
    assert response.status_code == 200
    assert b"Category created successfully" in response.data


def test_get_user(client: FlaskClient, mocker):
    print("Running test_get_user")
    mock_db_connection = mocker.patch('app.get_db_connection')
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = (1, "testuser", "test@user.com")
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    response = client.get("/users/1")
    assert response.status_code == 200
    assert response.json['username'] == "testuser"

def test_delete_user(client: FlaskClient, mocker):
    print("Running test_delete_user")
    mock_db_connection = mocker.patch('app.get_db_connection')
    mock_cursor = MagicMock()
    mock_cursor.rowcount = 1
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    response = client.delete("/users/1")
    assert response.status_code == 200
    assert b"User deleted successfully" in response.data

if __name__ == "__main__":
    import time
    start_time = time.time()
    try:
        pytest.main(["-v", "--maxfail=1", "--disable-warnings"])
    finally:
        duration = time.time() - start_time
        print(f"Tests completed in {duration} seconds")
