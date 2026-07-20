/**
 * Resume Review AI - Advanced Stage 3 Processing Engine
 * client-side PDF/DOCX parsing, semantic JD analysis, and interactive resume generation.
 */

// Global state variables
let rawTextContent = '';
let selectedFileName = '';
let structuredResume = {
  name: 'Candidate Name',
  email: 'email@example.com',
  phone: '(123) 456-7890',
  location: 'City, State',
  links: 'linkedin.com/in/username | github.com/username',
  summary: '',
  skills: [],
  experience: '',
  education: '',
  projects: ''
};

// Word list databases for semantic audits
const TECH_KEYWORDS = [
  'javascript', 'typescript', 'react', 'node.js', 'node', 'express', 'python', 'django', 'flask',
  'java', 'springboot', 'c++', 'c#', '.net', 'sql', 'mysql', 'postgresql', 'mongodb', 'redis',
  'aws', 'azure', 'docker', 'kubernetes', 'git', 'github', 'ci/cd', 'agile', 'scrum', 'html5',
  'css3', 'sass', 'webpack', 'graphql', 'rest api', 'machine learning', 'tensorflow', 'pytorch',
  'data structures', 'algorithms', 'software engineering', 'devops', 'cloud architecture'
];

const SOFT_KEYWORDS = [
  'leadership', 'stakeholder management', 'cross-functional collaboration', 'communication',
  'problem-solving', 'agile methodologies', 'teamwork', 'critical thinking', 'project management',
  'mentoring', 'negotiation', 'time management', 'active listening', 'adaptability'
];

const CLICHES = [
  'synergy', 'detail-oriented', 'team player', 'motivated self-starter', 'results-driven',
  'think outside the box', 'go-getter', 'hard worker', 'seasoned professional', 'thought leader'
];

const ACTION_VERBS = [
  'achieved', 'architected', 'spearheaded', 'pioneered', 'implemented', 'optimized',
  'orchestrated', 'engineered', 'streamlined', 'decreased', 'maximized', 'facilitated'
];

// Configure PDFJS Worker
if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
}

// DOM Elements
const uploadDropZone = document.getElementById('upload-drop-zone');
const resumeFileInput = document.getElementById('resume-file');
const uploadStatusText = document.getElementById('upload-status-text');
const fileNameLabel = document.getElementById('file-name-label');
const uploadError = document.getElementById('upload-error');
const jdText = document.getElementById('jd-text');
const jdWordCount = document.getElementById('jd-word-count');

const reviewBtn = document.getElementById('review-btn');
const clearBtn = document.getElementById('clear-btn');

// View states
const resultsEmpty = document.getElementById('results-empty');
const resultsScanning = document.getElementById('results-scanning');
const resultsContent = document.getElementById('results-content');
const scanningStepText = document.getElementById('scanning-step-text');

// Gauge elements
const radialProgressBar = document.getElementById('radial-progress-bar');
const radialMatchBar = document.getElementById('radial-match-bar');
const scoreVal = document.getElementById('score-val');
const matchVal = document.getElementById('match-val');
const jdMatchBox = document.getElementById('jd-match-box');

// Scoring details
const scoreBadge = document.getElementById('score-badge');
const scoreHeading = document.getElementById('score-heading');
const scoreSummary = document.getElementById('score-summary');

// Result lists
const listAdvantages = document.getElementById('list-advantages');
const listDisadvantages = document.getElementById('list-disadvantages');
const listRedflags = document.getElementById('list-redflags');
const listSuggestions = document.getElementById('list-suggestions');
const jdComparisonDetails = document.getElementById('jd-comparison-details');
const rewriteCtaBanner = document.getElementById('rewrite-cta-banner');
const generateResumeBtn = document.getElementById('generate-resume-btn');

// Workspace toggles
const workspaceDashboard = document.getElementById('workspace-dashboard');
const workspaceRewrite = document.getElementById('workspace-rewrite');
const backBtn = document.getElementById('back-btn');
const templateSelect = document.getElementById('template-select');
const resumePreviewSheet = document.getElementById('resume-preview-sheet');

// Interactive Editor fields
const editName = document.getElementById('edit-name');
const editEmail = document.getElementById('edit-email');
const editPhone = document.getElementById('edit-phone');
const editLocation = document.getElementById('edit-location');
const editLinks = document.getElementById('edit-links');
const editSummary = document.getElementById('edit-summary');
const editSkills = document.getElementById('edit-skills');
const editExperience = document.getElementById('edit-experience');
const editEducation = document.getElementById('edit-education');
const editProjects = document.getElementById('edit-projects');

