---
type: skill
name: GitHub Deployment
description: Handles Git operations and GitHub Pages deployment
version: 1.0
---

# GitHub Deployment Skill

## Overview
Manages all Git operations, repository updates, and GitHub Pages deployment with safety checks and verification.

## Core Functions

### 1. Git Configuration
- **Purpose**: Set up Git author identity
- **Configuration:**
  - Author name: "Copilot"
  - Author email: "223556219+Copilot@users.noreply.github.com"
  - Commit signing: Optional (if GPG key available)

**Git Config Commands:**
```bash
git config user.name "Copilot"
git config user.email "223556219+Copilot@users.noreply.github.com"
```

### 2. File Operations
- **Purpose**: Update repository files safely
- **Operations:**
  - Read existing HTML files
  - Generate new HTML content
  - Write changes to disk
  - Backup originals before overwrite

**Safe Update Strategy:**
1. Read original file (if exists)
2. Generate new content
3. Create backup (optional)
4. Write new content to temporary file
5. Validate new file (HTML syntax check)
6. Replace original with new file
7. Verify changes

**Files Modified:**
- `arxiv.html` - Main dashboard
- `css/style.css` - Styling (if needed)
- Preserve other files untouched

### 3. Git Staging & Status
- **Purpose**: Prepare changes for commit
- **Operations:**
  - Check repository status
  - Stage modified files
  - Verify nothing unintended is staged
  - Show diff before committing

**Workflow:**
```bash
git status  # Show changes
git diff [file]  # Review changes
git add [files]  # Stage files
git status  # Verify staging
```

### 4. Commit Creation
- **Purpose**: Create semantic commits with proper metadata
- **Commit Message Format:** `chore: update arxiv papers [TIMESTAMP]`
- **Timestamp Format:** YYYY-MM-DD HH:mm:ss UTC
- **Message Example:** `chore: update arxiv papers [2024-02-17 06:00:00 UTC]`

**Commit Template:**
```
chore: update arxiv papers [2024-02-17 06:00:00 UTC]

- Fetched 10 new papers from arXiv
- Generated AI summaries for all papers
- Updated arxiv.html dashboard
- Papers in topics: oncology, artificial intelligence

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

**Commit Trailer (Required):**
- Always include Co-authored-by line
- Format: `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`

### 5. Push & Deployment
- **Purpose**: Push changes to remote and trigger GitHub Pages
- **Branch:** main (configurable)
- **Push Strategy:** Force-push disabled (safety)
- **Authentication:** GitHub token via secrets

**Push Operations:**
```bash
git push origin main  # Push to main branch
```

**GitHub Pages Trigger:**
- Automatic on push to main
- Builds static site
- Deploys to https://katsaxton.github.io/bst236website/

**Configuration (GitHub UI):**
- Source: Deploy from branch
- Branch: main
- Path: / (root)

### 6. Verification & Monitoring
- **Purpose**: Confirm successful deployment
- **Checks:**
  - ✓ Git commit created with correct message
  - ✓ Files pushed to remote
  - ✓ GitHub Pages build triggered
  - ✓ Site accessible at live URL
  - ✓ HTML renders correctly

**Verification Steps:**
1. Get commit SHA from `git rev-parse HEAD`
2. Verify push success (check exit code)
3. Poll GitHub Pages status (via API or HTTP check)
4. Test live URL accessibility
5. Validate HTML structure in deployed version

**Logging:**
- Commit SHA
- Branch name
- Timestamp of deployment
- Files changed count
- Lines added/removed
- Live site URL

### 7. Error Handling & Recovery
- **Purpose**: Handle failures gracefully
- **Failure Cases:**
  - Git authentication failure
  - Network/connectivity issues
  - File permission errors
  - HTML syntax errors
  - Rate limiting

**Recovery Strategies:**
- **Auth failure:** Fail fast, log error, verify token
- **Network timeout:** Retry with exponential backoff (max 3)
- **File errors:** Check permissions, disk space
- **HTML syntax:** Validate before push, reject if invalid
- **Rate limit:** Wait and retry

**Error Messages:**
- Log detailed error information
- Include remediation steps
- Don't leak sensitive data (tokens, etc.)

## Configuration Parameters
```yaml
deployment_repo: katsaxton/bst236website
branch: main
github_token: ${{ secrets.GITHUB_TOKEN }}
author_name: Copilot
author_email: 223556219+Copilot@users.noreply.github.com
commit_prefix: "chore: update arxiv papers"
files_to_update:
  - arxiv.html
max_retries: 3
retry_backoff_seconds: 2
deployment_timeout_seconds: 300
verify_deployment: true
```

## Dependencies
- Git CLI (installed and available in PATH)
- GitHub CLI (optional, for advanced operations)
- HTTP client (for verification)
- File system access

## Example Workflow

**Initial State:**
```
Modified files: arxiv.html
Branch: main
Remote: origin (GitHub)
```

**Step 1: Check Status**
```
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified: arxiv.html
```

**Step 2: Stage Changes**
```
$ git add arxiv.html
```

**Step 3: Create Commit**
```
$ git commit -m "chore: update arxiv papers [2024-02-17 06:00:00 UTC]"
[main abc1234] chore: update arxiv papers [2024-02-17 06:00:00 UTC]
 1 file changed, 47 insertions(+), 3 deletions(-)
```

**Step 4: Push to Remote**
```
$ git push origin main
Counting objects: 3, done.
Writing objects: 100% (3/3), done.
Total 3 (delta 2), reused 0 (delta 0)
remote: Resolving deltas: 100% (2/2), done.
To github.com:katsaxton/bst236website.git
   xyz9876..abc1234  main -> main
```

**Step 5: Verify Deployment**
- GitHub Pages build completes (≈ 1-2 minutes)
- Site live at: https://katsaxton.github.io/bst236website/
- Updates reflected in arxiv.html

## Testing Considerations
- Test with dummy repository (create test repo)
- Verify commit message format
- Check co-authored-by trailer presence
- Validate GitHub Pages deployment
- Test error scenarios (network failure, auth)
- Verify no sensitive data in logs
- Test with various file sizes
