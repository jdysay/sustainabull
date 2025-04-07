# Use an official Python runtime as a parent image
FROM python:3.10-slim-buster

RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory to /app
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt /app

# Remove any existing venv and create a new one
RUN [ -d "/venv" ] && rm -rf /venv || true && python -m venv /venv

# Activate the virtual environment and install dependencies
RUN /venv/bin/pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . /app

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PATH="/venv/bin:$PATH"

# Run manage.py when the container launches
CMD ["/venv/bin/python", "manage.py", "migrate", "--noinput", "&&", "/venv/bin/python", "manage.py", "runserver", "0.0.0.0:8000"]