// Utility Actions
const copyTextBtn = document.getElementById('copy-text-btn');
const downloadPdfBtn = document.getElementById('download-pdf-btn');

/* ========================================================
   1. Initial Event Hookups & UI Sync
   ======================================================== */
document.addEventListener('DOMContentLoaded', () => {
  setupUploadEvents();
  setupEditorSync();
  
  // Job Description Text Counter
  jdText.addEventListener('input', () => {
    const text = jdText.value.trim();
    const wordCount = text ? text.split(/\s+/).length : 0;
    jdWordCount.textContent = `${wordCount} words`;
  });

  // Action Buttons
  reviewBtn.addEventListener('click', performFullAudit);
  clearBtn.addEventListener('click', resetWorkspace);
  generateResumeBtn.addEventListener('click', openRewriteWorkspace);
  backBtn.addEventListener('click', closeRewriteWorkspace);
  templateSelect.addEventListener('change', changeResumeTemplate);
  copyTextBtn.addEventListener('click', copyResumeToClipboard);
  downloadPdfBtn.addEventListener('click', downloadResumePDF);

  // Accordion Header Toggles
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('active');
      // Simple toggle height animation
      const content = header.nextElementSibling;
      if (item.classList.contains('active')) {
        content.style.display = 'block';
      } else {
        content.style.display = 'none';
      }
    });
  });
});

// Setup File Upload Zone Handlers
function setupUploadEvents() {
  uploadDropZone.addEventListener('click', () => resumeFileInput.click());
  
  uploadDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadDropZone.classList.add('dragover');
  });
  
  uploadDropZone.addEventListener('dragleave', () => {
    uploadDropZone.classList.remove('dragover');
  });
  
  uploadDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadDropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handleUploadedFile(e.dataTransfer.files[0]);
    }
  });

  resumeFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleUploadedFile(e.target.files[0]);
    }
  });
}

/* ========================================================
   2. File Processing (PDF / DOCX / TXT)
   ======================================================== */
async function handleUploadedFile(file) {
  selectedFileName = file.name;
  fileNameLabel.textContent = file.name;
  fileNameLabel.classList.add('active');
  uploadError.classList.remove('active');
  
  const ext = file.name.split('.').pop().toLowerCase();
  
  toggleScanningState(true, 'Reading file content...');

  try {
    if (ext === 'txt') {
      rawTextContent = await readTextFile(file);
    } else if (ext === 'pdf') {
      rawTextContent = await parsePDFFile(file);
    } else if (ext === 'docx') {
      rawTextContent = await parseDocxFile(file);
    } else {
      throw new Error('Unsupported file extension');
    }
    
    toggleScanningState(false);
    uploadStatusText.textContent = 'File uploaded successfully!';
  } catch (err) {
    console.error(err);
    toggleScanningState(false);
    uploadError.textContent = `Error reading file: ${err.message}`;
    uploadError.classList.add('active');
    fileNameLabel.textContent = 'No file selected';
    fileNameLabel.classList.remove('active');
    rawTextContent = '';
  }
}

// Plain Text Reader
function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('Failed to read plain text file'));
    reader.readAsText(file);
  });
}

// PDF.js Text Extractor
function parsePDFFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function() {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }
        resolve(fullText);
      } catch (err) {
        reject(new Error('Failed to parse PDF document. Code layout issues.'));
      }
    };
    reader.onerror = () => reject(new Error('File buffering failed'));
    reader.readAsArrayBuffer(file);
  });
}

// Mammoth.js DOCX Text Extractor
function parseDocxFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(loadEvent) {
      const arrayBuffer = loadEvent.target.result;
      mammoth.extractRawText({ arrayBuffer: arrayBuffer })
        .then(result => resolve(result.value))
        .catch(err => reject(new Error('Mammoth.js failed to extract DOCX text')));
    };
    reader.onerror = () => reject(new Error('File buffering failed'));
    reader.readAsArrayBuffer(file);
  });
}

function toggleScanningState(active, stepLabel = '') {
  if (active) {
    resultsEmpty.classList.remove('active');
    resultsContent.classList.remove('active');
    resultsScanning.classList.add('active');
    scanningStepText.textContent = stepLabel;
  } else {
    resultsScanning.classList.remove('active');
  }
}

