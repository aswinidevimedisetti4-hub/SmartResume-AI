// ResumeAI Analyst v2.0 - Core Engine

// 1. Role Skill Database
const ROLE_DATABASE = {
  frontend: {
    title: "Frontend Developer",
    skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Sass", "Webpack", "Vite", "Redux", "TailwindCSS", "Git", "REST APIs", "GraphQL", "Next.js", "Jest", "CI/CD"],
    criticalSkills: {
      "JavaScript": "Foundational programming language for web interactivity.",
      "React": "Most in-demand library for component-based UI engineering.",
      "TypeScript": "Enables type safety, reducing compile-time bugs in production.",
      "Git": "Essential version control system for engineering collaboration."
    },
    sections: ["experience", "skills", "education"]
  },
  backend: {
    title: "Backend Developer",
    skills: ["Node.js", "Express", "Python", "Django", "Java", "Spring Boot", "Go", "SQL", "PostgreSQL", "MongoDB", "Redis", "REST APIs", "GraphQL", "Docker", "AWS", "Git", "CI/CD"],
    criticalSkills: {
      "Node.js": "Primary backend runtime environment for modern APIs.",
      "SQL": "Crucial for writing optimized database queries and data schemas.",
      "REST APIs": "Core mechanism for system-to-system communications.",
      "Docker": "Industry standard for application containerization and deployment."
    },
    sections: ["experience", "skills", "education"]
  },
  fullstack: {
    title: "Full-Stack Developer",
    skills: ["React", "Node.js", "JavaScript", "TypeScript", "SQL", "NoSQL", "Express", "Git", "REST APIs", "Docker", "AWS", "CSS", "HTML", "CI/CD", "Next.js"],
    criticalSkills: {
      "React": "Handles building stateful client-side user interfaces.",
      "Node.js": "Handles scalable API construction and backend runtime.",
      "SQL": "Enables creation of structured relational database models.",
      "Git": "Key tool for tracking changes and managing pipeline collaboration."
    },
    sections: ["experience", "skills", "education"]
  },
  datascience: {
    title: "Data Scientist / Analyst",
    skills: ["Python", "R", "SQL", "Pandas", "NumPy", "Scikit-Learn", "Machine Learning", "Tableau", "PowerBI", "Statistics", "TensorFlow", "PyTorch", "Data Analysis", "Git", "Excel"],
    criticalSkills: {
      "Python": "Primary language for data manipulation, analysis, and ML scripting.",
      "SQL": "Needed to query, clean, and extract dataset tables.",
      "Data Analysis": "Core ability to translate raw numbers into business insights.",
      "Statistics": "Crucial mathematical foundation for testing hypotheses."
    },
    sections: ["experience", "skills", "education"]
  },
  productmanager: {
    title: "Product Manager",
    skills: ["Agile", "Scrum", "Product Strategy", "Product Roadmap", "Analytics", "Jira", "A/B Testing", "SQL", "User Research", "Stakeholder Management", "MVP", "UX Design", "KPIs"],
    criticalSkills: {
      "Product Roadmap": "Defines short and long term features mapping target goals.",
      "Agile": "Facilitates development sprint coordination and velocity.",
      "Stakeholder Management": "Negotiates alignment between engineering, sales, and design.",
      "Analytics": "Drives feature decisions based on quantitative user data."
    },
    sections: ["experience", "education"]
  },
  designer: {
    title: "UI/UX Designer",
    skills: ["Figma", "Sketch", "Adobe XD", "UI Design", "UX Design", "Wireframing", "Prototyping", "User Research", "User Journeys", "Typography", "Visual Design", "Design Systems", "HTML", "CSS"],
    criticalSkills: {
      "Figma": "Leading collaborative product design and prototyping workbench.",
      "UI Design": "Drives visually premium layouts, typography, and grids.",
      "UX Design": "Validates user flows, wireframes, and usability mapping.",
      "Prototyping": "Animates mockup screens to show interactions to developers."
    },
    sections: ["experience", "portfolio", "skills"]
  },
  devops: {
    title: "DevOps & Cloud Engineer",
    skills: ["Docker", "Kubernetes", "Jenkins", "CI/CD", "AWS", "Azure", "Terraform", "Ansible", "Linux", "Bash", "Git", "Monitoring", "Prometheus", "YAML", "Networking"],
    criticalSkills: {
      "Docker": "Packages software code into standardized virtual containers.",
      "Kubernetes": "Orchestrates deployment scaling of container pods.",
      "CI/CD": "Automates testing, building, and direct cloud pipeline releases.",
      "AWS": "Dominant global cloud infrastructure ecosystem."
    },
    sections: ["experience", "skills", "education"]
  },
  marketing: {
    title: "Marketing Specialist",
    skills: ["SEO", "SEM", "Google Analytics", "Content Strategy", "Copywriting", "Social Media", "Email Marketing", "PPC", "HubSpot", "Conversion Rate Optimization", "Campaigns", "A/B Testing", "Excel"],
    criticalSkills: {
      "Google Analytics": "Essential for tracking user acquisition funnel metrics.",
      "SEO": "Critical to rank corporate keywords and capture organic traffic.",
      "Content Strategy": "Establishes brand messaging authority and audience retention.",
      "Campaigns": "Coordinates marketing plays across multiple target channels."
    },
    sections: ["experience", "education"]
  }
};

