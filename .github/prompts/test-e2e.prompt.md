---
type: prompt
name: End-to-End Testing Guide
description: Instructions for manually testing the complete arXiv dashboard pipeline
---

# End-to-End Testing Guide

You are responsible for verifying that the entire arXiv dashboard pipeline works correctly from start to finish.

## Pre-Test Checklist

Before running end-to-end tests, verify the environment is ready:

```
□ Repository cloned: katsaxton/bst236website
□ Git credentials configured
□ GITHUB_TOKEN available (with 'contents' scope)
□ Internet connectivity available
□ Text editor or IDE open
□ Terminal/command line ready
□ All .github files present (agents, skills, prompts)
□ All HTML files present (index.html, arxiv.html, games.html)
□ CSS file present and linked correctly
```

## Test Phases

### Phase 1: Manual arXiv Fetching Test

**Objective**: Verify that the arXiv Fetcher agent can successfully fetch papers.

#### Step 1.1: Set Up Test Environment
```bash
# Navigate to repository root
cd /path/to/katsaxton/bst236website

# Create a test directory for outputs
mkdir -p .test-output

# Verify API is accessible
curl -s "http://export.arxiv.org/api/query?search_query=cat:cs.AI&start=0&max_results=1" \
  | head -20
# Should see XML response with arXiv papers
```

#### Step 1.2: Simulate arXiv Fetching
```bash
# Test API query construction
# Query format: (cat:cs.AI OR cat:q-bio.CB) AND submittedDate:[24h_ago TO now]

# Example with last 24 hours (adjust dates as needed):
QUERY="(cat:cs.AI%20OR%20cat:cs.LG%20OR%20cat:q-bio.CB)%20AND%20submittedDate:[202402160000%20TO%20202402170000]"

curl -s "http://export.arxiv.org/api/query?search_query=${QUERY}&start=0&max_results=10" \
  > .test-output/papers.xml

# Verify output
wc -c .test-output/papers.xml  # Should be > 5KB
grep -c "<entry>" .test-output/papers.xml  # Should have entries (count)
grep "arxiv.org/abs/" .test-output/papers.xml | head -3  # See paper IDs
```

#### Step 1.3: Validate Fetched Data
```
✓ Response is valid XML (check with grep patterns above)
✓ Contains multiple <entry> elements
✓ Each entry has: id, title, author, published, summary, category
✓ Paper IDs match format: YYMM.##### (e.g., 2402.12345)
✓ Published dates are recent (last 24 hours)
✓ Categories include at least one target category
```

**Success Criteria**: 5+ valid papers retrieved from API

---

### Phase 2: Manual Summarization Test

**Objective**: Verify that the Summarizer agent can generate summaries.

#### Step 2.1: Prepare Test Paper
Create a test paper object with a real abstract:

```json
{
  "id": "2402.12345",
  "title": "Deep Learning for Medical Imaging",
  "authors": ["Alice Smith", "Bob Jones"],
  "published": "2024-02-17T10:00:00Z",
  "summary": "We present a novel federated learning approach for training deep learning models on medical imaging data across multiple hospitals without centralizing sensitive patient information. Our method uses differential privacy to ensure patient privacy while achieving 94% accuracy on chest X-ray classification tasks. This work demonstrates the feasibility of privacy-preserving collaborative AI in healthcare settings.",
  "categories": ["cs.AI", "q-bio.CB"],
  "url": "https://arxiv.org/abs/2402.12345"
}
```

#### Step 2.2: Generate Summary Manually
Read the abstract and generate a 2-3 sentence summary:

**Input Abstract** (above)

**Expected Generated Summary**:
```
Researchers propose a federated learning approach that trains AI models 
on medical imaging data across multiple hospitals while preserving patient 
privacy. The method uses differential privacy mechanisms and achieves 94% 
accuracy on chest X-ray classification. This work demonstrates privacy-preserving 
collaborative AI is feasible in healthcare.
```

**Acceptance Criteria**:
- ✓ Exactly 2-3 sentences
- ✓ Total word count 80-150 words
- ✓ Contains main problem, approach, and results
- ✓ Understandable to non-specialist audience
- ✓ No made-up facts
- ✓ Proper grammar and punctuation

#### Step 2.3: Extract Key Points
From the same abstract, extract 3 key contributions:

**Expected Key Points**:
- Federated learning approach for multi-hospital AI training
- Differential privacy ensures patient data protection
- Achieves 94% accuracy on medical imaging tasks

