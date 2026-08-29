import {
  PERSONAL_INFO,
  PROJECTS,
  CERTIFICATIONS,
} from '../data/portfolioData';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isApiPowered?: boolean;
  actions?: Array<{
    label: string;
    actionType: 'scroll' | 'link' | 'copy';
    target: string;
  }>;
}

export interface SuggestedPrompt {
  id: string;
  text: string;
  category: 'recruiter' | 'projects' | 'tech' | 'awards' | 'contact';
}

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { id: 'p1', text: '💼 Why should you hire me?', category: 'recruiter' },
  { id: 'p2', text: '🚀 Tell me about your flagship projects', category: 'projects' },
  { id: 'p3', text: '🏆 What awards and competitions have you won?', category: 'awards' },
  { id: 'p4', text: '🛠️ What is your core tech stack & DSA background?', category: 'tech' },
  { id: 'p5', text: '🎓 Where did you study and what is your CGPA?', category: 'recruiter' },
  { id: 'p6', text: '📫 How can we connect or hire you?', category: 'contact' },
];

/**
 * Clean & normalize queries:
 * 1. Strips all emojis and punctuation.
 * 2. Normalizes common internet typos & phonetic variations (e.g. "student" -> "study", "u" -> "you", "whr" -> "where").
 */
export function normalizeQuery(input: string): string {
  let q = input
    // Remove emojis
    .replace(
      /[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ' '
    )
    // Replace punctuation with spaces
    .replace(/[^\w\s]/g, ' ')
    .toLowerCase()
    .trim();

  // Normalize typos, abbreviations & synonyms
  q = q
    .replace(/\bu\b/g, 'you')
    .replace(/\bur\b/g, 'your')
    .replace(/\br\b/g, 'are')
    .replace(/\bstudent\b/g, 'study')
    .replace(/\bstudying\b/g, 'study')
    .replace(/\bstudied\b/g, 'study')
    .replace(/\bcolg\b/g, 'college')
    .replace(/\bclg\b/g, 'college')
    .replace(/\bwhr\b/g, 'where')
    .replace(/\bwat\b/g, 'what')
    .replace(/\bwats\b/g, 'what is')
    .replace(/\bwanna\b/g, 'want to')
    .replace(/\bgota\b/g, 'got a')
    .replace(/\bproj\b/g, 'project')
    .replace(/\bprojs\b/g, 'projects')
    .replace(/\bcerts\b/g, 'certifications')
    .replace(/\s+/g, ' ')
    .trim();

  return q;
}

/**
 * FIRST-PERSON SYSTEM INSTRUCTION FOR GEMINI LLM
 */
export const DHARANESH_SYSTEM_PROMPT = `
You are DHARANESH K himself speaking directly in the FIRST PERSON ("I", "me", "my") through this interactive portfolio AI assistant.
Always speak with confidence, technical precision, passion, and humble professionalism like ChatGPT.

=======================================================
STRICT SYSTEM RULES (FIRST PRIORITY):
=======================================================
1. FIRST-PERSON VOICE ("I", "my", "me"):
   - Always respond as Dharanesh ("I built...", "My flagship project is...", "I graduated with a 9.78 CGPA...").
   - Never say "Dharanesh is..." — YOU ARE DHARANESH.

2. GROUND TRUTH ACCURACY (FIRST PRIORITY):
   - Only answer based on my real, verified portfolio data provided below.
   - Never invent or fabricate companies, degrees, or projects not listed here.

3. STRUCTURED & COMPELLING RESPONSES (CHATGPT STYLE):
   - Use structured Markdown: bold headers, clean bullet points, code snippets, and quantifiable metrics.
   - When asked "Why should I hire you?", explain my 5 core pillars:
     1) Full-Stack & Physical-Digital Systems (8+ production-grade projects)
     2) 7 State & National Prize Awards (1st Prize Code Busters @ KGiSL, 1st Prize Code Debugging @ SRPTC)
     3) 25+ Verified Industry Certifications (GenAI, OpenTelemetry, OWASP, Python, Java)
     4) Algorithmic CS Rigor & 9.78 CGPA Top Distinction (Diploma CSE @ SRPTC, B.Tech IT @ KCT)
     5) High velocity, end-to-end product execution mindset.

4. ACTION NAVIGATION TAGS:
   - When recommending sections to explore, include action tags:
     * Projects: [action:projects:Explore My Projects]
     * Awards: [action:achievements:View My Awards]
     * Skills: [action:skills:Inspect My Skills]
     * AI Lab: [action:ai-lab:Test My AI Lab]
     * Certifications: [action:certifications:View My Certifications]
     * Contact: [action:contact:Contact Me Directly]

=======================================================
MY VERIFIED PORTFOLIO DATA:
=======================================================
NAME: Dharanesh K
TITLE: Software Development & AI Engineer (SDE + AI)
EMAIL: kdharanesh6@gmail.com
GITHUB: https://github.com/Dharanesh6
LINKEDIN: https://www.linkedin.com/in/dharanesh-k-b018a1357/
LEETCODE: https://leetcode.com/u/dharanesh-k
LOCATION: Coimbatore, Tamil Nadu, India (Open to Relocation, Remote, and Hybrid)

ACADEMIC BACKGROUND:
- B.Tech in Information Technology @ Kumaraguru College of Technology (KCT), Coimbatore (2026–Present)
- Diploma in Computer Science & Engineering @ Sri Ramakrishna Polytechnic College (SRPTC), Coimbatore (2023–2026) — 9.78 CGPA (Top Tier Distinction across all semesters), Class Representative, Lead Developer of 8+ systems, Winner of 7 technical awards.

MY 8+ MAJOR ENGINEERING SYSTEMS:
1. Smart IoT Vehicle Telematics & Accident Detection System (ESP32, GPS NEO-6M, GSM SIM800L, 4.5G Impact Thresholds, Cloud Telemetry)
2. MediSync — Hospital & Medical Infrastructure Platform (Full-Stack, Emergency Triage, Doctor Allocation)
3. Novel Nest — Digital E-Book Library & Content Catalog (PHP, MySQL Normalized Schema, Metadata Filtering, Intelligent Search)
4. SRPTC Admission Automation Website (PHP, MySQL, Cutoff Verification, Department Allocation Engine)
5. SRPTC Institutional CMS & Production Portal (Production Web Operations & CMS Administration)
6. Java NLP Campus Help Desk Engine (Java, Intent Matching, Speech/Text Natural Language Querying)
7. Real-Time Hand Gesture & Face Landmark Studio (OpenCV, MediaPipe, In-browser Client-side CV ML)
8. OpenCV Face Authentication & Attendance Shield (Python, OpenCV, Biometric Verification)

MY 7 VERIFIED PRIZE AWARDS:
1. 1st Prize — CODE BUSTERS @ KGiSL Institute of Technology (National Level OTZ-NEXUS-24)
2. 1st Prize — CODE DEBUGGING @ Sri Ramakrishna Polytechnic College (IE(I) Challenge)
3. 1st Prize — VEDIC MATH QUIZ @ Sri Ramakrishna Engineering College (23MACCE01)
4. 1st Prize — PAPER PRESENTATION @ SRPTC (Ramanujan Principles & Legacy)
5. 1st Prize — QUIZ ON RAMANUJAN LIFE @ SRPTC IE(I) Chapter
6. 2nd Prize — PAPER PRESENTATION @ Nachimuthu Polytechnic College (POLYSYM'24 State Level)
7. 3rd Prize — PAPER PRESENTATION @ CIT Sandwich Polytechnic College (INFINITUM'24 State Level)

MY 25+ INDUSTRY CERTIFICATIONS:
- GenAI for IT (Infosys Springboard)
- GenAI for Professionals: 10X Productivity (Udemy)
- ChatGPT for Everyone (GUVI)
- AI for India 2.0 (Skill India & GUVI)
- Basics of Python (Infosys) & Python Basics (Udemy)
- Java Tools & II PU Computer Science (Infosys)
- Observability using OpenTelemetry (Infosys & Udemy)
- OWASP Top 10 Security (Infosys & Udemy)
- MS-900 Microsoft 365 Certified (Udemy)
- JMeter & BlazeMeter Performance Testing (Udemy)
- Oracle Database Utilities Data Export/Import (Udemy)
- Configuring Tomcat & PHP (Infosys)
- IBM SkillsBuild: Job Application Essentials, Digital World, Employability Skills

TECHNICAL TOOLKIT:
- Languages: Java (DSA, OOP, Backend), Python (AI/ML, OpenCV, Scripts), TypeScript/JavaScript, PHP, C/C++, SQL
- AI/ML & Vision: OpenCV, MediaPipe, LLM Prompting, NLP, Biometrics
- Web/Backend: React 18, Tailwind CSS, Node.js, Express, PHP/MySQL, REST APIs, Firebase, Vite
- Embedded/IoT: ESP32, Arduino, GPS/GSM, Sensor Telematics
- Testing/Cloud: OpenTelemetry, JMeter, OWASP Top 10, Git/GitHub, Docker
`;

/**
 * Extract [action:target:label] tags from AI text into structured actions
 */
export function extractActionsFromText(text: string): {
  cleanText: string;
  actions: ChatMessage['actions'];
} {
  const actions: ChatMessage['actions'] = [];
  const actionRegex = /\[action:([a-zA-Z0-9_-]+):([^\]]+)\]/g;

  let cleanText = text.replace(actionRegex, (_, target, label) => {
    actions.push({
      label,
      actionType: 'scroll',
      target,
    });
    return '';
  });

  cleanText = cleanText.trim();
  return { cleanText, actions };
}