/* ========================================================
   3. Document Section Parser
   ======================================================== */
function parseResumeSections(text) {
  // Extract contact info from top lines
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  structuredResume.name = lines[0] || 'Professional Candidate';
  
  // Extract Email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  structuredResume.email = emailMatch ? emailMatch[0] : 'candidate.email@domain.com';
  
  // Extract Phone
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  structuredResume.phone = phoneMatch ? phoneMatch[0] : '(555) 019-2834';

  // Extract Links
  const links = [];
  if (text.toLowerCase().includes('github.com')) {
    const gh = text.match(/github\.com\/[a-zA-Z0-9_-]+/i);
    if (gh) links.push(gh[0]);
  }
  if (text.toLowerCase().includes('linkedin.com')) {
    const li = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
    if (li) links.push(li[0]);
  }
  structuredResume.links = links.length > 0 ? links.join(' | ') : 'linkedin.com/in/username | github.com/username';

  // Simple heuristics for location
  structuredResume.location = 'San Francisco, CA'; // fallback default
  const locationMatch = text.match(/[A-Z][a-zA-Z\s]+,\s[A-Z]{2}/);
  if (locationMatch) {
    structuredResume.location = locationMatch[0];
  }

  // Segment parser based on keywords
  const sections = {
    summary: { keywords: ['professional summary', 'summary', 'profile', 'career objective', 'about me'], start: -1, end: -1 },
    skills: { keywords: ['skills', 'core competencies', 'technical skills', 'skills & tools', 'technologies'], start: -1, end: -1 },
    experience: { keywords: ['experience', 'work experience', 'professional experience', 'employment history', 'work history'], start: -1, end: -1 },
    education: { keywords: ['education', 'academic history', 'degrees', 'education & training'], start: -1, end: -1 },
    projects: { keywords: ['projects', 'key projects', 'academic projects', 'personal projects'], start: -1, end: -1 }
  };

  const lowerLines = lines.map(l => l.toLowerCase());
  
  // Find starts of sections
  Object.keys(sections).forEach(key => {
    const sec = sections[key];
    for (let i = 0; i < lowerLines.length; i++) {
      const line = lowerLines[i];
      // Check if line exactly matches or starts with one of the keywords
      const isHeader = sec.keywords.some(kw => line === kw || line.startsWith(kw + ':') || (line.length < 30 && line.includes(kw) && (line.startsWith('##') || line.startsWith('**') || line.toUpperCase() === line)));
      if (isHeader) {
        sec.start = i;
        break;
      }
    }
  });

  // Calculate ends by finding next starting section
  const sortedStarts = Object.keys(sections)
    .map(key => ({ key, start: sections[key].start }))
    .filter(item => item.start !== -1)
    .sort((a, b) => a.start - b.start);

  for (let i = 0; i < sortedStarts.length; i++) {
    const current = sortedStarts[i];
    const next = sortedStarts[i + 1];
    sections[current.key].end = next ? next.start : lines.length;
  }

  // Populate actual texts
  Object.keys(sections).forEach(key => {
    const sec = sections[key];
    if (sec.start !== -1) {
      // slice lines excluding header line
      structuredResume[key] = lines.slice(sec.start + 1, sec.end).join('\n');
    }
  });

  // Handle Skills as array
  if (structuredResume.skills) {
    structuredResume.skills = structuredResume.skills
      .split(/[,;\n\t]/)
      .map(s => s.replace(/[•\-\*]/g, '').trim())
      .filter(s => s.length > 1 && s.length < 30);
  }

  // If experience is empty, try to extract paragraphs that look like jobs
  if (!structuredResume.experience || structuredResume.experience.length < 50) {
    structuredResume.experience = text.substring(0, 1500); // safety fallback
  }
}

/* ========================================================
   4. ATS Audit Engine (Formatting & Best Practices)
   ======================================================== */
