#!/bin/bash
set -e

echo "=== ConstruManage Backend ==="

# Wait for PostgreSQL to be ready
echo "[*] A aguardar PostgreSQL..."
while ! python -c "
import socket
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
result = sock.connect_ex(('${POSTGRES_HOST:-db}', ${POSTGRES_PORT:-5432}))
sock.close()
exit(result)
" 2>/dev/null; do
    echo "[.] PostgreSQL ainda nao esta disponivel, a tentar novamente em 2s..."
    sleep 2
done
echo "[OK] PostgreSQL disponivel!"

# Run migrations
echo "[*] A validar configuracao Django..."
python manage.py check

echo "[*] A aplicar migracoes..."
python manage.py migrate --noinput

if [ "${RUN_DEMO_SEED:-false}" = "true" ]; then
    echo "[*] RUN_DEMO_SEED=true; a sincronizar utilizadores demo..."
    python manage.py sync_demo_users

    echo "[*] A verificar dados de demonstracao..."
    python -c "
import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
django.setup()
from api.obras.models import Obra
if Obra.objects.count() == 0:
    print('[*] Base de dados vazia, a carregar seed data...')
    from django.core.management import call_command
    call_command('seed_data')
else:
    print('[OK] Dados ja existem, seed ignorado.')
" || echo "[!] Seed demo falhou, mas o backend vai iniciar."
else
    echo "[OK] Seed demo desativado. Defina RUN_DEMO_SEED=true apenas em ambientes de demonstracao."
fi

echo "[OK] Backend pronto! A iniciar servidor..."
exec "$@"
