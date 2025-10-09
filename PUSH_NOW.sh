#!/bin/bash

# GitHub Push Script for overnight-react
# Run this in the Replit Shell

echo "🚀 Pushing to GitHub..."
echo ""

# Remove lock files
rm -f .git/index.lock .git/config.lock

# Add remote (ignore error if exists)
git remote remove origin 2>/dev/null
git remote add origin https://github.com/CherepinRO/overnight-react.git

# Push to GitHub
echo "Pushing to main branch..."
git push -u origin main

echo ""
echo "✅ Done! Check: https://github.com/CherepinRO/overnight-react"
