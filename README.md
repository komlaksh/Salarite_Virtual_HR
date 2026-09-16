# Salarite Virtual HR

A small Virtual HR + ATS dashboard built for the Salarite assignment.

The idea is simple: an employer can assign tasks to a Virtual HR, the Virtual HR can update the task progress, and the employer can monitor those updates. The dashboard also includes basic interview scheduling with Voice, Video, and Chat modes.

## Live Demo

**Frontend:** https://salarite-virtual-hr.vercel.app/

**Backend:** https://salarite-virtual-hr.onrender.com/

**API Docs:** https://salarite-virtual-hr.onrender.com/docs

**GitHub:** https://github.com/komlaksh/Salarite_Virtual_HR

---

## What it does

### Employer

* Create and assign tasks to Virtual HR
* View all assigned tasks
* Monitor task status
* Schedule interviews
* Select Voice, Video, or Chat as the interview mode

### Virtual HR

* View assigned tasks
* Update task status
* Track pending and completed work
* View scheduled interviews

### Task Flow

```text
Employer
   ↓
Assign Task
   ↓
Virtual HR
   ↓
Update Status
   ↓
Employer sees updated progress
```

The task list automatically refreshes so that status changes become visible without manually reloading the page.

### Interview Scheduling

The application supports basic interview scheduling with:

* Candidate name
* Interview date
* Interview time
* Interview mode

  * Voice
  * Video
  * Chat

The actual calling functionality is represented by a placeholder as required by the assignment.

---

## Tech Stack

**Frontend**

* Next.js
* React
* JavaScript
* Axios
* CSS

**Backend**

* Python
* FastAPI
* SQLAlchemy
* PyMySQL

**Database**

* MySQL
* Railway

**Deployment**

* Vercel — Frontend
* Render — Backend
* Railway — Database

---

## Project Structure

```text
Salarite_Virtual_HR/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models/
│   │   └── routes/
│   ├── requirements.txt
│   └── ...
│
└── README.md
```

---

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/komlaksh/Salarite_Virtual_HR.git
cd Salarite_Virtual_HR
```

### 2. Backend

```bash
cd backend
python -m venv venv
```

Activate the environment.

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside `backend`:

```env
DATABASE_URL=mysql+pymysql://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

### 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start Next.js:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

## Environment Variables

### Backend

```env
DATABASE_URL=mysql+pymysql://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

### Frontend

```env
NEXT_PUBLIC_API_URL=https://YOUR-RENDER-BACKEND.onrender.com
```

For local development, use:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Do not commit `.env` or `.env.local` to GitHub.

---

## API

The backend is built with FastAPI.

Some of the main operations include:

```text
/tasks/              → Task management
/tasks/{id}          → Task details / updates
/interviews/         → Interview scheduling
```

The complete API can be explored here:

https://salarite-virtual-hr.onrender.com/docs

---

## Demo Credentials

### Employer

```text
Email: YOUR_EMPLOYER_EMAIL
Password: YOUR_EMPLOYER_PASSWORD
```

### Virtual HR

```text
Email: YOUR_VIRTUAL_HR_EMAIL
Password: YOUR_VIRTUAL_HR_PASSWORD
```

> These credentials are for demonstrating the deployed application.

---

## Deployment

The project is split into three parts:

```text
Next.js
   ↓
Vercel
   ↓
FastAPI
   ↓
Render
   ↓
MySQL
   ↓
Railway
```

Frontend:

https://salarite-virtual-hr.vercel.app/

Backend:

https://salarite-virtual-hr.onrender.com/

---


## Author
**Komlaksh Sharma**

GitHub: https://github.com/komlaksh
