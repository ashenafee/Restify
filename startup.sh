#!/bin/bash

# Create a virtual environment
python -m venv env

# Activate the virtual environment
source env/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install required packages
pip install -r requirements.txt

# Install additional apt packages
sudo apt-get update
sudo apt-get install python3-dev python3-pil python3-venv -y

# Run migrations
python manage.py migrate
