#!/bin/bash

# Remove existing git repository if it exists
rm -rf .git

# Initialize new git repository
git init

# Add remote origin
git remote add origin git@github.com:UsamaKaleem322/Sales-AI-Rocket-.git

# Add all files (except those in .gitignore)
git add .

# Commit the changes
git commit -m "Initial commit: Sales AI Dashboard with green theme"

# Push to GitHub
git push -u origin master

echo "Repository setup complete!" 