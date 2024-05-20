from flask import Flask, request, jsonify, render_template
from datetime import datetime

app = Flask(__name__)
tasks = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET', 'POST'])
def manage_tasks():
    if request.method == 'POST':
        task_content = request.form.get('content')
        if task_content:
            tasks.append({
                'content': task_content,
                'timestamp': datetime.utcnow().isoformat()
            })
    return jsonify(tasks=tasks)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
