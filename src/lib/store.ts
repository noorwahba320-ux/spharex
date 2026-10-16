import {
  Member,
  ProjectItem,
  SiteSettings,
  CustomSection,
  LeaderboardEntry,
  MediaItem,
} from '../types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-1',
    slug: 'nour-eldein',
    name: 'Nour Eldein',
    arabicName: 'نور الدين وهبة',
    initials: 'NW',
    role: 'Cyber Security Engineer & API Developer',
    shortBio: 'Building APIs, Bots, Automation Systems and Cyber Security Tools since 2019.',
    fullBio:
      'Started programming journey in 2019 with a passion for building robust systems. Specialized in Python, Node.js, and Flask, crafting high-performance REST APIs, intelligent Telegram bots, and advanced Cyber Security tools. Bridges the gap between backend engineering and automation, delivering scalable, secure, and developer-friendly solutions.',
    themeAccent: '#38bdf8',
    showContact: false, // Default false as per privacy instructions
    email: 'noorwahba@gamil.com',
    githubUrl: 'https://github.com/noooreldein',
    telegramUrl: 'https://t.me/ZW_X3',
    websiteUrl: 'https://noooreldein.github.io/',
    order: 1,
    isVisible: true,
    education: 'Computer Science & Software Systems Engineering (2019 - Present)',
    skills: [
      { id: 's1', name: 'Python', category: 'Core Backend & Automation', highlight: true },
      { id: 's2', name: 'Node.js', category: 'Scalable Server-Side Apps', highlight: true },
      { id: 's3', name: 'Flask', category: 'Lightweight Python APIs', highlight: true },
      { id: 's4', name: 'REST APIs', category: 'Design & Integration', highlight: true },
      { id: 's5', name: 'Cyber Security', category: 'Security Tools & Audits', highlight: true },
      { id: 's6', name: 'Telegram Bot API', category: 'Bot Architecture & Webhooks', highlight: true },
      { id: 's7', name: 'Automation', category: 'Workflows & Scripting' },
      { id: 's8', name: 'Linux', category: 'Server & CLI Expertise' },
      { id: 's9', name: 'Git', category: 'Version Control' },
      { id: 's10', name: 'JavaScript', category: 'Frontend Logic' },
    ],
    achievements: [
      {
        id: 'ach-n1',
        title: 'Building Production APIs and Automation Bots',
        organization: 'Independent Engineering & Open Source',
        year: '2019 - Present',
      },
    ],
    timeline: [
      { id: 't1', year: '2019', title: 'Started Programming', description: 'Began journey with Python and foundational computer science.' },
      { id: 't2', year: '2020', title: 'Python Mastery', description: 'Built CLI tools and automation scripts.' },
      { id: 't3', year: '2021', title: 'Telegram Bots', description: 'Developed production-scale Telegram bots with inline keyboards and webhooks.' },
      { id: 't4', year: '2022', title: 'Automation Systems', description: 'Built complex automation workflows with scheduling and event-driven architecture.' },
      { id: 't5', year: '2023', title: 'REST APIs', description: 'Designed and deployed RESTful APIs with Flask, Node.js, and OpenAPI specs.' },
      { id: 't6', year: '2024', title: 'Cyber Security', description: 'Focused on security auditing, vulnerability assessment, and secure coding.' },
      { id: 't7', year: '2025', title: 'Advanced Backend', description: 'Architected microservices, message queues, and distributed systems.' },
      { id: 't8', year: '2026', title: 'AI APIs', description: 'Building and integrating AI-powered APIs for chat, generation, and analysis.' },
    ],
    apis: [
      {
        id: 'api-1',
        name: 'WormGPT',
        method: 'GET',
        endpoint: 'https://wormgpt2-u2rn.vercel.app/chat',
        category: 'AI Chat API',
        description: 'AI chat and generation endpoint.',
        params: '?q=TEXT',
      },
      {
        id: 'api-2',
        name: 'Gemini 2.5 Flash',
        method: 'GET',
        endpoint: 'https://gemini-nor.vercel.app/gemini',
        category: 'Google Gemini AI',
        description: 'Google Gemini AI interaction endpoint.',
        params: '?text=TEXT',
      },
      {
        id: 'api-3',
        name: 'DeepSeek Pro',
        method: 'POST',
        endpoint: 'https://deepseek-norpro.vercel.app/deeppro',
        category: 'Advanced AI Model',
        description: 'DeepSeek advanced conversational AI model API.',
        params: 'model, message',
      },
      {
        id: 'api-4',
        name: 'Blackbox AI',
        method: 'GET',
        endpoint: 'https://black-box-by-nour-w7nv.vercel.app/chat',
        category: 'Blackbox AI Chat',
        description: 'Blackbox AI conversational chat service.',
        params: '?q=TEXT',
      },
    ],
  },
  {
    id: 'mem-2',
    slug: 'abdelrahman-foda',
    name: 'Abdelrahman Mohamed Foda',
    arabicName: 'عبد الرحمن محمد فودة',
    initials: 'AM',
    role: 'Programmer, AI Specialist & Cybersecurity Competitor',
    shortBio: 'Building innovative technology solutions while competing in Artificial Intelligence, Cybersecurity, and Software Development programs.',
    fullBio:
      'Young Egyptian programmer and technology enthusiast specializing in Artificial Intelligence, Cybersecurity, Data Science, and Software Development. Has achieved national recognition through major competitions and technical programs, demonstrating excellence in competitive programming, cybersecurity (CTF), and technological innovation. Founder and leader of Quantix-Team Academy.',
    themeAccent: '#38bdf8',
    showContact: false,
    email: 'abdelramanfoda27@gmail.com',
    githubUrl: 'https://github.com/abdelrahmanfoda-133',
    websiteUrl: 'https://abdelrahmanfoda-133.github.io/am/',
    order: 2,
    isVisible: true,
    education: 'Grade 10 · DECI L3 (Digital Egypt Cubs Initiative - AI & Data Science Track) · Cisco Networking Academy',
    skills: [
      { id: 's11', name: 'Python', category: 'Programming Languages', highlight: true },
      { id: 's12', name: 'JavaScript', category: 'Programming Languages', highlight: true },
      { id: 's13', name: 'Node.js & Express.js', category: 'Backend Development', highlight: true },
      { id: 's14', name: 'REST APIs', category: 'Backend Development', highlight: true },
      { id: 's15', name: 'Capture The Flag (CTF)', category: 'Cybersecurity', highlight: true },
      { id: 's16', name: 'Network Security Fundamentals', category: 'Cybersecurity', highlight: true },
      { id: 's17', name: 'AI & OpenAI API Integration', category: 'Artificial Intelligence', highlight: true },
      { id: 's18', name: 'Data Analysis', category: 'Artificial Intelligence' },
      { id: 's19', name: 'SQLite, MongoDB & Firestore', category: 'Databases' },
      { id: 's20', name: 'Responsive Web Design (RTL)', category: 'Frontend Development' },
    ],
    achievements: [
      {
        id: 'ach-f1',
        title: 'Emerging Digital Solutions (EDS) 2026',
        organization: 'EDS National Competition',
        year: '2026',
        placement: '1st Place Nationwide (🥇 المركز الأول على مستوى الجمهورية)',
      },
      {
        id: 'ach-f2',
        title: 'NTI Year CTF — Creativa Edition 2026',
        organization: 'National Telecommunication Institute (NTI)',
        year: '2026',
        placement: '1st Place Nationwide (🥇 المركز الأول على مستوى الجمهورية)',
      },
      {
        id: 'ach-f3',
        title: 'Egyptian Youth Cybersecurity Challenge (EYCC)',
        organization: 'EYCC Competition',
        year: '2026',
        placement: 'Top 8 Nationwide (🥈 ضمن أفضل 8 على مستوى الجمهورية)',
      },
      {
        id: 'ach-f4',
        title: 'NASA Space Apps Cairo',
        organization: 'NASA Space Apps Challenge',
        year: '2025',
        placement: '22nd Place (🏆 المركز الثاني والعشرون)',
      },
      {
        id: 'ach-f5',
        title: 'Digital Egypt Cubs Initiative (DECI)',
        organization: 'Ministry of Communications and Information Technology (MCIT)',
        year: '2024',
        placement: 'Top Student Nationwide (🥇 الطالب المتفوق على مستوى الجمهورية)',
      },
    ],
    timeline: [
      { id: 'tf1', year: '2024', title: 'DECI Top Student Honor', description: 'Awarded Top Student Nationwide in Digital Egypt Cubs Initiative.' },
      { id: 'tf2', year: '2025', title: 'NASA Space Apps Cairo Competitor', description: 'Competed in NASA Space Apps Cairo, ranking 22nd place.' },
      { id: 'tf3', year: '2026', title: 'NTI CTF & EDS National Champion', description: 'Achieved 1st place nationwide in both EDS 2026 and NTI CTF Creativa 2026.' },
      { id: 'tf4', year: '2026 - Present', title: 'Founder & CEO, Quantix-Team Academy', description: 'Founded technical education community for youth in AI and Cybersecurity.' },
    ],
  },
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  // Nour Eldein's Real Verified Projects from Source
  {
    id: 'proj-n1',
    title: 'AutoMod Bot',
    slug: 'automod-bot',
    category: 'Telegram Bots',
    description: 'AI-powered moderation bot for Telegram groups with spam detection and auto-ban mechanisms.',
    techStack: ['Python', 'Telegram Bot API', 'AsyncIO'],
    githubUrl: 'https://github.com/noooreldein',
    memberSlug: 'nour-eldein',
  },
  {
    id: 'proj-n2',
    title: 'VulnScanner',
    slug: 'vuln-scanner',
    category: 'Cyber Security',
    description: 'Automated vulnerability scanner for web applications with security audits and detailed reporting.',
    techStack: ['Python', 'Sockets', 'Security Auditing'],
    githubUrl: 'https://github.com/noooreldein',
    memberSlug: 'nour-eldein',
  },
  {
    id: 'proj-n3',
    title: 'AI Gateway API',
    slug: 'ai-gateway-api',
    category: 'REST APIs',
    description: 'Unified API gateway for multiple AI models featuring dynamic rate limiting, token caching, and unified endpoints.',
    techStack: ['Python', 'Flask', 'REST APIs', 'Vercel'],
    githubUrl: 'https://github.com/noooreldein',
    memberSlug: 'nour-eldein',
  },
  {
    id: 'proj-n4',
    title: 'DeployFlow',
    slug: 'deploy-flow',
    category: 'Automation',
    description: 'CI/CD automation pipeline with GitHub Actions workflows and automated container deployment.',
    techStack: ['Linux', 'GitHub Actions', 'Docker'],
    githubUrl: 'https://github.com/noooreldein',
    memberSlug: 'nour-eldein',
  },
  {
    id: 'proj-n5',
    title: 'DataCrawler',
    slug: 'data-crawler',
    category: 'Data Extraction',
    description: 'Distributed web crawler with proxy rotation, parsing logic, and automated data extraction pipelines.',
    techStack: ['Python', 'Web Scraping', 'Automation'],
    githubUrl: 'https://github.com/noooreldein',
    memberSlug: 'nour-eldein',
  },
  {
    id: 'proj-n6',
    title: 'SecureAuth',
    slug: 'secure-auth',
    category: 'Cyber Security',
    description: 'Two-factor authentication system with Time-based One-Time Password (TOTP) and backup codes support.',
    techStack: ['Node.js', 'Cryptography', 'TOTP'],
    githubUrl: 'https://github.com/noooreldein',
    memberSlug: 'nour-eldein',
  },

  // Abdelrahman Foda's Real Verified Projects from Source
  {
    id: 'proj-f1',
    title: 'Quantix Platform',
    slug: 'quantix-platform',
    category: 'Educational Platform',
    description: 'Arabic educational community and technology platform focused on Artificial Intelligence, Programming, and Digital Skills.',
    techStack: ['JavaScript', 'HTML5', 'CSS3', 'Node.js'],
    githubUrl: 'https://github.com/abdelrahmanfoda-133',
    memberSlug: 'abdelrahman-foda',
  },
  {
    id: 'proj-f2',
    title: 'Masari',
    slug: 'masari',
    category: 'Career Platform',
    description: 'Intelligent Arabic platform helping students discover suitable digital career paths through assessments, curated resources, and roadmaps.',
    techStack: ['JavaScript', 'Node.js', 'APIs'],
    githubUrl: 'https://github.com/abdelrahmanfoda-133',
    memberSlug: 'abdelrahman-foda',
  },
  {
    id: 'proj-f3',
    title: 'Weathix',
    slug: 'weathix',
    category: 'Analytics',
    description: 'Weather analytics platform evaluating outdoor conditions and providing smart classifications for events and activities.',
    techStack: ['JavaScript', 'Weather APIs'],
    githubUrl: 'https://github.com/abdelrahmanfoda-133',
    memberSlug: 'abdelrahman-foda',
  },
  {
    id: 'proj-f4',
    title: 'MedScan X',
    slug: 'medscan-x',
    category: 'Healthcare AI',
    description: 'AI-assisted healthcare project designed to assist users with structured medical insights and health recommendations.',
    techStack: ['AI APIs', 'JavaScript'],
    githubUrl: 'https://github.com/abdelrahmanfoda-133',
    memberSlug: 'abdelrahman-foda',
  },
  {
    id: 'proj-f5',
    title: 'DTama Mind Cloud',
    slug: 'dtama-mind-cloud',
    category: 'Cloud Storage',
    description: 'Cloud storage and file management platform providing modern digital storage and access management.',
    techStack: ['Node.js', 'Firebase'],
    githubUrl: 'https://github.com/abdelrahmanfoda-133',
    memberSlug: 'abdelrahman-foda',
  },
  {
    id: 'proj-f6',
    title: 'DiaTwin AI',
    slug: 'diatwin-ai',
    category: 'Healthcare AI',
    description: 'AI-assisted monitoring system for diabetes patients offering structured health observation insights.',
    techStack: ['AI APIs', 'JavaScript'],
    githubUrl: 'https://github.com/abdelrahmanfoda-133',
    memberSlug: 'abdelrahman-foda',
  },
];

