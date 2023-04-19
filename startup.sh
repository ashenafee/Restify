#!/bin/bash

# Run backend/startup.sh in the background
cd backend || exit
./startup.sh &
cd ..

# Run frontend/startup.sh in the background
cd frontend || exit
./startup.sh &

# Wait for both processes to complete
wait
