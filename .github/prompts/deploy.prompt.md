---
type: prompt
name: GitHub Pages Deployment Instructions
description: Guides the deployer agent in updating and publishing the dashboard
---

# Deployment Prompt

You are responsible for safely updating the arxiv.html dashboard and deploying changes to GitHub Pages.

## Your Mission
1. Update `arxiv.html` with the latest paper summaries
2. Commit changes with proper Git metadata
3. Push to GitHub for automatic GitHub Pages deployment
4. Verify successful publication

---

## Step 1: Prepare Environment

### Git Configuration
Set up author identity for commits:
```bash
git config user.name "Copilot"
git config user.email "223556219+Copilot@users.noreply.github.com"
```

### Verify Repository State
```bash
pwd  # Should be root of katsaxton/bst236website
git status  # Check for uncommitted changes
git branch  # Verify on 'main' branch
```

### Backup Current State
Before making changes:
```bash
cp arxiv.html arxiv.html.backup  # Optional safety backup
```

---

## Step 2: Update HTML Content

### Load Template
The arxiv.html file should have this structure:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>arXiv Dashboard</title>
    <link rel="stylesheet" href="css/style.css">
  </head>
  <body>
    <nav>
      <a href="index.html">Home</a>
      <a href="arxiv.html" class="active">arXiv Papers</a>
      <a href="games.html">Games</a>
    </nav>
    
    <main>
      <h1>Latest Research Papers</h1>
      <section id="arxiv-papers" class="papers-grid">
        <!-- REPLACE THIS SECTION WITH NEW CONTENT -->
      </section>
      <footer>
        <p>Last updated: <time>REPLACE_WITH_TIMESTAMP</time></p>
      </footer>
    </main>
  </body>
</html>
```

### Generate Paper Cards
For each paper in the summarized papers array, create an HTML card:

```html
<article class="paper-card">
  <header>
    <h3 class="paper-title">
      <a href="https://arxiv.org/abs/{PAPER_ID}">
        {TITLE}
      </a>
    </h3>
    <p class="paper-meta">
      <span class="authors">By {AUTHORS_COMMA_SEPARATED}</span>
      <span class="date">Published: {PUBLISHED_DATE}</span>
    </p>
  </header>
  
  <section class="paper-content">
    <p class="summary">
      {GENERATED_SUMMARY}
    </p>
    <ul class="key-points">
      <li>{KEY_POINT_1}</li>
      <li>{KEY_POINT_2}</li>
      <li>{KEY_POINT_3}</li>
    </ul>
  </section>
  
  <footer class="paper-footer">
    <a href="https://arxiv.org/abs/{PAPER_ID}" class="arxiv-link">
      Read on arXiv →
    </a>
  </footer>
</article>
```

### Replace Content Section
1. Keep everything outside `<section id="arxiv-papers">` unchanged
2. Replace the entire `<section id="arxiv-papers">` with generated cards
3. Update the timestamp in `<time>` to current UTC time
4. Preserve CSS classes for styling

### HTML Sanitization Checklist
Before writing file:
```
□ All HTML special characters escaped: & < > " '
□ All URLs start with https:// or are relative paths
□ No <script> tags or inline event handlers
□ No unescaped user content
□ Valid HTML5 structure
□ All tags properly closed
□ No orphaned elements
```

---

## Step 3: Write and Validate

### Write to File
```bash
# Write generated HTML to arxiv.html
cat > arxiv.html << 'EOF'
{GENERATED_HTML_CONTENT}
EOF
```

### Validate HTML
```bash
# Check for basic HTML validity (optional, if tools available)
# Use an HTML validator tool or manual inspection
```

**Validation Checklist:**
```
□ DOCTYPE present and correct
□ All opening tags have closing tags
□ Navigation bar unchanged
□ Paper grid section properly formatted
□ Timestamp updated to current UTC
□ CSS file link correct: href="css/style.css"
□ All paper links valid and properly formatted
□ No broken HTML entities
```

### Test File Integrity
```bash
# Verify file was written
ls -la arxiv.html

# Check file size is reasonable (> 5KB)
wc -c arxiv.html

# Spot-check content
head -20 arxiv.html
tail -20 arxiv.html
grep 'paper-card' arxiv.html | wc -l  # Should match paper count
```

---

## Step 4: Git Staging & Commit

### Check Status
```bash
git status
# Should show: modified: arxiv.html
```

### Review Changes
```bash
# View the differences
git diff arxiv.html | head -50

# Verify no unexpected changes to other files
git status --porcelain
```

### Stage Changes
```bash
# Stage only arxiv.html
git add arxiv.html

# Verify staging
git status
# Should show: Changes to be committed: arxiv.html
```

### Create Commit
```bash
# Generate timestamp for commit message
TIMESTAMP=$(date -u +'%Y-%m-%d %H:%M:%S UTC')

