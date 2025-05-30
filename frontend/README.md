# Natural Language Task Manager

A modern web application that allows users to create tasks using natural language input. The app automatically parses task details and displays them in a beautiful, responsive UI.

## Features

- Natural language task input
- Automatic extraction of task name, assignee, due date/time, and priority
- Beautiful task board/list view
- Inline task editing
- Priority color coding
- Responsive design

## Tech Stack

### Frontend
- React (Vite)
- Redux Toolkit
- Tailwind CSS
- shadcn/ui components
- react-hook-form

### Backend
- Flask
- MongoDB
- OpenAI GPT API
- Python packages (see requirements.txt)

## Setup

1. Clone the repository
2. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/task_manager
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. Start MongoDB:
   - Make sure MongoDB is running locally
   - Use MongoDB Compass to manage the database

6. Start the backend:
   ```bash
   python app.py
   ```

## Usage

1. Enter tasks in natural language:
   - "Call John tomorrow at 2pm"
   - "Finish presentation by Friday 5pm P1"
   - "Review code with Sarah next Monday 10am P2"

2. The app will automatically parse:
   - Task name
   - Assignee
   - Due date/time
   - Priority (P1-P4, defaults to P3)

3. Tasks are displayed in a clean, organized list with:
   - Color-coded priorities
   - Clear due dates
   - Assignee information

## Development

- Frontend runs on `http://localhost:5173`
- Backend API runs on `http://localhost:5000`
- MongoDB runs on default port `27017`

## API Endpoints

- `POST /api/parse-task` - Parse natural language input
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task 