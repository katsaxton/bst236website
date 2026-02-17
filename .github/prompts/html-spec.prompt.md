---
type: prompt
name: HTML Specification
description: Detailed specifications for HTML page structure and styling
---

# HTML Specification & Design

## Page Structure

### Base Template Structure
All pages (index.html, arxiv.html, games.html) should follow this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page description">
  <title>Page Title</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <nav class="navbar">
    <!-- Navigation bar -->
  </nav>
  
  <main class="container">
    <!-- Page-specific content -->
  </main>
  
  <footer class="footer">
    <!-- Footer content -->
  </footer>
</body>
</html>
```

## Navigation Bar

### Structure
```html
<nav class="navbar">
  <div class="nav-container">
    <a href="index.html" class="nav-logo">
      <span class="logo-text">Personal Website</span>
    </a>
    
    <ul class="nav-menu">
      <li class="nav-item">
        <a href="index.html" class="nav-link">Home</a>
      </li>
      <li class="nav-item">
        <a href="arxiv.html" class="nav-link">arXiv Papers</a>
      </li>
      <li class="nav-item">
        <a href="games.html" class="nav-link">Games</a>
      </li>
    </ul>
  </div>
</nav>
```

### Styling Classes
- `.navbar` - Navigation container
- `.nav-container` - Inner wrapper
- `.nav-logo` - Logo/branding
- `.logo-text` - Logo text
- `.nav-menu` - Menu list
- `.nav-item` - Individual menu item
- `.nav-link` - Navigation links

### Active State
- Add `class="nav-link active"` to current page link
- CSS should highlight the active link

## Homepage (index.html)

### Purpose
Introduction to the website and personal branding.

### Content Structure
```html
<main class="container">
  <section class="hero">
    <h1>Welcome to My Website</h1>
    <p class="subtitle">Exploring research in oncology and AI</p>
  </section>
  
  <section class="features">
    <div class="feature-grid">
      <div class="feature-card">
        <h2>Latest Research</h2>
        <p>Automated arXiv paper dashboard</p>
        <a href="arxiv.html" class="btn">Explore Papers →</a>
      </div>
      
      <div class="feature-card">
        <h2>Games</h2>
        <p>Interactive games coming soon</p>
        <a href="games.html" class="btn">Play Games →</a>
      </div>
    </div>
  </section>
</main>
```

### Styling Classes
- `.hero` - Hero section with title
- `.subtitle` - Subtitle text
- `.features` - Features section
- `.feature-grid` - Grid layout for cards
- `.feature-card` - Individual feature card
- `.btn` - Call-to-action button

## arXiv Dashboard Page (arxiv.html)

### Purpose
Display latest research papers with summaries and metadata.

### Page Structure
```html
<main class="container">
  <section class="page-header">
    <h1>Latest Research Papers</h1>
    <p class="subtitle">Oncology and Artificial Intelligence</p>
    <p class="updated-at">
      Last updated: <time datetime="2024-02-17T06:00:00Z">2024-02-17 06:00:00 UTC</time>
    </p>
  </section>
  
  <section id="arxiv-papers" class="papers-grid">
    <!-- Paper cards injected here by deployer agent -->
  </section>
  
  <section class="papers-footer">
    <p>Papers are updated automatically every midnight UTC.</p>
    <p>Source: <a href="https://arxiv.org" target="_blank">arXiv.org</a></p>
  </section>
</main>
```

### Paper Card Structure
```html
<article class="paper-card">
  <header class="paper-header">
    <h3 class="paper-title">
      <a href="https://arxiv.org/abs/2402.12345" target="_blank">
        Paper Title Here
      </a>
    </h3>
    
    <div class="paper-meta">
      <span class="paper-authors">
        By John Doe, Jane Smith, Other Authors
      </span>
      <span class="paper-date">
        Published: <time datetime="2024-02-17">2024-02-17</time>
      </span>
    </div>
  </header>
  
  <section class="paper-body">
    <p class="paper-summary">
      This paper explores novel approaches to combining AI with medical
      imaging for improved diagnostic accuracy. The authors present a
      federated learning framework that enables collaborative training
      across multiple institutions without centralizing sensitive data.
    </p>
    
    <ul class="paper-key-points">
      <li>Federated learning approach for privacy-preserving training</li>
      <li>Achieves 94% accuracy on chest X-ray classification</li>
      <li>Enables deployment across healthcare institutions</li>
    </ul>
  </section>
  
  <footer class="paper-footer">
    <a href="https://arxiv.org/abs/2402.12345" target="_blank" class="arxiv-link">
      Read Full Paper on arXiv →
    </a>
  </footer>