// 2. Comprehensive Tech Keywords list (For auto-detecting tech skills)
const TECHNICAL_SKILLS_POOL = [
  "react", "angular", "vue", "javascript", "typescript", "html", "css", "sass", "less", "bootstrap",
  "tailwind", "tailwindcss", "webpack", "vite", "gulp", "redux", "graphql", "rest api", "rest apis", "api", "apis",
  "nodejs", "node.js", "express", "expressjs", "python", "django", "flask", "fastapi", "java", "spring", "spring boot",
  "go", "golang", "c++", "c#", "ruby", "rails", "php", "laravel", "sql", "mysql", "postgresql", "postgres",
  "sqlite", "mongodb", "nosql", "redis", "elasticsearch", "cassandra", "firebase", "supabase", "docker", "kubernetes",
  "helm", "terraform", "ansible", "jenkins", "github actions", "gitlab ci", "circleci", "aws", "amazon web services",
  "azure", "gcp", "google cloud", "linux", "bash", "shell", "git", "github", "gitlab", "bitbucket",
  "prometheus", "grafana", "elk", "splunk", "jira", "confluence", "scrum", "agile", "kanban", "figma",
  "sketch", "invision", "zeplin", "adobe xd", "photoshop", "illustrator", "seo", "sem", "google analytics",
  "google tag manager", "hubspot", "mailchimp", "salesforce", "marketo", "tableau", "powerbi", "power bi",
  "excel", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "keras", "matplotlib", "seaborn",
  "statistics", "math", "r", "sas", "spss", "stata", "matlab", "wordpress", "drupal", "joomla", "shopify"
];

// 3. Soft Skills Pool
const SOFT_SKILLS_POOL = [
  "leadership", "communication", "collaboration", "teamwork", "problem solving", "problem-solving",
  "critical thinking", "critical-thinking", "time management", "time-management", "adaptability",
  "flexibility", "creativity", "innovation", "organization", "planning", "negotiation", "conflict resolution",
  "emotional intelligence", "empathy", "active listening", "presentation", "public speaking", "writing",
  "customer service", "client relationship", "stakeholder management", "project management", "decision making",
  "decision-making", "work ethic", "attention to detail", "analytical skills", "coaching", "mentoring"
];

// 4. Action Verbs List
const ACTION_VERBS = [
  "managed", "led", "developed", "designed", "implemented", "created", "optimized", "built", "engineered",
  "collaborated", "facilitated", "increased", "reduced", "delivered", "coordinated", "analyzed", "architected",
  "formulated", "established", "spearheaded", "directed", "authored", "executed", "improved", "automated",
  "streamlined", "programmed", "solved", "administered", "initiated", "launched", "boosted"
];

// 5. Clichés / Buzzwords
const BUZZWORDS = [
  "go-getter", "team player", "synergy", "think outside the box", "detail-oriented", "hard worker", 
  "results-driven", "self-starter", "dynamic", "motivated", "detail oriented", "results driven"
];

// 6. UI Element Selectors
const resumeTextArea = document.getElementById('resume-text');
const wordCountSpan = document.getElementById('word-count');
const charCountSpan = document.getElementById('char-count');
const reviewBtn = document.getElementById('review-btn');
const clearBtn = document.getElementById('clear-btn');
const validationError = document.getElementById('validation-error');

