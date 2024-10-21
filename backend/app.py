import os
from flask import Flask, jsonify, request, send_from_directory, abort
from flask import Flask, jsonify, json
from flask_cors import CORS

# Initialize Flask app with the correct public folder path
app = Flask(__name__, static_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../public')))
CORS(app, resources={r"/api/*": {"origins": "*"}})

# In-memory data store
data = {
    "changeOrders": [],
    "payApplications": [],
    "budgetCategories": [],
    "tasks": [],
    "milestones": [],
    "budgetItems": []  # New: Holds budget items
}

subcontractors = [
    {
        "id": 1,
        "name": "ABC Electric",
        "scope": "Division 1 - Electrical",
        "tasks": [
            {"name": "Subcontract Agreement Signed", "completed": False},
            {"name": "Submittals Uploaded", "completed": False},
            {"name": "Materials Log Submitted", "completed": False},
            {"name": "Kickoff Meeting Attended", "completed": False},
        ],
    },
    {
        "id": 2,
        "name": "XYZ Plumbing",
        "scope": "Division 2 - Plumbing",
        "tasks": [
            {"name": "Subcontract Agreement Signed", "completed": False},
            {"name": "Submittals Uploaded", "completed": False},
            {"name": "Materials Log Submitted", "completed": False},
            {"name": "Kickoff Meeting Attended", "completed": False},
        ],
    },
]

### Routes to Serve Static Files ###
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    """Serve React app for all frontend routes."""
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/css/<path:filename>')
def serve_css(filename):
    css_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '../css'))
    if not os.path.exists(css_folder):
        abort(404, description="CSS folder not found.")
    return send_from_directory(css_folder, filename, mimetype='text/css')

@app.route('/dist/<path:filename>')
def serve_js(filename):
    dist_folder = os.path.join(app.static_folder, 'dist')
    if not os.path.exists(dist_folder):
        abort(404, description="JS folder not found.")
    return send_from_directory(dist_folder, filename, mimetype='application/javascript')

### API Endpoints ###

# Subcontractors API
@app.route('/api/subcontractors', methods=['GET'])
def get_subcontractors():
    return jsonify(subcontractors)

@app.route('/api/subcontractors/<int:subcontractor_id>/tasks/<int:task_index>', methods=['POST'])
def update_task(subcontractor_id, task_index):
    subcontractor = next((s for s in subcontractors if s["id"] == subcontractor_id), None)
    if not subcontractor:
        return jsonify({"error": "Subcontractor not found"}), 404

    subcontractor["tasks"][task_index]["completed"] = True
    return jsonify(subcontractor)

# Budget Items API (New)
@app.route('/api/budget-items', methods=['GET', 'POST'])
def budget_items():
    """Manage budget items."""
    if request.method == 'POST':
        item = request.json
        item['id'] = len(data["budgetItems"]) + 1
        data["budgetItems"].append(item)
        return jsonify(item), 201
    return jsonify(data["budgetItems"])

@app.route('/api/budget-items/<int:id>', methods=['PUT'])
def update_budget_item(id):
    """Update a specific budget item."""
    item = next((i for i in data["budgetItems"] if i["id"] == id), None)
    if not item:
        return jsonify({"error": "Budget item not found"}), 404
    
    updates = request.json
    item.update(updates)
    return jsonify(item)

# Budget Categories API
@app.route('/api/budget-categories', methods=['GET', 'POST'])
def budget_categories():
    """Manage budget categories."""
    if request.method == 'POST':
        category = request.json
        data["budgetCategories"].append(category)
        return jsonify(category), 201
    return jsonify(data["budgetCategories"])

# Change Orders API
@app.route('/api/change-orders', methods=['GET', 'POST'])
def change_orders():
    """Manage change orders."""
    if request.method == 'POST':
        order = request.json
        data["changeOrders"].append(order)
        return jsonify(order), 201
    return jsonify(data["changeOrders"])

# Pay Applications API
@app.route('/api/pay-applications', methods=['GET', 'POST'])
def pay_applications():
    """Manage pay applications."""
    if request.method == 'POST':
        application = request.json
        data["payApplications"].append(application)
        return jsonify(application), 201
    return jsonify(data["payApplications"])

# Tasks API
@app.route('/api/tasks', methods=['GET', 'POST'])
def tasks():
    """Manage tasks."""
    if request.method == 'POST':
        task = request.json
        task['id'] = len(data["tasks"]) + 1  # Assign a simple ID
        data["tasks"].append(task)
        return jsonify(task), 201
    return jsonify(data["tasks"])

# Milestones API (New)
@app.route('/api/milestones', methods=['GET', 'POST'])
def milestones():
    """Manage project milestones."""
    if request.method == 'POST':
        milestone = request.json
        milestone['id'] = len(data["milestones"]) + 1
        data["milestones"].append(milestone)
        return jsonify(milestone), 201
    return jsonify(data["milestones"])

@app.route('/api/divisions', methods=['GET'])
def get_divisions():
    try:
        with open('backend/divisions.json') as f:
            divisions = json.load(f)
        return jsonify(divisions)
    except FileNotFoundError:
        return jsonify({"error": "Divisions file not found."}), 404
### Run the Application ###
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
