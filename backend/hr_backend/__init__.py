from flask import Flask, jsonify, request, send_file, Response
from db import init_db, SessionLocal, User, Resource, TimeOff, Notification
import uuid
import os
from password_utils import verify_password, hash_password
import jwt
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
from s3_utils import upload_file_to_s3, download_file_from_s3, delete_file_from_s3
from io import BytesIO

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


def admin_required(f):
    @wraps(f)
    @login_required
    def wrapped(*args, **kwargs):
        uid = request.user_id
        try:
            uid_parsed = uuid.UUID(uid)
        except Exception:
            uid_parsed = uid
        
        with SessionLocal() as session:
            u = session.query(User).filter(User.id == uid_parsed).first()
            if not u:
                return jsonify({'message': 'user not found'}), 404
            # Check if user has admin type
            if u.user_type != 'admin':
                return jsonify({'message': 'admin access required'}), 403
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
            "role": u.role,
            "userType": u.user_type,
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
            return jsonify({"user": {"id": str(u.id), "email": u.email, "name": u.name, "position": u.position, "userType": u.user_type}, "token": token})
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
            'userType': u.user_type,
        }
        # Include manager information if available
        if u.manager:
            result['manager'] = {
                'id': str(u.manager.id),
                'name': u.manager.name,
                'position': u.manager.position,
            }
        return jsonify(result)


@app.route("/api/direct-reports", methods=["GET"])
@login_required
def get_direct_reports():
    """Get all users who report directly to the current user."""
    uid = request.user_id
    try:
        uid_parsed = uuid.UUID(uid)
    except Exception:
        uid_parsed = uid

    with SessionLocal() as session:
        # Get all users who report to the current user
        direct_reports = session.query(User).filter(User.reports_to_id == uid_parsed).all()
        
        result = []
        for emp in direct_reports:
            result.append({
                "id": str(emp.id),
                "name": emp.name,
                "email": emp.email,
                "position": emp.position,
                "role": emp.role,
            })
        
        return jsonify({"directReports": result})


# Admin endpoints
@app.route("/api/admin/users", methods=["POST"])
@admin_required
def create_user():
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    position = data.get("position")
    role = data.get("role")
    user_type = data.get("userType", "user")  # Default to 'user'
    reports_to_id = data.get("reportsToId")
    date_of_birth = data.get("dateOfBirth")
    address = data.get("address")
    phone = data.get("phone")
    start_date = data.get("startDate")
    
    if not name or not email or not password:
        return jsonify({"message": "name, email, and password are required"}), 400
    
    with SessionLocal() as session:
        # Check if email already exists
        existing = session.query(User).filter(User.email == email).first()
        if existing:
            return jsonify({"message": "email already exists"}), 400
        
        # Validate reports_to_id if provided
        reports_to = None
        if reports_to_id:
            try:
                reports_to_uid = uuid.UUID(reports_to_id)
                reports_to = session.query(User).filter(User.id == reports_to_uid).first()
                if not reports_to:
                    return jsonify({"message": "invalid reports_to_id"}), 400
            except Exception:
                return jsonify({"message": "invalid reports_to_id format"}), 400
        
        # Validate user_type
        if user_type not in ['user', 'admin']:
            return jsonify({"message": "userType must be 'user' or 'admin'"}), 400
        
        new_user = User(
            name=name,
            email=email,
            password=hash_password(password),
            position=position,
            role=role,
            user_type=user_type,
            reports_to_id=reports_to.id if reports_to else None,
            date_of_birth=date_of_birth,
            address=address,
            phone=phone,
            start_date=start_date,
        )
        session.add(new_user)
        session.commit()
        
        return jsonify({
            "id": str(new_user.id),
            "name": new_user.name,
            "email": new_user.email,
            "position": new_user.position,
        }), 201