function performFullAudit() {
  if (!rawTextContent) {
    uploadError.textContent = 'Please upload a resume file first.';
    uploadError.classList.add('active');
    return;
  }

  toggleScanningState(true, 'Auditing layout and formatting...');

  // Introduce a slight artificial delay to make the premium orbit loader feel active and high-tech
  setTimeout(() => {
    parseResumeSections(rawTextContent);
    
    // Evaluate ATS Score & Formatting Flags
    const { score, flags } = auditATSFriendliness(rawTextContent);
    
    // Evaluate JD Semantic Match (if provided)
    const jdTextVal = jdText.value.trim();
    let matchPercentage = 0;
    let advantages = [];
    let disadvantages = [];
    let suggestions = [];

    if (jdTextVal) {
      const matchResult = analyzeJobDescriptionMatch(rawTextContent, jdTextVal);
      matchPercentage = matchResult.matchScore;
      advantages = matchResult.advantages;
      disadvantages = matchResult.disadvantages;
      suggestions = matchResult.suggestions;
      
      jdMatchBox.style.display = 'flex';
      jdComparisonDetails.style.display = 'grid';
      rewriteCtaBanner.style.display = 'flex';
      
      // Update JD Match Circle
      animateRadialGauge(radialMatchBar, matchVal, matchPercentage);
    } else {
      jdMatchBox.style.display = 'none';
      jdComparisonDetails.style.display = 'none';
      rewriteCtaBanner.style.display = 'none';
      
      suggestions = generateGenericSuggestions(structuredResume);
    }

    // Update ATS Score Circle
    animateRadialGauge(radialProgressBar, scoreVal, score);

    // Update UI elements
    updateAuditUI(score, flags, advantages, disadvantages, suggestions);
    
    toggleScanningState(false);
    resultsContent.classList.add('active');
  }, 1200);
}

function auditATSFriendliness(text) {
  let score = 100;
  const flags = [];
  const lowerText = text.toLowerCase();

  // Flag 1: Non-standard headers
  const standardHeaders = ['summary', 'experience', 'skills', 'education', 'projects'];
  const hasStandardHeader = standardHeaders.some(h => lowerText.includes(h));
  if (!hasStandardHeader) {
    score -= 15;
    flags.push({
      title: 'Non-Standard Headers',
      explain: 'Your resume lacks standard headers like "Work Experience" or "Core Skills". ATS parsers may fail to categorise your data.'
    });
  }

  // Flag 2: Clichés/Buzzwords
  const foundCliches = CLICHES.filter(word => lowerText.includes(word));
  if (foundCliches.length > 2) {
    score -= 10;
    flags.push({
      title: 'Generic Buzzword Stuffing',
      explain: `Found cliches (${foundCliches.slice(0, 3).join(', ')}). Replace generic buzzwords with quantifiable accomplishments.`
    });
  }

  // Flag 3: Lack of quantified achievements (Metrics)
  const metricRegex = /\d+(%|\s*percent|x|\s*million|\s*k|\s*USD|\s*dollars)/i;
  const hasMetrics = metricRegex.test(text);
  if (!hasMetrics) {
    score -= 15;
    flags.push({
      title: 'Missing Quantifiable Metrics',
      explain: 'No figures, percentages, or dollar amounts were found. Resumes showing quantified impact convert 40% higher.'
    });
  }

  // Flag 4: Tables or text boxes detected (heuristic based on disjointed lines or pipe chars)
  const hasTableIndicators = text.includes('|') || text.includes('  \t  ') || (text.match(/\b(column|table|row)\b/gi) || []).length > 4;
  if (hasTableIndicators) {
    score -= 15;
    flags.push({
      title: 'Detected Complex Layout Grid',
      explain: 'Visual separators (tables, columns, grid blocks) detected. ATS parsers frequently mix up text read orders in tables.'
    });
  }

  // Flag 5: Non-ATS friendly fonts or graphical markers
  const badGraphics = (text.match(/📷|■|□|▲|▼|◆|◇|●|○/g) || []).length > 3;
  if (badGraphics) {
    score -= 10;
    flags.push({
      title: 'Graphical Accents Found',
      explain: 'Icons, graphical bullet points, or shapes found. Use standard circular/square characters for list items.'
    });
  }

  // Action verb density check
  const foundVerbs = ACTION_VERBS.filter(verb => lowerText.includes(verb));
  if (foundVerbs.length < 2) {
    score -= 10;
    flags.push({
      title: 'Passive Phrasing',
      explain: 'Lacks strong resume action verbs. Use verbs like "Spearheaded", "Architected", or "Optimized" to start bullets.'
    });
  }

  return { score: Math.max(score, 25), flags };
}

