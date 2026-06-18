# Production Readiness

## Database

The application is configured to use PostgreSQL through `backend/config/settings/base.py`.

`backend/db.sqlite3` may exist as a local artifact, but it is not used by the current Django settings.

## Startup Order

1. PostgreSQL starts first and must pass its healthcheck.
2. The backend validates Django settings, applies migrations, and starts Gunicorn.
3. Demo seed data is skipped by default.
4. The frontend starts after the backend healthcheck passes.

## Demo Data

Demo users and seed data are disabled unless `RUN_DEMO_SEED=true`.

Keep this flag disabled in production. Demo credentials must never be used in production environments.

## Required Production Settings

- `DJANGO_DEBUG=False`
- `DJANGO_SECRET_KEY` with a strong production value
- `DJANGO_ALLOWED_HOSTS` with explicit hostnames
- `CORS_ALLOWED_ORIGINS` with explicit origins
- `POSTGRES_PASSWORD` with a strong value
- `CSRF_TRUSTED_ORIGINS` when HTTPS origins are used

## Security Controls Added

- CORS is no longer open by default.
- Django security headers and secure cookie defaults are enabled for non-debug environments.
- DRF throttling is configured for anonymous and authenticated users.
- Nginx sends browser hardening headers and a CSP.
- Demo seeding no longer runs automatically.

## Operational Notes

- PostgreSQL is no longer exposed on the host port by default in `docker-compose.yml`.
- Backend and frontend services have healthchecks.
- Migrations still run at container startup for this project size; in mature deployments, move migrations to a release job.