const stateEmpty = document.getElementById('results-empty');
const stateScanning = document.getElementById('results-scanning');
const stateResults = document.getElementById('results-content');
const scanningStepText = document.getElementById('scanning-step-text');
const resultsCardContainer = document.getElementById('results-card-container');

// Results Dashboard Elements
const scoreVal = document.getElementById('score-val');
const radialProgressBar = document.getElementById('radial-progress-bar');
const scoreBadge = document.getElementById('score-badge');
const scoreHeading = document.getElementById('score-heading');
const scoreSummary = document.getElementById('score-summary');

const structurePercent = document.getElementById('breakdown-structure-val');
const structureFill = document.getElementById('breakdown-structure-fill');
const impactPercent = document.getElementById('breakdown-impact-val');
const impactFill = document.getElementById('breakdown-impact-fill');
const verbsPercent = document.getElementById('breakdown-verbs-val');
const verbsFill = document.getElementById('breakdown-verbs-fill');
const matchPercent = document.getElementById('breakdown-match-val');
const matchFill = document.getElementById('breakdown-match-fill');

// Additional Lists & Containers
const recommendedRolesContainer = document.getElementById('recommended-roles-container');
const generatedSummaryContent = document.getElementById('generated-summary-content');
const listStrengths = document.getElementById('list-strengths');
const listWeaknesses = document.getElementById('list-weaknesses');
const detectedTechSkills = document.getElementById('detected-tech-skills');
const detectedSoftSkills = document.getElementById('detected-soft-skills');
const listSkillsMissingExplained = document.getElementById('list-skills-missing-explained');

// Utility buttons
const copyAnalysisBtn = document.getElementById('copy-analysis-btn');
const pdfExportBtn = document.getElementById('pdf-export-btn');
const resetAnalysisBtn = document.getElementById('reset-analysis-btn');

// Global analysis results storage
let globalAnalysisData = null;

// 7. Input Event Handlers (Word & Char Counter)
resumeTextArea.addEventListener('input', () => {
  const text = resumeTextArea.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const chars = text.length;
  
  wordCountSpan.textContent = `${words} word${words !== 1 ? 's' : ''}`;
  charCountSpan.textContent = `${chars} char${chars !== 1 ? 's' : ''}`;
  
  // Clear error border on user typing
  if (text.length > 0) {
    resumeTextArea.classList.remove('invalid');
    validationError.classList.remove('active');
  }
});

// 8. Clear Button Handler
clearBtn.addEventListener('click', () => {
  resumeTextArea.value = '';
  wordCountSpan.textContent = '0 words';
  charCountSpan.textContent = '0 chars';
  resumeTextArea.classList.remove('invalid');
  validationError.classList.remove('active');
  switchState('empty');
});

