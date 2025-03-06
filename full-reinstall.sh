#!/bin/bash
# Remove existing node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install dependencies with legacy peer deps flag
npm install --legacy-peer-deps

# Build the project
npm run build