@app.route("/api/admin/users/<user_id>", methods=["PUT"])
@admin_required
def update_user(user_id: str):
    try:
        uid = uuid.UUID(user_id)
    except Exception:
        uid = user_id
    
    data = request.get_json() or {}
    
    with SessionLocal() as session:
        u = session.query(User).filter(User.id == uid).first()
        if not u:
            return jsonify({"message": "user not found"}), 404
        
        # Update fields if provided
        if "name" in data:
            u.name = data["name"]
        if "email" in data:
            # Check if email is already taken by another user
            existing = session.query(User).filter(User.email == data["email"], User.id != uid).first()
            if existing:
                return jsonify({"message": "email already exists"}), 400
            u.email = data["email"]
        if "position" in data:
            u.position = data["position"]
        if "role" in data:
            u.role = data["role"]
        if "userType" in data:
            if data["userType"] not in ['user', 'admin']:
                return jsonify({"message": "userType must be 'user' or 'admin'"}), 400
            u.user_type = data["userType"]
        if "dateOfBirth" in data:
            u.date_of_birth = data["dateOfBirth"]
        if "address" in data:
            u.address = data["address"]
        if "phone" in data:
            u.phone = data["phone"]
        if "startDate" in data:
            u.start_date = data["startDate"]
        if "password" in data and data["password"]:
            u.password = hash_password(data["password"])
        if "reportsToId" in data:
            if data["reportsToId"]:
                try:
                    reports_to_uid = uuid.UUID(data["reportsToId"])
                    reports_to = session.query(User).filter(User.id == reports_to_uid).first()
                    if not reports_to:
                        return jsonify({"message": "invalid reports_to_id"}), 400
                    u.reports_to_id = reports_to.id
                except Exception:
                    return jsonify({"message": "invalid reports_to_id format"}), 400
            else:
                u.reports_to_id = None
        
        session.commit()
        
        return jsonify({
            "id": str(u.id),
            "name": u.name,
            "email": u.email,
            "position": u.position,
            "role": u.role,
            "userType": u.user_type,
        }), 200


@app.route("/api/admin/resources", methods=["POST"])
@admin_required
def upload_resource():
    if 'file' not in request.files:
        return jsonify({"message": "no file provided"}), 400
    
    file = request.files['file']
    description = request.form.get('description', '')
    
    if file.filename == '':
        return jsonify({"message": "no file selected"}), 400
    
    # Check if file is PDF
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"message": "only PDF files are allowed"}), 400
    
    # Generate unique S3 key
    file_id = str(uuid.uuid4())
    original_filename = secure_filename(file.filename)
    s3_key = f"resources/{file_id}/{original_filename}"
    
    # Read file content
    file.seek(0)  # Reset file pointer
    file_content = file.read()
    file_size = len(file_content)
    
    # Upload to S3
    file_obj = BytesIO(file_content)
    success, error_message = upload_file_to_s3(file_obj, s3_key, content_type='application/pdf')
    if not success:
        return jsonify({"message": error_message or "failed to upload file to S3"}), 500
    
    # Save to database
    with SessionLocal() as session:
        uid = request.user_id
        try:
            uid_parsed = uuid.UUID(uid)
        except Exception:
            uid_parsed = uid
        
        resource = Resource(
            filename=original_filename,
            original_filename=original_filename,
            s3_key=s3_key,
            file_size=file_size,
            uploaded_by_id=uid_parsed,
            created_at=datetime.utcnow().isoformat(),
            description=description,
        )
        session.add(resource)
        session.commit()
        
        return jsonify({
            "id": str(resource.id),
            "filename": resource.original_filename,
            "size": resource.file_size,
            "createdAt": resource.created_at,
            "description": resource.description,
        }), 201


@app.route("/api/resources", methods=["GET"])
@login_required
def list_resources():
    with SessionLocal() as session:
        resources = session.query(Resource).order_by(Resource.created_at.desc()).all()
        result = []
        for r in resources:
            result.append({
                "id": str(r.id),
                "filename": r.original_filename,
                "size": r.file_size,
                "createdAt": r.created_at,
                "description": r.description,
            })
        return jsonify({"resources": result})


@app.route("/api/resources/<resource_id>", methods=["GET"])
@login_required
def get_resource(resource_id: str):
    try:
        rid = uuid.UUID(resource_id)
    except Exception:
        rid = resource_id
    
    with SessionLocal() as session:
        resource = session.query(Resource).filter(Resource.id == rid).first()
        if not resource:
            return jsonify({"message": "resource not found"}), 404
        
        # Download file from S3
        file_content = download_file_from_s3(resource.s3_key)
        if file_content is None:
            return jsonify({"message": "file not found in S3"}), 404
        
        return Response(
            file_content,
            mimetype='application/pdf',
            headers={
                'Content-Disposition': f'attachment; filename="{resource.original_filename}"'
            }
        )


@app.route("/api/admin/resources/<resource_id>", methods=["DELETE"])
@admin_required
def delete_resource(resource_id: str):
    try:
        rid = uuid.UUID(resource_id)
    except Exception:
        rid = resource_id
    
    with SessionLocal() as session:
        resource = session.query(Resource).filter(Resource.id == rid).first()
        if not resource:
            return jsonify({"message": "resource not found"}), 404
        
        # Delete file from S3
        if not delete_file_from_s3(resource.s3_key):
            # Log error but continue with database deletion
            print(f"Warning: Failed to delete file from S3: {resource.s3_key}")
        
        # Delete from database
        session.delete(resource)
        session.commit()
        
        return jsonify({"message": "resource deleted"}), 200


