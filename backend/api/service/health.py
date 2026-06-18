from django.db import connections
from django.utils import timezone


class HealthService:
    @staticmethod
    def status():
        database_ok = True
        database_error = None

        try:
            with connections['default'].cursor() as cursor:
                cursor.execute('SELECT 1')
                cursor.fetchone()
        except Exception as exc:  # pragma: no cover - depends on infrastructure failure
            database_ok = False
            database_error = exc.__class__.__name__

        payload = {
            'status': 'ok' if database_ok else 'degraded',
            'database': 'ok' if database_ok else 'unavailable',
            'time': timezone.now().isoformat(),
        }
        if database_error:
            payload['database_error'] = database_error
        return payload

    @staticmethod
    def is_healthy(payload):
        return payload.get('status') == 'ok'
