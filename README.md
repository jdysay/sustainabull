## Prerequisites

*   **Docker:** Make sure you have Docker Desktop installed and running on your machine. You can download it from [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/).

## Setup Instructions


1.  **Navigate to the Project Root:**

    ```
    cd sustainabull
    ```

2.  **Start Docker Compose:**

    ```
    docker-compose up -d
    ```

    *   This command will:
        *   Build the Docker images for the frontend, backend, and database (if they haven't been built before).

3.  **Apply Django Migrations:**

    ```
    docker-compose exec backend python manage.py migrate
    ```

    *   This command runs the `migrate` command inside the `backend` container. It will create the necessary database tables in PostgreSQL.

# Skip unless you newly run "pip install *" or "npm install *" --------------------------------------------------
4. **Rebuild if needed**:
    * If there are changes in `requirements.txt` or `package.json`, you will need to rebuild the images.
    ```
    docker-compose build
    ```
5. **Restart if needed**:
    * If there are changes in `requirements.txt` or `package.json`, you will need to restart the containers.
    ```
    docker-compose up -d
    ```
# ---------------------------------------------------------------------------------------------------------------

6. **Access the Application:**

    *   **Frontend:** Open your web browser and go to `http://localhost:5173`, where you can test demo
    <!-- *   **Backend:** The backend API will be running on `http://localhost:8000`.  -->

7.  **Stopping the Containers / When you stop dev today:**
    ```
    docker-compose down
    ```


---------------------------------------------------------------------------------------------------------------------------------------
### Working with Django Migrations

*   **Making New Migrations (When You Change Models):**
    1.  Make changes to your Django models (e.g., in `sustainabull_backend/accounts/models.py`).
    2.  Run:
        ```
        docker-compose exec backend python manage.py makemigrations
        ```
    3.  Run:
        ```
        docker-compose exec backend python manage.py migrate
        ```
    4.  Commit the new migration files (in the `migrations` directory) to Git.
    5.  Let your team know that you've made model changes.

*   **Applying Migrations (After Pulling Changes):**
    1.  Pull the latest changes from Git.
    2.  Run:
        ```
        docker-compose exec backend python manage.py migrate
        ```

### Working with Dependencies

*   **Adding New Python Dependencies:**
    1.  Activate your virtual environment (if you're using one).
    2.  Install the new package:
        ```
        pip install <package-name>
        ```
    3.  Update `requirements.txt`:
        ```
        pip freeze > requirements.txt
        ```
    4.  Commit the updated `requirements.txt` to Git.
    5. Rebuild the images:
        ```
        docker-compose build
        ```
    6. Restart the containers:
        ```
        docker-compose up -d
        ```

*   **Adding New Node.js Dependencies:**
    1.  Navigate to the frontend directory:
        ```
        cd sustainabull-project
        ```
    2.  Install the new package:
        ```
        npm install <package-name>
        ```
    3.  Commit the updated `package.json` and `package-lock.json` to Git.
    4. Rebuild the images:
        ```
        docker-compose build
        ```
    5. Restart the containers:
        ```
        docker-compose up -d
        ```

### Other Useful Docker Compose Commands

*   **Rebuilding Images:**
    ```
    docker-compose build
    ```
    *   Use this after making changes to `Dockerfile`, `requirements.txt`, or `package.json`.

*   **Restarting Containers:**
    ```
    docker-compose restart
    ```