</article>
```

### Styling Classes
- `.page-header` - Page header section
- `.papers-grid` - Grid container for paper cards
- `.paper-card` - Individual paper card
- `.paper-header` - Card header
- `.paper-title` - Paper title heading
- `.paper-meta` - Metadata (authors, date)
- `.paper-authors` - Authors list
- `.paper-date` - Publication date
- `.paper-body` - Main content section
- `.paper-summary` - Summary/abstract text
- `.paper-key-points` - Key points list
- `.paper-footer` - Card footer with link
- `.arxiv-link` - Link to arXiv paper
- `.papers-footer` - Footer for papers section
- `.updated-at` - Last updated timestamp

## Games Page (games.html)

### Purpose
Placeholder for future interactive games.

### Current Structure
```html
<main class="container">
  <section class="page-header">
    <h1>Games</h1>
    <p class="subtitle">Coming Soon</p>
  </section>
  
  <section class="content">
    <div class="placeholder-card">
      <h2>Interactive Games</h2>
      <p>More content coming soon. Check back later!</p>
    </div>
  </section>
</main>
```

### Styling Classes
- `.placeholder-card` - Placeholder content card

## Footer

### Structure
```html
<footer class="footer">
  <div class="footer-content">
    <p>&copy; 2024 Personal Website. Built with GitHub Copilot.</p>
    <ul class="footer-links">
      <li><a href="https://github.com" target="_blank">GitHub</a></li>
      <li><a href="https://arxiv.org" target="_blank">arXiv</a></li>
    </ul>
  </div>
</footer>
```

### Styling Classes
- `.footer` - Footer container
- `.footer-content` - Footer content wrapper
- `.footer-links` - Links list

## Accessibility Requirements

### Semantic HTML
- Use `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` elements
- Use `<h1>` for page title (one per page)
- Use proper heading hierarchy (h1 → h2 → h3)
- Use `<article>` for paper cards
- Use `<time>` element for dates with `datetime` attribute

### Links & Navigation
- All links have descriptive text (not "click here")
- External links open in new tab: `target="_blank"`
- Include `rel="noopener noreferrer"` for external links
- Navigation links are clear and functional

### Images (if used)
- Always include `alt` attribute
- Meaningful alt text (not "image" or "photo")
- `alt=""` for purely decorative images

### Color & Contrast
- Sufficient color contrast (WCAG AA standard: 4.5:1)
- Don't rely on color alone to convey meaning
- Support dark mode (optional but nice)

### Interactive Elements
- Buttons and links are keyboard accessible
- Focus states clearly visible
- Forms have associated labels

## Styling Approach

### CSS Organization
```
css/style.css contains:
1. CSS Reset / Normalization
2. Root variables (colors, fonts)
3. Typography
4. Layout components
5. Navigation styles
6. Paper card styles
7. Responsive media queries
8. Utility classes
```

### Responsive Design
- Mobile-first approach
- Breakpoints:
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+
- Grid layouts adapt to screen size
- Touch-friendly button sizes (min 44px)

### CSS Classes Naming
- Use BEM or similar methodology: `.block__element--modifier`
- Examples:
  - `.papers-grid` (block)
  - `.paper-card` (block)
  - `.paper-card__title` (element)
  - `.paper-card--featured` (modifier)
- Be consistent throughout

## Performance Guidelines

### Optimization
- Minimize external dependencies
- Inline small CSS
- Optimize images (if used)
- Use web-safe fonts or Google Fonts
- Lazy load images (if many)

### File Structure
```
/
├── index.html
├── arxiv.html
├── games.html
├── css/
│   └── style.css
├── img/ (if images used)
└── .github/
    ├── agents/
    ├── skills/
    └── prompts/
```

## Validation

### HTML5 Validation
- Validate with W3C validator
- No deprecated elements
- Proper element nesting
- All required attributes present

### Responsive Testing
- Test on mobile (320px width)
- Test on tablet (768px width)
- Test on desktop (1024px+ width)
- Check touch interactions on mobile

### Cross-browser Testing
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile Safari

## Examples

### Good: Paper Card with All Elements
```html
<article class="paper-card">
  <header class="paper-header">
    <h3 class="paper-title">
      <a href="https://arxiv.org/abs/2402.12345" target="_blank" rel="noopener noreferrer">
        Deep Learning for Medical Imaging
      </a>
    </h3>
    <div class="paper-meta">
      <span class="paper-authors">By John Doe, Jane Smith</span>
      <span class="paper-date">
        Published: <time datetime="2024-02-17">2024-02-17</time>
      </span>
    </div>
  </header>
  <section class="paper-body">
    <p class="paper-summary">This work presents a novel architecture...</p>
    <ul class="paper-key-points">
      <li>First key contribution</li>
      <li>Second key contribution</li>
    </ul>
  </section>
  <footer class="paper-footer">
    <a href="https://arxiv.org/abs/2402.12345" target="_blank" rel="noopener noreferrer" class="arxiv-link">
      Read Full Paper on arXiv →
    </a>
  </footer>
</article>
```

### Bad: Missing Semantic Elements
```html
<!-- Don't use generic divs for everything -->
<div class="paper">
  <div class="title">Paper Title</div>
  <div class="authors">Authors</div>
  <div class="summary">Summary</div>
</div>
```

## Summary

- **Use semantic HTML5** (header, nav, main, section, footer)
- **Follow accessibility standards** (WCAG AA minimum)
- **Support responsive design** (mobile-first)
- **Keep markup clean** (one primary `.container` per page)
- **Use consistent CSS classes** (BEM methodology)
- **Validate before deployment** (W3C validator)
