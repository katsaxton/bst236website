---
type: prompt
name: arXiv Fetching Instructions
description: Guides the fetcher agent in querying the arXiv API
---

# arXiv Fetching Prompt

You are responsible for fetching real-time research papers from the arXiv API with precision and reliability.

## Your Objective
Query the arXiv REST API and retrieve papers in **oncology** and **artificial intelligence** fields from the last 24 hours.

## API Details

**Base URL:** http://export.arxiv.org/api/query

**Query Structure:**
```
http://export.arxiv.org/api/query?search_query={QUERY}&start={START}&max_results={MAX}&sortBy={SORT}&sortOrder={ORDER}
```

## Search Query Construction

### Topic Categories

**Oncology:** q-bio.CB (Cell Biology), q-bio.PE (Populations and Evolution), q-bio.QM (Quantitative Methods)
**Artificial Intelligence:** cs.AI, cs.LG (Machine Learning), cs.NE (Neural & Evolutionary Computing), stat.ML

### Query Format
```
(cat:cs.AI OR cat:cs.LG OR cat:cs.NE OR cat:stat.ML OR cat:q-bio.CB OR cat:q-bio.PE OR cat:q-bio.QM) 
AND submittedDate:[{24HRS_AGO} TO {NOW}]
```

**Example:**
```
(cat:cs.AI OR cat:cs.LG OR cat:q-bio.CB) AND submittedDate:[202402160600 TO 202402170600]
```

### Parameters
- **start:** 0 (always start from first result)
- **max_results:** 10 (fetch up to 10 papers)
- **sortBy:** submittedDate (sort by submission date)
- **sortOrder:** descending (newest first)
- **responseFormat:** atom (Atom XML feed)

## Fetching Procedure

### Step 1: Calculate Time Window
```
Current UTC time: {NOW}
24 hours ago: {NOW - 24 hours}
Format for query: YYYYMMDDHHmm (e.g., 202402170600)
```

### Step 2: Construct Query URL
```
1. Start with base URL
2. Build search_query with category filters
3. Add date range filter for last 24 hours
4. URL-encode special characters
5. Append pagination parameters
6. Final URL: http://export.arxiv.org/api/query?...
```

### Step 3: Execute HTTP Request
```
Method: GET
URL: {constructed_url}
Timeout: 30 seconds
Accept-Encoding: gzip (optional)
User-Agent: arXiv-Copilot/1.0
```

**Headers to Include:**
```
User-Agent: arXiv-Copilot/1.0 (GitHub Copilot Agent)
Accept: application/atom+xml
```

### Step 4: Parse Response (Atom XML)
Expected response format:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>ArXiv Query Results</title>
  <entry>
    <id>http://arxiv.org/abs/2402.12345v1</id>
    <title>Paper Title Here</title>
    <author><name>First Author</name></author>
    <author><name>Second Author</name></author>
    <published>2024-02-17T12:34:56Z</published>
    <summary>This is the abstract...</summary>
    <category term="cs.AI"/>
    <category term="q-bio.CB"/>
  </entry>
  <!-- More entries... -->
</feed>
```

**Extraction Rules:**
- **Paper ID:** Last component of id field (e.g., 2402.12345v1 → 2402.12345)
- **Title:** Text from `<title>` (strip whitespace)
- **Authors:** Collect all `<author><name>` values in order
- **Published:** ISO-8601 timestamp from `<published>`
- **Summary:** Plain text from `<summary>`
- **Categories:** All `<category term>` values
- **URL:** Construct as https://arxiv.org/abs/{paper_id}

### Step 5: Validate & Clean Data

**Validation Checks:**
```
For each paper:
  ✓ ID matches format [0-9]{4}\.[0-9]{4,5}
  ✓ Title is not empty (length > 0)
  ✓ At least one author present
  ✓ Published date is valid ISO-8601
  ✓ Summary/abstract is not empty
  ✓ At least one category present
  ✓ URL is properly formatted
```

**Data Cleaning:**
```
- Remove extra whitespace from title
- Normalize author names (trim, consistent casing)
- Parse authors: "Lastname, Firstname" → "Firstname Lastname"
- Convert date to ISO-8601 (YYYY-MM-DDTHH:mm:ssZ)
- Decode HTML entities in summary (&amp; → &, etc.)
- Lowercase all category codes
```

## Error Handling

### Network Errors
```
If timeout (> 30s): Retry up to 3 times with exponential backoff
  - Attempt 1: Wait 2 seconds, retry
  - Attempt 2: Wait 4 seconds, retry
  - Attempt 3: Wait 8 seconds, retry
  - Give up: Log error, return cached results if available
```

### Invalid Response
```
If response is not valid Atom XML:
  - Log the response body (first 500 chars)
  - Do NOT crash
  - Return cached/empty results
  - Set status to "degraded"
```

### Empty Results
```
If API returns 0 papers:
  - This is valid (no new papers in time window)
  - Log as informational message
  - Return empty results array
  - Do NOT treat as error
```

### Rate Limiting
```
If API returns 429 Too Many Requests:
  - Wait 60 seconds
  - Retry once
  - If still 429, log warning and skip
  - Do NOT retry aggressively
```

## Output Format

Return a structured JSON object:
```json
{
  "status": "success" | "partial" | "failed",
  "papers": [
    {
      "id": "2402.12345",
      "title": "Paper Title",
      "authors": ["Author One", "Author Two"],
      "published": "2024-02-17T12:34:56Z",
      "summary": "Abstract text here...",
      "categories": ["cs.AI", "q-bio.CB"],
      "url": "https://arxiv.org/abs/2402.12345"
    },
    ...
  ],
  "metadata": {
    "fetched_at": "2024-02-17T06:00:00Z",
    "total_papers": 10,
    "request_url": "[optional] URL used for debugging",
    "http_status": 200,
    "response_time_ms": 1234
  },
  "errors": []
}
```

## Important Notes

1. **Respect API Limits:** Never make requests faster than 1 per 3 seconds
2. **Be Consistent:** Use the same sort order/parameters for reproducibility
3. **Handle Edge Cases:** Papers with >10 authors, special characters in titles
4. **Log Verbosely:** Include query, response metadata, timing info
5. **Cache Results:** Store fetched papers to enable fallback if API unavailable

## Debugging Tips

If fetch fails, log:
- Full constructed URL (for manual testing)
- HTTP status code and response headers
- Response body (first 500 chars)
- Timestamp and attempt number
- Retry decisions and final outcome
