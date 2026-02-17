---
type: skill
name: Summary Generation
description: Creates concise AI-generated summaries of research papers
version: 1.0
---

# Summary Generation Skill

## Overview
Uses language models to generate accessible, informative summaries of academic papers while maintaining technical accuracy.

## Core Functions

### 1. Summary Creation
- **Purpose**: Generate 2-3 sentence summaries from paper abstracts
- **Input**: Paper abstract (original arXiv text)
- **Output**: Condensed summary (max 150 words)

**Summary Requirements:**
- **Length**: 2-3 sentences exactly
- **Tone**: Professional, informative, accessible
- **Audience**: Scientists and educated non-specialists
- **Content**: Main problem, approach, findings
- **Accuracy**: Preserve technical correctness

**Prompt Template:**
```
Summarize the following academic paper abstract in 2-3 sentences. 
The summary should be understandable to educated non-specialists 
while maintaining technical accuracy. Focus on the main research 
question, novel approach, and key findings.

Abstract:
{abstract}

Summary:
```

### 2. Key Points Extraction
- **Purpose**: Identify main research contributions
- **Count**: 2-4 bullet points
- **Focus**: Innovation, methodology, results

**Extraction Rules:**
- Each point should be 1-2 sentences
- Avoid redundancy with main summary
- Highlight what makes this work novel
- Include practical applications if present

**Prompt Template:**
```
Extract 2-4 key points from this paper that highlight the main 
contributions and novel aspects. Format as a bullet list.

Paper:
Title: {title}
Abstract: {abstract}

Key Points:
- {point}
- {point}
```

### 3. Quality Assurance
- **Purpose**: Validate generated content
- **Checks:**
  - Summary is 2-3 sentences
  - Word count under 150 words
  - No factual contradictions
  - Proper grammar and spelling
  - Clear and concise language
  - Technical terms appropriate

**QA Rules:**
- Reject if contains made-up citations
- Flag if tone is too casual/formal
- Check if key concepts are present
- Verify no copy-paste from abstract

### 4. Length Management
- **Purpose**: Ensure summaries are concise and scannable
- **Summary Target:** 100-150 words
- **Key Points Target:** 50-80 words total
- **Enforcement:** Count words, truncate if needed

**Word Count Handling:**
- If summary > 150 words: Summarize further
- If summary < 50 words: May be too brief, review
- Maintain sentence structure (don't break mid-sentence)
- Preserve meaning while trimming

### 5. Error Handling & Fallback
- **Purpose**: Graceful degradation
- **Fallback Strategies:**
  1. AI summary generation fails → Use first 2 sentences of abstract
  2. Key points generation fails → Extract first N sentences
  3. Length constraint fails → Use truncated version with "..." 
  4. Quality check fails → Log warning, use as-is, add quality flag

**Error Cases:**
- Model timeout: Use abstract directly
- Invalid response: Log and skip custom summary
- Blank output: Return original abstract
- Rate limit: Retry with backoff

## Configuration Parameters
```yaml
model: gpt-4
temperature: 0.5
max_tokens_summary: 150
max_tokens_keypoints: 80
summary_sentences: 3
key_points_count: 3
retry_max: 2
retry_backoff: 2
fallback_strategy: abstract_sentences
enable_qa_checks: true
```

## Prompt Engineering Guidelines

### Tone & Style
- Use professional academic language
- Avoid colloquialisms and slang
- Be precise, not flowery
- Use active voice when possible
- Define acronyms on first use

### Structure
- Lead with the main research question
- Explain the novel contribution
- Describe methodology briefly
- Conclude with findings/implications

### Audience Consideration
- Assume readers have college-level education
- Define domain-specific terms
- Avoid insider jargon without explanation
- Use relatable examples (when appropriate)

## Example

**Input Abstract:**
```
Deep learning models have revolutionized computer vision, but their 
application to medical imaging in oncology remains challenging due to 
data scarcity and privacy constraints. This paper proposes a novel 
federated learning approach that enables collaborative model training 
across multiple hospitals without sharing sensitive patient data. We 
demonstrate state-of-the-art performance on tumor detection tasks 
using a privacy-preserving aggregation mechanism based on differential 
privacy...
```

**Generated Summary:**
```
This paper introduces a federated learning framework that enables 
multiple hospitals to collaboratively train AI models for tumor 
detection without sharing sensitive patient data. The approach uses 
differential privacy to ensure privacy while achieving state-of-the-art 
performance on oncology imaging tasks.
```

**Generated Key Points:**
```
- Novel federated learning approach for medical imaging
- Privacy-preserving training using differential privacy
- Demonstrates effectiveness across multiple healthcare institutions
```

## Testing Considerations
- Test with various paper types (theoretical, applied, review)
- Verify summarization of papers in different fields
- Check handling of highly technical vs. accessible papers
- Validate fallback mechanisms
- Test with edge cases (very short/long abstracts)
- Review output for bias or inaccuracies
- Benchmark against human-written summaries