/* ========================================================
   5. Semantic JD Comparison Engine
   ======================================================== */
function analyzeJobDescriptionMatch(resumeText, jdText) {
  const lowerResume = resumeText.toLowerCase();
  const lowerJd = jdText.toLowerCase();
  
  // Extract keywords present in JD
  const expectedTech = TECH_KEYWORDS.filter(kw => lowerJd.includes(kw));
  const expectedSoft = SOFT_KEYWORDS.filter(kw => lowerJd.includes(kw));

  // Determine overlap
  const matchingTech = expectedTech.filter(kw => lowerResume.includes(kw));
  const matchingSoft = expectedSoft.filter(kw => lowerResume.includes(kw));
  
  const missingTech = expectedTech.filter(kw => !lowerResume.includes(kw));
  const missingSoft = expectedSoft.filter(kw => !lowerResume.includes(kw));

  // Match score calculation
  const totalKeywords = expectedTech.length + expectedSoft.length;
  const matchedKeywords = matchingTech.length + matchingSoft.length;
  
  let matchScore = 0;
  if (totalKeywords > 0) {
    matchScore = Math.round((matchedKeywords / totalKeywords) * 100);
  } else {
    // Fallback based on generic term overlaps
    matchScore = 40; 
  }

  // Compile advantages
  const advantages = [];
  if (matchingTech.length > 0) {
    advantages.push(`Matching Technical Stack: Detected core technologies (${matchingTech.slice(0, 4).join(', ')}).`);
  }
  if (matchingSoft.length > 0) {
    advantages.push(`Soft Skill Alignment: Highlights essential attributes like ${matchingSoft.slice(0, 3).join(', ')}.`);
  }
  if (advantages.length === 0) {
    advantages.push('Formatting Base: Section dividers and details are in order.');
  }

  // Compile disadvantages
  const disadvantages = [];
  missingTech.slice(0, 4).forEach(kw => {
    disadvantages.push({
      title: `Missing Skill: ${kw.toUpperCase()}`,
      explain: `Target job description heavily stresses ${kw} proficiency. Ensure this skill is showcased.`
    });
  });
  
  missingSoft.slice(0, 2).forEach(kw => {
    disadvantages.push({
      title: `Missing Qualification: ${kw.toUpperCase()}`,
      explain: `Failed to find expressions representing ${kw} capability.`
    });
  });

  if (disadvantages.length === 0) {
    disadvantages.push({
      title: 'High Correlation',
      explain: 'Your resume shows strong relevance against all core JD criteria.'
    });
  }

  // Compile actionable suggestions
  const suggestions = [];
  missingTech.slice(0, 3).forEach(kw => {
    suggestions.push(`Integrate the technology term **"${kw}"** into your skills section or project highlights.`);
  });
  missingSoft.slice(0, 2).forEach(kw => {
    suggestions.push(`Rephrase experience accomplishments to display **"${kw}"** impact.`);
  });
  suggestions.push('Add quantified metrics showing percentages, dollar figures, or hourly scope to Experience highlights.');

  return {
    matchScore,
    advantages,
    disadvantages,
    suggestions
  };
}

function generateGenericSuggestions(resumeObj) {
  const suggestions = [];
  if (!resumeObj.summary || resumeObj.summary.length < 30) {
    suggestions.push('Create a compelling 3-sentence **Professional Summary** that summarizes your value proposition.');
  }
  if (!resumeObj.skills || resumeObj.skills.length < 5) {
    suggestions.push('Expand your **Core Skills** section. Add technical tools and platforms relative to your target industry.');
  }
  suggestions.push('Quantify experience bullet points. Use figures (e.g. "managed $5K budget", "boosted page response speed by 35%").');
  suggestions.push('Audit active verbs: check that every bullet in experience begins with a strong verb (e.g., spearheaded, architected).');
  return suggestions;
}

/* ========================================================
   6. UI Render Functions
   ======================================================== */
