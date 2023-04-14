#!/bin/bash

# Start the Django backend server
start_backend() {
  cd backend || exit

  # Activate the Python virtual environment
  source venv/bin/activate

  # Make and run migrations for Django backend
  python manage.py makemigrations
  python manage.py migrate

  python manage.py runserver
}

# Start the React frontend server
start_frontend() {
  cd frontend || exit
  npm start
}

# Export the functions to be used by 'concurrently'
export -f start_backend
export -f start_frontend

# Run both backend and frontend servers concurrently
concurrently --kill-others "bash -c start_backend" "bash -c start_frontend"
