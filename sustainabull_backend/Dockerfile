# Use an official Python runtime as a parent image
FROM python:3.10-slim-buster

# Set the working directory to /app
WORKDIR /app

# Define environment variable
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create the virtual environment outside the mounted volume
RUN python -m venv /venv

# Add the venv to PATH
ENV PATH="/venv/bin:$PATH"

# Copy the requirements file into the container at /app
COPY requirements.txt /app/

# Install dependencies in the virtual environment
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . /app/

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Update the CMD to use the virtual environment python
CMD ["/venv/bin/python", "manage.py", "runserver", "0.0.0.0:8000"]