function animateRadialGauge(progressCircle, valTextElement, targetValue) {
  const radius = progressCircle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  
  progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  
  // Set stroke color class based on score value
  progressCircle.classList.remove('strong', 'good', 'weak');
  if (targetValue >= 80) {
    progressCircle.classList.add('strong');
  } else if (targetValue >= 60) {
    progressCircle.classList.add('good');
  } else {
    progressCircle.classList.add('weak');
  }

  // Animate progress circle offset
  const offset = circumference - (targetValue / 100) * circumference;
  progressCircle.style.strokeDashoffset = offset;
  
  // Counter animation for text value
  let startVal = 0;
  const duration = 1200; // ms
  const stepTime = Math.abs(Math.floor(duration / targetValue));
  
  const timer = setInterval(() => {
    startVal++;
    valTextElement.textContent = startVal;
    if (startVal >= targetValue) {
      clearInterval(timer);
      valTextElement.textContent = targetValue;
    }
  }, stepTime);
}

function updateAuditUI(score, flags, advantages, disadvantages, suggestions) {
  // Update Score Badge & Meta Text
  scoreBadge.classList.remove('strong', 'weak');
  if (score >= 80) {
    scoreBadge.textContent = 'Excellent';
    scoreBadge.classList.add('strong');
    scoreHeading.textContent = 'ATS-Ready Portfolio';
    scoreSummary.textContent = 'Your resume aligns with modern ATS guidelines. Formatting, structure, and text density are clean.';
  } else if (score >= 60) {
    scoreBadge.textContent = 'Good';
    scoreHeading.textContent = 'Solid Baseline';
    scoreSummary.textContent = 'Good content, but minor formatting revisions and key terms can optimize layout significantly.';
  } else {
    scoreBadge.textContent = 'Needs Work';
    scoreBadge.classList.add('weak');
    scoreHeading.textContent = 'Action Required';
    scoreSummary.textContent = 'Critical formatting flags. Ensure sections use standard titles and avoid tabular structures.';
  }

  // Render Advantages
  listAdvantages.innerHTML = '';
  advantages.forEach(adv => {
    const li = document.createElement('li');
    li.textContent = adv;
    listAdvantages.appendChild(li);
  });

  // Render Disadvantages
  listDisadvantages.innerHTML = '';
  disadvantages.forEach(dis => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="disadvantage-item-content">
        <span class="disadvantage-title">${dis.title}</span>
        <span class="disadvantage-explain">${dis.explain}</span>
      </div>
    `;
    listDisadvantages.appendChild(li);
  });

  // Render Red Flags
  listRedflags.innerHTML = '';
  if (flags.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No critical formatting red flags detected!';
    li.style.color = 'var(--success)';
    listRedflags.appendChild(li);
  } else {
    flags.forEach(flag => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="redflag-item-content">
          <span class="redflag-title">${flag.title}</span>
          <span class="redflag-explain">${flag.explain}</span>
        </div>
      `;
      listRedflags.appendChild(li);
    });
  }

  // Render Actionable Suggestions
  listSuggestions.innerHTML = '';
  suggestions.forEach(sug => {
    const li = document.createElement('li');
    // Allow inline markdown styling for keyword highlights
    li.innerHTML = sug.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    listSuggestions.appendChild(li);
  });
}

function resetWorkspace() {
  rawTextContent = '';
  selectedFileName = '';
  fileNameLabel.textContent = 'No file selected';
  fileNameLabel.classList.remove('active');
  resumeFileInput.value = '';
  jdText.value = '';
  jdWordCount.textContent = '0 words';
  uploadError.classList.remove('active');
  
  resultsContent.classList.remove('active');
  resultsScanning.classList.remove('active');
  resultsEmpty.classList.add('active');
}

/* ========================================================
   7. AI Rewriting Workspace Sync
   ======================================================== */