**Acceptance Criteria**:
- ✓ 2-4 bullet points (target: 3)
- ✓ Each point is 1-2 sentences
- ✓ Highlights novel contributions
- ✓ Distinct from the summary
- ✓ Specific and measurable

**Success Criteria**: Summary and key points meet all acceptance criteria

---

### Phase 3: HTML Generation & Styling Test

**Objective**: Verify that HTML is properly generated and styled.

#### Step 3.1: Check HTML Structure
```bash
# Verify arxiv.html exists and is valid
test -f arxiv.html && echo "✓ arxiv.html exists" || echo "✗ File missing"

# Check for required elements
grep -q '<nav class="navbar">' arxiv.html && echo "✓ Navigation bar present"
grep -q '<section id="arxiv-papers"' arxiv.html && echo "✓ Papers section present"
grep -q '<link rel="stylesheet" href="css/style.css">' arxiv.html && echo "✓ CSS linked"
grep -q '<footer class="footer">' arxiv.html && echo "✓ Footer present"
```

#### Step 3.2: Validate Paper Card Structure
```bash
# Check for paper card template
grep -q '<article class="paper-card">' arxiv.html && echo "✓ Paper card structure present"

# Verify card has required elements
grep -A5 '<article class="paper-card">' arxiv.html | grep -q '<h3 class="paper-title">' && echo "✓ Title element"
grep -A10 '<article class="paper-card">' arxiv.html | grep -q '<p class="paper-summary">' && echo "✓ Summary element"
grep -A10 '<article class="paper-card">' arxiv.html | grep -q '<ul class="paper-key-points">' && echo "✓ Key points list"
```

#### Step 3.3: Check CSS Styling
```bash
# Verify CSS file exists
test -f css/style.css && echo "✓ CSS file exists" || echo "✗ CSS missing"

# Check for required styles
grep -q '.paper-card' css/style.css && echo "✓ Paper card styles"
grep -q '.papers-grid' css/style.css && echo "✓ Grid layout styles"
grep -q '.navbar' css/style.css && echo "✓ Navigation styles"
grep -q '@media' css/style.css && echo "✓ Responsive design"

# Verify CSS variables
grep -q '--primary-color' css/style.css && echo "✓ CSS variables defined"
grep -q '--spacing-' css/style.css && echo "✓ Spacing variables defined"
```

#### Step 3.4: Test Responsive Design
```
Manual Test (requires browser):
□ Open arxiv.html in browser
□ Desktop view (1024px+): 
  ✓ Navigation bar horizontal
  ✓ Paper cards in 2-column grid
  ✓ All content readable
□ Tablet view (768px): 
  ✓ Paper cards in 1-column layout
  ✓ Navigation bar functional
  ✓ Text sizes adjusted
□ Mobile view (320px): 
  ✓ Single column layout
  ✓ Touch-friendly button sizes (min 44px)
  ✓ Navigation accessible
```

#### Step 3.5: Accessibility Validation
```
Manual Test (browser DevTools):
□ Color contrast adequate (WCAG AA: 4.5:1)
□ All images have alt text (if any)
□ Heading hierarchy correct (H1 > H2 > H3)
□ Links have descriptive text
□ Focus outlines visible on interactive elements
□ Keyboard navigation works (Tab key)
```

**Success Criteria**: All HTML structure, CSS styling, and accessibility checks pass

---

### Phase 4: Git Operations Test

**Objective**: Verify that git operations work correctly.

#### Step 4.1: Configure Git
```bash
# Set git user (if not already configured)
git config user.name "Copilot"
git config user.email "223556219+Copilot@users.noreply.github.com"

# Verify configuration
git config user.name
git config user.email
```

#### Step 4.2: Create Test Commit
```bash
# Make a test change to arxiv.html
# (Add a comment in HTML: <!-- Test commit -->)

# Check status
git status

# Stage the change
git add arxiv.html

# Create a test commit
TIMESTAMP=$(date -u +'%Y-%m-%d %H:%M:%S UTC')
git commit -m "test: verify git operations [$TIMESTAMP]" \
  -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

# Verify commit was created
git log -1 --oneline
git log -1 | grep "Co-authored-by"
```

**Acceptance Criteria**:
- ✓ Commit created successfully
- ✓ Commit message includes timestamp
- ✓ Co-author trailer present
- ✓ Commit shows in log

