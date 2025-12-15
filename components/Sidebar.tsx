import React from 'react';
import { FolderKanban, History, MessageSquarePlus, Newspaper, FileText, LayoutGrid, Briefcase, Compass } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const menuItems = [
    { id: 'input', label: '새 기록 시작 (New Chat)', icon: MessageSquarePlus, pageId: 'main_input' },
    { id: 'storage', label: '내 경험함 (Cards)', icon: LayoutGrid, pageId: 'storage' },
    { id: 'timeline', label: '커리어 타임라인', icon: History, pageId: 'timeline' },
    { id: 'applications', label: '나의 자소서 (My Statements)', icon: Briefcase, pageId: 'applications' },
    { id: 'recommendations', label: '커리어 네비게이션', icon: Compass, pageId: 'recommendations' },
    { id: 'news', label: '채용 공고 (Job News)', icon: Newspaper, pageId: 'job_news' },
    { id: 'coverletter', label: '자소서 도우미', icon: FileText, pageId: 'cover_letter' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full hidden md:flex">
      <div className="p-6 flex items-center justify-center border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tighter">CONDOT<span className="text-orange-500">.</span></h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.pageId)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 
              ${activePage === item.pageId 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 text-xs text-gray-400 text-center">
        © 2025 CONDOT Corp.
      </div>
    </div>
  );
};

export default Sidebar;