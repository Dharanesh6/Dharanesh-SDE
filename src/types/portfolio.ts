export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  isFlagship?: boolean;
  featuredOrder: number;
  domain: string;
  techStack: string[];
  role: string;
  summary: string;
  problem: string;
  solution: string;
  hardwareComponents?: { name: string; pin?: string; role: string }[];
  softwareArchitecture?: string[];
  keyFeatures: string[];
  verifiedOutcome: string;
  githubUrl?: string;
  demoUrl?: string;
  stats?: { label: string; value: string }[];
}

export interface AchievementItem {
  id: string;
  title: string;
  event: string;
  institution: string;
  level: 'National Level' | 'State Level' | 'Institutional';
  category: 'Coding & Debugging' | 'Paper Presentation' | 'Quiz' | 'Project Presentation' | 'Symposium';
  prize: '1st Prize' | '2nd Prize' | '3rd Prize' | 'Participation';
  date: string;
  year: number;
  highlight?: boolean;
  description?: string;
  certificateUrl?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  platform: 'Infosys Springboard' | 'IBM SkillsBuild' | 'GUVI / Skill India' | 'Udemy' | 'PANTECH / Naan Mudhalvan' | 'Institutional';
  category: 'AI & GenAI' | 'Programming & Cloud' | 'Security & Database' | 'Professional & Management' | 'IoT & Hardware';
  date: string;
  year: number;
  credentialUrl?: string;
  skills: string[];
  certificateUrl?: string;
  certificateImages?: { title: string; url: string; issuer?: string }[];
}

export interface SkillCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  skills: {
    name: string;
    level: 'Foundational' | 'Intermediate' | 'Proficient' | 'Hands-on Project' | 'Demonstrated';
    tag: string;
    practicalUse: string;
  }[];
}

export interface AILabExperiment {
  id: string;
  title: string;
  tech: string;
  description: string;
  keyModule: string;
  status: 'Completed & Tested' | 'Active Exploration';
  inputMethod: string;
  hardwareInteraction: string;
  interactiveType: 'virtual_mouse' | 'gesture_audio' | 'gaze_tracking' | 'mask_detector';
}

export interface JourneyMilestone {
  period: string;
  year: string;
  title: string;
  institution: string;
  location: string;
  badge: string;
  description: string;
  achievements: string[];
  isCurrent?: boolean;
  isFuture?: boolean;
}

export interface LeadershipRole {
  title: string;
  organization: string;
  period: string;
  type: 'Project Leadership' | 'Class Leadership' | 'Event Leadership';
  impact: string[];
}

export interface WorkshopItem {
  id: string;
  title: string;
  organizer: string;
  date: string;
  duration?: string;
  type: string;
  description: string;
  keyHighlights: string[];
  skills?: string[];
  badge?: string;
  certificateUrl?: string;
}

export interface InternshipItem {
  title: string;
  role?: string;
  organization: string;
  duration: string;
  location: string;
  verified: boolean;
  summary: string;
  keyLearnings: string[];
  skills?: string[];
  certificateUrl?: string;
}

export interface CertificateModalData {
  title: string;
  subtitle?: string;
  issuer: string;
  category?: string;
  date?: string;
  imageUrl: string;
  additionalImages?: { title: string; url: string; issuer?: string }[];
  skills?: string[];
  badge?: string;
  verified?: boolean;
}

