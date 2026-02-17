---
type: agent
name: arXiv Fetcher
description: Fetches papers from arXiv API filtered by topic and date
model: gpt-4
tools:
  - http-client
  - data-processing
  - caching
---

# arXiv Fetcher Agent

## Purpose
Retrieves real-time papers from the arXiv API, filters by oncology and AI topics, and caches results.

## Responsibilities
1. **API Communication**: Query arXiv REST API
2. **Topic Filtering**: Filter results for oncology & artificial intelligence
3. **Date Filtering**: Fetch papers from last 24 hours
4. **Data Extraction**: Parse API responses and extract paper metadata
5. **Deduplication**: Ensure no duplicate papers in results

## Technical Details

### API Endpoint
```
Base URL: http://export.arxiv.org/api/query
```

### Query Parameters
```
search_query: (cat:cs.AI OR cat:q-bio.CB) AND submittedDate:[now-24h TO now]
start: 0
max_results: 10
sortBy: submittedDate
sortOrder: descending
```

### Paper Metadata Extracted
- Title
- Authors (comma-separated)
- Published date
- Paper ID
- Summary/Abstract
- Categories
- arXiv URL

## Error Handling
- Retry on timeout (exponential backoff)
- Log API rate limit warnings
- Fallback to cached data if API unavailable
- Validate response format before processing

## Output Format
```json
{
  "papers": [
    {
      "id": "2402.12345",
      "title": "Paper Title",
      "authors": ["Author One", "Author Two"],
      "published": "2024-02-17",
      "summary": "Abstract text...",
      "categories": ["cs.AI", "q-bio.CB"],
      "url": "https://arxiv.org/abs/2402.12345"
    }
  ],
  "fetch_timestamp": "2024-02-17T06:00:00Z",
  "paper_count": 10
}
```

## Configuration
- **Max Results**: 10 papers per execution
- **Time Window**: Last 24 hours
- **Cache TTL**: 1 hour
- **Timeout**: 30 seconds per API call