# Time Off endpoints
@app.route("/api/time-off", methods=["POST"])
@login_required
def create_time_off():
    data = request.get_json() or {}
    start_date = data.get("startDate")
    end_date = data.get("endDate")
    notes = data.get("notes", "")
    
    if not start_date or not end_date:
        return jsonify({"message": "startDate and endDate are required"}), 400
    
    # Validate date format and that end_date is after start_date
    try:
        start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        if end < start:
            return jsonify({"message": "endDate must be after startDate"}), 400
    except ValueError:
        return jsonify({"message": "Invalid date format. Use ISO format (YYYY-MM-DD)"}), 400
    
    with SessionLocal() as session:
        uid = request.user_id
        try:
            uid_parsed = uuid.UUID(uid)
        except Exception:
            uid_parsed = uid
        
        # Check if user exists
        user = session.query(User).filter(User.id == uid_parsed).first()
        if not user:
            return jsonify({"message": "user not found"}), 404
        
        time_off = TimeOff(
            user_id=uid_parsed,
            start_date=start_date,
            end_date=end_date,
            created_at=datetime.utcnow().isoformat(),
            status='pending',
            notes=notes,
        )
        session.add(time_off)
        session.flush()  # Flush to get the time_off.id
        
        # Send notification to manager if user has one
        if user.manager:
            notification = Notification(
                user_id=user.manager.id,
                title=f"Time Off Request from {user.name}",
                message=f"{user.name} has requested time off from {start_date} to {end_date}.",
                created_at=datetime.utcnow().isoformat(),
                read='false',
                type='info',
                link=f"/approve-time-off?id={time_off.id}",
            )
            session.add(notification)
        
        session.commit()
        
        return jsonify({
            "id": str(time_off.id),
            "startDate": time_off.start_date,
            "endDate": time_off.end_date,
            "status": time_off.status,
            "notes": time_off.notes,
            "createdAt": time_off.created_at,
        }), 201


@app.route("/api/time-off", methods=["GET"])
@login_required
def list_time_off():
    uid = request.user_id
    try:
        uid_parsed = uuid.UUID(uid)
    except Exception:
        uid_parsed = uid
    
    with SessionLocal() as session:
        # Get all time off requests for the current user
        time_off_requests = session.query(TimeOff).filter(TimeOff.user_id == uid_parsed).order_by(TimeOff.start_date.desc()).all()
        
        result = []
        for to in time_off_requests:
            result.append({
                "id": str(to.id),
                "startDate": to.start_date,
                "endDate": to.end_date,
                "status": to.status,
                "notes": to.notes,
                "createdAt": to.created_at,
            })
        
        return jsonify({"timeOff": result})


@app.route("/api/time-off/<time_off_id>/approve", methods=["PUT"])
@login_required
def approve_time_off(time_off_id: str):
    return update_time_off_status(time_off_id, 'approved')


@app.route("/api/time-off/<time_off_id>/reject", methods=["PUT"])
@login_required
def reject_time_off(time_off_id: str):
    return update_time_off_status(time_off_id, 'rejected')


def update_time_off_status(time_off_id: str, new_status: str):
    """Helper function to update time off status and send notification to employee."""
    try:
        toid = uuid.UUID(time_off_id)
    except Exception:
        toid = time_off_id
    
    uid = request.user_id
    try:
        uid_parsed = uuid.UUID(uid)
    except Exception:
        uid_parsed = uid
    
    with SessionLocal() as session:
        time_off = session.query(TimeOff).filter(TimeOff.id == toid).first()
        if not time_off:
            return jsonify({"message": "time off request not found"}), 404
        
        # Check if current user is the manager of the employee who requested time off
        employee = session.query(User).filter(User.id == time_off.user_id).first()
        if not employee:
            return jsonify({"message": "employee not found"}), 404
        
        # Check if current user is the employee's manager
        if not employee.manager or employee.manager.id != uid_parsed:
            return jsonify({"message": "only the employee's manager can approve/reject this request"}), 403
        
        # Update status
        time_off.status = new_status
        session.flush()
        
        # Send notification to employee
        status_text = 'approved' if new_status == 'approved' else 'rejected'
        notification = Notification(
            user_id=time_off.user_id,
            title=f"Time Off Request {status_text.capitalize()}",
            message=f"Your time off request from {time_off.start_date} to {time_off.end_date} has been {status_text}.",
            created_at=datetime.utcnow().isoformat(),
            read='false',
            type='success' if new_status == 'approved' else 'warning',
        )
        session.add(notification)
        session.commit()
        
        return jsonify({
            "id": str(time_off.id),
            "startDate": time_off.start_date,
            "endDate": time_off.end_date,
            "status": time_off.status,
            "notes": time_off.notes,
            "createdAt": time_off.created_at,
        }), 200