#### Step 4.3: Revert Test Commit
```bash
# Remove test commit (don't push to remote)
git reset --soft HEAD~1

# Revert changes to arxiv.html
git checkout arxiv.html

# Verify clean state
git status
```

**Success Criteria**: Git operations work without errors

---

### Phase 5: GitHub Pages Deployment Test

**Objective**: Verify that the website is accessible via GitHub Pages.

#### Step 5.1: Check Repository Settings
```
Manual Test (GitHub web interface):
1. Navigate to: https://github.com/katsaxton/bst236website
2. Settings → Pages
3. Verify:
   □ Source: "Deploy from branch"
   □ Branch: "main" (or appropriate branch)
   □ Folder: "/ (root)"
4. Note the deployed URL (should be https://katsaxton.github.io/bst236website/)
```

#### Step 5.2: Test Live Site Accessibility
```bash
# Test homepage
curl -s -o /dev/null -w "%{http_code}" https://katsaxton.github.io/bst236website/
# Should return: 200

# Test arxiv page
curl -s -o /dev/null -w "%{http_code}" https://katsaxton.github.io/bst236website/arxiv.html
# Should return: 200

# Test CSS
curl -s -o /dev/null -w "%{http_code}" https://katsaxton.github.io/bst236website/css/style.css
# Should return: 200

# Verify pages load correctly
curl -s "https://katsaxton.github.io/bst236website/" | grep -q '<h1>' && echo "✓ Homepage loads"
curl -s "https://katsaxton.github.io/bst236website/arxiv.html" | grep -q 'Latest Research' && echo "✓ arXiv page loads"
```

#### Step 5.3: Manual Browser Test
```
Open each URL in browser and verify:
□ https://katsaxton.github.io/bst236website/
  ✓ Page loads completely
  ✓ Navigation bar visible
  ✓ Feature cards display
  ✓ Links work (to arxiv.html and games.html)
  ✓ CSS styling applied (not plain text)

□ https://katsaxton.github.io/bst236website/arxiv.html
  ✓ Page loads completely
  ✓ "Latest Research Papers" heading visible
  ✓ Paper cards display (placeholder or real papers)
  ✓ Navigation shows arxiv.html as active
  ✓ CSS styling applied

□ https://katsaxton.github.io/bst236website/games.html
  ✓ Page loads completely
  ✓ "Games" heading visible
  ✓ Placeholder message shows
  ✓ Navigation shows games.html as active
```

**Success Criteria**: All pages load correctly via GitHub Pages

---

### Phase 6: Workflow Automation Test

**Objective**: Verify that GitHub Actions workflow is configured correctly.

#### Step 6.1: Check Workflow File
```bash
# Verify workflow file exists
test -f .github/workflows/update-papers.yml && echo "✓ Workflow file exists"

# Check workflow configuration
grep -q 'schedule:' .github/workflows/update-papers.yml && echo "✓ Schedule configured"
grep -q "cron: '0 0 \* \* \*'" .github/workflows/update-papers.yml && echo "✓ Midnight UTC cron"
grep -q 'workflow_dispatch:' .github/workflows/update-papers.yml && echo "✓ Manual trigger enabled"
```

#### Step 6.2: Check Workflow Contents
```bash
# Verify workflow defines required jobs
grep -q 'jobs:' .github/workflows/update-papers.yml && echo "✓ Jobs defined"
grep -q 'update-papers:' .github/workflows/update-papers.yml && echo "✓ Main job present"

# Check for key steps
grep -q 'Invoke Orchestrator Agent' .github/workflows/update-papers.yml && echo "✓ Orchestrator step"
grep -q 'Verify deployment' .github/workflows/update-papers.yml && echo "✓ Verification step"
```

#### Step 6.3: Manual Workflow Trigger
```
Test (GitHub web interface):
1. Go to: https://github.com/katsaxton/bst236website/actions
2. Select "Update arXiv Papers Dashboard" workflow
3. Click "Run workflow" → "Run workflow"
4. Wait for run to complete
5. Check results:
   □ Workflow completed (check status badge)
   □ All steps executed
   □ No errors in logs
   □ (Optional) Verify arxiv.html was updated
```

**Success Criteria**: Workflow runs successfully without errors

---

## Integration Test: Complete Pipeline

