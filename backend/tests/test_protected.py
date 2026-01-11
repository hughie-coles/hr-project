import jwt
import os
from hr_backend import app
from db import init_db

JWT_SECRET = os.getenv('JWT_SECRET', 'dev-secret')


def setup_module(module):
    init_db()


def get_token_for_email(email: str):
    client = app.test_client()
    resp = client.post('/api/auth/login', json={'email': email, 'password': 'password'})
    assert resp.status_code == 200
    data = resp.get_json()
    return data['token']


def test_protected_me_requires_token():
    client = app.test_client()
    resp = client.get('/api/me')
    assert resp.status_code == 401


def test_protected_me_returns_user():
    token = get_token_for_email('alex@example.com')
    client = app.test_client()
    resp = client.get('/api/me', headers={'Authorization': f'Bearer {token}'})
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['email'] == 'alex@example.com'


def test_employees_requires_auth():
    client = app.test_client()
    resp = client.get('/api/employees')
    assert resp.status_code == 401


def test_employees_with_token():
    token = get_token_for_email('alex@example.com')
    client = app.test_client()
    resp = client.get('/api/employees', headers={'Authorization': f'Bearer {token}'})
    assert resp.status_code == 200
    data = resp.get_json()
    assert 'employees' in data
