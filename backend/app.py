from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from pymongo import MongoClient
from bson import ObjectId
import openai
from datetime import datetime, timezone
import dateutil.parser
import json

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
# Configure CORS to allow requests from frontend
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})

# Configure MongoDB
client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
db = client.task_manager
tasks_collection = db.tasks

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

def parse_task_with_gpt(text):
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a task parser. Extract the following information from the user's input: task name, assignee, due date/time, and priority (P1-P4, default to P3 if not specified). Return the information in JSON format with these exact keys: task_name, assignee, due_date_time, priority."
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            response_format={ "type": "json_object" }
        )
        
        # Parse the JSON string from OpenAI's response
        parsed_data = json.loads(response.choices[0].message.content)
        
        # Convert the natural language date to ISO format
        try:
            due_date = dateutil.parser.parse(parsed_data['due_date_time'], fuzzy=True)
            # Ensure the date is timezone-aware and in UTC
            if due_date.tzinfo is None:
                due_date = due_date.replace(tzinfo=timezone.utc)
            parsed_data['due_date_time'] = due_date.isoformat()
        except Exception as e:
            print(f"Error parsing date: {e}")
            # If date parsing fails, keep the original string
            pass
            
        return parsed_data
    except Exception as e:
        print(f"Error parsing task with GPT: {e}")
        return None

@app.route('/api/parse-task', methods=['POST'])
def parse_task():
    text = request.json.get('text')
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    parsed_data = parse_task_with_gpt(text)
    if not parsed_data:
        return jsonify({'error': 'Failed to parse task'}), 500

    return jsonify(parsed_data)

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = list(tasks_collection.find())
    for task in tasks:
        task['_id'] = str(task['_id'])
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    task = request.json
    if not task:
        return jsonify({'error': 'No task data provided'}), 400

    # Parse the due date if it's a string
    if isinstance(task.get('due_date_time'), str):
        try:
            due_date = dateutil.parser.parse(task['due_date_time'], fuzzy=True)
            if due_date.tzinfo is None:
                due_date = due_date.replace(tzinfo=timezone.utc)
            task['due_date_time'] = due_date.isoformat()
        except Exception as e:
            print(f"Error parsing date: {e}")
            # If date parsing fails, keep the original string
            pass

    task['created_at'] = datetime.now(timezone.utc).isoformat()
    task['updated_at'] = datetime.now(timezone.utc).isoformat()

    result = tasks_collection.insert_one(task)
    task['_id'] = str(result.inserted_id)
    return jsonify(task), 201

@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    task = request.json
    if not task:
        return jsonify({'error': 'No task data provided'}), 400

    # Remove _id from the update data if it exists
    if '_id' in task:
        del task['_id']

    task['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    # Parse the due date if it's a string
    if isinstance(task.get('due_date_time'), str):
        try:
            due_date = dateutil.parser.parse(task['due_date_time'], fuzzy=True)
            if due_date.tzinfo is None:
                due_date = due_date.replace(tzinfo=timezone.utc)
            task['due_date_time'] = due_date.isoformat()
        except Exception as e:
            print(f"Error parsing date: {e}")
            # If date parsing fails, keep the original string
            pass

    result = tasks_collection.update_one(
        {'_id': ObjectId(task_id)},
        {'$set': task}
    )

    if result.modified_count == 0:
        return jsonify({'error': 'Task not found'}), 404

    # Get the updated task from the database
    updated_task = tasks_collection.find_one({'_id': ObjectId(task_id)})
    if updated_task:
        updated_task['_id'] = str(updated_task['_id'])
        return jsonify(updated_task)
    
    return jsonify({'error': 'Failed to retrieve updated task'}), 500

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    result = tasks_collection.delete_one({'_id': ObjectId(task_id)})
    if result.deleted_count == 0:
        return jsonify({'error': 'Task not found'}), 404
    return '', 204

if __name__ == '__main__':
    app.run(debug=True, port=5003) 