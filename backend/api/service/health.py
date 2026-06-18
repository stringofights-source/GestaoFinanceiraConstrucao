from django.utils import timezone


class HealthService:
    @staticmethod
    def status():
        return {
            'status': 'ok',
            'database': 'postgresql',
            'time': timezone.now().isoformat(),
        }
