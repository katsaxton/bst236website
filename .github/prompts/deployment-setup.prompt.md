---
type: prompt
name: Deployment Setup Instructions
description: Guide for setting up and deploying to the target katsaxton/bst236website repository
---

# Deployment Setup Guide

You are responsible for setting up the target deployment repository and deploying the arXiv dashboard system to production.

## Overview

This guide covers:
1. Creating the target repository on GitHub
2. Configuring GitHub Pages
3. Pushing the code to the target repository
4. Verifying the deployment
5. Setting up GitHub Actions automation

**Target Repository:** `katsaxton/bst236website`
**Live URL:** `https://katsaxton.github.io/bst236website/`

---

## Phase 1: Create Target Repository

### Step 1.1: Create Repository on GitHub

**Via GitHub Web Interface:**
```
1. Go to: https://github.com/new
2. Fill in:
   - Repository name: bst236website
   - Description: "Automated arXiv paper dashboard with AI summaries"
   - Visibility: Public (required for GitHub Pages)
   - Initialize repository: Leave unchecked (we'll push existing code)
3. Click: "Create repository"
```

**Result:** New empty repository at https://github.com/katsaxton/bst236website

### Step 1.2: Note the Repository URL

```bash
# You'll need this URL for pushing code
REPO_URL="https://github.com/katsaxton/bst236website.git"
# or for SSH:
REPO_URL="git@github.com:katsaxton/bst236website.git"
```

---

## Phase 2: Prepare Code for Deployment

### Step 2.1: Navigate to Homework Repository

```bash
cd /Users/kathrynsaxton/Documents/Harvard/Spring-2026/BST236/homework-1-katsaxton
```

### Step 2.2: Verify All Files Present

```bash
# Check essential files exist
test -f index.html && echo "✓ index.html"
test -f arxiv.html && echo "✓ arxiv.html"
test -f games.html && echo "✓ games.html"
test -f css/style.css && echo "✓ css/style.css"
test -d .github/agents && echo "✓ .github/agents/"
test -d .github/skills && echo "✓ .github/skills/"
test -d .github/prompts && echo "✓ .github/prompts/"
test -f .github/workflows/update-papers.yml && echo "✓ .github/workflows/"
```

**Expected Output:**
```
✓ index.html
✓ arxiv.html
✓ games.html
✓ css/style.css
✓ .github/agents/
✓ .github/skills/
✓ .github/prompts/
✓ .github/workflows/
```

### Step 2.3: Verify Git Status

```bash
# Check that all changes are committed
git status

# Expected: "On branch main
#            Your branch is up to date with 'origin/main'.
#            nothing to commit, working tree clean"

# If uncommitted changes exist:
git add -A
git commit -m "prep: final state for deployment"
```

---

## Phase 3: Create Deployment Clone (Optional but Recommended)

### Step 3.1: Create Clean Clone for Deployment

**Option A: Via Git Clone**
```bash
# Create a clean clone specifically for deployment
mkdir -p ~/github-deploy
cd ~/github-deploy
git clone https://github.com/katsaxton/bst236website.git
cd bst236website
```

**Option B: Copy Files Directly**
```bash
# Or copy files from homework repo
cp -r ~/Documents/Harvard/Spring-2026/BST236/homework-1-katsaxton/* .
cd bst236website
```

### Step 3.2: Configure Git (if new clone)

```bash
# Set git user
git config user.name "Copilot"
git config user.email "223556219+Copilot@users.noreply.github.com"

# Verify
git config user.name
git config user.email
```

---

## Phase 4: Push Code to Target Repository

### Step 4.1: Add Remote Origin

```bash
# If repository is empty (no initial commit)
git remote add origin https://github.com/katsaxton/bst236website.git

# If remote already exists (or to update it)
git remote set-url origin https://github.com/katsaxton/bst236website.git

# Verify remote
git remote -v
# Should show: origin  https://github.com/katsaxton/bst236website.git (fetch)
#              origin  https://github.com/katsaxton/bst236website.git (push)
```

