# ResumeAI Analyst - AI-Powered Professional Resume Reviewer

ResumeAI Analyst is a premium, client-side web application built with HTML, CSS, and modern JavaScript. It analyzes pasted resume text against target job roles, evaluating structure, active language usage, quantified achievements, and skill compatibility to provide comprehensive ratings and actionable optimization suggestions.

## Features

- **Modern Glassmorphic UI**: High-fidelity dark-mode interface styled with vanilla CSS using HSL colors, smooth transitions, and responsive grid layouts.
- **Client-Side AI Parsing Engine**: Detects sections, extracts active action verbs, identifies metrics/percentages for quantified impact, checks for common clichés/buzzwords, and measures role alignment.
- **Target Role Databases**: Evaluates candidates against 8 high-growth job profiles (e.g. Frontend Developer, Data Scientist, Product Manager, DevOps Engineer).
- **Interactive Ratings & Feedback**:
  1. Circular progress gauge animating the overall score.
  2. Performance breakdown bars (Completeness, Impact, Verbs, Keyword Match).
  3. Tailored lists of Strengths, Weaknesses, and Suggestions.
  4. Missing Skills tags dynamically suggested based on the target job profile.

## Project Structure

```
resume-review-ai/
├── index.html     # Structural page layout and SEO tags
├── styles.css     # Premium UI styling, variables, keyframes
└── app.js         # Text parsing, scoring, and UI interaction logic
```

## How to Run the Application

Since the application runs entirely client-side, there is no need for servers, compilers, or installation processes.

1. **Option A: Direct Execution (Easiest)**
   Simply open the `index.html` file in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
   - In your file explorer, navigate to `C:\Users\DELL\.gemini\antigravity\scratch\resume-review-ai`
   - Double-click `index.html` or drag it into a browser tab.

2. **Option B: Run with an HTTP Server**
   If you have Python installed, you can launch a local server:
   ```bash
   python -m http.server 8000
   ```
   Or if you have Node.js / npm:
   ```bash
   npx serve .
   ```
   Then open `http://localhost:8000` or `http://localhost:3000` in your web browser.

## Recommendations for Testing

To see the AI analysis in action:
1. **Low Score Test**: Paste a single sentence (e.g., "I am looking for a job as a developer"). The scanner will flag missing sections, low word count, missing critical skills, and evaluate a low score (around 1.5/10).
2. **High Score Test**: Paste a comprehensive professional resume text with defined headers (Summary, Experience, Skills, Education), including bullet points with metrics (e.g. "Increased React page loading performance by 30%") and action verbs (e.g. "Spearheaded, Optimized"). The rating will reflect high ATS compatibility.
