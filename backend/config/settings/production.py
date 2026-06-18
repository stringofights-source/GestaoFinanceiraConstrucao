from django.core.exceptions import ImproperlyConfigured

from config.settings.base import *  # noqa: F401,F403

DEBUG = False

if any(host in ('', '*') for host in ALLOWED_HOSTS):
    raise ImproperlyConfigured('DJANGO_ALLOWED_HOSTS must be explicit when DJANGO_DEBUG=False')

if SECRET_KEY.lower().startswith(('change-me', 'dev-', 'insecure')):
    raise ImproperlyConfigured('DJANGO_SECRET_KEY must be a production-grade secret')

CORS_ALLOWED_ORIGINS = env_list('CORS_ALLOWED_ORIGINS')
if not CORS_ALLOWED_ORIGINS:
    raise ImproperlyConfigured('CORS_ALLOWED_ORIGINS is required in production')
CORS_ALLOW_ALL_ORIGINS = False

CSRF_TRUSTED_ORIGINS = env_list('CSRF_TRUSTED_ORIGINS')

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = env_bool('DJANGO_SECURE_SSL_REDIRECT', True)
SECURE_HSTS_SECONDS = int(os.environ.get('DJANGO_SECURE_HSTS_SECONDS', 31536000))
SECURE_HSTS_INCLUDE_SUBDOMAINS = env_bool('DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS', True)
SECURE_HSTS_PRELOAD = env_bool('DJANGO_SECURE_HSTS_PRELOAD', True)
SECURE_CONTENT_TYPE_NOSNIFF = True
SESSION_COOKIE_SECURE = env_bool('DJANGO_SESSION_COOKIE_SECURE', True)
CSRF_COOKIE_SECURE = env_bool('DJANGO_CSRF_COOKIE_SECURE', True)
X_FRAME_OPTIONS = 'DENY'