### Step 4.2: Create Initial Commit (if needed)

```bash
# Check if there's an initial commit
git log --oneline | head -1

# If no commits, create one:
git add -A
git commit -m "initial: arXiv dashboard system

- 4 agents: Orchestrator, Fetcher, Summarizer, Deployer
- 5 skills: API, Data, HTML, Summaries, Deployment
- 7 prompts: Orchestration, Fetching, Summarization, Deployment, Style, Spec, Testing
- 3 web pages: Homepage, arXiv Dashboard, Games
- 1 workflow: Automated midnight updates

Deployment target: katsaxton/bst236website
Live URL: https://katsaxton.github.io/bst236website/

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Step 4.3: Push to Remote

```bash
# Push to main branch
git branch -M main  # Rename to main if needed
git push -u origin main

# Expected output:
# Counting objects: 22, done.
# Writing objects: 100% (22/22), done.
# Total 22 (delta 0), reused 0 (delta 0)
# remote: 
# remote: Create a pull request for 'main' on GitHub by visiting:
# remote:      https://github.com/katsaxton/bst236website/pull/new/main
# remote:
# To https://github.com/katsaxton/bst236website.git
#  * [new branch]      main -> main
# Branch 'main' set up to track remote branch 'main' from 'origin'.
```

### Step 4.4: Verify Push Success

```bash
# Check remote status
git status
# Should show: "Your branch is up to date with 'origin/main'."

# View commits on remote
git log --oneline origin/main | head -5

# Check that all files are on remote
git ls-tree -r origin/main --name-only | head -20
```

---

## Phase 5: Configure GitHub Pages

### Step 5.1: Enable GitHub Pages

**Via GitHub Web Interface:**
```
1. Navigate to: https://github.com/katsaxton/bst236website
2. Click: Settings (gear icon)
3. Left sidebar: Click "Pages"
4. Under "Build and deployment":
   - Source: Select "Deploy from a branch"
   - Branch: Select "main"
   - Folder: Select "/ (root)"
5. Click: Save
```

**Expected:** GitHub Pages will show a blue checkmark and deployment URL

### Step 5.2: Note the GitHub Pages URL

```
Your site is live at: https://katsaxton.github.io/bst236website/
```

**Bookmark this URL** - it's your live website!

---

## Phase 6: Configure GitHub Actions

### Step 6.1: Enable Actions (if needed)

**Via GitHub Web Interface:**
```
1. Navigate to: https://github.com/katsaxton/bst236website
2. Click: Settings (gear icon)
3. Left sidebar: Click "Actions" → "General"
4. Under "Actions permissions":
   - Ensure "Allow all actions" is selected (or customize as needed)
   - Under "Workflow permissions", enable "Read and write permissions"
5. Click: Save
```

### Step 6.2: Verify Workflow File

```bash
# In your repository, verify workflow exists
cat .github/workflows/update-papers.yml

# Should show:
# - name: Update arXiv Papers Dashboard
# - Schedule: 0 0 * * * (midnight UTC)
# - workflow_dispatch: true (manual trigger)
```

### Step 6.3: Test Workflow Manually

**Via GitHub Web Interface:**
```
1. Navigate to: https://github.com/katsaxton/bst236website/actions
2. Click: "Update arXiv Papers Dashboard" workflow (on left)
3. Click: "Run workflow" dropdown
4. Click: "Run workflow" button
5. Wait for run to complete (should take < 1 minute)
```

**Check Results:**
```
✓ Workflow completed
✓ No errors in logs
✓ All steps executed
```

---

## Phase 7: Verify Live Deployment

### Step 7.1: Test Homepage

```bash
# Test HTTP access
curl -s -o /dev/null -w "%{http_code}\n" \
  https://katsaxton.github.io/bst236website/
# Should return: 200

# Verify content
curl -s https://katsaxton.github.io/bst236website/ | grep -q '<h1>' && \
  echo "✓ Homepage has content"
