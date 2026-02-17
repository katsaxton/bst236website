---
type: skill
name: arXiv API Integration
description: Handles all interactions with the arXiv REST API
version: 1.0
---

# arXiv API Skill

## Overview
Provides robust methods for querying the arXiv API with proper error handling and response parsing.

## Core Functions

### 1. Query Construction
- **Purpose**: Build properly formatted search queries
- **Inputs**: Topics, date range, max results
- **Output**: Valid arXiv API query string

**Implementation Notes:**
- Topics: Use arXiv category codes (cs.AI, q-bio.CB)
- Date format: YYYYMMDDHHMMSS
- Support boolean operators (AND, OR, NOT)
- URL encode all special characters

### 2. API Request Execution
- **Purpose**: Execute HTTP GET request to arXiv API
- **Endpoint**: http://export.arxiv.org/api/query
- **Format**: Atom XML response
- **Rate Limit**: 3 seconds between requests (respect API limits)

**Error Handling:**
- Timeout: 30 seconds
- Retry on 5xx errors (max 3 times)
- Exponential backoff: 2^n seconds
- Log all HTTP status codes

### 3. Response Parsing
- **Purpose**: Extract paper metadata from Atom XML
- **Fields**: id, title, authors, published, summary, category

**Extraction Logic:**
```
For each <entry> in response:
  - Extract arxiv ID from id field (last component)
  - Parse title (trim whitespace)
  - Extract author names (nested <author> elements)
  - Get published date (first publication)
  - Extract summary/abstract
  - Collect all categories
  - Build arxiv.org URL from ID
```

### 4. Data Validation
- **Purpose**: Ensure data quality before downstream processing
- **Checks:**
  - Required fields present (title, authors, summary)
  - ID is valid 4-digit format (YYMM.#####)
  - Date is valid ISO 8601
  - Summary is not empty
  - No duplicate papers (check by ID)

### 5. Caching
- **Purpose**: Reduce API calls and improve performance
- **Cache Key**: Hash of query string + date range
- **TTL**: 1 hour
- **Invalidation**: Manual or automatic on new papers

## Configuration Parameters
```yaml
api_base_url: http://export.arxiv.org/api/query
max_retries: 3
timeout_seconds: 30
min_request_interval: 3
cache_ttl_minutes: 60
max_results_per_query: 10
```

## Dependencies
- HTTP client library
- XML/Atom parser
- Date/time utilities
- Caching mechanism

## Example Query
```
search_query=(cat:cs.AI OR cat:q-bio.CB)
&start=0
&max_results=10
&sortBy=submittedDate
&sortOrder=descending
```

## Testing Considerations
- Mock API responses for unit tests
- Test with invalid/missing fields
- Verify retry behavior
- Validate error messages
- Check cache invalidation
