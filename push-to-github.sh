#!/bin/bash
# Push local commits to https://github.com/mattjss/Orbit-Sphere.git
# Run this from the Orbit-Sphere folder (or from repo root) after opening a terminal.
cd "$(dirname "$0")"
echo "Pushing to origin (https://github.com/mattjss/Orbit-Sphere.git)..."
git push origin main
if [ $? -eq 0 ]; then
  echo "Done. Check https://github.com/mattjss/Orbit-Sphere"
else
  echo "Push failed. Make sure you're logged in to GitHub (e.g. gh auth login or Git credential manager)."
fi
