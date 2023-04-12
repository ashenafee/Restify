#!/bin/bash

# Remove all __pycache__ directories
find . -name __pycache__ -type d -exec rm -r {} +

# Keep the repository up to date
if [[ $OSTYPE == linux-gnu* ]]; then
    sudo apt-get update
fi

# Create a virtual environment
if [[ $OSTYPE == linux-gnu* ]]; then
    # Install packages
    sudo apt install python3-venv -y
    python3 -m venv venv
else
    python3 -m venv venv
fi

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

# Check if running on Ubuntu
if [[ $OSTYPE == linux-gnu* ]]; then
    # Install additional apt packages
    sudo apt-get install python3-dev python3-pil python3-venv -y
fi

# Make migrations
python manage.py makemigrations

# Run migrations
python manage.py migrate
