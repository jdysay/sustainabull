#!/bin/bash

# Wait for database to be ready
echo "Waiting for PostgreSQL to start..."
sleep 10

# Apply migrations
echo "Applying migrations..."
python manage.py migrate

# Create superuser if it doesn't exist
echo "Creating superuser if needed..."
python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword');
    print('Superuser created.');
else:
    print('Superuser already exists.');
"

# Start server
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000
