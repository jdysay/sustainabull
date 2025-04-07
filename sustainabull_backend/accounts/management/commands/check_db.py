from django.core.management.base import BaseCommand
from django.db import connections
from django.db.utils import OperationalError

class Command(BaseCommand):
    help = 'Check database connection'

    def handle(self, *args, **options):
        self.stdout.write('Checking database connection...')
        db_conn = connections['default']
        try:
            c = db_conn.cursor()
            self.stdout.write(self.style.SUCCESS('Database connection successful'))
        except OperationalError:
            self.stdout.write(self.style.ERROR('Database connection failed'))
