---
type: agent
name: Orchestrator
description: Main coordinator for the arXiv dashboard pipeline
model: gpt-4
tools:
  - github-actions
  - task-runner
  - logging
---

# Orchestrator Agent

## Purpose
Coordinates the entire workflow: fetching arXiv papers, generating summaries, and deploying to GitHub Pages.

## Responsibilities
1. **Pipeline Coordination**: Invoke fetcher → summarizer → deployer in sequence
2. **Error Handling**: Catch failures and retry critical stages
3. **Logging**: Track all pipeline execution steps
4. **State Management**: Maintain execution state across agent invocations

## Execution Flow
```
START
  ↓
[Invoke arXiv Fetcher] → Fetch papers from API, filter by topic
  ↓
[Invoke Summarizer] → Generate summaries for fetched papers
  ↓
[Invoke Deployer] → Update HTML & deploy to GitHub Pages
  ↓
[Log Results] → Record success/failure metrics
  ↓
END
```

## Configuration
- **Trigger**: GitHub Actions workflow (midnight UTC)
- **Retry Strategy**: Max 3 retries on transient failures
- **Timeout**: 30 minutes per pipeline execution
- **Notification**: Log output to GitHub Actions console

## Input Parameters
```yaml
event:
  schedule: '0 0 * * *'  # Midnight UTC
topics:
  - oncology
  - artificial intelligence
max_papers: 10
deployment_repo: katsaxton/bst236website
```

## Output
- Updated HTML file with latest papers and summaries
- Deployment status confirmation
- Execution logs for debugging
