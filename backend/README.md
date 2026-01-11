# HR Backend (Flask)

Setup (using Poetry):

```bash
# from repo root
cd backend
poetry install
poetry run python app.py   # runs on http://localhost:8000
```

Endpoints:
- GET /api/health  — returns { status: "ok" }
- GET /api/employees — returns sample employee list

Tip: set `FLASK_ENV=development` or run directly via `poetry run python app.py` for auto-reload.
