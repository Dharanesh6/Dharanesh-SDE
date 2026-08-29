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
  actions?: Array<{
    label: string;
    actionType: 'scroll' | 'link' | 'copy';
    target: string;
    icon?: string;
  }>;
}

export interface SuggestedPrompt {
  id: string;
  text: string;
  category: 'recruiter' | 'projects' | 'tech' | 'awards' | 'contact';
}

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { id: 'p1', text: '💼 Give me a 60-second recruiter summary', category: 'recruiter' },
  { id: 'p2', text: '🚀 Tell me about your Top Flagship Projects', category: 'projects' },
  { id: 'p3', text: '🏆 What National & State Awards have you won?', category: 'awards' },
  { id: 'p4', text: '🛠️ What is your core Tech Stack & Languages?', category: 'tech' },
  { id: 'p5', text: '🤖 What is your experience in GenAI & Computer Vision?', category: 'tech' },
  { id: 'p6', text: '📫 How can I contact or hire Dharanesh?', category: 'contact' },
];

/**
 * Intelligent client-side AI response generator for Dharanesh's portfolio
 */
export function generateAIResponse(query: string): {
  text: string;
  actions?: ChatMessage['actions'];
} {
  const q = query.toLowerCase().trim();

  // 1. GREETINGS & CASUAL INTROS
  if (/^(hi|hello|hey|greetings|hola|namaste|sup|who are you|what can you do)/i.test(q)) {
    return {
      text: `👋 **Hello! I'm Dharanesh AI**, the intelligent portfolio assistant for **Dharanesh K**.\n\nI can answer anything about Dharanesh's **software architecture, 8+ major projects, 7 national/state prize awards, 25+ verified AI/Cloud certifications, tech stack (Java, Python, IoT, React, PHP, SQL)**, or his availability for **SDE & AI Engineering roles**!\n\nHow can I help you today? You can ask freely or click any suggestion below!`,
      actions: [
        { label: '💼 Recruiter Pitch', actionType: 'scroll', target: 'about' },
        { label: '🚀 Explore Projects', actionType: 'scroll', target: 'projects' },
        { label: '🏆 View Awards', actionType: 'scroll', target: 'achievements' },
      ],
    };
  }

  // 2. RECRUITER / WHY HIRE / SUMMARY / ABOUT DHARANESH
  if (
    /recruiter|why hire|summary|overview|profile|pitch|background|who is dharanesh|tell me about yourself|strengths/i.test(
      q
    )
  ) {
    return {
      text: `### 💼 Executive Recruiter Summary — Dharanesh K\n\n` +
        `Dharanesh is a high-velocity **Software Development & AI Engineer** currently pursuing **B.Tech in IT at Kumaraguru College of Technology (KCT)** after graduating with distinction in **Diploma in CSE from Sri Ramakrishna Polytechnic College (SRPTC)**.\n\n` +
        `**Key Highlights for Hiring Managers:**\n` +
        `* 🚀 **Full-Stack & Systems Builder**: Engineered **8+ production-grade systems** spanning IoT hardware telematics, Java NLP query engines, PHP/MySQL administrative portals, and client-side Computer Vision.\n` +
        `* 🏆 **Track Record of Excellence**: Clinched **7 Verified 1st/2nd/3rd Prize Awards** in competitive programming (*1st Prize Code Busters @ KGiSL*), code debugging (*1st Prize @ SRPTC*), and technical paper presentations.\n` +
        `* 📜 **25+ Industry Certifications**: Verified credentials in **GenAI, Cloud Observability (OpenTelemetry), OWASP Security, Python, Java, Oracle DB**, and Management from *Infosys, IBM, GUVI, and Udemy*.\n` +
        `* 🎯 **Foundational Rigor**: Strong algorithmic mastery (DSA in Java & Python) with end-to-end product execution skills from embedded firmware to cloud services.\n\n` +
        `**Availability**: Open for **SDE Internships, Graduate Engineering Roles, & AI Engineering Positions** (Coimbatore, Bangalore, Hybrid & Remote).`,
      actions: [
        { label: '📄 Contact & Connect', actionType: 'scroll', target: 'contact' },
        { label: '🚀 View Major Projects', actionType: 'scroll', target: 'projects' },
        { label: '🏆 Inspect Certificates', actionType: 'scroll', target: 'achievements' },
      ],
    };
  }

  // 3. EDUCATION & ACADEMIC TRAJECTORY
  if (/education|college|university|degree|diploma|b\.?tech|kct|srptc|school|study|cgpa|academic/i.test(q)) {
    return {
      text: `### 🎓 Academic Trajectory & Institutions\n\n` +
        `Dharanesh's computer science foundation combines practical engineering with theoretical rigor:\n\n` +
        `1. **B.Tech in Information Technology** (2026 – Present)\n` +
        `   * 🏛️ **Kumaraguru College of Technology (KCT)**, Coimbatore\n` +
        `   * 🎯 *Focus*: Data Structures & Algorithms (Java/Python), Scalable Distributed Systems, Computer Vision, and Applied AI.\n\n` +
        `2. **Diploma in Computer Science & Engineering** (2023 – 2026)\n` +
        `   * 🏛️ **Sri Ramakrishna Polytechnic College (SRPTC)**, Coimbatore\n` +
        `   * 🏅 *Distinction*: Top academic rank, **Class Representative**, Lead Developer for 8+ institutional and research systems, and winner of 7 State/National technical awards.\n\n` +
        `3. **Industry Up-skilling & Certifications**:\n` +
        `   * Over **25+ specialized technical certifications** in GenAI, OpenTelemetry, OWASP, Java Tools, and Python.`,
      actions: [
        { label: '🗺️ View Roadmap', actionType: 'scroll', target: 'journey' },
        { label: '📜 View Certifications', actionType: 'scroll', target: 'certifications' },
      ],
    };
  }

  // 4. PROJECTS / IOT / TELEMATICS / NOVEL NEST / ADMISSION PORTAL
  if (/project|iot|safeguard|telematics|vehicle|novel nest|admission|medisync|cms|system|built|portfolio/i.test(q)) {
    if (/safeguard|iot|vehicle|telematics|accident|hardware/i.test(q)) {
      return {
        text: `### 🛡️ Smart IoT Vehicle Telematics & Accident Detection System\n\n` +
          `* **Domain**: IoT & Embedded Automotive Telematics\n` +
          `* **Tech Stack**: ESP32 / Arduino, Accelerometer & Gyroscope Sensors, GPS (NEO-6M), GSM (SIM800L), Cloud Webhook Telemetry\n` +
          `* **Problem Solved**: Delayed emergency medical response during highway accidents causing avoidable fatalities.\n` +
          `* **Architecture & Outcome**:\n` +
          `  - Continuous G-force and tilt threshold monitoring (> 4.5G spike detection).\n` +
          `  - Instant geo-coordinate lock via GPS and autonomous emergency SMS/call dispatch via GSM.\n` +
          `  - Real-time cloud telemetry synchronization with an administrative incident dispatch dashboard.`,
        actions: [
          { label: '🔍 View Project Details', actionType: 'scroll', target: 'projects' },
          { label: '🛠️ View Skills Matrix', actionType: 'scroll', target: 'skills' },
        ],
      };
    }

    if (/novel nest|library|ebook|book/i.test(q)) {
      return {
        text: `### 📚 Novel Nest — Digital E-Book Library Platform\n\n` +
          `* **Domain**: Web Application & Content Discovery\n` +
          `* **Tech Stack**: PHP, MySQL Relational Database, JavaScript, HTML5/CSS3, Bootstrap\n` +
          `* **Problem Solved**: Disorganized book discovery in academic libraries and slow search indexing.\n` +
          `* **Key Capabilities**:\n` +
          `  - Dynamic metadata filtering by author, genre, year, and course discipline.\n` +
          `  - Normalized MySQL schema (\`ebook_store.sql\`) handling user borrowing logs, book catalog, and reviews.\n` +
          `  - Live search assistance and responsive reader view for mobile and desktop.`,
        actions: [
          { label: '🔍 View Projects Section', actionType: 'scroll', target: 'projects' },
        ],
      };
    }

    if (/admission|srptc portal|automation/i.test(q)) {
      return {
        text: `### 🏛️ SRPTC Admission Automation & Allocation System\n\n` +
          `* **Domain**: Academic Administrative Automation\n` +
          `* **Tech Stack**: PHP, MySQL, JavaScript, HTML5/CSS3\n` +
          `* **Problem Solved**: Manual verification of hundreds of paper candidate forms and clerical bottlenecks during polytechnic admission seasons.\n` +
          `* **Impact & Architecture**:\n` +
          `  - Automated cutoff calculation and department seat quota allocation logic.\n` +
          `  - Real-time institutional intake analytics dashboard for department heads.\n` +
          `  - One-click exportable allotment summaries and candidate tracking pipeline.`,
        actions: [
          { label: '🔍 View in Projects', actionType: 'scroll', target: 'projects' },
        ],
      };
    }

    return {
      text: `### 🚀 Dharanesh's Major Engineering Systems (8+ Projects)\n\n` +
        `1. **Smart IoT Vehicle Telematics & Accident Detection** (ESP32, GPS/GSM, Cloud Telemetry)\n` +
        `2. **MediSync** — Hospital & Medical Infrastructure Platform (Full-Stack, Real-time triage)\n` +
        `3. **Novel Nest** — Digital E-Book Library & Content Catalog (PHP, MySQL, Search Indexing)\n` +
        `4. **SRPTC Admission Automation Website** (PHP/MySQL, Cutoff & Quota Engine)\n` +
        `5. **SRPTC Institutional Website CMS** (Production Web Operations & CMS Administration)\n` +
        `6. **Java NLP Campus Help Desk Engine** (Java, Intent Matching, Natural Language Querying)\n` +
        `7. **Real-Time Hand & Face Gesture Studio** (OpenCV, MediaPipe, Client-side CV ML)\n` +
        `8. **OpenCV Face Authentication & Attendance Shield** (Python, Biometric Verification)\n\n` +
        `Which specific project would you like to know more about?`,
      actions: [
        { label: '🚀 Explore All Projects', actionType: 'scroll', target: 'projects' },
        { label: '🤖 Open AI Lab Studio', actionType: 'scroll', target: 'ai-lab' },
      ],
    };
  }

  // 5. AWARDS, PRIZES & SYMPOSIUMS
  if (/award|prize|competition|symposium|contest|hackathon|won|first prize|1st prize|trophy|achieve/i.test(q)) {
    return {
      text: `### 🏆 7 Verified Prize Awards & 10+ Technical Symposiums\n\n` +
        `Dharanesh has a proven competitive track record across state and national engineering competitions:\n\n` +
        `* 🥇 **1st Prize — CODE BUSTERS** @ *KGiSL Institute of Technology* (OTZ-NEXUS-24, National Level)\n` +
        `* 🥇 **1st Prize — CODE DEBUGGING** @ *Sri Ramakrishna Polytechnic College* (IE(I) Challenge)\n` +
        `* 🥇 **1st Prize — VEDIC MATH QUIZ** @ *Sri Ramakrishna Engineering College* (23MACCE01)\n` +
        `* 🥇 **1st Prize — PAPER PRESENTATION** @ *SRPTC Ramanujan Day* (Srinivasa Ramanujan Principles)\n` +
        `* 🥇 **1st Prize — QUIZ ON RAMANUJAN LIFE** @ *SRPTC IE(I) Chapter*\n` +
        `* 🥈 **2nd Prize — PAPER PRESENTATION** @ *Nachimuthu Polytechnic College* (POLYSYM'24 State Level)\n` +
        `* 🥉 **3rd Prize — PAPER PRESENTATION** @ *CIT Sandwich Polytechnic College* (INFINITUM'24 State Level)\n\n` +
        `*Plus **10 State & National Participations** in Codextreme, TANSACS RRC Quiz, ISTE Ramanujan Math, and Project Contests!*\n\n` +
        `*All certificates are 100% verified and viewable directly in the Achievement Wall!*`,
      actions: [
        { label: '🏆 Open Achievement Wall', actionType: 'scroll', target: 'achievements' },
        { label: '📜 View Certificates', actionType: 'scroll', target: 'certifications' },
      ],
    };
  }

  // 6. TECH STACK, PROGRAMMING LANGUAGES & SKILLS
  if (/skill|stack|language|tech|java|python|javascript|typescript|c\+\+|php|mysql|react|docker|git/i.test(q)) {
    return {
      text: `### 🛠️ Dharanesh's Technical Skills & Engineering Toolkit\n\n` +
        `* **Core Programming Languages**: **Java** (DSA, OOP, Enterprise), **Python** (AI/ML, OpenCV, Scripts), **TypeScript / JavaScript** (Modern ES6+), **PHP**, **C/C++**, **SQL**.\n` +
        `* **AI, Machine Learning & Vision**: **OpenCV**, **MediaPipe**, **Generative AI & LLM Prompting**, **Natural Language Processing (NLP)**, **Biometric Face Verification**.\n` +
        `* **Web & Backend Architecture**: **React 18**, **Tailwind CSS**, **Node.js / Express**, **RESTful APIs**, **PHP/MySQL**, **Firebase**, **Vite**.\n` +
        `* **IoT & Embedded Systems**: **ESP32**, **Arduino**, **GPS/GSM Modules**, **Accelerometer/Gyro Telematics**, **Sensor Integration**.\n` +
        `* **Observability, Testing & Cloud**: **OpenTelemetry (Distributed Tracing)**, **JMeter / BlazeMeter (Load & Performance Testing)**, **OWASP Top 10 Security**, **Git / GitHub CI/CD**, **Docker**.\n` +
        `* **Databases & Tools**: **MySQL**, **Oracle Database Utilities (Import/Export)**, **PostgreSQL**, **VS Code**, **Linux/PowerShell**.`,
      actions: [
        { label: '📊 View Full Skills Matrix', actionType: 'scroll', target: 'skills' },
        { label: '🤖 Test Live AI Lab', actionType: 'scroll', target: 'ai-lab' },
      ],
    };
  }

  // 7. AI, COMPUTER VISION & GENERATIVE AI EXPERIENCE
  if (/ai|vision|opencv|mediapipe|genai|llm|chatgpt|machine learning|cv|gesture|camera/i.test(q)) {
    return {
      text: `### 🤖 Artificial Intelligence & Computer Vision Capabilities\n\n` +
        `Dharanesh combines practical software engineering with applied machine learning and real-time computer vision:\n\n` +
        `* 🎯 **Client-Side Vision ML**: Built in-browser real-time **Hand Gesture Controllers** (pinch-to-volume, palm tracking) and **Face Mesh Landmark Trackers** using MediaPipe & OpenCV.\n` +
        `* 🧠 **Generative AI & LLM Pipelines**: Certified in **GenAI for IT (Infosys)**, **GenAI for Professionals (Udemy)**, and **ChatGPT for Everyone (GUVI)**, specializing in embedding structured intelligence into digital products.\n` +
        `* 🛡️ **Biometric Authentication**: Created real-time OpenCV face authentication pipelines with anti-spoofing and secure credential matching.\n` +
        `* 🎮 **Interactive AI Lab**: You can test Dharanesh's live computer vision experiments right on this website without installing anything!`,
      actions: [
        { label: '🧪 Launch AI Lab Studio', actionType: 'scroll', target: 'ai-lab' },
        { label: '📜 View AI Certifications', actionType: 'scroll', target: 'certifications' },
      ],
    };
  }

  // 8. CERTIFICATIONS
  if (/certif|mooc|infosys|ibm|udemy|guvi|credential|license/i.test(q)) {
    return {
      text: `### 📜 25+ Verified Industry Certifications\n\n` +
        `Dharanesh holds verified credentials from premier platforms across multiple technical disciplines:\n\n` +
        `* 🤖 **AI & Generative AI**: *GenAI for IT (Infosys)*, *GenAI for Professionals (Udemy)*, *ChatGPT for Everyone (GUVI)*, *AI for India 2.0 (Skill India & GUVI)*.\n` +
        `* 🐍 **Programming & Development**: *Basics of Python (Infosys)*, *Python Basics (Udemy)*, *Java Tools (Infosys)*, *II PU Computer Science (Infosys)*.\n` +
        `* ☁️ **Cloud, Observability & Security**: *Observability using OpenTelemetry (Infosys & Udemy)*, *OWASP Top 10 Security (Infosys & Udemy)*, *MS-900 Microsoft 365 (Udemy)*, *JMeter Performance Testing (Udemy)*, *Oracle DB Utilities (Udemy)*, *Tomcat & PHP (Infosys)*.\n` +
        `* 💼 **Professional & Management**: *Job Application Essentials (IBM)*, *Working in a Digital World (IBM)*, *Employability Skills (IBM/TNSDC)*, *Design Thinking (Infosys)*, *Digital Marketing (Infosys)*, *Meeting & Presentation Suites (Udemy & Infosys)*.\n\n` +
        `*Every single certificate can be viewed and downloaded in high resolution on the Certifications section.*`,
      actions: [
        { label: '📜 Open Certifications Library', actionType: 'scroll', target: 'certifications' },
      ],
    };
  }

  // 9. EXPERIENCE, INTERNSHIP & LEADERSHIP
  if (/experience|internship|work|leadership|role|class rep|srptc lead|srec/i.test(q)) {
    return {
      text: `### 💼 Experience, Internship & Technical Leadership\n\n` +
        `* 🏢 **AI-Powered Integrated System Design Intern** @ *Sri Ramakrishna Engineering College (SREC)* (50 Hours)\n` +
        `  - Designed hardware-software integration loops connecting sensors, microcontrollers, and applied AI pipelines.\n` +
        `* 👑 **Class Representative & Student Lead** @ *Sri Ramakrishna Polytechnic College (SRPTC)* (2023–2026)\n` +
        `  - Led technical student cohorts, coordinated academic operations, and organized inter-departmental workshops.\n` +
        `* 🛠️ **Workshop Conductor & Participant**:\n` +
        `  - Web Designing Club & PC Hardware Troubleshooting Workshop @ SRPTC.\n` +
        `  - AR/VR Exploration Workshop @ Dept of Computer Engineering.\n` +
        `  - Vedic Mathematics & Speed Computation Program @ SREC.`,
      actions: [
        { label: '💼 View Experience Section', actionType: 'scroll', target: 'experience' },
      ],
    };
  }

  // 10. CONTACT, HIRE, RESUME, LOCATION & SOCIALS
  if (/contact|email|phone|hire|resume|cv|download|linkedin|github|leetcode|message|location|availability/i.test(q)) {
    return {
      text: `### 📫 Contact & Connect with Dharanesh K\n\n` +
        `Dharanesh is actively open to **SDE Internships, Graduate Software Engineer roles, Full-Stack & AI Engineering opportunities**.\n\n` +
        `* 📧 **Direct Email**: [kdharanesh6@gmail.com](mailto:kdharanesh6@gmail.com)\n` +
        `* 💼 **LinkedIn**: [linkedin.com/in/dharanesh-k](https://www.linkedin.com/in/dharanesh-k-b018a1357/)\n` +
        `* 💻 **GitHub**: [github.com/Dharanesh6](https://github.com/Dharanesh6)\n` +
        `* 🧠 **LeetCode**: [leetcode.com/u/dharanesh-k](https://leetcode.com/u/dharanesh-k)\n` +
        `* 📍 **Location**: Coimbatore, Tamil Nadu, India (Open to Relocation / Remote / Hybrid)\n\n` +
        `Feel free to reach out directly or submit a message via the Contact section below!`,
      actions: [
        { label: '✉️ Send Message in Contact Form', actionType: 'scroll', target: 'contact' },
        { label: '🔗 Open LinkedIn', actionType: 'link', target: PERSONAL_INFO.social.linkedin },
        { label: '💻 Open GitHub', actionType: 'link', target: PERSONAL_INFO.social.github },
      ],
    };
  }

  // 11. FALLBACK / GENERAL QUERY MATCHING
  // Search across projects, skills, and achievements
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
    let response = `### 🔍 Found Relevant Portfolio Match:\n\n`;

    if (matchingProjects.length > 0) {
      response += `**Relevant Systems Built:**\n`;
      matchingProjects.slice(0, 3).forEach((p) => {
        response += `* **${p.title}** (${p.techStack.join(', ')}): ${p.summary}\n`;
      });
      response += `\n`;
    }

    if (matchingCerts.length > 0) {
      response += `**Relevant Certifications:**\n`;
      matchingCerts.slice(0, 3).forEach((c) => {
        response += `* **${c.title}** (*${c.issuer}* — ${c.date})\n`;
      });
    }

    return {
      text: response,
      actions: [
        { label: '🚀 View Projects', actionType: 'scroll', target: 'projects' },
        { label: '📜 View Certifications', actionType: 'scroll', target: 'certifications' },
      ],
    };
  }

  // Default intelligent fallback
  return {
    text: `I understand you are asking about **"${query}"**.\n\n` +
      `Dharanesh is a **Software Engineer & AI Builder** with expertise across **Java, Python, IoT, React, PHP/MySQL, Computer Vision, and 25+ verified certifications**.\n\n` +
      `You can ask me anything about:\n` +
      `* 💼 **His Background & Recruiter Summary**\n` +
      `* 🚀 **His 8+ Systems & Flagship Projects**\n` +
      `* 🏆 **His 7 National & State Prize Awards**\n` +
      `* 🛠️ **His Technical Skills & DSA Mastery**\n` +
      `* 📫 **How to Contact or Hire Him**`,
    actions: [
      { label: '💼 Recruiter Pitch', actionType: 'scroll', target: 'about' },
      { label: '🚀 Explore Projects', actionType: 'scroll', target: 'projects' },
      { label: '📫 Contact Info', actionType: 'scroll', target: 'contact' },
    ],
  };
}
