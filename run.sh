#!/bin/bash

# Run backend/startup.sh in the background
cd backend || exit
./run.sh &
cd ..

# Run frontend/startup.sh in the background
cd frontend || exit
./run.sh &

# Wait for both processes to complete
wait