@app.route("/api/time-off/<time_off_id>", methods=["DELETE"])
@login_required
def cancel_time_off(time_off_id: str):
    """Cancel/delete a pending time off request. Only the user who created it can cancel."""
    try:
        toid = uuid.UUID(time_off_id)
    except Exception:
        toid = time_off_id
    
    uid = request.user_id
    try:
        uid_parsed = uuid.UUID(uid)
    except Exception:
        uid_parsed = uid
    
    with SessionLocal() as session:
        time_off = session.query(TimeOff).filter(TimeOff.id == toid).first()
        if not time_off:
            return jsonify({"message": "time off request not found"}), 404
        
        # Check if current user is the one who created the request
        if time_off.user_id != uid_parsed:
            return jsonify({"message": "you can only cancel your own time off requests"}), 403
        
        # Only allow canceling pending requests
        if time_off.status != 'pending':
            return jsonify({"message": "only pending requests can be canceled"}), 400
        
        # If the request has a manager, notify them of the cancellation
        employee = session.query(User).filter(User.id == time_off.user_id).first()
        if employee and employee.manager:
            notification = Notification(
                user_id=employee.manager.id,
                title=f"Time Off Request Cancelled by {employee.name}",
                message=f"{employee.name} has cancelled their time off request from {time_off.start_date} to {time_off.end_date}.",
                created_at=datetime.utcnow().isoformat(),
                read='false',
                type='info',
            )
            session.add(notification)
        
        # Delete the time off request
        session.delete(time_off)
        session.commit()
        
        return jsonify({"message": "time off request cancelled"}), 200


@app.route("/api/time-off/pending", methods=["GET"])
@login_required
def list_pending_time_off():
    """Get all pending time off requests for employees reporting to the current user (manager)."""
    uid = request.user_id
    try:
        uid_parsed = uuid.UUID(uid)
    except Exception:
        uid_parsed = uid
    
    with SessionLocal() as session:
        # Get all users who report to the current user
        direct_reports = session.query(User).filter(User.reports_to_id == uid_parsed).all()
        report_ids = [u.id for u in direct_reports]
        
        if not report_ids:
            return jsonify({"timeOff": []})
        
        # Get all pending time off requests for direct reports
        pending_requests = session.query(TimeOff).filter(
            TimeOff.user_id.in_(report_ids),
            TimeOff.status == 'pending'
        ).order_by(TimeOff.created_at.desc()).all()
        
        result = []
        for to in pending_requests:
            employee = session.query(User).filter(User.id == to.user_id).first()
            result.append({
                "id": str(to.id),
                "employeeId": str(to.user_id),
                "employeeName": employee.name if employee else "Unknown",
                "startDate": to.start_date,
                "endDate": to.end_date,
                "status": to.status,
                "notes": to.notes,
                "createdAt": to.created_at,
            })
        
        return jsonify({"timeOff": result})


# Notifications endpoints
@app.route("/api/notifications", methods=["GET"])
@login_required
def list_notifications():
    uid = request.user_id
    try:
        uid_parsed = uuid.UUID(uid)
    except Exception:
        uid_parsed = uid
    
    with SessionLocal() as session:
        # Get all notifications for the current user, ordered by most recent first
        notifications = session.query(Notification).filter(
            Notification.user_id == uid_parsed
        ).order_by(Notification.created_at.desc()).all()
        
        result = []
        for notif in notifications:
            result.append({
                "id": str(notif.id),
                "title": notif.title,
                "message": notif.message,
                "type": notif.type,
                "read": notif.read == 'true',
                "createdAt": notif.created_at,
                "link": notif.link,
            })
        
        return jsonify({"notifications": result})


@app.route("/api/notifications/<notification_id>/read", methods=["PUT"])
@login_required
def mark_notification_read(notification_id: str):
    try:
        nid = uuid.UUID(notification_id)
    except Exception:
        nid = notification_id
    
    uid = request.user_id
    try:
        uid_parsed = uuid.UUID(uid)
    except Exception:
        uid_parsed = uid
    
    with SessionLocal() as session:
        notification = session.query(Notification).filter(
            Notification.id == nid,
            Notification.user_id == uid_parsed
        ).first()
        
        if not notification:
            return jsonify({"message": "notification not found"}), 404
        
        notification.read = 'true'
        session.commit()
        
        return jsonify({
            "id": str(notification.id),
            "read": True,
        }), 200


@app.route("/api/notifications/read-all", methods=["PUT"])
@login_required
def mark_all_notifications_read():
    uid = request.user_id
    try:
        uid_parsed = uuid.UUID(uid)
    except Exception:
        uid_parsed = uid
    
    with SessionLocal() as session:
        # Mark all unread notifications as read
        updated = session.query(Notification).filter(
            Notification.user_id == uid_parsed,
            Notification.read == 'false'
        ).update({'read': 'true'})
        
        session.commit()
        
        return jsonify({"message": f"Marked {updated} notifications as read"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
