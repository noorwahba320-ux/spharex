export type MemberSlug = 'nour-eldein' | 'abdelrahman-foda' | string;

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  highlight?: boolean;
}

export interface ApiItem {
  id: string;
  name: string;
  method: 'GET' | 'POST';
  endpoint: string;
  category: string;
  description: string;
  params?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  memberSlug: MemberSlug | 'team';
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  year: string;
  placement?: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface CustomSection {
  id: string;
  memberId: string;
  title: string;
  type: 'text' | 'skills' | 'projects' | 'timeline' | 'achievements' | 'apis';
  content: string;
  order: number;
  isVisible: boolean;
}

export interface Member {
  id: string;
  slug: MemberSlug;
  name: string;
  arabicName: string;
  initials: string;
  role: string;
  shortBio: string;
  fullBio: string;
  themeAccent: string;
  showContact: boolean;
  email?: string;
  githubUrl?: string;
  telegramUrl?: string;
  websiteUrl?: string;
  order: number;
  isVisible: boolean;
  education: string;
  skills: SkillItem[];
  achievements: AchievementItem[];
  timeline: TimelineItem[];
  apis?: ApiItem[];
}

export interface SiteSettings {
  teamName: string;
  teamLogoUrl?: string;
  challengeTitle: string;
  challengeTrack: string;
  heroHeadline: string;
  heroSubheadline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  gameCarDecalText: string;
  gameCarColor: string;
  footerText: string;
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  score: number;
  distance: number;
  date: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  uploadedAt: string;
}
