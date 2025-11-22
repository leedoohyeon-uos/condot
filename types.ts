import React from 'react';

export enum Sender {
  USER = 'user',
  BOT = 'bot'
}

export type Page = 'home' | 'chat' | 'library' | 'timeline' | 'resume';

export interface CardField {
  label: string;
  value: string;
}

export interface FileInfo {
  name: string;
  size: number; // in bytes
  type: string;
  url: string; // blob url
  uploadedAt: number;
}

export interface ExperienceCardData {
  id: string; // ID is now mandatory for updates
  title: string; 
  category: string; 
  iconType: 'medal' | 'trophy' | 'star';
  date: string; // Format: YY.MM.DD
  fields: CardField[];
  files?: FileInfo[]; // Attached files
  colorHex?: string; // To store the specific color for this card
}

export interface TimelineItem {
  id: string;
  year: number;
  date: string; // Format: YY.MM.DD
  title: string; 
  categoryId: string;
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  cardData?: ExperienceCardData; 
  timestamp: number;
}

export interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
}

export type CategoryColor = 'green' | 'lime' | 'yellow' | 'orange' | 'pink' | 'magenta' | 'purple' | 'blue' | 'sky' | 'red';

export interface Category {
  id: string;
  name: string;
  color: CategoryColor;
  hex: string;
}

export const CATEGORIES: Category[] = [
  { id: 'competition', name: '공모전', color: 'green', hex: '#7AB573' },
  { id: 'education', name: '교육', color: 'lime', hex: '#C6E08D' },
  { id: 'activity', name: '대외활동', color: 'yellow', hex: '#E9E589' },
  { id: 'volunteer', name: '봉사활동', color: 'orange', hex: '#E8A281' },
  { id: 'parttime', name: '알바', color: 'pink', hex: '#E28589' },
  { id: 'language', name: '어학성적', color: 'magenta', hex: '#CE8BB8' },
  { id: 'intern', name: '인턴', color: 'purple', hex: '#9D8EBF' },
  { id: 'cert', name: '자격증', color: 'blue', hex: '#889CCE' },
  { id: 'other', name: '기타', color: 'sky', hex: '#87C8E3' },
];

// Gemini Response Types
export type EngineAction = 'create' | 'update' | 'delete' | 'chat' | 'confirm';

export interface EngineResponse {
  action: EngineAction;
  message: string;
  data?: ExperienceCardData; // For create/update
  targetId?: string; // For update/delete
  timeline?: { // Legacy: kept for type compatibility with service parsing, but logic will prefer ExperienceCardData
      year: number;
      date: string;
      title: string;
      categoryId: string;
  };
}