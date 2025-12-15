export enum FolderCategory {
  COMPETITION = "공모전",
  CLASS = "수업/교육",
  TRAINING = "외부 교육",
  VOLUNTEER = "봉사활동",
  PROJECT = "프로젝트",
  PAPER = "논문/연구",
  INTERNSHIP = "인턴십",
  CERTIFICATE = "자격증",
  LANGUAGE = "어학",
  CLUB = "동아리/학회",
  WORK = "아르바이트",
  OTHER = "기타"
}

export interface PortfolioContent {
  overview: string;
  role: string;
  skills_used: string[];
  outcomes: string[];
  learned: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string; // Mock URL or Base64
  type: 'ppt' | 'report' | 'other';
  size?: string;
}

export interface Experience {
  id: string;
  title: string;
  dateRange: string; // YYYY.MM - YYYY.MM
  year: number; // For sorting
  summary: string;
  category: FolderCategory;
  keywords: string[];
  content: PortfolioContent;
  isFavorite: boolean;
  createdAt?: any;
  attachments?: Attachment[]; // New field for file attachments
}

export enum ApplicationStatus {
  PREPARING = "준비중",
  APPLIED = "지원완료",
  DOC_PASS = "서류합격",
  INTERVIEW_1 = "1차면접 합격",
  INTERVIEW_2 = "2차면접 합격",
  FINAL_PASS = "최종합격",
  REJECTED = "불합격"
}

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  date: string; // Application Date YYYY.MM.DD
  status: ApplicationStatus;
  jobPostingUrl: string; // Link to job posting
  coverLetter: string; // Personal statement content
  createdAt?: any;
  // New Fields
  jobRole?: string;
  experienceLevel?: string; // 'new' | 'experienced'
  companyType?: string; // 'large' | 'medium' | 'small' | 'startup'
}

export interface JobNewsItem {
  id: string;
  title: string;
  company: string;
  deadline: string;
  tags: string[];
  content: string;
}

export interface User {
  name: string;
  email: string;
  avatarUrl: string;
  isAdmin: boolean;
}

// --- RAG & Recommendation Types ---

export interface ReferenceMaterial {
  id: string;
  company: string;
  jobRole: string;
  question: string;
  answer: string;
  keyCapabilities: string[];
  createdAt: any;
}

export interface CareerPrediction {
  role: string;
  compatibility: number; // 0-100
  reasoning: string;
  recommendedExperiences: string[];
}

export interface CareerGapAnalysis {
  targetRole: string;
  currentMatch: string[];
  missingSkills: string[];
  actionPlan: string[];
}

export interface GlobalConfig {
  isTestMode: boolean;
}

// Updated Folder color mapping
export const FOLDER_COLORS: Record<FolderCategory, string> = {
  [FolderCategory.COMPETITION]: "bg-red-50 text-red-700 border-red-200",
  [FolderCategory.CLASS]: "bg-orange-50 text-orange-700 border-orange-200",
  [FolderCategory.TRAINING]: "bg-yellow-50 text-yellow-700 border-yellow-200",
  [FolderCategory.VOLUNTEER]: "bg-lime-50 text-lime-700 border-lime-200",
  [FolderCategory.PROJECT]: "bg-green-50 text-green-700 border-green-200",
  [FolderCategory.PAPER]: "bg-teal-50 text-teal-700 border-teal-200",
  [FolderCategory.INTERNSHIP]: "bg-cyan-50 text-cyan-700 border-cyan-200",
  [FolderCategory.CERTIFICATE]: "bg-sky-50 text-sky-700 border-sky-200",
  [FolderCategory.LANGUAGE]: "bg-blue-50 text-blue-700 border-blue-200",
  [FolderCategory.CLUB]: "bg-indigo-50 text-indigo-700 border-indigo-200",
  [FolderCategory.WORK]: "bg-violet-50 text-violet-700 border-violet-200",
  [FolderCategory.OTHER]: "bg-pink-50 text-pink-700 border-pink-200",
};

export const FOLDER_BG_COLORS: Record<FolderCategory, string> = {
    [FolderCategory.COMPETITION]: "bg-red-500",
    [FolderCategory.CLASS]: "bg-orange-500",
    [FolderCategory.TRAINING]: "bg-yellow-500",
    [FolderCategory.VOLUNTEER]: "bg-lime-500",
    [FolderCategory.PROJECT]: "bg-green-500",
    [FolderCategory.PAPER]: "bg-teal-500",
    [FolderCategory.INTERNSHIP]: "bg-cyan-500",
    [FolderCategory.CERTIFICATE]: "bg-sky-500",
    [FolderCategory.LANGUAGE]: "bg-blue-500",
    [FolderCategory.CLUB]: "bg-indigo-500",
    [FolderCategory.WORK]: "bg-violet-500",
    [FolderCategory.OTHER]: "bg-pink-500",
};