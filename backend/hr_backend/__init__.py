from flask import Flask, jsonify, request
from db import init_db, SessionLocal, User
import uuid
import os
from password_utils import verify_password
import jwt
from datetime import datetime, timedelta

JWT_SECRET = os.getenv('JWT_SECRET', 'dev-secret')
JWT_EXP_SECONDS = int(os.getenv('JWT_EXP_SECONDS', 86400))  # 1 day

app = Flask(__name__)

# Initialize DB (creates tables and seeds demo data when needed)
init_db()

from functools import wraps
from flask import g


def _get_token_from_header():
    auth = request.headers.get('Authorization', '')
    if not auth or not auth.startswith('Bearer '):
        return None
    return auth.split(' ', 1)[1]


def login_required(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        token = _get_token_from_header()
        if not token:
            return jsonify({'message': 'missing token'}), 401
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'invalid token'}), 401
        # attach identity to request
        request.user_id = payload.get('sub')
        return f(*args, **kwargs)
    return wrapped


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})

@app.route("/api/employees")
@login_required
def get_employees():
    with SessionLocal() as session:
        users = session.query(User).all()
        employees = []
        for u in users:
            emp = {
                "id": str(u.id),
                "name": u.name,
                "role": u.position or u.role,
            }
            # Include manager information if available
            if u.manager:
                emp["manager"] = {
                    "id": str(u.manager.id),
                    "name": u.manager.name,
                    "position": u.manager.position,
                }
            employees.append(emp)
        return jsonify({"employees": employees})

@app.route("/api/users/<user_id>")
@login_required
def get_user(user_id: str):
    # Accept UUIDs as strings; attempt to parse into a uuid.UUID for DB lookup
    try:
        uid = uuid.UUID(user_id)
    except Exception:
        uid = user_id

    with SessionLocal() as session:
        u = session.query(User).filter(User.id == uid).first()
        if not u:
            return jsonify({"message": "not found"}), 404
        result = {
            "id": str(u.id),
            "name": u.name,
            "email": u.email,
            "position": u.position,
            "dateOfBirth": u.date_of_birth,
            "address": u.address,
            "phone": u.phone,
            "startDate": u.start_date,
        }
        # Include manager information if available
        if u.manager:
            result["manager"] = {
                "id": str(u.manager.id),
                "name": u.manager.name,
                "position": u.manager.position,
            }
        return jsonify(result)

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    with SessionLocal() as session:
        u = session.query(User).filter(User.email == email).first()
        if u and u.password and verify_password(password or '', u.password):
            # create JWT token containing user id
            payload = {
                'sub': str(u.id),
                'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_SECONDS),
                'iat': datetime.utcnow(),
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
            return jsonify({"user": {"id": str(u.id), "email": u.email, "name": u.name, "position": u.position}, "token": token})
    return jsonify({"message": "invalid credentials"}), 401


@app.route('/api/me')
@login_required
def me():
    uid = request.user_id
    try:
        uid_parsed = uuid.UUID(uid)
    except Exception:
        uid_parsed = uid

    with SessionLocal() as session:
        u = session.query(User).filter(User.id == uid_parsed).first()
        if not u:
            return jsonify({'message': 'not found'}), 404
        result = {
            'id': str(u.id),
            'name': u.name,
            'email': u.email,
            'position': u.position,
        }
        # Include manager information if available
        if u.manager:
            result['manager'] = {
                'id': str(u.manager.id),
                'name': u.manager.name,
                'position': u.manager.position,
            }
        return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
