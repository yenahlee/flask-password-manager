from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from config import Config
from models import db, User, PasswordEntry
import bcrypt
from cryptography.fernet import Fernet

# Initialize app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)
CORS(app)  # Allow React frontend to access API

# Initialize Fernet encryption
fernet = Fernet(app.config["ENCRYPTION_KEY"])

# Create tables at startup
with app.app_context():
    db.create_all()

# Register new user
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 400

    pw_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    new_user = User(username=username, password_hash=pw_hash)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created"}), 201

# Login user
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.checkpw(password.encode("utf-8"), user.password_hash):
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token), 200

# Protected test route: Get password vault
@app.route("/vault", methods=["GET"])
@jwt_required()
def get_vault():
    user_id = int(get_jwt_identity())
    entries = PasswordEntry.query.filter_by(user_id=user_id).all()

    result = []
    for entry in entries:
        result.append({
            "id": entry.id,
            "site_name": entry.site_name,
            "site_username": entry.site_username,
            "password": fernet.decrypt(entry.encrypted_password).decode(),
            "notes": entry.notes,
            "created_at": entry.created_at
        })

    return jsonify(result), 200

# Add new vault entry
@app.route("/add_entry", methods=["POST"])
@jwt_required()
def add_entry():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    site_name = data.get("site_name")
    site_username = data.get("site_username")
    password = data.get("password")
    notes = data.get("notes", "")

    # Encrypt password
    encrypted_password = fernet.encrypt(password.encode())

    # Create new entry
    new_entry = PasswordEntry(
        site_name=site_name,
        site_username=site_username,
        encrypted_password=encrypted_password,
        notes=notes,
        user_id=user_id
    )

    # Save to DB
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({"msg": "Entry added"}), 201

# Update existing vault entry
@app.route("/update_entry/<int:entry_id>", methods=["PUT"])
@jwt_required()
def update_entry(entry_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()

    entry = PasswordEntry.query.filter_by(id=entry_id, user_id=user_id).first()
    if not entry:
        return jsonify({"msg": "Entry not found"}), 404

    if "site_name" in data:
        entry.site_name = data["site_name"]
    if "site_username" in data:
        entry.site_username = data["site_username"]
    if "password" in data:
        entry.encrypted_password = fernet.encrypt(data["password"].encode())
    if "notes" in data:
        entry.notes = data["notes"]

    db.session.commit()

    return jsonify({"msg": "Entry updated"}), 200

@app.route("/delete_entry/<int:entry_id>", methods=["DELETE"])
@jwt_required()
def delete_entry(entry_id):
    user_id = int(get_jwt_identity())

    entry = PasswordEntry.query.filter_by(id=entry_id, user_id=user_id).first()
    if not entry:
        return jsonify({"msg": "Entry not found"}), 404

    db.session.delete(entry)
    db.session.commit()

    return jsonify({"msg": "Entry deleted"}), 200

# Run app

if __name__ == "__main__":
    app.run(debug=True)
