sustainabull/           (The root directory of your project)
├── .gitignore           (Git ignore file)
├── docker-compose.yml   (Docker Compose file)
├── sustainabull-project/  (React Frontend)
│   ├── Dockerfile       (Frontend Dockerfile)
│   ├── public/
│   │   └── ...
│   ├── src/
│   │   ├── LoginPage.jsx
│   │   ├── SignUpPage.jsx
│   │   ├── App.css
│   │   └── ...
│   ├── node_modules/
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   └── ...
├── features/              (Django Apps)
│   ├── accounts/      (Your accounts Django app)
│   │   ├── migrations/
│   │   │   └── __init__.py
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── __init__.py   (empty file)
│   ├── sustains/
│   │   ├── migrations/
│   │   │   └── __init__.py
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   └── maps/
│       ├── migrations/
│       │   └── __init__.py
│       ├── __init__.py
│       ├── models.py
│       ├── views.py
│       ├── serializers.py
│       └── urls.py
├── sustainabull_backend/ (Django Backend)
│   ├── Dockerfile       (Backend Dockerfile)
│   ├── sustainabull_backend/ (The main folder of your backend project)
│   │   ├── __init__.py
│   │   ├── settings.py (Django settings)
│   │   ├── urls.py     (Django URLs)
│   │   ├── wsgi.py     (WSGI configuration)
│   │   └── asgi.py      (ASGI configuration)
│   ├── manage.py       (Django management script)
│   ├── db.sqlite3       (Database, will be created automatically)
│   ├── requirements.txt    (File with the necessary dependencies)
│   └── venv/              (Virtual environment, will be created automatically)
└── ...                  (Other project files, if any)
