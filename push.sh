#!/bin/zsh
# Run this from the Rentify folder to push all changes to GitHub
# Usage: ./push.sh "your commit message"

cd "$(dirname "$0")"

MSG=${1:-"Update $(date '+%d %b %Y %H:%M')"}

git add -A
git commit -m "$MSG"
git push origin main && echo "✅ Pushed to GitHub: $MSG" || echo "❌ Push failed — check your internet or token"
