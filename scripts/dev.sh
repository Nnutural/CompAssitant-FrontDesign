#!/usr/bin/env bash
set -euo pipefail

cat <<'EOF'
SecureHub local development

Frontend:
  cd frontend
  npm install
  npm run dev

Backend:
  cd backend
  uv sync
  uv run uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

Open:
  Frontend: http://localhost:5173
  Backend docs: http://127.0.0.1:8000/docs
EOF
