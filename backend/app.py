from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS


data = {
    "changeOrders": [],
    "payApplications": [],
    "budgetCategories": [],
}

@app.route('/api/change-orders', methods=['GET', 'POST'])
def change_orders():
    if request.method == 'POST':
        order = request.json
        data["changeOrders"].append(order)
        return jsonify(order), 201
    return jsonify(data["changeOrders"])

@app.route('/api/pay-applications', methods=['GET', 'POST'])
def pay_applications():
    if request.method == 'POST':
        application = request.json
        data["payApplications"].append(application)
        return jsonify(application), 201
    return jsonify(data["payApplications"])

@app.route('/api/budget-categories', methods=['GET', 'POST'])
def budget_categories():
    if request.method == 'POST':
        category = request.json
        data["budgetCategories"].append(category)
        return jsonify(category), 201
    return jsonify(data["budgetCategories"])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
