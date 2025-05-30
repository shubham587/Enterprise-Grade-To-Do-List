# 🧠 Natural Language Task Manager (Enterprise-Grade To-Do List)

A powerful task management web app that understands natural language and converts it into structured tasks with assignee, due time, and priority — ready for enterprise teams.

---

## 📌 Project Objective

Enable users to enter tasks like:

“Finish landing page Aman by 11pm 20th June”
“Call client Rajeev tomorrow 5pm P1”

---

The app will parse these inputs and extract:
- ✅ **Task Name**: e.g., `Finish landing page`
- 👤 **Assignee**: e.g., `Aman`
- 🕒 **Due Date & Time**: e.g., `11:00 PM, 20 June`
- ⚙️ **Priority**: Defaults to `P3` unless `P1`, `P2`, or `P4` is specified

---

## 🚀 Features

- ✨ Parse natural language input using OpenAI GPT
- ✅ Extract and store Task Name, Assignee, Due Date/Time, and Priority
- 🧾 Task list display in a clean, responsive UI
- ✍️ Inline editing of tasks
- 💾 Task persistence using MongoDB
- ⚙️ REST API for CRUD operations on tasks
- 🔐 Secure environment variable handling for API keys

---

## 🧩 Tech Stack

### 🖥️ Frontend

- ⚛️ **React (Vite)**
- 🎨 **Tailwind CSS**
- 🧱 **shadcn/ui**
- 🧠 **Redux Toolkit**
- 📝 **react-hook-form** + **Zod**
- 📱 Fully responsive UI
- ❌ No routing required

### 🛠️ Backend

- 🐍 **Flask** (REST API)
- 🌿 **MongoDB Compass**
- 🤖 **OpenAI GPT API**
- 🔐 Environment-based config using `.env`
- 📦 CORS enabled

---

## 📁 Folder Structure (Expected)

```bash
root/
│
├── frontend/              # React + Vite frontend
│   ├── components/
│   ├── features/          # Redux slices
│   ├── ui/                # shadcn components
│   └── ...
│
├── backend/               # Flask backend
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── ...
│
├── .env                   # API keys and DB URI
├── README.md              # Project overview
└── requirements.txt       # Flask dependencies
```
## 🧠 How It Works
User enters a task like:

Submit report to Anjali by Friday 5pm P2
The input is sent to the Flask backend.

Backend uses OpenAI GPT API to extract:
Task: Submit report
Assignee: Anjali
Due: [Date/time parsed from “Friday 5pm”]
Priority: P2
The parsed task is saved to MongoDB.

Frontend displays all tasks in a clean UI.

## 🏃 How to Run the Project
1️⃣ Backend Setup
1. Go to backend folder
- cd backend

2. Create and activate virtual environment
- python -m venv venv
- source venv/bin/activate     # On Windows: venv\Scripts\activate

3. Install Python dependencies
- pip install -r requirements.txt

4.  Create .env file and add credentials
- touch .env
- Then add OPENAI_API_KEY and MONGODB_URI as shown above

5. Run the Flask server
- python run.py
- Backend will be available at http://localhost:5000

2️⃣ Frontend Setup
1. Go to frontend folder
- cd frontend

 2 Install dependencies
- npm install

3. Run Vite development server
- npm run dev
- Frontend will run at http://localhost:5173
✅ Make sure both backend and frontend are running in separate terminals.