### Step 1: Simulate Complete Flow
```
Manually perform the following in sequence:

1. Fetch Papers
   - Query arXiv API (see Phase 1)
   - Validate 5+ papers retrieved
   - Save to test-output/papers.json

2. Generate Summaries
   - Take 3 papers from step 1
   - Generate summaries manually (see Phase 2)
   - Verify quality

3. Update HTML
   - Create 3 paper card elements (see Phase 3)
   - Insert into arxiv.html
   - Verify styling looks correct

4. Commit & Push
   - Stage changes (git add)
   - Create commit with timestamp (see Phase 4)
   - (Don't push - test only)

5. Verify on Live Site
   - Check GitHub Pages (see Phase 5)
   - Confirm changes visible
```

### Step 2: End-to-End Verification Checklist

```
✓ Papers fetched from arXiv API
✓ Papers include title, authors, abstract, URL
✓ Summaries are 2-3 sentences, under 150 words
✓ Key points extracted and relevant
✓ HTML generates without errors
✓ Paper cards display with correct styling
✓ CSS responsive design works
✓ Navigation links function
✓ Git commits created with proper metadata
✓ GitHub Pages serves pages over HTTPS
✓ All pages load in < 3 seconds
✓ Accessibility features present
✓ No console errors in browser DevTools
```

## Debugging Guide

### If arXiv API Fails
```bash
# Test API endpoint directly
curl -s "http://export.arxiv.org/api/query?search_query=cat:cs.AI&start=0&max_results=1" \
  | head -30

# Check response format
# Should be XML with <feed> root element

# If timeout: arXiv servers slow, retry in 30 seconds
# If 429: Rate limited, wait 60 seconds before retry
# If empty: No papers in category, adjust query
```

### If HTML Doesn't Display Correctly
```bash
# Validate HTML5 syntax
# Use online validator: https://validator.w3.org/

# Check CSS link path
# Ensure css/style.css exists in repository root

# Clear browser cache
# Ctrl+Shift+Delete (Chrome) or Cmd+Shift+Delete (Safari)
# Or use incognito/private window
```

### If GitHub Pages Not Updating
```bash
# Check deployment status
# GitHub → Settings → Pages → Deployments

# Verify main branch has latest changes
git fetch origin
git log origin/main | head -5

# Check workflow logs
# Actions tab → select recent run → view logs
```

### If Styling Looks Wrong
```bash
# Verify CSS file is being served
curl -s https://katsaxton.github.io/bst236website/css/style.css | head -20

# Check for CSS syntax errors
# Open DevTools → Sources tab → css/style.css

# Verify media queries
# Resize browser and check responsive breakpoints
```

## Success Criteria

The end-to-end test is successful when:

✅ All phases complete without critical errors
✅ Papers fetched from arXiv successfully
✅ Summaries generated and meet quality standards
✅ HTML renders correctly with proper styling
✅ Git operations work without issues
✅ GitHub Pages serves all pages correctly
✅ Workflow automation is configured properly
✅ Complete pipeline runs successfully

## Troubleshooting Escalation

If issues persist:

1. **Check logs first** - GitHub Actions, browser console, terminal output
2. **Isolate the problem** - Test each phase independently
3. **Validate inputs** - Ensure data is in expected format
4. **Try fallback strategies** - Use cached data, original abstracts, etc.
5. **Review documentation** - Check agent/skill/prompt files for guidance
6. **Manual verification** - Test components outside automation
7. **Contact support** - If technical blocker (API, GitHub issue)

## Reporting Results

After completing all tests, create a test report:

```
=== END-TO-END TEST REPORT ===
Date: [DATE]
Tester: [NAME]

Phase 1 (arXiv Fetching): PASS/FAIL
  Papers fetched: [COUNT]
  Issues: [NONE or details]

Phase 2 (Summarization): PASS/FAIL
  Summaries generated: [COUNT]
  Quality: [GOOD/NEEDS_WORK]

Phase 3 (HTML & Styling): PASS/FAIL
  Structure: [VALID/ISSUES]
  Responsiveness: [OK/NEEDS_WORK]
  Accessibility: [COMPLIANT/ISSUES]

Phase 4 (Git Operations): PASS/FAIL
  Commits created: [COUNT]
  Format: [CORRECT/ISSUES]

Phase 5 (GitHub Pages): PASS/FAIL
  URLs accessible: [YES/NO]
  Content correct: [YES/NO]

Phase 6 (Automation): PASS/FAIL
  Workflow present: [YES/NO]
  Trigger configured: [YES/NO]

Overall: PASS/FAIL

Notes:
[Any observations, issues, or improvements]

Next Steps:
[What to do next]
============================
```