```

### Step 7.2: Test arXiv Dashboard

```bash
# Test arXiv page
curl -s -o /dev/null -w "%{http_code}\n" \
  https://katsaxton.github.io/bst236website/arxiv.html
# Should return: 200

# Verify content
curl -s https://katsaxton.github.io/bst236website/arxiv.html | \
  grep -q 'Latest Research' && \
  echo "✓ arXiv page loads"
```

### Step 7.3: Test CSS Styling

```bash
# Test CSS file
curl -s -o /dev/null -w "%{http_code}\n" \
  https://katsaxton.github.io/bst236website/css/style.css
# Should return: 200

# Verify it's not empty
curl -s https://katsaxton.github.io/bst236website/css/style.css | \
  wc -c
# Should show > 5000 bytes
```

### Step 7.4: Manual Browser Testing

**Open in Browser:**
```
Homepage:     https://katsaxton.github.io/bst236website/
arXiv Page:   https://katsaxton.github.io/bst236website/arxiv.html
Games Page:   https://katsaxton.github.io/bst236website/games.html
```

**Verify:**
- ✓ Pages load without errors
- ✓ Navigation bar visible and functional
- ✓ CSS styling applied (not plain HTML)
- ✓ Links work correctly
- ✓ Responsive design works (resize browser)

---

## Phase 8: Verify Agents & Skills Files

### Step 8.1: Check Agent Files on GitHub

```bash
# Verify agent files are accessible
curl -s -o /dev/null -w "%{http_code}\n" \
  https://raw.githubusercontent.com/katsaxton/bst236website/main/.github/agents/orchestrator.agent.md
# Should return: 200

# Check all agents
for agent in orchestrator arxiv-fetcher summarizer deployer; do
  curl -s -o /dev/null -w "$agent: %{http_code}\n" \
    https://raw.githubusercontent.com/katsaxton/bst236website/main/.github/agents/${agent}.agent.md
done
```

### Step 8.2: Check Skill Files

```bash
# Verify skill files
for skill in arxiv-api data-processing html-generation summary-generation github-deployment; do
  curl -s -o /dev/null -w "$skill: %{http_code}\n" \
    https://raw.githubusercontent.com/katsaxton/bst236website/main/.github/skills/${skill}.skill.md
done
```

### Step 8.3: Check Prompt Files

```bash
# Verify prompt files
for prompt in orchestrate fetch-arxiv summarize deploy coding-style html-spec test-e2e; do
  curl -s -o /dev/null -w "$prompt: %{http_code}\n" \
    https://raw.githubusercontent.com/katsaxton/bst236website/main/.github/prompts/${prompt}.prompt.md
done
```

---

## Phase 9: Set Up Scheduled Deployment

### Step 9.1: Verify Workflow Schedule

The workflow is configured to run at **midnight UTC** every day via cron: `0 0 * * *`

**To confirm:**
```
1. GitHub → Actions
2. Select "Update arXiv Papers Dashboard"
3. Should show "This workflow runs every day at 00:00 UTC"
```

### Step 9.2: Optional: Adjust Schedule

To change the schedule (e.g., every 6 hours):

```bash
# Edit workflow file
nano .github/workflows/update-papers.yml

# Find this line:
#   - cron: '0 0 * * *'  # Midnight UTC every day

# Change to (for every 6 hours):
#   - cron: '0 0,6,12,18 * * *'

# Commit and push
git add .github/workflows/update-papers.yml
git commit -m "chore: adjust workflow schedule to every 6 hours"
git push origin main
```

---

## Phase 10: Documentation & Handoff

### Step 10.1: Create Deployment Record

```bash
# Create a deployment log
cat > DEPLOYMENT.md << 'EOF'
# Deployment Record

## Target Repository
- GitHub: https://github.com/katsaxton/bst236website
- Live URL: https://katsaxton.github.io/bst236website/

## Deployment Date
- Deployed: 2024-02-17

