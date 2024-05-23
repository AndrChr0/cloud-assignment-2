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
# from db_utils import get_db_connection
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
    like_batcher.stop()  # Make sure this properly stops any background threads or processes
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

    # print("test_index passed")

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

    # print("test_register passed")

def test_login(client: FlaskClient, mocker):
    print("Running test_login")
    mock_db_connection = mocker.patch('app.get_db_connection')
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = (1, "testuser", "test@user.com")  # Mocking user data
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    # Create a test user
    client.post("/register", json={
        "username": "testuser",
        "email": "test@user.com",
        "password": "test@user.com"
    })
    # Attempt to log in
    response = client.post("/login", json={
        "username": "testuser",
        "password": "test@user.com"
    })
    assert response.status_code == 200
    assert b"Login successful" in response.data

    # print("test_login passed")

if __name__ == "__main__":
    import time
    start_time = time.time()
    try:
        pytest.main(["-v", "--maxfail=1", "--disable-warnings"])
    finally:
        duration = time.time() - start_time
        # print(f"Tests completed in {duration} seconds")