export const INITIAL_SECTIONS: CustomSection[] = [];

export const INITIAL_SETTINGS: SiteSettings = {
  teamName: 'AstraSPHEREx Egypt',
  challengeTitle: 'NASA Space Apps Challenge 2026',
  challengeTrack: 'Planet X and SPHEREx',
  heroHeadline: 'فريق برمجيات وأمن سيبراني وذكاء اصطناعي',
  heroSubheadline: 'تمثيل مصري في NASA Space Apps Challenge 2026 — بناء وتطوير حلول برمجية في مسار SPHEREx و Planet X.',
  primaryColor: '#38bdf8',
  secondaryColor: '#0ea5e9',
  accentColor: '#f59e0b',
  backgroundColor: '#05070a',
  surfaceColor: '#0b1016',
  gameCarDecalText: 'EGYPT · SPHEREx',
  gameCarColor: '#38bdf8',
  footerText: 'فريق مصري مشارك في NASA Space Apps Challenge 2026',
};

// CLEAN EMPTY LEADERBOARD - Zero mock scores!
export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [];

export interface AppState {
  members: Member[];
  projects: ProjectItem[];
  sections: CustomSection[];
  settings: SiteSettings;
  leaderboard: LeaderboardEntry[];
  media: MediaItem[];
}

const STORAGE_KEY = 'astraspherex_clean_state_v2';

export function loadStoredState(): AppState {
  if (typeof window === 'undefined') {
    return {
      members: INITIAL_MEMBERS,
      projects: INITIAL_PROJECTS,
      sections: INITIAL_SECTIONS,
      settings: INITIAL_SETTINGS,
      leaderboard: INITIAL_LEADERBOARD,
      media: [],
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        members: parsed.members || INITIAL_MEMBERS,
        projects: parsed.projects || INITIAL_PROJECTS,
        sections: parsed.sections || INITIAL_SECTIONS,
        settings: { ...INITIAL_SETTINGS, ...(parsed.settings || {}) },
        leaderboard: Array.isArray(parsed.leaderboard) ? parsed.leaderboard : [],
        media: Array.isArray(parsed.media) ? parsed.media : [],
      };
    }
  } catch (err) {
    console.error('Failed to load clean state:', err);
  }

  return {
    members: INITIAL_MEMBERS,
    projects: INITIAL_PROJECTS,
    sections: INITIAL_SECTIONS,
    settings: INITIAL_SETTINGS,
    leaderboard: INITIAL_LEADERBOARD,
    media: [],
  };
}

export function saveState(state: AppState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state:', err);
  }
}
