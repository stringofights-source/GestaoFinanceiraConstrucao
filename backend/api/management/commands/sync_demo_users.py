import os

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create or update the configured demo users.'

    def add_arguments(self, parser):
        parser.add_argument('--admin-password', default=os.environ.get('SEED_ADMIN_PASSWORD', 'admin123'))
        parser.add_argument('--user-password', default=os.environ.get('SEED_USER_PASSWORD', 'davide1234'))

    def handle(self, *args, **options):
        self.sync_user(
            username=os.environ.get('SEED_ADMIN_USERNAME', 'admin'),
            email=os.environ.get('SEED_ADMIN_EMAIL', 'admin@construmanage.pt'),
            password=options['admin_password'],
            is_staff=True,
            is_superuser=True,
        )
        self.sync_user(
            username=os.environ.get('SEED_USER_USERNAME', 'davide'),
            email=os.environ.get('SEED_USER_EMAIL', 'davide@construmanage.pt'),
            password=options['user_password'],
            first_name=os.environ.get('SEED_USER_FIRST_NAME', 'Davide'),
            last_name=os.environ.get('SEED_USER_LAST_NAME', 'Moreno'),
        )

    def sync_user(self, username, email, password, first_name='', last_name='', is_staff=False, is_superuser=False):
        user, created = User.objects.get_or_create(username=username)
        user.email = email
        user.first_name = first_name
        user.last_name = last_name
        user.is_staff = is_staff
        user.is_superuser = is_superuser
        user.is_active = True
        user.set_password(password)
        user.save()

        action = 'created' if created else 'updated'
        self.stdout.write(self.style.SUCCESS(f'{username} {action}; password verified: {user.check_password(password)}'))
