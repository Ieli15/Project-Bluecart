#!/bin/bash

# Install dependencies
cd frontend
npm install

# Build the React app
npm run build

# Create build directory if it doesn't exist
mkdir -p ../static

# Copy build files to static directory
cp -r build/* ../static/

echo "Frontend build completed successfully!"