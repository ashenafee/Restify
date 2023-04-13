#!/bin/bash

# Activate the Python virtual environment for the Django backend
source backend/venv/bin/activate

# Start the Django backend server
start_backend() {
  cd backend
  python manage.py runserver
}

# Start the React frontend server
start_frontend() {
  cd frontend
  npm start
}

# Export the functions to be used by 'concurrently'
export -f start_backend
export -f start_frontend

# Run both backend and frontend servers concurrently
concurrently --kill-others "bash -c start_backend" "bash -c start_frontend"
