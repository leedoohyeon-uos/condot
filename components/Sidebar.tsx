import React from 'react';
import { Home, BookOpen, LayoutList, FileText, MoreHorizontal, MessageSquare } from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const menuItems = [
    { id: 'home' as Page, label: '홈', icon: <Home size={18} /> },
    { id: 'library' as Page, label: '내 경험함', icon: <BookOpen size={18} /> },
    { id: 'timeline' as Page, label: '커리어 타임라인', icon: <LayoutList size={18} /> },
    { id: 'resume' as Page, label: '자소서 도우미', icon: <FileText size={18} /> },
  ];

  return (
    <aside className="w-64 bg-brand-sidebar border-r border-gray-200 hidden md:flex flex-col h-full flex-shrink-0 z-30">
      {/* Logo Area */}
      <div className="p-6 cursor-pointer" onClick={() => onNavigate('home')}>
        {/* Updated CONDOT Logo */}
        <h1 className="text-3xl font-black tracking-tighter flex items-baseline text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
          CONDOT<span className="text-[#FF8A00]">.</span>
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors group ${
              currentPage === item.id 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={currentPage === item.id ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}>
                {item.icon}
              </span>
              {item.label}
            </div>
            {currentPage === item.id && (
               <MoreHorizontal size={16} className="text-gray-400" />
            )}
          </button>
        ))}
        
        {/* Special Chat Tab (Invisible unless active, or just accessible via Home) */}
        {currentPage === 'chat' && (
             <button
             className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors bg-gray-100 text-gray-900"
           >
             <div className="flex items-center gap-3">
               <span className="text-gray-900">
                 <MessageSquare size={18} />
               </span>
               채팅
             </div>
             <div className="w-2 h-2 bg-[#FF8A00] rounded-full"></div>
           </button>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
         <div className="text-xs text-gray-400 text-center">
             © 2024 CONDOT Corp.
         </div>
      </div>
    </aside>
  );
};