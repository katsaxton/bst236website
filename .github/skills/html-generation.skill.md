---
type: skill
name: HTML Generation
description: Creates and updates HTML pages dynamically
version: 1.0
---

# HTML Generation Skill

## Overview
Dynamically generates and updates HTML content while maintaining template structure, styling, and semantic markup.

## Core Functions

### 1. Template Management
- **Purpose**: Load and manage HTML templates
- **Templates:**
  - Base page template (navigation, structure)
  - Paper card template (single paper display)
  - Grid/list container template

**Base Template Features:**
- DOCTYPE and meta tags
- Navigation bar (Home, arXiv Papers, Games)
- Header with branding
- Content area placeholder
- Footer with metadata
- Link to css/style.css

### 2. Paper Card Rendering
- **Purpose**: Convert paper object to HTML card
- **Inputs**: Summarized paper object
- **Output**: HTML article element

**Card Structure:**
```html
<article class="paper-card">
  <header>
    <h3 class="paper-title">
      <a href="{arxiv_url}">Title</a>
    </h3>
    <p class="paper-meta">
      <span class="authors">Authors</span>
      <span class="date">Published</span>
    </p>
  </header>
  <section class="paper-content">
    <p class="summary">Generated summary</p>
    <ul class="key-points">
      <li>Point 1</li>
      <li>Point 2</li>
    </ul>
  </section>
  <footer>
    <a href="{arxiv_url}" class="arxiv-link">Read on arXiv →</a>
  </footer>
</article>
```

**Styling Classes:**
- `.paper-card`: Container
- `.paper-title`: Paper title heading
- `.authors`: Author list
- `.date`: Publication date
- `.summary`: Generated summary text
- `.key-points`: Bullet list of points
- `.arxiv-link`: Direct arXiv link

### 3. Page Generation
- **Purpose**: Build complete arxiv.html page
- **Steps:**
  1. Load base template
  2. Generate paper cards from papers array
  3. Insert cards into content section
  4. Add metadata/timestamp
  5. Minify/format output

**Generated Page Structure:**
```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Meta tags, title, styles -->
  </head>
  <body>
    <nav><!-- Navigation --></nav>
    <main>
      <section id="arxiv-papers" class="papers-grid">
        <!-- Generated paper cards -->
      </section>
      <footer>
        Last updated: {timestamp}
      </footer>
    </main>
  </body>
</html>
```

### 4. Content Sanitization
- **Purpose**: Prevent XSS vulnerabilities
- **Operations:**
  - Escape HTML special characters (&, <, >, ", ')
  - Remove dangerous HTML tags
  - Validate URLs (must be https or data:)
  - Strip scripts and event handlers
  - Allow safe formatting (bold, italic, links)

**Sanitization Rules:**
- Paper titles: Plain text with escaped HTML
- Summaries: Plain text, preserve line breaks
- Authors: Plain text only
- URLs: Whitelist https and arxiv.org domain
- Reject any embedded scripts/styles

### 5. Formatting & Aesthetics
- **Purpose**: Generate readable, well-formatted HTML
- **Options:**
  - Pretty-print (indentation, line breaks)
  - Minification (single-file output)
  - Normalize whitespace
  - Consistent quote style
  - Proper encoding (UTF-8)

## Configuration Parameters
```yaml
template_dir: .github/templates
output_file: arxiv.html
paper_grid_columns: 2
include_timestamps: true
date_format: "YYYY-MM-DD HH:mm:ss UTC"
enable_minification: false
enable_sanitization: true
```

## Dependencies
- HTML templating engine
- String formatting utilities
- XSS prevention library
- Date/time formatting

## Example: Paper Card Generation

**Input:**
```json
{
  "title": "AI in Cancer Treatment",
  "authors": ["John Doe", "Jane Smith"],
  "published": "2024-02-17",
  "summary": "This paper explores AI applications...",
  "key_points": ["Improved accuracy", "Faster diagnosis"],
  "url": "https://arxiv.org/abs/2402.12345"
}
```

**Output:**
```html
<article class="paper-card">
  <header>
    <h3 class="paper-title">
      <a href="https://arxiv.org/abs/2402.12345">AI in Cancer Treatment</a>
    </h3>
    <p class="paper-meta">
      <span class="authors">By John Doe, Jane Smith</span>
      <span class="date">Published: 2024-02-17</span>
    </p>
  </header>
  <section class="paper-content">
    <p class="summary">This paper explores AI applications...</p>
    <ul class="key-points">
      <li>Improved accuracy</li>
      <li>Faster diagnosis</li>
    </ul>
  </section>
  <footer>
    <a href="https://arxiv.org/abs/2402.12345" class="arxiv-link">Read on arXiv →</a>
  </footer>
</article>
```

## Testing Considerations
- Test with special characters in titles
- Verify XSS prevention (inject dangerous content)
- Check HTML validity (W3C validator)
- Test with long author lists
- Verify styling applies correctly
- Test responsive design rendering
