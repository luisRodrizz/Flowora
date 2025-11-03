from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Task
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'database.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Inicializa la base de datos con la app
db.init_app(app)

# Crea las tablas si no existen
with app.app_context():
    db.create_all()

# 📍 Rutas -----------------------------------------------------------------

@app.route("/tasks", methods=["GET"])
def get_tasks():
    """Devuelve todas las tareas."""
    tasks = Task.query.all()
    return jsonify([t.to_dict() for t in tasks])


@app.route("/tasks", methods=["POST"])
def add_task():
    """Crea una nueva tarea (con categoría, fecha límite y descripción opcional)."""
    data = request.get_json()

    due_date = None
    if data.get("due_date"):
        try:
            due_date = datetime.fromisoformat(data["due_date"])
        except ValueError:
            return jsonify({"error": "Invalid date format"}), 400

    new_task = Task(
        title=data.get("title"),
        completed=False,
        category=data.get("category", "General"),
        due_date=due_date,
        description=data.get("description", "")  # 🆕 nuevo campo
    )

    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201


@app.route("/tasks/<int:id>", methods=["PUT"])
def update_task(id):
    """Actualiza una tarea existente."""
    task = db.session.get(Task, id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    data = request.get_json()
    task.title = data.get("title", task.title)
    task.completed = data.get("completed", task.completed)
    task.category = data.get("category", task.category)
    task.description = data.get("description", task.description)  # 🆕 permite editar descripción

    if "due_date" in data:
        if data["due_date"]:
            try:
                task.due_date = datetime.fromisoformat(data["due_date"])
            except ValueError:
                return jsonify({"error": "Invalid date format"}), 400
        else:
            task.due_date = None

    db.session.commit()
    return jsonify(task.to_dict())


@app.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    """Elimina una tarea."""
    task = db.session.get(Task, id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Deleted successfully"})

# --------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)