function openRewriteWorkspace() {
  // Populate editable fields with currently parsed values
  editName.value = structuredResume.name;
  editEmail.value = structuredResume.email;
  editPhone.value = structuredResume.phone;
  editLocation.value = structuredResume.location;
  editLinks.value = structuredResume.links;
  
  // Synthesize customized content using target JD parameters
  const jdVal = jdText.value.trim();
  let generatedSummary = structuredResume.summary;
  let generatedSkills = structuredResume.skills;
  let generatedExperience = structuredResume.experience;

  // Simulate complex AI Rewrite mapping missing keywords
  if (jdVal) {
    const lowerJd = jdVal.toLowerCase();
    const missingTech = TECH_KEYWORDS.filter(kw => lowerJd.includes(kw) && !rawTextContent.toLowerCase().includes(kw));
    const missingSoft = SOFT_KEYWORDS.filter(kw => lowerJd.includes(kw) && !rawTextContent.toLowerCase().includes(kw));
    
    // 1. Synthesize tailored summary
    const roleMatch = jdVal.match(/(senior|junior|lead)?\s*(software engineer|developer|manager|analyst|designer)/i);
    const targetTitle = roleMatch ? roleMatch[0] : 'Professional Developer';
    generatedSummary = `Dynamic and results-driven ${targetTitle} with proven expertise in orchestrating robust system lifecycles. Adept at leveraging ${[...structuredResume.skills.slice(0, 3), ...missingTech.slice(0, 2)].join(', ')} to engineer high-velocity solutions. Committed to stakeholder collaboration and implementing streamlined, ATS-optimized deliverables.`;

    // 2. Add missing keywords to skills list
    const finalSkills = [...structuredResume.skills];
    missingTech.slice(0, 4).forEach(kw => {
      if (!finalSkills.includes(kw)) finalSkills.push(kw);
    });
    generatedSkills = finalSkills.join(', ');

    // 3. Inject missing keywords and clean phrasing in Experience bullets
    const bulletItems = structuredResume.experience.split('\n').filter(l => l.trim().length > 10);
    const compiledBullets = [];
    
    bulletItems.forEach((bullet, index) => {
      let refined = bullet.replace(/[•\-\*]/g, '').trim();
      
      // Inject missing terms dynamically into the first two bullets
      if (index === 0 && missingTech[0]) {
        refined = `Spearheaded software architecture, utilizing ${missingTech[0]} to streamline product pipelines and optimize performance metrics.`;
      } else if (index === 1 && missingSoft[0]) {
        refined = `Collaborated across cross-functional teams to execute deliverables, demonstrating agility in ${missingSoft[0]} and stakeholder relations.`;
      }
      
      // Replace passive phrases with action verbs
      if (refined.toLowerCase().startsWith('responsible for')) {
        refined = refined.replace(/responsible for/i, 'Orchestrated');
      } else if (refined.toLowerCase().startsWith('helped with')) {
        refined = refined.replace(/helped with/i, 'Facilitated');
      }
      
      compiledBullets.push(`• ${refined}`);
    });
    
    generatedExperience = compiledBullets.join('\n');
  } else {
    // Use raw values if no JD
    generatedSummary = structuredResume.summary || 'Detail-oriented professional with comprehensive experience in modern product delivery methodologies.';
    generatedSkills = structuredResume.skills.join(', ') || 'Project Management, Communication, Business Analysis';
    generatedExperience = structuredResume.experience;
  }

  editSummary.value = generatedSummary;
  editSkills.value = generatedSkills;
  editExperience.value = generatedExperience;
  editEducation.value = structuredResume.education || 'Bachelor of Science in Computer Science | State University';
  editProjects.value = structuredResume.projects || 'Portfolio Platform - Engineered high-performance showcase site incorporating clean layout sheets.';

  // Swap Screen
  workspaceDashboard.classList.remove('active-workspace');
  workspaceRewrite.classList.add('active-workspace');
  
  // Render initial preview
  syncResumePreview();
}

function closeRewriteWorkspace() {
  workspaceRewrite.classList.remove('active-workspace');
  workspaceDashboard.classList.add('active-workspace');
}

// Attach event listeners to input changes to live-render A4 preview sheet
function setupEditorSync() {
  const fields = [
    editName, editEmail, editPhone, editLocation, editLinks,
    editSummary, editSkills, editExperience, editEducation, editProjects
  ];
  
  fields.forEach(field => {
    field.addEventListener('input', syncResumePreview);
  });
}

