import os
import jwt
from hr_backend import app
from db import init_db

JWT_SECRET = os.getenv('JWT_SECRET', 'dev-secret')


def setup_module(module):
    # Ensure DB and seed data
    init_db()


def test_login_and_get_user():
    client = app.test_client()
    # login with seeded user
    resp = client.post('/api/auth/login', json={'email': 'alex@example.com', 'password': 'password'})
    assert resp.status_code == 200
    data = resp.get_json()
    assert 'token' in data
    assert 'user' in data
    token = data['token']
    # verify token decodes to sub=userid
    payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    assert 'sub' in payload
    uid = payload['sub']

    # fetch the user endpoint
    resp = client.get(f'/api/users/{uid}')
    assert resp.status_code == 200
    user_data = resp.get_json()
    assert user_data['email'] == 'alex@example.com'
