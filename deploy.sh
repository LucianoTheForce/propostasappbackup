#!/bin/bash

# Quick Deploy Script for THE FORCE Projects
# Usage: ./deploy.sh "commit message"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 THE FORCE Quick Deploy${NC}"
echo "================================"

# Get commit message or use default
COMMIT_MESSAGE="${1:-Quick update - $(date '+%Y-%m-%d %H:%M')}"

# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  No changes detected. Nothing to deploy.${NC}"
    exit 0
fi

# Show what will be committed
echo -e "${BLUE}📝 Changes to deploy:${NC}"
git diff --name-only --cached
git diff --name-only

echo ""
echo -e "${BLUE}💾 Committing changes...${NC}"

# Add all changes
git add .

# Commit with message
git commit -m "$COMMIT_MESSAGE"

# Push to trigger Vercel deployment
echo -e "${BLUE}📤 Pushing to GitHub (auto-deploys to Vercel)...${NC}"
git push

echo ""
echo -e "${GREEN}✅ Deploy initiated!${NC}"
echo -e "${BLUE}📱 Check your Vercel dashboard for deployment status${NC}"
echo -e "${BLUE}🌐 Live URL will be available in ~30-60 seconds${NC}"
echo ""
echo -e "${YELLOW}💡 Pro tip: Use 'vercel --prod' for immediate production deploy${NC}" 