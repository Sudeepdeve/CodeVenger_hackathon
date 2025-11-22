from flask import Flask, jsonify, render_template
import random

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/data')
def data():
    # Generate random values (replace later with DB/API values)
    values = {
        "completed": random.randint(20, 80),
        "remaining": random.randint(20, 80)
    }
    return jsonify(values)

if __name__ == '__main__':
    app.run(debug=True)
