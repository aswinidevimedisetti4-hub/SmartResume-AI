# ResumeAI Agent v3.0 - AI-Powered Resume Audit & Rewriting Suite
ResumeAI Agent is a portfolio-quality, full-featured web application built with HTML, CSS, and modern JavaScript. It serves as an interactive AI-powered resume reviewer and optimizer that parses PDF/DOCX resumes, analyzes them against target job descriptions, computes ATS scorecards, flags formatting issues, and generates tailored A4 resumes with live-updating templates for direct PDF/text export.
## 🚀 Project Overview
In today's recruitment landscape, over 98% of Fortune 500 companies use Applicant Tracking Systems (ATS) to filter resumes before they reach human eyes. ResumeAI Analyst gives candidates the power to test, score, and optimize their resumes before submission. Running entirely in the browser, the application provides instantaneous diagnostics without storing or sending personal details outside the local system.
---
## 🌟 Features
1. **0-100 ATS Score System**: Calculates overall resume health across 4 dimensions: Layout structure, quantitative impact, active verb usage, and job keyword match. Shows green (Excellent), blue (Good), and amber (Needs Improvement) levels.
2. **Technical & Soft Skills Classification**: Uses custom parsers to scan for 100+ technologies and 30+ soft skill attributes, rendering detected assets as distinct badges.
3. **Structured Strengths & Diagnostics**: Points out strong layout elements and lists weakness items. Each weakness includes an explanation of *Why it matters* and a concrete instructions on *How to fix* it.
4. **Target Role Compatibility**: Matches resume content against 8 popular job roles (e.g. Frontend Developer, Data Scientist, Product Manager, DevOps Engineer) and outputs sorted confidence bars.
5. **AI Profile Summary Generator**: Compiles an ATS-optimized professional profile summary matching the candidate's target role and experience level.
6. **Critically Missing Skills Recommendations**: Identifies missing critical skills for the target role and explains their importance.
7. **Utility Integrations**:
   - **Copy Report**: Copies a structured plain-text version of the analysis report to the clipboard.
   - **Export PDF**: Formats results via a customized print stylesheet (`@media print`) that creates a professional, clean multi-page document layout when printing or saving as a PDF.
   - **Live Counters**: Monitors word and character counts on-the-fly during editing.
   - **Validation & Error Handling**: Highlights inputs in red and alerts users when submitting empty contents.
## 🚀 Key Features
## 🛠️ Technologies Used
* **HTML5**: Structured semantic document flow (`<main>`, `<article>`, `<aside>`).
* **CSS3**: Variables, glassmorphism, flexbox/grid alignments, keyframe animations, and `@media print` rules.
* **ES6+ JavaScript**: Native regular expression tokenizers, DOM rendering, clipboard API.
1. **Resume Upload & Local Parsing**:
   - Accepts **PDF**, **DOCX**, and plain **TXT** files.
   - Extracts text 100% client-side in the browser using `pdf.js` and `mammoth.js`, ensuring absolute data privacy.
   - Automatically segments contact details, summary, experience, skills, projects, and education.
## 📦 Installation & Setup
Since the app runs client-side, there are no dependency downloads or compilation processes:
2. **ATS Compatibility Auditing & Score**:
   - Inspects formatting structure for ATS-unfriendly components (complex layouts, columns, tables, graphics, non-standard headings, cliches).
   - Generates a **0-100 ATS Score** with circular progress feedback.
1. **Option A: Direct Execution**
   - Download the files to your machine.
   - Navigate to the folder containing the project.
   - Double-click `index.html` or drag it into any web browser.
3. **Semantic Job Description Comparison Engine**:
   - Calculates a **Job Match Score (%)** against a pasted target Job Description (JD).
   - Identifies matching strengths and flags core gaps (missing technical skills, soft skill communication gaps) in an **Advantages vs. Disadvantages** side-by-side format.
   - Recommends missing keywords with clear context-based action suggestions.
2. **Option B: Run a Local HTTP Server**
   If you wish to host it locally using a python server:
4. **AI-Generated Tailored Resume Suite**:
   - Dynamically compiles a brand-new resume by reframing accomplishments, replacing passive phrasing, and naturally injecting target keywords.
   - Provides a side-by-side **Interactive Editor** (to modify summary, skills, experience bullets) and **Live A4 Preview Sheet** that updates instantly as you type.
5. **Multi-Template Professional Formats**:
   - **Modern Tech**: Sans-serif (Inter/Outfit) font, accent lines, clean grid borders.
   - **Classic Serif**: Center-aligned traditional layout with Playfair Display headings.
   - **Minimalist**: Monospace layout (JetBrains Mono) for developers and engineers.
6. **Export Options**:
   - **Direct PDF Export**: Generates pixel-perfect PDFs with standard A4 ratios using `html2pdf.js`.
   - **Copy Text**: One-click formatting of tailored resumes to plain text.
   - `@media print` styles for clean system print optimization.
---
## 🛠️ Technology Stack
* **Frontend**: HTML5, CSS3 (variables, animations, glassmorphism, responsive flex/grid), ES6+ JavaScript.
* **Libraries**:
  - `pdf.js` (Mozilla): Client-side binary PDF text reading.
  - `mammoth.js`: Binary DOCX parsing.
  - `html2pdf.js`: High-fidelity HTML-to-PDF document renderer.
---
## 📦 Getting Started
Since the application runs client-side in the browser, no installation is required.
### Run Locally
1. Clone or download this project folder.
2. Open `index.html` directly in any browser (Chrome, Firefox, Safari, Edge).
3. Alternatively, launch a light local server:
   ```bash
   # Python
   python -m http.server 8000
   ```
   Or if you use node/npm:
   ```bash
   
   # Node
   npx serve .
   ```
   Navigate your web browser to `http://localhost:8000` or the port shown.
4. Access the suite at `http://localhost:8000` (or the printed port).
## 📸 UI Screenshots
*(Create your screenshots folder and place images here for a complete portfolio presentation)*
---
- **Dashboard Input Panel**: Standard dark theme with config selectors.
- **ATS Scan Orbit Animation**: Visual orbit spinner showing active progress checks.
- **Scored Results Report**: ATS circular score ring with ratings.
## 💡 How to Test & Use
## 🔮 Future Enhancements
- **Dynamic File Parsing**: Direct parsing of PDF and DOCX documents in the browser.
- **Job Description Comparison**: Text area to paste specific job ads and match resume keywords directly.
- **API LLM Integration**: Secure toggle to call cloud LLMs (Gemini, OpenAI) for deep contextual sentence rewriting suggestions.
1. **Upload Resume**: Select or drag-and-drop a PDF/DOCX resume file (e.g. including details like contact info, skills, and experience).
2. **Add Job Description**: Paste a target job description containing industry-standard keywords.
3. **Analyze**: Click **Analyze Resume**. Watch the orbit-spinner run local audits.
4. **Inspect Dashboard**: View the radial progress score gauges, check the advantages list, flags, and missing keywords.
5. **Open Rewrite Suite**: Click **Open Rewrite Suite** to access the side-by-side editor. Customize your resume, toggle templates, copy text, or export a professional PDF!
