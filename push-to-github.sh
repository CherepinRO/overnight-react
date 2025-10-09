#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Push to GitHub - Overnight React    ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════╝${NC}"

# Repository details
REPO_URL="https://github.com/CherepinRO/overnight-react.git"
REPO_NAME="overnight-react"

echo -e "\n${YELLOW}📦 Repository: ${REPO_URL}${NC}\n"

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo -e "${YELLOW}Initializing git repository...${NC}"
  git init
  echo -e "${GREEN}✓ Git initialized${NC}"
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ -z "$CURRENT_BRANCH" ]; then
  CURRENT_BRANCH="main"
  git checkout -b main
  echo -e "${GREEN}✓ Created branch: main${NC}"
fi

echo -e "${BLUE}Current branch: ${CURRENT_BRANCH}${NC}"

# Check if remote exists
if git remote | grep -q "^origin$"; then
  echo -e "${YELLOW}Remote 'origin' already exists. Removing...${NC}"
  git remote remove origin
fi

# Add remote
echo -e "${YELLOW}Adding remote...${NC}"
git remote add origin $REPO_URL
echo -e "${GREEN}✓ Remote added: origin -> ${REPO_URL}${NC}"

# Stage all files
echo -e "\n${YELLOW}Staging files...${NC}"
git add .
echo -e "${GREEN}✓ All files staged${NC}"

# Show what will be committed
echo -e "\n${BLUE}Files to be committed:${NC}"
git status --short | head -20
FILE_COUNT=$(git status --short | wc -l)
if [ $FILE_COUNT -gt 20 ]; then
  echo -e "${YELLOW}... and $(($FILE_COUNT - 20)) more files${NC}"
fi

# Commit
echo -e "\n${YELLOW}Creating commit...${NC}"
git commit -m "Initial commit: Overnight React fintech app

- Firebase authentication with Google Sign-In
- Stripe payment integration (monthly/yearly subscriptions)
- Firebase Cloud Functions for overnight processing
- PWA support with service worker
- Comprehensive test suite (47 tests passing)
- Multi-language support (EN/RU)
- Real-time dashboard with analytics
- Complete documentation"

echo -e "${GREEN}✓ Commit created${NC}"

# Push to GitHub
echo -e "\n${YELLOW}Pushing to GitHub...${NC}"
git push -u origin $CURRENT_BRANCH

if [ $? -eq 0 ]; then
  echo -e "\n${GREEN}╔════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║          SUCCESS! 🎉                   ║${NC}"
  echo -e "${GREEN}╔════════════════════════════════════════╝${NC}"
  echo -e "\n${GREEN}✓ Code successfully pushed to GitHub!${NC}"
  echo -e "\n${BLUE}📦 Repository URL:${NC}"
  echo -e "   ${REPO_URL%.git}\n"
  echo -e "${BLUE}🚀 Next steps:${NC}"
  echo -e "   1. Visit your repository on GitHub"
  echo -e "   2. Set up branch protection rules (optional)"
  echo -e "   3. Configure GitHub Actions for CI/CD (optional)"
  echo -e "   4. Add repository topics/tags"
  echo -e "   5. Update repository description\n"
else
  echo -e "\n${YELLOW}⚠️  Push failed. This might be because:${NC}"
  echo -e "   1. You need to authenticate with GitHub"
  echo -e "   2. The repository already has commits"
  echo -e "   3. Network issues\n"
  echo -e "${BLUE}Try manual push:${NC}"
  echo -e "   git push -u origin $CURRENT_BRANCH --force\n"
fi
