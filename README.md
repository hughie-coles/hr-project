# HR SASS Project (Monorepo)

This repository contains two main folders:

- `frontend/` — Next.js + React + TypeScript + Tailwind CSS
- `backend/` — Flask API using Poetry for dependency management

Quick start (local dev):

1) Backend
```bash
cd backend
poetry install
poetry run python app.py
# backend available at http://localhost:8000
```

2) Frontend
```bash
cd frontend
npm install
npm run dev
# frontend available at http://localhost:3000
```

Run with Docker (dev):

```bash
docker compose up --build
```

What's included:
- Simple health check and sample `/api/employees` endpoint
- Next.js demo page with a button to check backend health

Next suggestions: add auth, database (Postgres), migrations, and CI.