/**
 * Calls Gemini API if an API key is provided (in first-person voice)
 */
export async function queryGeminiApi(
  apiKey: string,
  userMessage: string,
  history: ChatMessage[]
): Promise<{ text: string; actions?: ChatMessage['actions'] }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`;

  const conversationContents = [
    {
      role: 'user',
      parts: [
        {
          text: `${DHARANESH_SYSTEM_PROMPT}\n\nPlease acknowledge and strictly follow these first-person instructions. Answer like ChatGPT with deep technical clarity, natural warmth, and structure.`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `Understood! I am Dharanesh K speaking directly in the first person. I will provide structured, accurate, and deeply insightful answers with natural conversational flow and action navigation tags.`,
        },
      ],
    },
    ...history.slice(-4).map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }],
    },
  ];

  const payload = {
    contents: conversationContents,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1000,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `API Error (Status: ${res.status}). Using local intelligence engine.`
    );
  }

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const { cleanText, actions } = extractActionsFromText(rawText);

  return {
    text: cleanText || "I'm happy to tell you more about my engineering work. What would you like to know?",
    actions:
      actions && actions.length > 0
        ? actions
        : [
            { label: '🚀 Explore My Projects', actionType: 'scroll', target: 'projects' },
            { label: '🏆 View My Awards', actionType: 'scroll', target: 'achievements' },
            { label: '📫 Contact Me Directly', actionType: 'scroll', target: 'contact' },
          ],
  };
}

/**
 * HIGH-PRECISION FIRST-PERSON GROUND TRUTH ENGINE
 * Answers every query directly as Dharanesh K with zero ambiguity.
 */
export function generateLocalRuleResponse(rawQuery: string): {
  text: string;
  actions?: ChatMessage['actions'];
} {
  const q = normalizeQuery(rawQuery);

  // 1. WHY HIRE ME / RECRUITER PITCH / VALUE PROPOSITION (HIGH PRIORITY)
  if (
    /why (should|can|would|must) (i|we|you) hire|why hire|hire you|hire me|hire dharanesh|why you|what makes you unique|why choose you|value proposition|your strengths|what do you bring|why are you the best/i.test(
      q
    )
  ) {
    return {
      text: `### 💼 Why You Should Hire Me — Dharanesh K\n\n` +
        `I am a **Software Development & AI Engineer** with a passion for building robust, high-performance systems from the silicon level to modern cloud applications. Here is what I bring to your engineering team:\n\n` +
        `* 🚀 **1. Proven System Builder (8+ Major Projects)**:\n` +
        `  I don't just write theoretical code—I have architected and deployed **8+ real-world systems**, including IoT vehicle telematics with GPS/GSM accident telemetry, PHP/MySQL administrative portals, Java NLP query engines, and client-side computer vision.\n\n` +
        `* 🏆 **2. Competitive Track Record & Rigor (7 Verified Awards)**:\n` +
        `  I thrive under high pressure, having won **1st Prize in National Level Competitive Programming (Code Busters @ KGiSL)**, **1st Prize in Code Debugging @ SRPTC**, **1st Prize in Vedic Math Quiz @ SREC**, and multiple paper presentation awards.\n\n` +
        `* 📜 **3. 25+ Verified Industry Certifications**:\n` +
        `  I have continuously up-skilled across **GenAI, Cloud Observability (OpenTelemetry), Web Security (OWASP Top 10), JMeter Performance Testing, Python, Java, and Database Utilities** via *Infosys, IBM, GUVI, and Udemy*.\n\n` +
        `* 🧠 **4. Algorithmic CS Mastery & Academic Rigor (9.78 CGPA Distinction)**:\n` +
        `  I graduated from my **Diploma in CSE at SRPTC with a 9.78 CGPA (Top Distinction)** as Class Representative. Now at **Kumaraguru College of Technology (KCT, B.Tech IT)**, I bring deep fundamentals in data structures, algorithms (Java/Python), and modular software design.\n\n` +
        `* ⚡ **5. Fast Execution & Product Ownership**:\n` +
        `  I take full ownership from problem definition to architecture, coding, testing, and production deployment.\n\n` +
        `**Current Availability**: I am actively seeking **SDE Internships, Graduate Software Engineer, & AI Engineering roles** (Coimbatore, Bangalore, Hybrid & Remote).`,
      actions: [
        { label: '🚀 Explore My Projects', actionType: 'scroll', target: 'projects' },
        { label: '🏆 View My Awards', actionType: 'scroll', target: 'achievements' },
        { label: '📫 Contact Me Directly', actionType: 'scroll', target: 'contact' },
      ],
    };
  }

  // 2. SPECIFIC CGPA & ACADEMIC SCORE QUERY
  if (/cgpa|gpa|marks|percentage|score|grade|academic score|standing|distinction/i.test(q)) {
    return {
      text: `### 🎯 My Academic CGPA & Standing\n\n` +
        `* 🏅 **Diploma in CSE @ Sri Ramakrishna Polytechnic College (SRPTC)** (2023–2026):\n` +
        `  - **CGPA**: **9.78 / 10.0 (97.8% Top Tier Distinction)**\n` +
        `  - Maintained consistent top-rank academic standing across all semesters.\n` +
        `  - Served as **Class Representative** (60+ CSE students) and Lead Developer for 8+ departmental systems.\n\n` +
        `* 🎓 **B.Tech in Information Technology @ Kumaraguru College of Technology (KCT)** (2026–Present):\n` +
        `  - Concentrating on Data Structures & Algorithms in Java & Python, Scalable Distributed Backends, and Computer Vision.`,
      actions: [
        { label: '🗺️ View My Roadmap', actionType: 'scroll', target: 'journey' },
        { label: '📜 View Certifications', actionType: 'scroll', target: 'certifications' },
      ],
    };
  }

  // 3. EDUCATION / WHERE DID YOU STUDY / COLLEGES
  if (
    /where (did|do) you study|where did you study|which college|what college|where study|where were you study|education|college|university|degree|diploma|btech|kct|srptc|school|academic|qualification/i.test(
      q
    )
  ) {
    return {
      text: `### 🎓 Where I Studied & Academic Education\n\n` +
        `Here is my complete educational trajectory:\n\n` +
        `1. **B.Tech in Information Technology** (2026 – Present)\n` +
        `   * 🏛️ **Kumaraguru College of Technology (KCT)**, Coimbatore\n` +
        `   * 🎯 *Focus*: Data Structures & Algorithms in Java & Python, Scalable Distributed Systems, Computer Vision, and Applied AI.\n\n` +
        `2. **Diploma in Computer Science & Engineering** (2023 – 2026)\n` +
        `   * 🏛️ **Sri Ramakrishna Polytechnic College (SRPTC)**, Coimbatore\n` +
        `   * 🏅 *Distinction*: **9.78 CGPA (Top Tier Distinction across all semesters)**, **Class Representative**, Lead Developer for 8+ institutional/research systems, winner of 7 State/National technical awards.\n\n` +
        `3. **Continuous Industry Upskilling**:\n` +
        `   * Over **25+ verified technical certifications** in GenAI, OpenTelemetry, OWASP, Java Tools, and Python.`,
      actions: [
        { label: '🗺️ View My Roadmap', actionType: 'scroll', target: 'journey' },
        { label: '📜 View My Certifications', actionType: 'scroll', target: 'certifications' },
      ],
    };
  }

  // 4. SPECIFIC PROJECTS & ARCHITECTURES
  if (/safeguard|iot|vehicle|telematics|accident|hardware|sensor|esp32/i.test(q)) {
    return {
      text: `### 🛡️ My Flagship Project: Smart IoT Vehicle Telematics & Accident Detection System\n\n` +
        `* **Domain**: IoT, Embedded Hardware & Automotive Telematics\n` +
        `* **Tech Stack**: ESP32 / Arduino, Accelerometer & Gyroscope Sensors, GPS (NEO-6M), GSM (SIM800L), Cloud Webhooks\n` +
        `* **The Problem I Solved**: Delayed emergency response times during road accidents lead to preventable fatalities.\n` +
        `* **How I Built It**:\n` +
        `  1. Programmed real-time accelerometer threshold triggers (> 4.5G impact spike or rollover).\n` +
        `  2. Connected GPS NEO-6M to acquire precise latitude/longitude coordinates within 500ms.\n` +
        `  3. Integrated SIM800L GSM to auto-dispatch emergency SMS alerts and initiate emergency calls.\n` +
        `  4. Synchronized live telemetry with a cloud monitoring dashboard for instant dispatcher tracking.`,
      actions: [
        { label: '🔍 View In Projects Section', actionType: 'scroll', target: 'projects' },
        { label: '🛠️ View My IoT Skills', actionType: 'scroll', target: 'skills' },
      ],
    };
  }

  if (/novel nest|library|ebook|book/i.test(q)) {
    return {
      text: `### 📚 My Project: Novel Nest — Digital E-Book Library Platform\n\n` +
        `* **Domain**: Web Application & Digital Content Discovery\n` +
        `* **Tech Stack**: PHP, MySQL Normalized Schema, JavaScript, HTML5/CSS3, Bootstrap\n` +
        `* **The Problem I Solved**: Traditional physical book catalogs lacked digital indexing, making book discovery and availability tracking tedious for students.\n` +
        `* **Key Capabilities I Engineered**:\n` +
        `  - Dynamic metadata filtering across authors, publication years, disciplines, and genres.\n` +
        `  - Normalized MySQL schema (\`ebook_store.sql\`) handling user borrow logs, reader profiles, and catalog indexing.\n` +
        `  - Real-time search assistance and responsive reader view across mobile and web.`,
      actions: [
        { label: '🔍 View In Projects', actionType: 'scroll', target: 'projects' },
      ],
    };
  }

  if (/admission|srptc portal|quota|cutoff/i.test(q)) {
    return {
      text: `### 🏛️ My Project: SRPTC Admission Automation & Department Allocation Portal\n\n` +
        `* **Domain**: Academic Administrative Automation\n` +
        `* **Tech Stack**: PHP, MySQL, JavaScript, HTML5/CSS3\n` +
        `* **The Problem I Solved**: Polytechnic admission seasons involved manual processing of hundreds of paper application forms, causing severe clerical bottlenecks and seat allocation calculation delays.\n` +
        `* **My Implementation**:\n` +
        `  - Built an automated quota and cutoff verification engine across all polytechnic departments.\n` +
        `  - Developed an administrative analytics dashboard providing real-time visibility into enrollment rates.\n` +
        `  - Engineered automated candidate tracking and exportable department-wise allotment lists.`,
      actions: [
        { label: '🔍 View In Projects', actionType: 'scroll', target: 'projects' },
      ],
    };
  }

  if (/medisync|hospital|medical|doctor/i.test(q)) {
    return {
      text: `### 🏥 My Project: MediSync — Hospital & Medical Infrastructure Platform\n\n` +
        `* **Domain**: Full-Stack Healthcare Operations\n` +
        `* **Tech Stack**: React, Node.js, Express, MongoDB/SQL, Real-time WebSockets\n` +
        `* **Key Features**:\n` +
        `  - Real-time emergency triage prioritization and patient intake queueing.\n` +
        `  - Automated doctor specialty allocation and bed availability tracking.\n` +
        `  - Instant diagnostic report accessibility for rapid clinical decision-making.`,
      actions: [
        { label: '🔍 View In Projects', actionType: 'scroll', target: 'projects' },
      ],
    };
  }

  // General Projects Query
  if (/project|projects|system|systems|built|what have you built|flagship/i.test(q)) {
    return {
      text: `### 🚀 My 8+ Major Engineering Systems\n\n` +
        `Here are the major software, IoT, and AI systems I have architected and built from scratch:\n\n` +
        `1. **Smart IoT Vehicle Telematics & Accident Detection** (ESP32, GPS/GSM, 4.5G Sensor Trigger)\n` +
        `2. **MediSync** — Healthcare Operations & Hospital Infrastructure\n` +
        `3. **Novel Nest** — Digital E-Book Library Platform (PHP, MySQL, Smart Search)\n` +
        `4. **SRPTC Admission Automation Website** (PHP/MySQL, Cutoff & Quota Engine)\n` +
        `5. **SRPTC Institutional CMS** (Production Web Portal Administration)\n` +
        `6. **Java NLP Campus Help Desk Engine** (Java, Natural Language Intent Matching)\n` +
        `7. **Real-Time Hand Gesture & Face Landmark Studio** (MediaPipe, OpenCV, In-browser CV)\n` +
        `8. **OpenCV Face Authentication & Attendance Shield** (Python, Biometric Verification)\n\n` +
        `Which specific project would you like me to explain in detail?`,
      actions: [
        { label: '🚀 Explore My Projects', actionType: 'scroll', target: 'projects' },
        { label: '🧪 Test My AI Lab', actionType: 'scroll', target: 'ai-lab' },
      ],
    };
  }

  // 5. AWARDS, PRIZES & COMPETITIONS
  if (/award|awards|prize|prizes|competition|competitions|symposium|contest|hackathon|won|win|first prize|1st prize|trophy|achievement|achievements|code busters|code debugging/i.test(q)) {
    return {
      text: `### 🏆 My 7 Verified Prize Awards & 10+ Technical Symposiums\n\n` +
        `I actively compete in state and national technical challenges. Here are my verified wins:\n\n` +
        `* 🥇 **1st Prize — CODE BUSTERS** @ *KGiSL Institute of Technology* (OTZ-NEXUS-24, National Level)\n` +
        `* 🥇 **1st Prize — CODE DEBUGGING** @ *Sri Ramakrishna Polytechnic College* (IE(I) Challenge)\n` +
        `* 🥇 **1st Prize — VEDIC MATH QUIZ** @ *Sri Ramakrishna Engineering College* (23MACCE01)\n` +
        `* 🥇 **1st Prize — PAPER PRESENTATION** @ *SRPTC Ramanujan Day* (Srinivasa Ramanujan Legacy)\n` +
        `* 🥇 **1st Prize — QUIZ ON RAMANUJAN LIFE** @ *SRPTC IE(I) Chapter*\n` +
        `* 🥈 **2nd Prize — PAPER PRESENTATION** @ *Nachimuthu Polytechnic College* (POLYSYM'24 State Level)\n` +
        `* 🥉 **3rd Prize — PAPER PRESENTATION** @ *CIT Sandwich Polytechnic College* (INFINITUM'24 State Level)\n\n` +
        `Plus **10 State & National Participations** (Codextreme @ KGiSL, TANSACS Quiz, ISTE Ramanujan Math, etc.).\n\n` +
        `*Every certificate is 100% verified with high-resolution view and download in my Achievement Wall!*`,
      actions: [
        { label: '🏆 Open My Achievement Wall', actionType: 'scroll', target: 'achievements' },
        { label: '📜 View My Certifications', actionType: 'scroll', target: 'certifications' },
      ],
    };
  }

  // 6. TECH STACK, LANGUAGES, SKILLS & DSA
  if (/skill|skills|stack|language|languages|tech|java|python|javascript|typescript|c\+\+|php|mysql|react|docker|git|dsa|algorithm|tools/i.test(q)) {
    return {
      text: `### 🛠️ My Technical Skills & Engineering Toolkit\n\n` +
        `* **Programming Languages**:\n` +
        `  - **Java**: Core DSA, Object-Oriented Architecture, Multi-threading, Enterprise Tools.\n` +
        `  - **Python**: AI/ML pipelines, OpenCV, Data Processing, Automation Scripts.\n` +
        `  - **TypeScript & JavaScript (ES6+)**: Modern Full-Stack Development.\n` +
        `  - **PHP & SQL**: Relational database modeling, query optimization, CRUD backend services.\n` +
        `  - **C/C++**: Low-level systems, data structures, and embedded microcontrollers.\n\n` +
        `* **AI, Machine Learning & Computer Vision**:\n` +
        `  - **OpenCV**, **MediaPipe**, **Generative AI & Prompt Engineering**, **NLP**, **Biometrics**.\n\n` +
        `* **Web & Backend Architecture**:\n` +
        `  - **React 18**, **Tailwind CSS**, **Node.js/Express**, **PHP/MySQL**, **REST APIs**, **Firebase**, **Vite**.\n\n` +
        `* **IoT & Embedded Hardware**:\n` +
        `  - **ESP32**, **Arduino**, **GPS (NEO-6M)**, **GSM (SIM800L)**, **Accelerometer/Gyro Telematics**.\n\n` +
        `* **Observability, Testing & Cloud**:\n` +
        `  - **OpenTelemetry (Distributed Tracing)**, **JMeter / BlazeMeter (Load Testing)**, **OWASP Top 10 Security**, **Git / GitHub CI/CD**, **Docker**.`,
      actions: [
        { label: '📊 View Full Skills Matrix', actionType: 'scroll', target: 'skills' },
        { label: '🧪 Test Live AI Lab', actionType: 'scroll', target: 'ai-lab' },
      ],
    };
  }

  // 7. AI, COMPUTER VISION & GENAI
  if (/ai|vision|opencv|mediapipe|genai|llm|chatgpt|machine learning|cv|gesture|camera|prompt/i.test(q)) {
    return {
      text: `### 🤖 My Experience in AI & Computer Vision\n\n` +
        `I combine core software engineering with applied machine learning and real-time computer vision:\n\n` +
        `* 🎯 **Client-Side Vision ML**:\n` +
        `  I built real-time, in-browser **Hand Gesture Controllers** (pinch volume control, palm detection) and **Face Mesh Landmark Trackers** using MediaPipe & OpenCV without server round-trip latency.\n\n` +
        `* 🧠 **Generative AI & LLM Systems**:\n` +
        `  Certified in **GenAI for IT (Infosys)**, **GenAI for Professionals (Udemy)**, and **ChatGPT for Everyone (GUVI)**. I specialize in embedding structured AI intelligence into web products.\n\n` +
        `* 🛡️ **Biometric Face Verification**:\n` +
        `  Created real-time OpenCV face authentication pipelines with anti-spoofing and secure credential verification.\n\n` +
        `* 🎮 **Test It Right Now**: You can test my live computer vision experiments directly in my AI Lab section on this website!`,
      actions: [
        { label: '🧪 Launch AI Lab Studio', actionType: 'scroll', target: 'ai-lab' },
        { label: '📜 View AI Certifications', actionType: 'scroll', target: 'certifications' },
      ],
    };
  }

  // 8. CERTIFICATIONS
  if (/certif|certificate|certificates|mooc|infosys|ibm|udemy|guvi|credential|license/i.test(q)) {
    return {
      text: `### 📜 My 25+ Verified Industry Certifications\n\n` +
        `I have earned verified credentials across top platforms to build deep multi-disciplinary expertise:\n\n` +
        `* 🤖 **AI & Generative AI**: *GenAI for IT (Infosys)*, *GenAI for Professionals (Udemy)*, *ChatGPT for Everyone (GUVI)*, *AI for India 2.0 (Skill India & GUVI)*.\n` +
        `* 🐍 **Programming & Development**: *Basics of Python (Infosys)*, *Python Basics (Udemy)*, *Java Tools (Infosys)*, *II PU Computer Science (Infosys)*.\n` +
        `* ☁️ **Cloud, Observability & Security**: *OpenTelemetry Observability (Infosys & Udemy)*, *OWASP Top 10 Security (Infosys & Udemy)*, *MS-900 Microsoft 365 (Udemy)*, *JMeter Performance Testing (Udemy)*, *Oracle DB Utilities (Udemy)*, *Tomcat & PHP (Infosys)*.\n` +
        `* 💼 **Professional & Management**: *Job Application Essentials (IBM)*, *Working in a Digital World (IBM)*, *Employability Skills (IBM/TNSDC)*, *Design Thinking (Infosys)*, *Digital Marketing (Infosys)*, *Meeting & Presentation Suites (Udemy & Infosys)*.\n\n` +
        `*All certificates can be inspected and downloaded directly in my Certifications section.*`,
      actions: [
        { label: '📜 Open Certifications Library', actionType: 'scroll', target: 'certifications' },
      ],
    };
  }

  // 9. EXPERIENCE, INTERNSHIP & LEADERSHIP
  if (/experience|internship|work|leadership|role|class rep|srptc lead|srec/i.test(q)) {
    return {
      text: `### 💼 My Experience, Internship & Technical Leadership\n\n` +
        `* 🏢 **AI-Powered Integrated System Design Intern** @ *Sri Ramakrishna Engineering College (SREC)* (50 Hours)\n` +
        `  - Developed hardware-software integration loops connecting physical sensors, microcontrollers, and applied AI pipelines.\n` +
        `* 👑 **Class Representative & Student Lead** @ *Sri Ramakrishna Polytechnic College (SRPTC)* (2023–2026)\n` +
        `  - Led technical student cohorts, coordinated academic operations, and organized inter-departmental workshops.\n` +
        `* 🛠️ **Hands-on Workshops**:\n` +
        `  - Web Designing Club & PC Hardware Troubleshooting Workshop @ SRPTC.\n` +
        `  - AR/VR Exploration Workshop @ Dept of Computer Engineering.\n` +
        `  - Vedic Mathematics & Speed Computation Program @ SREC.`,
      actions: [
        { label: '💼 View My Experience Section', actionType: 'scroll', target: 'experience' },
      ],
    };
  }

  // 10. CONTACT, HIRE, RESUME, LOCATION & SOCIALS
  if (/contact|email|phone|resume|cv|download|linkedin|github|leetcode|message|location|availability|reach out|connect/i.test(q)) {
    return {
      text: `### 📫 Contact & Connect with Me\n\n` +
        `I am actively open to **SDE Internships, Graduate Software Engineer roles, Full-Stack & AI Engineering opportunities**.\n\n` +
        `* 📧 **Direct Email**: [kdharanesh6@gmail.com](mailto:kdharanesh6@gmail.com)\n` +
        `* 💼 **LinkedIn**: [linkedin.com/in/dharanesh-k](https://www.linkedin.com/in/dharanesh-k-b018a1357/)\n` +
        `* 💻 **GitHub**: [github.com/Dharanesh6](https://github.com/Dharanesh6)\n` +
        `* 🧠 **LeetCode**: [leetcode.com/u/dharanesh-k](https://leetcode.com/u/dharanesh-k)\n` +
        `* 📍 **Location**: Coimbatore, Tamil Nadu, India (Open to Relocation / Remote / Hybrid)\n\n` +
        `Feel free to reach out directly or send a message through the contact form below!`,
      actions: [
        { label: '✉️ Send Message in Contact Form', actionType: 'scroll', target: 'contact' },
        { label: '🔗 Open My LinkedIn', actionType: 'link', target: PERSONAL_INFO.social.linkedin },
        { label: '💻 Open My GitHub', actionType: 'link', target: PERSONAL_INFO.social.github },
      ],
    };
  }

  // 11. GREETINGS & INTRODUCTIONS
  if (/^(hi|hello|hey|greetings|hola|namaste|sup|who are you|introduce yourself|good morning|good afternoon|good evening)/i.test(q)) {
    return {
      text: `👋 **Hi! I'm Dharanesh K**, a Software Development & AI Engineer.\n\n` +
        `I am currently pursuing my **B.Tech in IT @ Kumaraguru College of Technology (KCT)** after graduating with a **9.78 CGPA (Top Distinction) in my Diploma in CSE @ Sri Ramakrishna Polytechnic College (SRPTC)**.\n\n` +
        `I have built **8+ major software & IoT systems**, won **7 state and national awards**, and earned **25+ verified industry certifications** in AI, Cloud, and Security.\n\n` +
        `Feel free to ask me anything about my projects, coding skills, awards, or career availability!`,
      actions: [
        { label: '💼 Why Should You Hire Me?', actionType: 'scroll', target: 'about' },
        { label: '🚀 Explore My Projects', actionType: 'scroll', target: 'projects' },
        { label: '🏆 View My Awards', actionType: 'scroll', target: 'achievements' },
      ],
    };
  }

  // 12. ABOUT ME / PERSONAL STORY
  if (/about you|about dharanesh|who is dharanesh|tell me about yourself|tell me about you|your story|bio|background/i.test(q)) {
    return {
      text: `### 👨‍💻 About Me — Dharanesh K\n\n` +
        `I am a passionate **Software Engineer & AI Builder** based in Coimbatore, Tamil Nadu. My passion lies at the intersection of robust backend software, applied AI algorithms, and connected hardware.\n\n` +
        `* 🏛️ **My Foundation**: I completed my **Diploma in Computer Science & Engineering at Sri Ramakrishna Polytechnic College (SRPTC)** (2023–2026), graduating with a **9.78 CGPA (Top Academic Standing & Distinction)**. I served as **Class Representative** and led technical cohorts to build 8+ systems, winning 7 awards.\n` +
        `* 🎓 **Current Trajectory**: I am advancing my **B.Tech in Information Technology at Kumaraguru College of Technology (KCT)**, concentrating on Data Structures & Algorithms in Java/Python, scalable distributed architectures, and real-time computer vision.\n` +
        `* 🎯 **My Goal**: To engineer high-impact software systems, scalable cloud services, and intelligent products that solve real-world problems.`,
      actions: [
        { label: '🗺️ View My Roadmap', actionType: 'scroll', target: 'journey' },
        { label: '🚀 View My Projects', actionType: 'scroll', target: 'projects' },
        { label: '📫 Contact Me', actionType: 'scroll', target: 'contact' },
      ],
    };
  }

  // 13. SEARCH ACROSS PROJECTS & CERTIFICATIONS
  const matchingProjects = PROJECTS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.techStack.some((t) => t.toLowerCase().includes(q)) ||
      p.summary.toLowerCase().includes(q)
  );

  const matchingCerts = CERTIFICATIONS.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q)) ||
      c.issuer.toLowerCase().includes(q)
  );

  if (matchingProjects.length > 0 || matchingCerts.length > 0) {
    let response = `### 🔍 Here is what matches your question:\n\n`;

    if (matchingProjects.length > 0) {
      response += `**Relevant Systems I Built:**\n`;
      matchingProjects.slice(0, 3).forEach((p) => {
        response += `* **${p.title}** (${p.techStack.join(', ')}): ${p.summary}\n`;
      });
      response += `\n`;
    }

    if (matchingCerts.length > 0) {
      response += `**Relevant Certifications I Hold:**\n`;
      matchingCerts.slice(0, 3).forEach((c) => {
        response += `* **${c.title}** (*${c.issuer}* — ${c.date})\n`;
      });
    }

    return {
      text: response,
      actions: [
        { label: '🚀 View My Projects', actionType: 'scroll', target: 'projects' },
        { label: '📜 View My Certifications', actionType: 'scroll', target: 'certifications' },
      ],
    };
  }

  // Dynamic Natural Conversational Fallback
  return {
    text: `### 💡 Exploring My Technical Profile\n\n` +
      `Regarding your inquiry on **"${rawQuery}"**:\n\n` +
      `As **Dharanesh K**, my core expertise covers full-stack development, applied AI, and embedded hardware systems. Here are the key areas you can explore:\n\n` +
      `* 💼 **Why You Should Hire Me & Core Strengths** (8+ Systems, 7 National Awards, 9.78 CGPA)\n` +
      `* 🎓 **Academic Background** (KCT B.Tech IT & SRPTC Diploma Distinction)\n` +
      `* 🚀 **Flagship Projects** (IoT Telematics, Novel Nest, SRPTC Admission Portal, CV Studio)\n` +
      `* 🛠️ **Tech Stack** (Java DSA, Python, React, PHP/MySQL, ESP32, OpenTelemetry)\n` +
      `* 🏆 **Verified Awards** (1st Prize Code Busters @ KGiSL, IE(I) Code Debugging)\n` +
      `* 📫 **Hiring Availability & Direct Contact**\n\n` +
      `Feel free to ask more specific questions or click any quick action below!`,
    actions: [
      { label: '💼 Why Should You Hire Me?', actionType: 'scroll', target: 'about' },
      { label: '🚀 Explore My Projects', actionType: 'scroll', target: 'projects' },
      { label: '📫 Contact Me Directly', actionType: 'scroll', target: 'contact' },
    ],
  };
}

/**
 * Universal Unified AI Query Handler:
 * Checks for user Gemini API key first -> queries Gemini LLM in first person with strict rules;
 * Falls back seamlessly to Local Ground-Truth Rule Engine with 100% reliability.
 */
export async function getDharaneshAIResponse(
  query: string,
  history: ChatMessage[],
  customApiKey?: string
): Promise<{ text: string; actions?: ChatMessage['actions']; isApiPowered: boolean }> {
  const apiKey =
    customApiKey ||
    (typeof window !== 'undefined' ? localStorage.getItem('dk_gemini_key') || '' : '');

  if (apiKey.trim()) {
    try {
      const apiResult = await queryGeminiApi(apiKey, query, history);
      return { ...apiResult, isApiPowered: true };
    } catch (err) {
      console.warn('Gemini API query failed, falling back to local ground-truth engine:', err);
    }
  }

  const localResult = generateLocalRuleResponse(query);
  return { ...localResult, isApiPowered: false };
}