## Components
- ✓ 4 Agents (.github/agents/)
- ✓ 5 Skills (.github/skills/)
- ✓ 7 Prompts (.github/prompts/)
- ✓ 3 Web Pages (index.html, arxiv.html, games.html)
- ✓ CSS Styling (css/style.css)
- ✓ GitHub Actions Workflow (.github/workflows/update-papers.yml)

## Configuration
- Update Schedule: Midnight UTC daily
- Manual Trigger: Enabled (workflow_dispatch)
- GitHub Pages: Enabled (deploy from main branch)
- Automation: Enabled

## Verification
- [x] Homepage accessible: https://katsaxton.github.io/bst236website/
- [x] arXiv Dashboard: https://katsaxton.github.io/bst236website/arxiv.html
- [x] CSS styling applied
- [x] Workflow configured
- [x] All agents, skills, prompts present

## Next Steps
1. Wait for first scheduled run (midnight UTC)
2. Monitor workflow logs (Actions tab)
3. Verify arXiv.html updates with real papers
4. Test the complete pipeline
EOF

# Commit this record
git add DEPLOYMENT.md
git commit -m "docs: add deployment record"
git push origin main
```

### Step 10.2: Update Homework README

In your homework repository's README, add a link to the live site:

```markdown
## Problem 3: Data Scaffolding from the Internet - arXiv Dashboard

**Live Site:** [katsaxton.github.io/bst236website](https://katsaxton.github.io/bst236website/)

### Implementation Details
- Agents: 4 (Orchestrator, Fetcher, Summarizer, Deployer)
- Skills: 5 (API, Data, HTML, Summaries, Deployment)
- Prompts: 7 (comprehensive guidance for all components)
- Automation: GitHub Actions (midnight UTC daily)
- Tech: HTML5, CSS3, arXiv API, GitHub Pages

See `.github/` directory for complete agent system configuration.
```

---

## Troubleshooting

### GitHub Pages Not Showing

```
Issue: Site returns 404
Fix:
  1. Settings → Pages
  2. Verify branch is "main"
  3. Verify folder is "/"
  4. Wait 1-2 minutes for rebuild
  5. Refresh browser (Ctrl+Shift+R)
```

### Workflow Not Running

```
Issue: Scheduled workflow doesn't execute
Fix:
  1. Settings → Actions → General
  2. Verify "Allow all actions" is selected
  3. Manually trigger: Actions tab → "Run workflow"
  4. Check workflow file exists: .github/workflows/update-papers.yml
```

### Files Not Showing on GitHub

```
Issue: Files missing from repository
Fix:
  1. Verify files were added: git status
  2. Commit if needed: git add -A && git commit
  3. Push to remote: git push origin main
  4. Wait 30 seconds and refresh GitHub
```

### CSS Not Applying

```
Issue: Website looks like plain HTML
Fix:
  1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
  2. Verify CSS file exists: https://katsaxton.github.io/bst236website/css/style.css
  3. Check file size (should be > 10KB)
  4. Wait 1-2 minutes and try again
```

---

## Success Criteria

Your deployment is successful when:

```
✅ Repository created: github.com/katsaxton/bst236website
✅ All files pushed to main branch
✅ GitHub Pages enabled and live
✅ Homepage loads: https://katsaxton.github.io/bst236website/
✅ arXiv page loads: https://katsaxton.github.io/bst236website/arxiv.html
✅ CSS styling visible (not plain HTML)
✅ Navigation links functional
✅ Workflow configured and tested
✅ All agents, skills, prompts present in .github/
✅ DEPLOYMENT.md created with verification checklist
✅ Homework README updated with live link
```

---

## Next: Automated Updates

Once deployed and verified:

1. **Wait for first scheduled run** - Midnight UTC of next day
2. **Monitor Actions tab** - Check workflow execution
3. **Verify arXiv updates** - Check arxiv.html for real papers
4. **Review logs** - Check for any errors or warnings
5. **Adjust if needed** - Use debugging guide if issues arise

Your arXiv dashboard will now automatically update every midnight UTC! 🚀

