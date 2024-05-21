import pytest
from flask import Flask
from flask.testing import FlaskClient
from typing import Generator
from unittest.mock import MagicMock

from app.app import app, get_db_connection

@pytest.fixture
def client() -> Generator[FlaskClient, None, None]:
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_index(client: FlaskClient, mocker):
    mock_db_connection = mocker.patch("app.app.get_db_connection")
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = (42,)
    mock_db_connection.return_value.cursor.return_value = mock_cursor

    response = client.get("/")
    assert response.status_code == 200
    assert b"user_count" in response.data

def test_register(client: FlaskClient, mocker):
    mock_db_connection = mocker.patch('app.app.get_db_connection')
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
    mock_db_connection = mocker.patch('app.app.get_db_connection')
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