---
type: prompt
name: Coding Style Guide
description: General instructions for code generation and system behavior
---

# Coding Style & System Behavior Guide

## General Principles

### Code Quality
- **Readability First**: Code should be clear and self-documenting
- **Minimal Comments**: Only comment complex logic that isn't obvious
- **Consistent Formatting**: Follow consistent patterns throughout
- **Error Handling**: Always handle errors gracefully with meaningful messages
- **Logging**: Log important operations, errors, and state changes

### System Behavior
- **Fail Safely**: Design for graceful degradation, not catastrophic failure
- **Be Deterministic**: Same inputs should produce consistent results
- **Respect Limits**: Honor timeouts, rate limits, and resource constraints
- **Transparent Logging**: Log decisions, retries, and failures for debugging
- **Idempotent Operations**: Safe to re-run without side effects

### Security & Privacy
- **No Credentials in Logs**: Never output tokens, passwords, or API keys
- **URL Encoding**: Properly encode URLs and query parameters
- **Input Validation**: Validate all external inputs before processing
- **Safe Defaults**: Use safe defaults when uncertain
- **XSS Prevention**: Sanitize user/external content in HTML

## JSON Response Format

All agent outputs MUST be valid JSON:

```json
{
  "status": "success|partial|failed",
  "data": {
    "primary_results": "...",
    "count": 0
  },
  "metadata": {
    "timestamp": "2024-02-17T06:00:00Z",
    "execution_time_ms": 1234
  },
  "errors": []
}
```

### Error Reporting
```json
{
  "status": "failed",
  "data": null,
  "metadata": {...},
  "errors": [
    {
      "code": "ERROR_CODE",
      "message": "Human-readable error message",
      "context": "Additional debugging info"
    }
  ]
}
```

## Logging Standards

### Log Levels
- **ERROR**: Something failed that should be fixed
- **WARN**: Unexpected condition but operation continues
- **INFO**: Important state changes or milestones
- **DEBUG**: Detailed execution information

### Log Message Format
```
[LEVEL] [TIMESTAMP] [COMPONENT] Message: {details}
```

Example:
```
[INFO] 2024-02-17T06:00:00Z [arxiv-fetcher] Fetching papers: topics=oncology,ai start=0 max_results=10
[INFO] 2024-02-17T06:00:02Z [arxiv-fetcher] Received 10 papers from API
[INFO] 2024-02-17T06:00:02Z [summarizer] Processing 10 papers for summarization
[WARN] 2024-02-17T06:00:08Z [summarizer] Summary generation failed for paper 2402.12345, using fallback
[INFO] 2024-02-17T06:00:10Z [summarizer] Completed summarization of 10 papers (9 generated, 1 fallback)
```

## String Handling

### Text Encoding
- Use UTF-8 everywhere (no special encoding tricks)
- Handle HTML entities: & < > " '
- Normalize whitespace in user-facing text
- Preserve line breaks in abstracts/summaries

### Author Name Formatting
```
Input: "Smith, John" or "John Smith" or "J. Smith"
Output: "John Smith" (Firstname Lastname)
```

### Date Formatting
```
All dates in ISO-8601 format: YYYY-MM-DDTHH:mm:ssZ
Examples:
  2024-02-17T06:00:00Z  (correct)
  2024-02-17 06:00:00 UTC  (for display)
```

## Configuration Management

### Environment Variables
- Use `${{ secrets.VARIABLE_NAME }}` for sensitive data
- Use `${{ env.VARIABLE_NAME }}` for general config
- Document all required variables
- Provide sensible defaults when possible

### Configuration Objects
```yaml
# Use YAML for configuration files
database:
  host: localhost
  port: 5432
  timeout_seconds: 30

array_config:
  - item1
  - item2
```

## Performance Considerations

### Timeouts
- Network requests: 30 seconds max
- Database queries: 10 seconds max
- Batch operations: 120 seconds max
- Total pipeline: 360 seconds max

### Resource Usage
- Keep intermediate results in memory (don't temp files unless necessary)
- Batch API calls to reduce requests
- Cache results when appropriate (1 hour TTL)
- Clean up temporary data

### Parallelization
- Process independent items in parallel (when possible)
- Limit concurrency to avoid resource exhaustion
- Implement proper error handling for parallel operations

## Testing Principles

### Test Coverage
- Test happy path (normal operation)
- Test error cases (network, invalid data)
- Test edge cases (empty input, max size)
- Test idempotency (safe to re-run)

### Mock Data
- Use realistic test data that matches production format
- Include edge cases in test data
- Mock external APIs (don't hit real APIs in tests)

## Documentation Standards

### Comments
**DO** comment:
- Complex algorithms or non-obvious logic
- Workarounds for known issues
- Important assumptions or constraints

**DON'T** comment:
- Obvious code (let it speak for itself)
- Every line
- Change tracking (use git history)

Example:
```
# Retry with exponential backoff: 2^n seconds
# This respects arXiv API rate limits while being resilient to transient failures
for attempt in range(max_retries):
    try:
        return fetch_from_api()
    except TimeoutError:
        wait_time = 2 ** attempt
        sleep(wait_time)
```

### Function/Method Documentation
```
Purpose: One-line description
Inputs: List of parameters with types
Output: Return value description
Side Effects: Any state changes
Errors: Exceptions that can be raised
```

## Git Commit Standards

### Commit Message Format
```
{type}: {description} [{timestamp}]

Optional body with more details

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

### Commit Types
- `chore:` Maintenance, updates to content
- `fix:` Bug fixes
- `feat:` New features
- `docs:` Documentation changes
- `refactor:` Code restructuring

### Commit Examples
```
chore: update arxiv papers [2024-02-17 06:00:00 UTC]

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>

---

fix: handle arXiv API timeout in fetcher

Implement exponential backoff retry logic with max 3 attempts.
Add debug logging for failed requests.

Fixes #123

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

## API Integration Standards

### HTTP Requests
- Set proper User-Agent header
- Include timeout (default: 30 seconds)
- Handle retries with exponential backoff
- Log request/response for debugging
- Validate response format before parsing

### Error Responses
- Handle non-200 status codes
- Parse error messages from API
- Distinguish transient vs. permanent failures
- Log sufficient context for debugging

## Data Validation

### Input Validation Rules
- Check for null/undefined values
- Validate data types
- Check string lengths
- Validate URL formats
- Verify date formats

### Output Validation Rules
- Ensure required fields present
- Verify data types match schema
- Check array lengths are reasonable
- Validate numeric ranges
- Test with edge cases

## Accessibility & Compatibility

### HTML/CSS
- Use semantic HTML5 elements
- Ensure proper heading hierarchy
- Provide alt text for important images
- Use sufficient color contrast
- Support responsive design (mobile-friendly)
- Test in multiple browsers

### JavaScript (if used)
- Progressive enhancement (works without JS)
- Avoid deprecated APIs
- Handle missing features gracefully
- Test in multiple browsers

## Summary

Follow these principles to create:
- **Reliable** systems (handle failures gracefully)
- **Maintainable** code (clear and documented)
- **Secure** systems (validate inputs, protect secrets)
- **Observable** systems (log important events)
- **Efficient** systems (respect limits and resources)