function syncResumePreview() {
  const name = editName.value || 'Your Name';
  const email = editEmail.value || 'email@example.com';
  const phone = editPhone.value || '(123) 456-7890';
  const location = editLocation.value || 'Location';
  const links = editLinks.value || 'GitHub | LinkedIn';
  
  const summary = editSummary.value;
  const skills = editSkills.value.split(',').map(s => s.trim()).filter(Boolean);
  
  // Format Experience Bullets
  const expLines = editExperience.value.split('\n').filter(Boolean);
  let expHTML = '';
  let insideItem = false;

  expLines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      if (!insideItem) {
        expHTML += '<ul class="item-bullets">';
        insideItem = true;
      }
      expHTML += `<li>${trimmed.substring(1).trim()}</li>`;
    } else {
      if (insideItem) {
        expHTML += '</ul>';
        insideItem = false;
      }
      // Treat text as job headings
      expHTML += `
        <div class="experience-item">
          <div class="item-header">
            <span>${trimmed}</span>
          </div>
        </div>
      `;
    }
  });
  if (insideItem) expHTML += '</ul>';

  // Format Education
  const eduHTML = editEducation.value.split('\n').map(l => `<p>${l.trim()}</p>`).join('');

  // Format Projects
  const projHTML = editProjects.value.split('\n').map(l => `<p>${l.trim()}</p>`).join('');

  // Combine into Template wrapper
  const templateType = templateSelect.value;
  
  let headerBlock = '';
  if (templateType === 'classic') {
    headerBlock = `
      <div class="resume-header">
        <div class="resume-name">${name}</div>
        <div class="resume-contact">${email} &bull; ${phone} &bull; ${location}</div>
        <div class="resume-contact">${links}</div>
      </div>
    `;
  } else {
    headerBlock = `
      <div class="resume-header">
        <div class="resume-name">${name}</div>
        <div class="resume-contact">
          <span>${email}</span> | <span>${phone}</span> | <span>${location}</span>
        </div>
        <div class="resume-contact">
          <span>${links}</span>
        </div>
      </div>
    `;
  }

  resumePreviewSheet.innerHTML = `
    ${headerBlock}
    
    ${summary ? `
      <div class="resume-section">
        <div class="section-heading">Professional Summary</div>
        <p style="margin-top: 0.25rem;">${summary}</p>
      </div>
    ` : ''}

    ${skills.length > 0 ? `
      <div class="resume-section">
        <div class="section-heading">Skills & Expertise</div>
        <p style="margin-top: 0.25rem; font-weight: 500;">${skills.join('  •  ')}</p>
      </div>
    ` : ''}

    ${expHTML ? `
      <div class="resume-section">
        <div class="section-heading">Professional Experience</div>
        <div style="margin-top: 0.35rem;">${expHTML}</div>
      </div>
    ` : ''}

    ${eduHTML ? `
      <div class="resume-section">
        <div class="section-heading">Education</div>
        <div style="margin-top: 0.25rem;">${eduHTML}</div>
      </div>
    ` : ''}

    ${projHTML ? `
      <div class="resume-section">
        <div class="section-heading">Key Projects</div>
        <div style="margin-top: 0.25rem;">${projHTML}</div>
      </div>
    ` : ''}
  `;
}

function changeResumeTemplate() {
  const template = templateSelect.value;
  resumePreviewSheet.className = `resume-sheet template-${template}`;
  syncResumePreview();
}

/* ========================================================
   8. Document Export (Direct Print / html2pdf.js)
   ======================================================== */
function downloadResumePDF() {
  const element = document.getElementById('resume-preview-sheet');
  const filename = `${editName.value.replace(/\s+/g, '_')}_Tailored_Resume.pdf`;

  // Premium Options configuration for html2pdf.js
  const opt = {
    margin:       [0.4, 0.4, 0.4, 0.4], // 10mm margin
    filename:     filename,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  toggleScanningState(true, 'Compiling A4 PDF Document...');
  
  html2pdf().set(opt).from(element).save()
    .then(() => {
      toggleScanningState(false);
    })
    .catch((err) => {
      console.error(err);
      toggleScanningState(false);
      // Fallback: standard system print dialog
      window.print();
    });
}

function copyResumeToClipboard() {
  const name = editName.value;
  const email = editEmail.value;
  const phone = editPhone.value;
  const location = editLocation.value;
  const links = editLinks.value;
  const summary = editSummary.value;
  const skills = editSkills.value;
  const experience = editExperience.value;
  const education = editEducation.value;
  const projects = editProjects.value;

  const plainText = `
${name}
${email} | ${phone} | ${location}
${links}

=========================================
PROFESSIONAL SUMMARY
=========================================
${summary}

=========================================
CORE SKILLS
=========================================
${skills}

=========================================
PROFESSIONAL EXPERIENCE
=========================================
${experience}

=========================================
EDUCATION
=========================================
${education}

=========================================
PROJECTS
=========================================
${projects}
  `.trim();

  navigator.clipboard.writeText(plainText)
    .then(() => {
      alert('Tailored resume text copied to clipboard successfully!');
    })
    .catch(err => {
      console.error('Failed to copy text: ', err);
    });
}
