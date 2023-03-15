#!/bin/bash

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install required packages
pip install -r requirements.txt

# Create a secret key
KEY=$(chars='abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)'; python -c "import secrets; print(''.join(secrets.choice('${chars}') for i in range(50)))")

# Create a .env file with SECRET_KEY
echo "SECRET_KEY=$KEY" > .env

# Install additional apt packages
sudo apt-get update
sudo apt-get install python3-dev python3-pil python3-venv -y

# Make migrations
python manage.py makemigrations

# Run migrations
python manage.py migrate
