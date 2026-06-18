# ConstruManage

ConstruManage is a web application for financial management in civil construction companies. It combines a Django REST API, PostgreSQL, and a React frontend served by Nginx.

## What Is Included

- Dashboard with monthly revenue, expenses, balance, category costs, and overdue supplier payments.
- Construction works management with budget, current cost, progress, status, and planned dates.
- Cash-flow transactions linked optionally to a work.
- Supplier and subcontractor payments with due dates and payment status.
- Monthly financial forecasts.
- Persistent notifications for overdue payments, upcoming payments, and budget overruns.
- JWT authentication with access token refresh.

## Stack

- Backend: Python 3.12, Django 5, Django REST Framework, Simple JWT, Gunicorn.
- Database: PostgreSQL 16.
- Frontend: React 18, Vite 5, React Router, Axios, Recharts.
- Runtime: Docker Compose with PostgreSQL, Django, Nginx.

## Project Structure

```text
.
|-- docker-compose.yml
|-- DOCUMENTATION.md
|-- docs/
|-- backend/
|   |-- manage.py
|   |-- requirements.txt
|   |-- Dockerfile
|   |-- entrypoint.sh
|   |-- config/
|   |   |-- urls.py
|   |   |-- wsgi.py
|   |   |-- asgi.py
|   |   `-- settings/
|   |       |-- base.py
|   |       |-- local.py
|   |       |-- production.py
|   |       `-- test.py
|   `-- api/
|       |-- accounts/
|       |-- core/
|       |-- dashboard/
|       |-- financeiro/
|       |-- fornecedores/
|       |-- notificacoes/
|       |-- obras/
|       `-- service/
`-- frontend/
    |-- package.json
    |-- vite.config.js
    |-- nginx.conf
    `-- src/
```

## Quick Start With Docker

Prerequisite: Docker Desktop running.

```bash
cp backend/.env.example backend/.env
cp backend/.env.example backend/.env.docker
```

Edit `backend/.env` and `backend/.env.docker` before starting:

- Use a strong `DJANGO_SECRET_KEY`.
- Use a strong `POSTGRES_PASSWORD`.
- In Docker, set `POSTGRES_HOST=db`.
- Keep `RUN_DEMO_SEED=false` unless you intentionally want demo data.

Start the system:

```bash
docker compose up --build -d
```

Open:

- Frontend: `http://localhost`
- Backend API: `http://localhost:8000/api/`
- Health check: `http://localhost:8000/api/health/`
- Django admin: `http://localhost:8000/admin/`

## Manual Development

Backend:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://127.0.0.1:8000`.

## Backend Checks

```bash
cd backend
python manage.py check
python manage.py test --settings=config.settings.test
```

The test settings use an in-memory SQLite database so unit tests do not require PostgreSQL.

## Frontend Checks

```bash
cd frontend
npm test
npm run build
```

## Main API Endpoints

Public:

- `GET /api/health/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `POST /api/auth/register/`

Authenticated:

- `GET /api/dashboard/`
- CRUD `/api/obras/`
- CRUD `/api/transacoes/`
- CRUD `/api/fornecedores/`
- CRUD `/api/previsoes/`
- `GET`, `PATCH`, `DELETE /api/notificacoes/`
- `POST /api/notificacoes/sincronizar/`
- `POST /api/notificacoes/{id}/marcar_lida/`
- `POST /api/notificacoes/marcar_todas_lidas/`

## Production Notes

Use `config.settings.production` for production deployments and set:

- `DJANGO_DEBUG=False`
- explicit `DJANGO_ALLOWED_HOSTS`
- explicit `CORS_ALLOWED_ORIGINS`
- explicit `CSRF_TRUSTED_ORIGINS` when using HTTPS
- strong `DJANGO_SECRET_KEY`
- strong `POSTGRES_PASSWORD`

Demo seeding is disabled by default. Enable `RUN_DEMO_SEED=true` only in demo environments.
