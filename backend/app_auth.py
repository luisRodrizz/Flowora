from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from models import db, User, Task
from datetime import datetime, timedelta
import os

# Inicializar app
app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'database_auth.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Configuración de JWT
app.config["JWT_SECRET_KEY"] = "super-secret-key"  # ⚠️ cámbialo en producción
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)

jwt = JWTManager(app)
db.init_app(app)

# Crear tablas si no existen
with app.app_context():
    db.create_all()


# 🧍 Registro de usuario ---------------------------------------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "El email ya está registrado"}), 400

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado con éxito"}), 201


# 🔑 Login -----------------------------------------------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # Buscar usuario por email
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Credenciales incorrectas"}), 401

    # 👇 convertimos el ID a string para evitar el error 422
    token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Inicio de sesión exitoso",
        "token": token,
        "user": user.to_dict()
    }), 200



# 📋 Obtener tareas del usuario -------------------------------------------
@app.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():
    user_id = int(get_jwt_identity())  # ← convertimos a entero
    tasks = Task.query.filter_by(user_id=user_id).all()
    return jsonify([t.to_dict() for t in tasks])

# ➕ Crear tarea -----------------------------------------------------------
@app.route("/tasks", methods=["POST"])
@jwt_required()
def add_task():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    due_date = None
    if data.get("due_date"):
        try:
            due_date = datetime.fromisoformat(data["due_date"])
        except ValueError:
            return jsonify({"error": "Formato de fecha inválido"}), 400

    new_task = Task(
        title=data.get("title"),
        completed=False,
        category=data.get("category", "General"),
        due_date=due_date,
        description=data.get("description", ""),
        user_id=user_id  # 👈 se asocia al usuario autenticado
    )

    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201


# ✏️ Actualizar tarea ------------------------------------------------------
@app.route("/tasks/<int:id>", methods=["PUT"])
@jwt_required()
def update_task(id):
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=id, user_id=user_id).first()
    if not task:
        return jsonify({"error": "Tarea no encontrada"}), 404

    data = request.get_json()
    task.title = data.get("title", task.title)
    task.completed = data.get("completed", task.completed)
    task.category = data.get("category", task.category)
    task.description = data.get("description", task.description)

    if "due_date" in data:
        if data["due_date"]:
            try:
                task.due_date = datetime.fromisoformat(data["due_date"])
            except ValueError:
                return jsonify({"error": "Formato de fecha inválido"}), 400
        else:
            task.due_date = None

    db.session.commit()
    return jsonify(task.to_dict())


# 🗑️ Eliminar tarea --------------------------------------------------------
@app.route("/tasks/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_task(id):
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=id, user_id=user_id).first()
    if not task:
        return jsonify({"error": "Tarea no encontrada"}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Tarea eliminada correctamente"})


# --------------------------------------------------------------------------
if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