// 9. Reset Button Handler
resetAnalysisBtn.addEventListener('click', () => {
  switchState('empty');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 10. Copy Analysis Handler
copyAnalysisBtn.addEventListener('click', () => {
  if (!globalAnalysisData) return;
  
  const selectedRoleName = ROLE_DATABASE[document.getElementById('job-role').value].title;
  let textReport = `======================================\n`;
  textReport += `RESUMEAI ANALYST - PERFORMANCE REPORT\n`;
  textReport += `======================================\n\n`;
  textReport += `Target Job Profile: ${selectedRoleName}\n`;
  textReport += `Overall ATS Score: ${globalAnalysisData.finalScore}/100 [Rating: ${globalAnalysisData.badgeText}]\n\n`;
  textReport += `--------------------------------------\n`;
  textReport += `PROFESSIONAL SUMMARY SUGGESTION\n`;
  textReport += `--------------------------------------\n`;
  textReport += `${globalAnalysisData.generatedSummary}\n\n`;
  textReport += `--------------------------------------\n`;
  textReport += `FIT METRICS BREAKDOWN\n`;
  textReport += `--------------------------------------\n`;
  textReport += `- Layout Structure: ${globalAnalysisData.breakdown.structure}%\n`;
  textReport += `- Quantitative Impact: ${globalAnalysisData.breakdown.impact}%\n`;
  textReport += `- Action Verbs Usage: ${globalAnalysisData.breakdown.verbs}%\n`;
  textReport += `- Role-Specific Keywords: ${globalAnalysisData.breakdown.match}%\n\n`;
  textReport += `--------------------------------------\n`;
  textReport += `TOP ROLE FIT RECOMMENDATIONS\n`;
  textReport += `--------------------------------------\n`;
  globalAnalysisData.roleRecommendations.forEach(role => {
    textReport += `- ${role.title}: ${role.confidence}% Match\n`;
  });
  textReport += `\n`;
  textReport += `--------------------------------------\n`;
  textReport += `DETECTED KEY STRENGTHS\n`;
  textReport += `--------------------------------------\n`;
  globalAnalysisData.strengths.forEach(str => {
    textReport += `[✓] ${str}\n`;
  });
  textReport += `\n`;
  textReport += `--------------------------------------\n`;
  textReport += `IDENTIFIED WEAKNESSES & IMPROVEMENTS\n`;
  textReport += `--------------------------------------\n`;
  globalAnalysisData.weaknesses.forEach(wk => {
    textReport += `[!] ${wk.title}\n`;
    textReport += `    Why: ${wk.explain}\n`;
    textReport += `    Fix: ${wk.fix}\n\n`;
  });
  textReport += `--------------------------------------\n`;
  textReport += `TECHNICAL SKILLS DETECTED\n`;
  textReport += `--------------------------------------\n`;
  textReport += globalAnalysisData.techSkills.length > 0 ? globalAnalysisData.techSkills.join(', ') : 'None detected';
  textReport += `\n\n`;
  textReport += `--------------------------------------\n`;
  textReport += `SOFT SKILLS DETECTED\n`;
  textReport += `--------------------------------------\n`;
  textReport += globalAnalysisData.softSkills.length > 0 ? globalAnalysisData.softSkills.join(', ') : 'None detected';
  textReport += `\n\n`;
  textReport += `--------------------------------------\n`;
  textReport += `CRITICAL MISSING SKILLS & IMPORTANCE\n`;
  textReport += `--------------------------------------\n`;
  globalAnalysisData.missingSkillsExplained.forEach(ms => {
    textReport += `[+] ${ms.skill}: ${ms.reason}\n`;
  });
  
  navigator.clipboard.writeText(textReport).then(() => {
    const originalText = copyAnalysisBtn.innerHTML;
    copyAnalysisBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span style="color: var(--success)">Report Copied!</span>
    `;
    setTimeout(() => {
      copyAnalysisBtn.innerHTML = originalText;
    }, 2000);
  }).catch(err => {
    console.error("Clipboard copy failed: ", err);
    alert("Could not copy clipboard text. Please try selecting the report manual.");
  });
});

// 11. PDF Export Handler
pdfExportBtn.addEventListener('click', () => {
  window.print();
});

// 12. Review Button Handler
reviewBtn.addEventListener('click', () => {
  const text = resumeTextArea.value.trim();
  if (text.length === 0) {
    resumeTextArea.classList.add('invalid');
    validationError.classList.add('active');
    resumeTextArea.focus();
    return;
  }
  
  runAnalysis(text);
});

// 13. State Manager
function switchState(state) {
  stateEmpty.classList.remove('active');
  stateScanning.classList.remove('active');
  stateResults.classList.remove('active');

  if (state === 'empty') {
    stateEmpty.style.display = 'flex';
    stateScanning.style.display = 'none';
    stateResults.style.display = 'none';
    setTimeout(() => stateEmpty.classList.add('active'), 50);
  } else if (state === 'scanning') {
    stateEmpty.style.display = 'none';
    stateScanning.style.display = 'flex';
    stateResults.style.display = 'none';
    setTimeout(() => stateScanning.classList.add('active'), 50);
  } else if (state === 'results') {
    stateEmpty.style.display = 'none';
    stateScanning.style.display = 'none';
    stateResults.style.display = 'flex';
    setTimeout(() => stateResults.classList.add('active'), 50);
  }
}

// 14. Scan Orbit Animation Steps Trigger
function runAnalysis(text) {
  switchState('scanning');
  
  const selectedRole = document.getElementById('job-role').value;
  const expLevel = document.getElementById('exp-level').value;
  
  const steps = [
    { text: "Parsing structural headers & document spacing...", delay: 400 },
    { text: "Detecting technical verbs & impact achievements...", delay: 800 },
    { text: "Indexing technical & soft skills taxonomy...", delay: 1200 },
    { text: "Determining role match profiles & confidence metrics...", delay: 1600 },
    { text: "Compiling final resume profile suggestion summary...", delay: 2000 }
  ];
  
  steps.forEach(step => {
    setTimeout(() => {
      scanningStepText.textContent = step.text;
    }, step.delay);
  });
  
  setTimeout(() => {
    const results = analyzeResumeText(text, selectedRole, expLevel);
    globalAnalysisData = results;
    displayResults(results, selectedRole);
    switchState('results');
    
    // Smooth scroll down to results container
    resultsCardContainer.scrollIntoView({ behavior: 'smooth' });
  }, 2400);
}

// 15. Keyword Boundary Match Helper
function checkKeyword(text, keyword) {
  const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'i');
  return regex.test(text);
}

// 16. Dynamic ATS Processing Core
function analyzeResumeText(text, roleKey, expLevel) {
  const words = text.split(/\s+/).length;
  const chars = text.length;
  const roleData = ROLE_DATABASE[roleKey];
  
  // A. Structure Checklist (20%)
  const sections = {
    summary: /(summary|objective|professional summary|about me|profile)/i.test(text),
    experience: /(experience|work history|employment|career history|professional background|work experience)/i.test(text),
    skills: /(skills|technologies|technical expertise|core competencies|competencies)/i.test(text),
    projects: /(projects|academic projects|personal projects|portfolio)/i.test(text),
    education: /(education|academic background|qualifications|academic credentials)/i.test(text)
  };
  
  let sectionsFoundCount = Object.values(sections).filter(Boolean).length;
  let structureScore = (sectionsFoundCount / 5) * 100;
  
  // B. Quantitative Impact Check (30%)
  const metricRegexes = [
    /\b\d+%\b/g,                          // e.g. 20%
    /\$\d+/g,                             // e.g. $500
    /\b\d+\s*x\b/gi,                      // e.g. 5x faster
    /\b(?:increased|reduced|saved|grew|revenue|users)\b.*?\b\d+\b/gi, // context words + number
    /\b\d+\s*(?:million|billion|k|thousand)\b/gi, // quantities
    /\b(?:team of|managed|led)\s+\d+/gi   // team sizes
  ];
  
  let metricsCount = 0;
  metricRegexes.forEach(regex => {
    const matches = text.match(regex);
    if (matches) {
      metricsCount += matches.length;
    }
  });
  
  let impactScore = 10;
  if (metricsCount >= 5) impactScore = 100;
  else if (metricsCount >= 3) impactScore = 85;
  else if (metricsCount >= 2) impactScore = 65;
  else if (metricsCount >= 1) impactScore = 40;
  
  // C. Active Action Verbs Check (20%)
  const lines = text.split(/[\n.•\-\*]/);
  let actionVerbCount = 0;
  
  lines.forEach(line => {
    const trimmedLine = line.trim().toLowerCase();
    const firstWord = trimmedLine.split(/\s+/)[0];
    const cleanedWord = firstWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    if (ACTION_VERBS.includes(cleanedWord)) {
      actionVerbCount++;
    }
  });
  
  let verbScore = 10;
  if (actionVerbCount >= 8) verbScore = 100;
  else if (actionVerbCount >= 5) verbScore = 80;
  else if (actionVerbCount >= 3) verbScore = 60;
  else if (actionVerbCount >= 1) verbScore = 35;
  
  // D. Keyword matching (30%)
  const presentRoleSkills = [];
  const missingRoleSkills = [];
  
  roleData.skills.forEach(skill => {
    if (checkKeyword(text, skill)) {
      presentRoleSkills.push(skill);
    } else {
      missingRoleSkills.push(skill);
    }
  });
  
  let matchScore = 0;
  if (roleData.skills.length > 0) {
    matchScore = Math.round((presentRoleSkills.length / roleData.skills.length) * 100);
  }
  
  // E. Overall ATS Score Calculation (0-100 scale)
  let overallScore = (structureScore * 0.20) + (impactScore * 0.30) + (verbScore * 0.20) + (matchScore * 0.30);
  overallScore = Math.round(overallScore);
  if (overallScore > 100) overallScore = 100;
  if (overallScore < 10 && words > 10) overallScore = 15;
  
  // F. Skills Auto-detection (Technical & Soft)
  const techSkillsDetected = [];
  TECHNICAL_SKILLS_POOL.forEach(skillName => {
    if (checkKeyword(text, skillName)) {
      // Capitalize first letters for tags displaying
      const formattedName = skillName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (!techSkillsDetected.includes(formattedName)) {
        techSkillsDetected.push(formattedName);
      }
    }
  });
  
  const softSkillsDetected = [];
  SOFT_SKILLS_POOL.forEach(skillName => {
    if (checkKeyword(text, skillName)) {
      const formattedName = skillName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (!softSkillsDetected.includes(formattedName)) {
        softSkillsDetected.push(formattedName);
      }
    }
  });
  
  // G. Dynamic Job Role Fit Recommendations
  const roleRecommendations = [];
  Object.keys(ROLE_DATABASE).forEach(key => {
    const roleInfo = ROLE_DATABASE[key];
    let matchedKeywords = 0;
    roleInfo.skills.forEach(skill => {
      if (checkKeyword(text, skill)) {
        matchedKeywords++;
      }
    });
    
    let fitPercentage = Math.round((matchedKeywords / roleInfo.skills.length) * 100);
    // Adjust slightly based on overall structure score for realistic confidence match
    fitPercentage = Math.round(fitPercentage * 0.8 + (structureScore / 100) * 20);
    if (fitPercentage > 100) fitPercentage = 100;
    if (fitPercentage < 10) fitPercentage = 12;
    
    roleRecommendations.push({
      key: key,
      title: roleInfo.title,
      confidence: fitPercentage
    });
  });
  // Sort descending and select top 3
  roleRecommendations.sort((a, b) => b.confidence - a.confidence);
  const topRoles = roleRecommendations.slice(0, 3);
  
  // H. ATS-Optimized profile Summary compiler
  let generatedSummary = "";
  const yearsExpText = expLevel === 'entry' ? "Aspiring" : expLevel === 'mid' ? "Results-driven" : "Visionary Senior";
  const primarySkillsStr = presentRoleSkills.slice(0, 4).join(', ');
  
  if (words < 20) {
    generatedSummary = `Enter comprehensive resume detail context to compile a professional profile summary.`;
  } else {
    generatedSummary = `${yearsExpText} ${roleData.title} with a proven background in target core methodologies. `;
    if (presentRoleSkills.length > 0) {
      generatedSummary += `Demonstrated hands-on expertise with ${primarySkillsStr}. `;
    }
    if (metricsCount > 0) {
      generatedSummary += `Adept at translating requirements into engineering workflows, leading to measurable business improvements. `;
    } else {
      generatedSummary += `Focused on building scalable system components, streamlining layouts, and enhancing development processes. `;
    }
    generatedSummary += `Recognized for strong teamwork, technical problems resolution, and commitment to project delivery excellence.`;
  }
  
  // I. Build Diagnostics: Strengths
  const strengths = [];
  if (sectionsFoundCount >= 4) {
    strengths.push("Excellent structural layout: Contains standard headers, assisting ATS scrapers in indexing content.");
  } else {
    strengths.push("Base text layout is parseable, providing clean content structure.");
  }
  if (metricsCount >= 3) {
    strengths.push(`High impact density: Detected ${metricsCount} quantified metrics, validating business contribution.`);
  }
  if (actionVerbCount >= 6) {
    strengths.push(`Strong vocabulary: Detected ${actionVerbCount} action-driven verbs, reflecting leadership initiative.`);
  }
  if (matchScore >= 60) {
    strengths.push(`Excellent keyword optimization: Matches a majority of expected technology tags for ${roleData.title}.`);
  }
  if (words >= 250 && words <= 800) {
    strengths.push(`Ideal density: Resume length is optimal (${words} words), preventing scanner fatigue.`);
  }
  
  // J. Build Diagnostics: Weaknesses with 'Why' and 'Fix'
  const weaknesses = [];
  const foundBuzzwords = [];
  BUZZWORDS.forEach(buzz => {
    if (checkKeyword(text, buzz)) {
      foundBuzzwords.push(buzz);
    }
  });
  
  if (sectionsFoundCount < 4) {
    weaknesses.push({
      title: "Missing critical sections",
      explain: "Bypassing key headers (like Projects or Skills) hinders ATS crawlers from categorizing details correctly.",
      fix: "Create distinct sections labeled 'Professional Experience', 'Technical Skills', 'Projects', and 'Education'."
    });
  }
  if (metricsCount < 3) {
    weaknesses.push({
      title: "Lack of quantified achievements",
      explain: "Recruiters cannot gauge the scale of your achievements unless you verify results using clear metric volumes.",
      fix: "Incorporate numbers, percentage increases, time saved, or team sizes (e.g., 'reduced bug count by 20%')."
    });
  }
  if (actionVerbCount < 5) {
    weaknesses.push({
      title: "Low usage of action verbs",
      explain: "Using passive phrases like 'responsible for' makes responsibilities feel like checklists instead of accomplishments.",
      fix: "Rewrite bullet points using active verbs: change 'was responsible for managing code releases' to 'Spearheaded release pipeline automation'."
    });
  }
  if (matchScore < 50) {
    weaknesses.push({
      title: "Low role keyword optimization",
      explain: "Your resume lacks multiple technologies and tags expected for a standard candidate in this role.",
      fix: `Incorporate more target keywords relevant to ${roleData.title} positions, such as ${missingRoleSkills.slice(0, 3).join(', ')}.`
    });
  }
  if (foundBuzzwords.length > 0) {
    weaknesses.push({
      title: "Clichés and buzzwords detected",
      explain: "Vague terms like 'team player' or 'motivated self-starter' sound repetitive and fail to demonstrate actual capabilities.",
      fix: `Remove terms like "${foundBuzzwords.slice(0, 3).join(', ')}" and replace them with specific examples of achievements.`
    });
  }
  if (words < 200) {
    weaknesses.push({
      title: "Document text length is too brief",
      explain: "ATS systems and managers may conclude that you lack the experience depth needed due to low content volume.",
      fix: "Add details about project architectures, team roles, technical challenges, and business results."
    });
  }
  if (words > 1000) {
    weaknesses.push({
      title: "Document text length is too wordy",
      explain: "Long resumes get scanned quickly. Important projects risk getting lost in heavy paragraphs.",
      fix: "Condense long descriptions. Keep professional experience to a maximum of 4-6 bullet points per role."
    });
  }
  
  // K. Missing Skills Recommendations with 'Importance'
  const missingSkillsExplained = [];
  const missingCriticalKeys = Object.keys(roleData.criticalSkills).filter(
    cs => !techSkillsDetected.some(ts => ts.toLowerCase() === cs.toLowerCase())
  );
  
  missingCriticalKeys.forEach(skill => {
    missingSkillsExplained.push({
      skill: skill,
      reason: roleData.criticalSkills[skill]
    });
  });
  
  // Fill with generic missing skills if there are no critical missing ones
  if (missingSkillsExplained.length === 0 && missingRoleSkills.length > 0) {
    missingRoleSkills.slice(0, 3).forEach(skill => {
      missingSkillsExplained.push({
        skill: skill,
        reason: "Highly expected keyword for standard ATS filtering algorithms for " + roleData.title + "."
      });
    });
  }
  
  // Rating Level texts
  let badgeText = "Needs Improvement";
  if (overallScore >= 80) badgeText = "Excellent";
  else if (overallScore >= 60) badgeText = "Good";
  
  return {
    finalScore: overallScore,
    badgeText,
    breakdown: {
      structure: Math.round(structureScore),
      impact: Math.round(impactScore),
      verbs: Math.round(verbScore),
      match: Math.round(matchScore)
    },
    roleRecommendations: topRoles,
    generatedSummary,
    strengths,
    weaknesses,
    techSkills: techSkillsDetected,
    softSkills: softSkillsDetected,
    missingSkillsExplained
  };
}

// 17. Render Data into UI Dashboard
function displayResults(data, roleKey) {
  const roleName = ROLE_DATABASE[roleKey].title;
  
  // A. Set radial progress
  scoreVal.textContent = data.finalScore;
  
  const maxOffset = 251.2;
  const offset = maxOffset - (data.finalScore / 100) * maxOffset;
  
  radialProgressBar.style.strokeDashoffset = maxOffset;
  radialProgressBar.className = "radial-progress"; // Reset classes
  
  let badgeClass = "weak";
  let headingText = "Needs Optimization";
  let summaryText = "Your resume requires core structural and keyword adjustments to bypass ATS screenings and secure interviews.";
  
  if (data.finalScore >= 80) {
    badgeClass = "strong";
    headingText = "Highly Compatible Resume!";
    summaryText = "Excellent formatting layout, strong quantified impact, and robust technology match for a " + roleName + " position.";
    radialProgressBar.classList.add('strong');
  } else if (data.finalScore >= 60) {
    badgeClass = "good";
    headingText = "Competitive Standings";
    summaryText = "Your resume is positioned well! Tapping into missing keywords and active verbs will elevate it further.";
    radialProgressBar.classList.add('good');
  } else {
    radialProgressBar.classList.add('weak');
  }
  
  scoreBadge.textContent = data.badgeText;
  scoreBadge.className = `score-badge ${badgeClass}`;
  scoreHeading.textContent = headingText;
  scoreSummary.textContent = summaryText;
  
  // SVG progress fill animation trigger
  void radialProgressBar.offsetWidth;
  radialProgressBar.style.strokeDashoffset = offset;
  
  // B. Fill breakdown indicators
  structurePercent.textContent = `${data.breakdown.structure}%`;
  structureFill.style.width = `${data.breakdown.structure}%`;
  
  impactPercent.textContent = `${data.breakdown.impact}%`;
  impactFill.style.width = `${data.breakdown.impact}%`;
  
  verbsPercent.textContent = `${data.breakdown.verbs}%`;
  verbsFill.style.width = `${data.breakdown.verbs}%`;
  
  matchPercent.textContent = `${data.breakdown.match}%`;
  matchFill.style.width = `${data.breakdown.match}%`;
  
  // C. Populate Recommended Roles Bars
  recommendedRolesContainer.innerHTML = '';
  data.roleRecommendations.forEach(role => {
    const item = document.createElement('div');
    item.className = 'recommended-role-item';
    item.innerHTML = `
      <div class="recommended-role-label">
        <span class="recommended-role-title">${role.title}</span>
        <span class="recommended-role-confidence">${role.confidence}% Match</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${role.confidence}%"></div>
      </div>
    `;
    recommendedRolesContainer.appendChild(item);
  });
  
  // D. Populate Suggestions summary
  generatedSummaryContent.textContent = data.generatedSummary;
  
  // E. Populate Strengths List
  listStrengths.innerHTML = '';
  data.strengths.forEach(str => {
    const li = document.createElement('li');
    li.textContent = str;
    listStrengths.appendChild(li);
  });
  
  // F. Populate Weaknesses & Improvements List
  listWeaknesses.innerHTML = '';
  if (data.weaknesses.length === 0) {
    const li = document.createElement('li');
    li.textContent = "No severe layout formatting weaknesses detected.";
    listWeaknesses.appendChild(li);
  } else {
    data.weaknesses.forEach(wk => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="weakness-item-content">
          <span class="weakness-title-line">${wk.title}</span>
          <span class="weakness-explain-line"><strong>Why:</strong> ${wk.explain}</span>
          <span class="weakness-fix-line"><strong>Fix:</strong> ${wk.fix}</span>
        </div>
      `;
      listWeaknesses.appendChild(li);
    });
  }
  
  // G. Populate Detected Skills Tags
  detectedTechSkills.innerHTML = '';
  if (data.techSkills.length === 0) {
    detectedTechSkills.innerHTML = '<span class="word-counter">No specific tech keywords identified.</span>';
  } else {
    data.techSkills.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'skill-tag';
      span.textContent = tag;
      detectedTechSkills.appendChild(span);
    });
  }
  
  detectedSoftSkills.innerHTML = '';
  if (data.softSkills.length === 0) {
    detectedSoftSkills.innerHTML = '<span class="word-counter">No specific soft skill keywords identified.</span>';
  } else {
    data.softSkills.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'skill-tag';
      span.textContent = tag;
      detectedSoftSkills.appendChild(span);
    });
  }
  
  // H. Populate Missing Skills Importance list
  listSkillsMissingExplained.innerHTML = '';
  if (data.missingSkillsExplained.length === 0) {
    const li = document.createElement('li');
    li.textContent = "Great! You have all the expected core skills for this role.";
    listSkillsMissingExplained.appendChild(li);
  } else {
    data.missingSkillsExplained.forEach(ms => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="missing-item-content">
          <span class="missing-title-line">${ms.skill}</span>
          <span class="missing-explain-line"><strong>Importance:</strong> ${ms.reason}</span>
        </div>
      `;
      listSkillsMissingExplained.appendChild(li);
    });
  }
}