# Create commit with proper message and co-author trailer
git commit -m "chore: update arxiv papers [$TIMESTAMP]" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

**Commit Message Format:**
```
chore: update arxiv papers [2024-02-17 06:00:00 UTC]

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

### Verify Commit
```bash
# Check commit was created
git log -1 --oneline
# Output: abc1234 chore: update arxiv papers [2024-02-17 06:00:00 UTC]

# Verify commit includes co-author
git log -1 | grep "Co-authored-by"
```

---

## Step 5: Push to Remote

### Get Commit SHA
```bash
COMMIT_SHA=$(git rev-parse HEAD)
echo "Deploying commit: $COMMIT_SHA"
```

### Push Changes
```bash
# Push to main branch
git push origin main

# Expected output:
# Counting objects: 3, done.
# Writing objects: 100% (3/3), done.
# To github.com:katsaxton/bst236website.git
#    xyz9876..abc1234  main -> main
```

### Handle Push Failures

**If authentication fails:**
```
Error: remote: Support for password authentication was removed
Fix: Ensure GITHUB_TOKEN secret is properly configured
     Verify token has 'contents' scope for repo access
```

**If push is rejected:**
```
Error: Updates were rejected because the tip of your current branch
Fix: Pull latest: git pull origin main
     Retry push: git push origin main
```

---

## Step 6: Verify Deployment

### Confirm Push Success
```bash
# Check remote matches local
git rev-parse HEAD  # Local commit
git rev-parse origin/main  # Remote commit
# Should match
```

### Monitor GitHub Pages Build
GitHub Pages automatically builds when you push to main:
1. Build starts immediately
2. Takes 1-2 minutes typically
3. Check status at: https://github.com/katsaxton/bst236website/deployments
4. Or at: https://github.com/katsaxton/bst236website/pages

### Verify Live Site
```bash
# Wait for build to complete (≈ 1-2 minutes)
# Then visit:
https://katsaxton.github.io/bst236website/arxiv.html

# Spot-check:
□ Page loads without errors
□ Navigation bar visible and working
□ Paper cards display correctly
□ Paper titles are links to arXiv
□ Timestamp shows current date
□ CSS styling is applied (not plain text)
```

---

## Step 7: Log Deployment Results

### Create Deployment Report
```
=== DEPLOYMENT SUMMARY ===
Timestamp: 2024-02-17T06:00:00Z
Repository: katsaxton/bst236website
Branch: main
Commit SHA: abc1234567890
Files Updated: 1 (arxiv.html)
Lines Added: 127
Lines Removed: 45
Papers Published: 10

Live URL: https://katsaxton.github.io/bst236website/arxiv.html
Status: ✓ SUCCESS

Build Status: Pending → In Progress → Complete
Live Site: ✓ Accessible
Content: ✓ Updated correctly
==========================
```

### Log to GitHub Actions
```bash
# Print results to workflow logs
echo "✓ Deployment successful"
echo "Commit: $COMMIT_SHA"
echo "Live: https://katsaxton.github.io/bst236website/arxiv.html"
```

---

## Error Recovery

### If HTML Update Fails
```
Action: Do NOT attempt to push
Reason: Prevents corrupted state
Fix: Restore from backup
     git checkout arxiv.html
     Log error for debugging
```

### If Commit Fails
```
Action: Reset staging area
Command: git reset HEAD arxiv.html
Fix: Verify Git configuration
     Try commit again
```

### If Push Fails (network)
```
Action: Retry with exponential backoff
Attempt 1: Wait 2 seconds, retry
Attempt 2: Wait 4 seconds, retry
Attempt 3: Wait 8 seconds, retry
After 3 failures: Log error, stop
```

### If GitHub Pages Build Fails
```
Note: This is separate from our push
Check: GitHub Actions tab in repository
Review: Build logs for HTML syntax errors
Action: Fix HTML and retry push
```

---

## Important Guidelines

1. **Never Force Push:** Always use `git push` (never `-f` or `--force`)
2. **Preserve Other Files:** Only modify `arxiv.html`, touch nothing else
3. **Proper Messaging:** Always include timestamp in commit message
4. **Co-Author Attribution:** Always include Co-authored-by trailer
5. **Validate First:** Check HTML before committing
6. **One Branch:** Always push to `main` branch
7. **Idempotent:** Safe to re-run deployment multiple times

---

## Configuration

```yaml
repository: katsaxton/bst236website
branch: main
author:
  name: Copilot
  email: 223556219+Copilot@users.noreply.github.com
target_file: arxiv.html
content_section_id: arxiv-papers
timestamp_format: '%Y-%m-%d %H:%M:%S UTC'
github_pages_url: https://katsaxton.github.io/bst236website/
verification_timeout: 300  # seconds
```
